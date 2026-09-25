import { createReadStream } from 'node:fs';
import { access, mkdir, realpath, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { defaultContent } from '../data/content';
import { API_VERSION, CONTENT_ID, getSanityConfig } from '../lib/sanity/content';
import { makeSeedDocument, type UploadMedia } from '../lib/sanity/seed';

async function main() {
  try { process.loadEnvFile(path.resolve('.env.local')); } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
  const flags = new Set(process.argv.slice(2));
  for (const flag of flags) if (!['--dry-run', '--upload-videos'].includes(flag)) throw new Error(`Unknown option: ${flag}`);
  const dryRun = flags.has('--dry-run');
  if (dryRun) {
    const document = await makeSeedDocument(defaultContent);
    const destination = path.resolve('work/sanity/site-content.ndjson');
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, JSON.stringify(document) + '\n');
    console.log(`Exported current content to ${destination}. No network access or changes to Sanity.`);
    return;
  }
  const config = getSanityConfig(process.env);
  if (!config || !process.env.SANITY_API_WRITE_TOKEN) throw new Error('Set SANITY_PROJECT_ID, SANITY_DATASET and SANITY_API_WRITE_TOKEN in .env.local first. See docs/SANITY.md.');
  const client = createClient({ ...config, token: process.env.SANITY_API_WRITE_TOKEN, apiVersion: API_VERSION, useCdn: false, perspective: 'raw', maxRetries: 1 });
  const existing = await client.getDocuments([CONTENT_ID, `drafts.${CONTENT_ID}`]);
  if (existing.some(Boolean)) {
    console.log('siteContent already exists (published or draft). Nothing changed; edit it in Studio.');
    return;
  }
  const publicRoot = await realpath(path.resolve('public'));
  const uploads = new Map<string, Promise<Record<string, unknown>>>();
  const upload: UploadMedia = async (media) => {
    if (!media.path.startsWith('/') || media.path.startsWith('//')) return media;
    const isVideo = /\.(mp4|webm|mov)$/i.test(media.path);
    if (isVideo && !flags.has('--upload-videos')) return media;
    const filename = await realpath(path.resolve(publicRoot, `.${media.path}`));
    if (!filename.startsWith(publicRoot + path.sep)) throw new Error(`Asset must be inside public/: ${media.path}`);
    await access(filename);
    const kind = media._type === 'siteImage' || /\.(png|jpe?g|webp|gif|avif)$/i.test(filename) ? 'image' : 'file';
    const key = `${kind}:${filename}`;
    if (!uploads.has(key)) {
      uploads.set(key, client.assets.upload(kind, createReadStream(filename), { filename: path.basename(filename) }).then(asset => ({ _type: kind, asset: { _type: 'reference', _ref: asset._id } })));
    }
    return { ...media, [kind]: await uploads.get(key) };
  };
  // Verify referenced local files before uploading anything.
  await makeSeedDocument(defaultContent, async media => {
    if (media.path.startsWith('/') && !media.path.startsWith('//')) {
      const filename = await realpath(path.resolve(publicRoot, `.${media.path}`));
      if (!filename.startsWith(publicRoot + path.sep)) throw new Error(`Asset must be inside public/: ${media.path}`);
    }
    return media;
  });
  const document = await makeSeedDocument(defaultContent, upload);
  await client.createIfNotExists(document);
  console.log(`Imported siteContent and ${uploads.size} assets to ${config.projectId}/${config.dataset}. Current content is published. Rerunning never overwrites edits.`);
  if (!flags.has('--upload-videos')) console.log('Videos still use existing public URLs. Upload replacements in Studio, or pass --upload-videos on the first seed to upload originals too.');
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : 'Migration failed.');
  process.exitCode = 1;
});
