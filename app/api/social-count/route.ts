import { NextResponse } from "next/server";
import { FALLBACK_SOCIAL_COUNTS } from "@/data/socialLinks";

/**
 * GET /api/social-count
 *
 * Combined LibyanClub audience across Instagram + Facebook via the official
 * Meta Graph API. Tokens live server-side only — never ship them to the client.
 *
 * To go live, set these in .env.local (all optional; each network falls back
 * to FALLBACK_SOCIAL_COUNTS in data/socialLinks.ts when missing or failing):
 *
 *   META_ACCESS_TOKEN        Long-lived Page/system-user token with
 *                            instagram_basic + pages_read_engagement.
 *   IG_BUSINESS_ACCOUNT_ID   Your own IG professional account id, used for
 *                            Business Discovery lookups of @libyansclub.
 *   FB_PAGE_ID               LibyanClub Facebook Page id (979893621873299).
 *
 * Instagram: Business Discovery — GET /{ig-user-id}?fields=
 *   business_discovery.username(libyansclub){followers_count}
 * Facebook:  Page fields — GET /{page-id}?fields=followers_count,fan_count
 */

const IG_USERNAME = "libyansclub";
const GRAPH = "https://graph.facebook.com/v21.0";
const CACHE_TTL_MS = 60 * 60 * 1000; // refresh at most once per hour

type SocialCount = {
  instagramFollowers: number;
  facebookFollowers: number;
  totalFollowers: number;
  /** null while running on fallback numbers */
  lastUpdated: string | null;
  live: boolean;
  sources: { instagram: "live" | "snapshot"; facebook: "live" | "snapshot" };
};

let cache: { data: SocialCount; fetchedAt: number } | null = null;

async function fetchInstagramFollowers(): Promise<number | null> {
  const token = process.env.META_ACCESS_TOKEN;
  const igAccountId = process.env.IG_BUSINESS_ACCOUNT_ID;
  if (!token || !igAccountId) return null;

  try {
    const fields = `business_discovery.username(${IG_USERNAME}){followers_count}`;
    const res = await fetch(
      `${GRAPH}/${igAccountId}?fields=${encodeURIComponent(fields)}&access_token=${token}`,
      { cache: "no-store", signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const count = json?.business_discovery?.followers_count;
    return Number.isSafeInteger(count) && count >= 0 ? count : null;
  } catch {
    return null;
  }
}

async function fetchFacebookFollowers(): Promise<number | null> {
  const token = process.env.META_ACCESS_TOKEN;
  const pageId = process.env.FB_PAGE_ID;
  if (!token || !pageId) return null;

  try {
    const res = await fetch(
      `${GRAPH}/${pageId}?fields=followers_count,fan_count&access_token=${token}`,
      { cache: "no-store", signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const count = json?.followers_count;
    return Number.isSafeInteger(count) && count >= 0 ? count : null;
  } catch {
    return null;
  }
}

export async function GET() {
  if (cache && Date.now() - cache.fetchedAt < (cache.data.live ? CACHE_TTL_MS : 60000)) {
    return NextResponse.json(cache.data, {
      headers: { "Cache-Control": cache.data.live ? "public, s-maxage=3600" : "no-store" }
    });
  }

  const [instagram, facebook] = await Promise.all([
    fetchInstagramFollowers(),
    fetchFacebookFollowers()
  ]);

  const live = instagram !== null && facebook !== null;
  const instagramFollowers = instagram ?? FALLBACK_SOCIAL_COUNTS.instagramFollowers;
  const facebookFollowers = facebook ?? FALLBACK_SOCIAL_COUNTS.facebookFollowers;

  const data: SocialCount = {
    instagramFollowers,
    facebookFollowers,
    totalFollowers: instagramFollowers + facebookFollowers,
    lastUpdated: live ? new Date().toISOString() : null,
    live,
    sources: { instagram: instagram !== null ? "live" : "snapshot", facebook: facebook !== null ? "live" : "snapshot" }
  };

  cache = { data, fetchedAt: Date.now() };
  return NextResponse.json(data, {
    headers: { "Cache-Control": live ? "public, s-maxage=3600" : "no-store" }
  });
}
