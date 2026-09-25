import { createReadStream } from 'node:fs';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { defaultContent } from '../data/content';
import { API_VERSION, CONTENT_ID, getSanityConfig } from '../lib/sanity/content';
import { makeSeedDocument } from '../lib/sanity/seed';

type Value = unknown;
type Doc = Record<string, Value>;

const MEDIA_TYPES = new Set(['siteImage', 'siteFile', 'siteMedia']);
const SYSTEM_KEYS = new Set(['_id', '_type', '_rev', '_createdAt', '_updatedAt']);
const RESUME_PATH = '/Awad_Buisir_Resume.pdf';
const isObject = (value: Value): value is Doc => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const isMedia = (value: Value): value is Doc => isObject(value) && MEDIA_TYPES.has(String(value._type));

/**
 * Local content wins for text, numbers, and lists. Media already uploaded to
 * Sanity is kept whenever its path is unchanged, so syncing never swaps CDN
 * images back to local files. List items are matched by their stable _key.
 */
export function mergeForSync(live: Value, local: Value, added: Doc[] = []): Value {
  if (isMedia(local)) {
    if (isMedia(live) && live.path === local.path) return live;
    const fresh = { ...local };
    added.push(fresh);
    return fresh;
  }
  if (Array.isArray(local)) {
    const liveItems = new Map((Array.isArray(live) ? live : []).filter(isObject).map((item) => [item._key, item]));
    return local.map((item) => (isObject(item) && typeof item._key === 'string' ? mergeForSync(liveItems.get(item._key), item, added) : item));
  }
  if (isObject(local)) {
    return Object.fromEntries(Object.entries(local).map(([key, item]) => [key, mergeForSync(isObject(live) ? live[key] : undefined, item, added)]));
  }
  return local;
}

/** Human-readable list of leaf paths that differ, for the dry run. */
function differences(live: Value, next: Value, at = ''): string[] {
  if (isMedia(next) || isMedia(live)) return JSON.stringify(live) === JSON.stringify(next) ? [] : [`${at} (media)`];
  if (Array.isArray(next) || Array.isArray(live)) {
    const a = Array.isArray(live) ? live : [];
    const b = Array.isArray(next) ? next : [];
    const out = a.length !== b.length ? [`${at}: ${a.length} → ${b.length} items`] : [];
    for (let index = 0; index < Math.max(a.length, b.length); index += 1) out.push(...differences(a[index], b[index], `${at}[${index}]`));
    return out;
  }
  if (isObject(next) || isObject(live)) {
    const keys = new Set([...Object.keys(isObject(live) ? live : {}), ...Object.keys(isObject(next) ? next : {})]);
    return [...keys].filter((key) => !SYSTEM_KEYS.has(key) && key !== '_key').flatMap((key) =>
      differences(isObject(live) ? live[key] : undefined, isObject(next) ? next[key] : undefined, at ? `${at}.${key}` : key));
  }
  return live === next ? [] : [`${at}: ${JSON.stringify(live)?.slice(0, 60) ?? '∅'} → ${JSON.stringify(next)?.slice(0, 60) ?? '∅'}`];
}

async function main() {
  try { process.loadEnvFile(path.resolve('.env.local')); } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
  const flags = new Set(process.argv.slice(2));
  for (const flag of flags) if (!['--apply', '--resume'].includes(flag)) throw new Error(`Unknown option: ${flag}. Use --apply and/or --resume.`);
  const apply = flags.has('--apply');
  const config = getSanityConfig(process.env);
  if (!config) throw new Error('Set SANITY_PROJECT_ID and SANITY_DATASET in .env.local first.');
  const token = process.env.SANITY_API_WRITE_TOKEN || undefined;
  if (apply && !token) throw new Error('Writing needs a token: run `npm run cms:sync:login -- --apply` (uses your Sanity login) or set SANITY_API_WRITE_TOKEN.');
  const client = createClient({ ...config, token, apiVersion: API_VERSION, useCdn: false, perspective: 'raw', maxRetries: 1 });

  const [published, draft] = await client.getDocuments<Doc>([CONTENT_ID, `drafts.${CONTENT_ID}`]);
  if (!published) throw new Error('No published siteContent yet. Run `npm run cms:seed` first.');
  if (draft) throw new Error('Studio has an unpublished draft of the website. Publish or discard it first so this sync does not overwrite it.');

  // New media (not yet in Sanity) is uploaded from public/ so Studio shows it; videos keep their site URLs.
  const added: Doc[] = [];
  const merged = mergeForSync(published, await makeSeedDocument(defaultContent), added) as Doc;
  const uploads = added.filter((media) => typeof media.path === 'string' && media.path.startsWith('/') && !/\.(mp4|webm|mov)$/i.test(media.path));
  for (const media of uploads) {
    const filename = path.resolve('public', `.${media.path}`);
    await access(filename);
    const kind = media._type === 'siteImage' || /\.(png|jpe?g|webp|gif|avif)$/i.test(filename) ? 'image' : 'file';
    if (apply) {
      const asset = await client.assets.upload(kind, createReadStream(filename), { filename: path.basename(filename) });
      media[kind] = { _type: kind, asset: { _type: 'reference', _ref: asset._id } };
    } else {
      media[kind] = `(new upload: ${media.path})`;
    }
  }

  if (flags.has('--resume')) {
    const filename = path.resolve('public', `.${RESUME_PATH}`);
    await access(filename);
    const contact = merged.contact as Doc;
    if (apply) {
      const asset = await client.assets.upload('file', createReadStream(filename), { filename: path.basename(filename) });
      contact.resume = { _type: 'siteFile', path: RESUME_PATH, file: { _type: 'file', asset: { _type: 'reference', _ref: asset._id } } };
    } else {
      contact.resume = { _type: 'siteFile', path: RESUME_PATH, file: '(new upload from public/)' };
    }
  }

  const changes = differences(published, merged);
  if (!changes.length) {
    console.log('Sanity already matches the local content. Nothing to do.');
    return;
  }
  console.log(`${changes.length} field changes:\n  ${changes.join('\n  ')}`);
  if (!apply) {
    console.log('\nDry run only. Re-run with --apply to publish these changes (the live site refreshes within about a minute).');
    return;
  }

  const fields = Object.fromEntries(Object.entries(merged).filter(([key]) => !SYSTEM_KEYS.has(key)));
  // ifRevisionId: refuse to write if someone edited the document since it was read.
  const result = await client.patch(CONTENT_ID).ifRevisionId(String(published._rev)).set(fields).commit();
  console.log(`\nPublished ${changes.length} changes to ${config.projectId}/${config.dataset} (revision ${result._rev}). Sanity keeps the previous revision in its history.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Sync failed.');
  process.exitCode = 1;
});
