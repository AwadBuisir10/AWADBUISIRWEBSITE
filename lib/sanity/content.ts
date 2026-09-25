import { createImageUrlBuilder } from '@sanity/image-url';
import { defaultContent, type SiteContent } from '../../data/content';

export const CONTENT_ID = 'siteContent';
export const API_VERSION = '2026-09-01';
export type SanityConfig = { projectId: string; dataset: string };
type RecordValue = Record<string, unknown>;
const isObject = (value: unknown): value is RecordValue => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

export function getSanityConfig(env: Record<string, string | undefined>): SanityConfig | null {
  const projectId = env.SANITY_PROJECT_ID?.trim();
  if (!projectId) return null;
  const dataset = env.SANITY_DATASET?.trim() || 'production';
  if (!/^[a-z0-9]+$/.test(projectId) || !/^[a-z0-9][a-z0-9_-]*$/.test(dataset)) {
    throw new Error('Invalid Sanity project ID or dataset name.');
  }
  return { projectId, dataset };
}

export function safeContentUrl(value: string): boolean {
  if (!value || /[\u0000-\u0020\\]/.test(value)) return false;
  return /^\/(?!\/)/.test(value) || /^#[\w-]+$/.test(value) || /^(https?:\/\/|mailto:|tel:)/i.test(value);
}

function mediaUrl(value: RecordValue, config: SanityConfig): string | null {
  const image = value.image;
  if (isObject(image) && isObject(image.asset) && typeof image.asset._ref === 'string') {
    if (/^image-[a-zA-Z0-9]+-\d+x\d+-[a-zA-Z0-9]+$/.test(image.asset._ref)) {
      return createImageUrlBuilder(config).image(image).width(2000).fit('max').auto('format').url();
    }
  }
  const file = value.file;
  if (isObject(file) && isObject(file.asset) && typeof file.asset._ref === 'string') {
    const match = /^file-([a-zA-Z0-9]+)-([a-zA-Z0-9]+)$/.exec(file.asset._ref);
    if (match && (value._type !== 'siteMedia' || /^(mp4|webm|mov)$/i.test(match[2]))) return `https://cdn.sanity.io/files/${config.projectId}/${config.dataset}/${match[1]}.${match[2]}`;
  }
  if (typeof value.path !== 'string' || !safeContentUrl(value.path)) return null;
  // Next/Image is deliberately limited to local images and Sanity's CDN.
  if (value._type === 'siteImage' && !value.path.startsWith('/') && !value.path.startsWith('https://cdn.sanity.io/images/')) return null;
  if (value._type === 'siteMedia' && !value.path.startsWith('/') && !value.path.startsWith('https://cdn.sanity.io/images/') && !/^https:\/\/cdn\.sanity\.io\/files\/.+\.(mp4|webm|mov)([?#].*)?$/i.test(value.path)) return null;
  return value.path;
}

export function resolveMedia(value: unknown, config: SanityConfig): unknown {
  if (Array.isArray(value)) return value.map(item => resolveMedia(item, config));
  if (!isObject(value)) return value;
  if (['siteImage', 'siteFile', 'siteMedia'].includes(String(value._type))) return mediaUrl(value, config);
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !key.startsWith('_'))
    .map(([key, item]) => [key, resolveMedia(item, config)]));
}

function blankLike(template: unknown): unknown {
  if (Array.isArray(template)) return [];
  if (isObject(template)) return Object.fromEntries(Object.entries(template).map(([key, value]) => [key, blankLike(value)]));
  if (typeof template === 'number') return 0;
  if (typeof template === 'boolean') return false;
  return template === null ? null : '';
}

function mergeTemplate(left: unknown, right: unknown): unknown {
  if (isObject(left) && isObject(right)) {
    const result = { ...left };
    for (const [key, value] of Object.entries(right)) result[key] = mergeTemplate(result[key], value);
    return result;
  }
  if (Array.isArray(left) && Array.isArray(right)) return [...left, ...right];
  return right == null ? left ?? right : right;
}

/** Missing collection fields mean intentionally empty; never resurrect deleted items. */
function shapeContent(value: unknown, template: unknown, inArray = false): unknown {
  if (Array.isArray(template)) {
    if (!Array.isArray(value)) return [];
    const example = template.every(isObject) ? template.reduce<unknown>(mergeTemplate, {}) : template[0];
    return value.filter(item => typeof item === typeof example && (isObject(example) ? isObject(item) : true))
      .map(item => shapeContent(item, example, true));
  }
  if (isObject(template)) {
    const source = isObject(value) ? value : {};
    return Object.fromEntries(Object.entries(template).map(([key, sample]) => {
      const field = source[key];
      const shaped = (key === 'media' || key === 'link') && field == null ? null : shapeContent(field, sample, inArray);
      const urlField = /^(href|url|src|link|resume|file|media|portrait|photo|crest|watermark|poster|contextImage|thumbnail|image)$|Url$/.test(key);
      return [key, urlField && typeof shaped === 'string' && shaped && !safeContentUrl(shaped) ? '' : shaped];
    }));
  }
  if (template === null) return typeof value === 'string' ? value : null;
  if (typeof value === typeof template && (typeof value !== 'number' || Number.isFinite(value))) return value;
  return inArray ? blankLike(template) : template;
}

export function normalizeContent(document: unknown, config: SanityConfig): SiteContent {
  if (!isObject(document) || document._id !== CONTENT_ID || document._type !== 'siteContent') return defaultContent;
  return shapeContent(resolveMedia(document, config), defaultContent) as SiteContent;
}
