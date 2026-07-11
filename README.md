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
| `data/socialLinks.ts` | Social profiles + fallback follower counts |

The resume download lives at `public/Awad_Buisir_Resume.pdf`.

## Live social counter

`GET /api/social-count` combines LibyanClub Instagram + Facebook followers via
the official Meta Graph API and caches the result for one hour. Without
credentials it serves the fallback numbers from `data/socialLinks.ts`.

To go live, create `.env.local`:

```bash
META_ACCESS_TOKEN=...        # long-lived token: instagram_basic + pages_read_engagement
IG_BUSINESS_ACCOUNT_ID=...   # your IG professional account id (Business Discovery)
FB_PAGE_ID=979893621873299   # LibyanClub Facebook Page id
```

Tokens stay server-side; the frontend only ever sees the JSON counts.
