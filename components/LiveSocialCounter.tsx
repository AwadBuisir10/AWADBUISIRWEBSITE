"use client";

import { useEffect, useState } from "react";
import { FALLBACK_SOCIAL_COUNTS } from "@/data/socialLinks";

type SocialCount = {
  instagramFollowers: number;
  facebookFollowers: number;
  totalFollowers: number;
  lastUpdated: string | null;
  live: boolean;
  sources?: { instagram: "live" | "snapshot"; facebook: "live" | "snapshot" };
};

const fallback: SocialCount = {
  instagramFollowers: FALLBACK_SOCIAL_COUNTS.instagramFollowers,
  facebookFollowers: FALLBACK_SOCIAL_COUNTS.facebookFollowers,
  totalFollowers:
    FALLBACK_SOCIAL_COUNTS.instagramFollowers + FALLBACK_SOCIAL_COUNTS.facebookFollowers,
  lastUpdated: null,
  live: false
};

const compact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : n.toLocaleString("en-US");

/** Combined LibyanClub audience — live via /api/social-count, fallback until connected. */
export function LiveSocialCounter() {
  const [count, setCount] = useState<SocialCount>(fallback);

  useEffect(() => {
    let cancelled = false;
    const refresh = () => fetch("/api/social-count", { signal: AbortSignal.timeout(12000) })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SocialCount | null) => {
        if (data && !cancelled && Number.isSafeInteger(data.totalFollowers) && data.totalFollowers >= 0) setCount(data);
      })
      .catch(() => {
        /* keep fallback */
      });
    refresh();
    const interval = window.setInterval(refresh, 60000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <p className="flex items-center gap-2.5 font-mono text-[13px] uppercase tracking-[0.12em] text-navy">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          {count.live ? <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-seafoam-600 opacity-60 motion-reduce:hidden" /> : null}
          <span className="relative inline-flex h-2 w-2 rounded-full bg-seafoam-700" />
        </span>
        {count.live ? "Live Community Reach" : "Community Reach"}
      </p>

      <p className="mt-4">
        <span className="font-display text-6xl font-semibold tracking-[-0.03em] text-navy sm:text-7xl">
          {count.totalFollowers.toLocaleString("en-US")}{count.live ? "" : "+"}
        </span>
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-[13px] uppercase tracking-[0.1em] text-slate">
        <a href="https://www.instagram.com/libyansclub/" target="_blank" rel="noreferrer">Instagram {compact(count.instagramFollowers)} · {count.sources?.instagram === "live" ? "live" : "saved count"}</a>
        <a href="https://www.facebook.com/979893621873299" target="_blank" rel="noreferrer">Facebook {compact(count.facebookFollowers)} · {count.sources?.facebook === "live" ? "live" : "saved count"}</a>
        {count.lastUpdated ? (
          <span>
            Updated{" "}
            {new Date(count.lastUpdated).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric"
            })}
          </span>
        ) : null}
      </div>
      {!count.live ? <p className="mt-3 text-sm leading-6 text-slate">Live updates are temporarily unavailable for one or more profiles. Saved counts may be out of date; visit the profiles for the latest totals.</p> : null}
    </div>
  );
}
