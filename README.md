# Awad Buisir — Portfolio

Dark editorial portfolio built with Next.js, Tailwind CSS, and Framer Motion.
Canvas-drawn wireframe globe, live LibyanClub audience counter, and an
infinite reel carousel.

## Run locally

```bash
npm install
npm run dev
```

## Content

All copy and links live in `data/`:

| File | Drives |
| --- | --- |
| `data/site.ts` | Nav, hero copy, about, experience, creative gallery, skills, contact |
| `data/metrics.ts` | Impact strip + LibyanClub metrics |
| `data/projects.ts` | Selected Work rows (add `link` when a demo/repo is ready) |
| `data/reels.ts` | Featured reel URLs, titles, view counts, and cover images (`public/assets/reels/`) |
| `data/cities.ts` | Globe nodes and routes (Boston is `home`) |
| `data/socialLinks.ts` | Social profile links |
| `data/socialCounts.ts` | Scraped follower profiles, refresh interval, and confirmed fallback counts |

The resume download lives at `public/Awad_Buisir_Resume.pdf`.

## Public follower counts

`GET /api/social-count` reads the public Instagram, TikTok, and Facebook profile
pages without API credentials. TikTok uses the exact `statsV2` follower count
when present; Instagram/Facebook use explicit follower counts in profile metadata.
All parsers verify the profile identity. Likes, following, and post counts are ignored.

The Next Data Cache shares results, including failed attempts, for five minutes.
Fixed cache keys prevent query strings or each visitor from triggering scrapes.
Concurrent requests in the same instance share one fetch. Each fetch has an
eight-second timeout, a 2 MB body limit, and no automatic retries. HTTP 403/429
responses trigger a warm-instance cooldown of at least 30 minutes, honoring a
longer Retry-After. This cooldown/last-good memory resets on cold starts; the
shared five-minute Data Cache remains the primary cross-instance throttle.
Public platforms can still throttle or block Vercel IPs; this cannot guarantee
uninterrupted scraping or a globally exact request limit without shared storage.

Visible tabs poll every five minutes; hidden tabs stop polling. Revalidation is
traffic-driven, not a background cron: idle sites do not scrape, and a stale
cache can be returned while a refresh runs. The CDN caches responses for 30 seconds.

All follower displays (reach card, metric row, globe, and inline audience copy)
subscribe to one client store and one five-minute polling timer. The UI shows
three platform counts and matching profile buttons without source-status labels.
Approximate values retain the ≈ marker. `data/socialCounts.ts` contains September 4
snapshots: Instagram ~26K, TikTok 11,965, and owner-confirmed Facebook 17,042.
Facebook currently exposes likes, not followers, in its public metadata; it
retains the confirmed snapshot until an explicit follower count is available.
No login automation, proxy rotation, or anti-bot challenge bypass is used.

Views, interactions, accounts reached, and growth are campaign milestones, not
follower-derived analytics. Current milestone values follow the September resume:
20M+ views, 1M+ interactions, 2.5M+ accounts reached, and +8,000% early growth.

Run scraper and caching checks with `node --test tests/social-counts.test.cjs`.
