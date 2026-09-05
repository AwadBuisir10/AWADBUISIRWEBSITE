"use client";

import { SOCIAL_NETWORKS, SOCIAL_PROFILES } from "@/data/socialCounts";
import { useSocialCounts } from "@/lib/social-count-store";

export function LiveSocialCounter() {
  const count = useSocialCounts();

  return (
    <div>
      <p className="flex items-center gap-2.5 font-mono text-[13px] uppercase tracking-[0.12em] text-navy">
        <span className="h-2 w-2 rounded-full bg-seafoam-700" aria-hidden="true" />Community Reach
      </p>
      <p className="mt-4 font-display text-5xl font-semibold tracking-[-0.03em] text-navy sm:text-7xl">
        {count.approximate ? "≈ " : ""}{count.totalFollowers.toLocaleString("en-US")}
      </p>
      <p className="mt-2 text-sm text-slate">Combined followers across three platforms</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {SOCIAL_NETWORKS.map(network => {
          const profile = SOCIAL_PROFILES[network];
          const value = count.platforms[network];
          return (
            <a key={network} href={profile.url} target="_blank" rel="noreferrer" className="min-w-0 rounded-lg border border-line bg-white/60 p-3 transition-colors hover:border-seafoam-700">
              <span className="block font-mono text-[11px] uppercase tracking-[0.08em] text-slate">{profile.label} ↗</span>
              <span className="mt-1 block text-xl font-semibold text-navy">{value.approximate ? "≈ " : ""}{value.followers.toLocaleString("en-US")}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
