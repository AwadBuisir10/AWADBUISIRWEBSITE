import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { INITIAL_SOCIAL_COUNTS, SOCIAL_NETWORKS, SOCIAL_PROFILES, SOCIAL_REFRESH_SECONDS, summarizeCounts, type FollowerCount, type SocialNetwork } from "@/data/socialCounts";
import { parsePublicFollowers, retryDelay } from "@/lib/social-scraper";

export const runtime = "nodejs";
export const maxDuration = 20;

// Shared Next Data Cache is the primary throttle, including failed scrapes.
// Warm-instance guards merge simultaneous requests and retain last-good values
// and Retry-After cooldowns. Cold instances fall back to confirmed snapshots.
const pending = new Map<SocialNetwork, Promise<FollowerCount>>();
const lastGood = new Map<SocialNetwork, FollowerCount>();
const cooldown = new Map<SocialNetwork, number>();

async function scrape(network: SocialNetwork): Promise<FollowerCount> {
  const saved = lastGood.get(network) ?? INITIAL_SOCIAL_COUNTS[network];
  const now = Date.now();
  if (now < (cooldown.get(network) ?? 0)) return { ...saved, status: "saved" };
  const checkedAt = new Date(now).toISOString();
  const fallback: FollowerCount = { ...saved, checkedAt, status: "saved" };
  try {
    const response = await fetch(SOCIAL_PROFILES[network].url, {
      cache: "no-store",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; PortfolioFollowerCounter/1.0; +https://awadbuisir.com)", "Accept-Language": "en-US,en;q=0.9", Accept: "text/html" },
      signal: AbortSignal.timeout(8000)
    });
    if (response.status === 429 || response.status === 403) {
      cooldown.set(network, now + retryDelay(response.headers.get("retry-after"), now));
      await response.body?.cancel();
      return fallback;
    }
    if (!response.ok) { await response.body?.cancel(); return fallback; }
    const reader = response.body?.getReader();
    if (!reader) return fallback;
    const decoder = new TextDecoder();
    let html = "", bytes = 0;
    for (;;) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > 2_000_000) { await reader.cancel(); return fallback; }
      html += decoder.decode(chunk.value, { stream: true });
    }
    html += decoder.decode();
    const parsed = parsePublicFollowers(network, html);
    if (!parsed) return fallback;
    const result: FollowerCount = { ...parsed, source: "public-page", observedAt: checkedAt, checkedAt, status: "updated" };
    lastGood.set(network, result);
    cooldown.delete(network);
    return result;
  } catch { return fallback; }
}

function singleFlight(network: SocialNetwork): Promise<FollowerCount> {
  const existing = pending.get(network);
  if (existing) return existing;
  const request = scrape(network).finally(() => pending.delete(network));
  pending.set(network, request);
  return request;
}

// Fixed keys: query strings and visitor identities cannot force a new scrape.
const readCounts = unstable_cache(singleFlight, ["public-followers-v1"], { revalidate: SOCIAL_REFRESH_SECONDS });

export async function GET() {
  const counts = await Promise.all(SOCIAL_NETWORKS.map(network => readCounts(network)));
  const platforms = Object.fromEntries(SOCIAL_NETWORKS.map((network, i) => [network, counts[i]])) as Record<SocialNetwork, FollowerCount>;
  return NextResponse.json(summarizeCounts(platforms), {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=30" }
  });
}
