/**
 * Public-content field names that hold an upload or a preserved public path.
 * Apply this to the frontend content BEFORE traversing a media wrapper.
 * Wrapper internals (`image`/`file`) are native Sanity assets, not more wrappers.
 */
export const mediaFields = {
  media: "siteMedia",
  resume: "siteFile",
  file: "siteFile",
  crest: "siteImage",
  watermark: "siteImage",
  portrait: "siteImage",
  photo: "siteImage",
  poster: "siteImage",
  contextImage: "siteImage",
  thumbnail: "siteImage",
  image: "siteImage"
} as const;

export type SiteMediaType = (typeof mediaFields)[keyof typeof mediaFields];
export function mediaTypeForField(name: string): SiteMediaType | undefined {
  return mediaFields[name as keyof typeof mediaFields];
}
