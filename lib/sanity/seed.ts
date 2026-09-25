import { createHash } from 'node:crypto';
import { mediaTypeForField } from '../../studio/media-fields';
import { CONTENT_ID } from './content';

type MediaValue = { _type: string; path: string };
export type UploadMedia = (value: MediaValue) => Promise<Record<string, unknown>>;

/** Stable keys and createIfNotExists make reruns safe for an edited dataset. */
export async function makeSeedDocument(content: Record<string, unknown>, upload?: UploadMedia): Promise<Record<string, unknown> & { _id: string; _type: string }> {
  async function serialize(value: unknown, path: string, field = ''): Promise<unknown> {
    const mediaType = mediaTypeForField(field);
    if (mediaType && typeof value === 'string' && value) {
      const media = { _type: mediaType, path: value };
      return upload ? upload(media) : media;
    }
    if (Array.isArray(value)) {
      return Promise.all(value.map(async (item, index) => {
        const nested = await serialize(item, `${path}.${index}`);
        return nested && typeof nested === 'object' && !Array.isArray(nested)
          ? { ...nested, _type: 'item', _key: createHash('sha1').update(`${path}.${index}`).digest('hex').slice(0, 16) }
          : nested;
      }));
    }
    if (value && typeof value === 'object') {
      const entries = [];
      for (const [key, item] of Object.entries(value)) {
        if (item !== null && item !== undefined) entries.push([key, await serialize(item, `${path}.${key}`, key)]);
      }
      return Object.fromEntries(entries);
    }
    return value;
  }
  return { ...(await serialize(content, 'siteContent') as Record<string, unknown>), _id: CONTENT_ID, _type: 'siteContent' };
}
