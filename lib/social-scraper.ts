import { type SocialNetwork } from "../data/socialCounts";
export type ParsedFollowers = { followers: number; approximate: boolean };
export function parseFollowerNumber(value: unknown): ParsedFollowers | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const match = String(value).trim().match(/^(\d{1,3}(?:,\d{3})+|\d+)(\.\d+)?\s*([KMB])?$/i);
  if (!match) return null;
  const multiplier = ({ K: 1e3, M: 1e6, B: 1e9 } as Record<string, number>)[match[3]?.toUpperCase()] ?? 1;
  const followers = Math.round(Number(match[1].replaceAll(",", "") + (match[2] ?? "")) * multiplier);
  if (!Number.isSafeInteger(followers) || followers < 0 || followers > 2e9 || (match[2] && !match[3])) return null;
  return { followers, approximate: Boolean(match[3]) };
}
function decode(text: string): string {
  return text.replace(/&#(x[\da-f]+|\d+);/gi, (_, code: string) => {
    const point = code[0].toLowerCase() === "x" ? parseInt(code.slice(1), 16) : Number(code);
    return point <= 0x10ffff ? String.fromCodePoint(point) : "";
  }).replaceAll("&quot;", '"').replaceAll("&amp;", "&").replaceAll("&nbsp;", " ").replaceAll("&#39;", "'");
}
function meta(html: string, name: string): string | null {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attributes = Object.fromEntries(Array.from(tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gs), m => [m[1].toLowerCase(), decode(m[3])]));
    if (attributes.property === name || attributes.name === name) return attributes.content ?? null;
  }
  return null;
}
export function parsePublicFollowers(network: SocialNetwork, html: string): ParsedFollowers | null {
  if (network === "tiktok") {
    const script = html.match(/<script\b[^>]*\bid=["']__UNIVERSAL_DATA_FOR_REHYDRATION__["'][^>]*>([\s\S]*?)<\/script>/i);
    if (!script) return null;
    try {
      const detail = JSON.parse(script[1]).__DEFAULT_SCOPE__?.["webapp.user-detail"];
      if (detail?.statusCode !== 0 || detail?.userInfo?.user?.uniqueId?.toLowerCase() !== "libyanclub") return null;
      const exact = parseFollowerNumber(detail.userInfo.statsV2?.followerCount);
      if (exact) return exact;
      const rounded = parseFollowerNumber(detail.userInfo.stats?.followerCount);
      return rounded ? { ...rounded, approximate: true } : null;
    } catch { return null; }
  }
  const canonical = meta(html, "og:url");
  if (!canonical) return null;
  let url: URL;
  try { url = new URL(canonical); } catch { return null; }
  const host = url.hostname.replace(/^www\./, "");
  const validProfile = network === "instagram"
    ? host === "instagram.com" && url.pathname.replace(/\/$/, "").toLowerCase() === "/libyansclub"
    : host === "facebook.com" && (url.pathname === "/979893621873299" || url.pathname === "/p/Libyansclub-61586181910399/" || (url.pathname === "/profile.php" && url.searchParams.get("id") === "61586181910399"));
  if (!validProfile) return null;
  // Restrict to profile metadata, never posts or recommendations.
  const description = meta(html, "og:description") ?? meta(html, "description");
  const match = description?.match(/(?:^|[\s·:])((?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?\s*[KMB]?)\s+followers\b/i);
  return match ? parseFollowerNumber(match[1]) : null;
}
export function retryDelay(retryAfter: string | null, now: number): number {
  const seconds = retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter) * 1000 : 0;
  const dateDelay = retryAfter && !seconds ? Date.parse(retryAfter) - now : 0;
  return Math.max(30 * 60 * 1000, seconds || dateDelay || 0);
}
