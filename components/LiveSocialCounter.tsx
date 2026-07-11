"use client";

import { useEffect, useState } from "react";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { FALLBACK_SOCIAL_COUNTS } from "@/data/socialLinks";

type SocialCount = {
  instagramFollowers: number;
  facebookFollowers: number;
  totalFollowers: number;
  lastUpdated: string | null;
  live: boolean;
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
    fetch("/api/social-count")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SocialCount | null) => {
        if (data && !cancelled) setCount(data);
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <p className="flex items-center gap-2.5 font-mono text-[13px] uppercase tracking-[0.12em] text-navy">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-seafoam-600 opacity-60 motion-reduce:hidden" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-seafoam-700" />
        </span>
        Live Community Reach
      </p>

      <p className="mt-4">
        <AnimatedNumber
          value={count.totalFollowers}
          suffix={count.live ? "" : "+"}
          className="font-display text-6xl font-semibold tracking-[-0.03em] text-navy sm:text-7xl"
        />
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-[13px] uppercase tracking-[0.1em] text-slate">
        <span>Instagram {compact(count.instagramFollowers)}</span>
        <span>Facebook {compact(count.facebookFollowers)}</span>
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
    </div>
  );
}
