import 'server-only';
import { createClient } from '@sanity/client';
import { unstable_cache } from 'next/cache';
import { defaultContent } from '../../data/content';
import { API_VERSION, CONTENT_ID, getSanityConfig, normalizeContent } from './content';

export const CONTENT_QUERY = '*[_id == $id && _type == "siteContent"][0]';

// This cache stores successful reads only. A failed refresh can retain Next's
// previous successful value; an initial failure falls back to the shipped site.
const fetchPublishedContent = unstable_cache(async () => {
  const config = getSanityConfig(process.env);
  if (!config) return defaultContent;
  const client = createClient({
    ...config,
    apiVersion: API_VERSION,
    useCdn: false,
    perspective: 'published',
    token: process.env.SANITY_API_READ_TOKEN || undefined,
    timeout: 8000,
    maxRetries: 0,
  });
  const document = await client.fetch(CONTENT_QUERY, { id: CONTENT_ID }, { cache: 'no-store' });
  if (!document) {
    console.warn('[Sanity] No published siteContent document; showing shipped content. Run cms:seed.');
    return defaultContent;
  }
  return normalizeContent(document, config);
}, ['sanity-site-content-v1'], { revalidate: 60, tags: ['site-content'] });

export async function getSiteContent() {
  try {
    if (!getSanityConfig(process.env)) return defaultContent;
    return await fetchPublishedContent();
  } catch {
    console.warn('[Sanity] Content unavailable; showing shipped content. Check project, dataset and read access.');
    return defaultContent;
  }
}
