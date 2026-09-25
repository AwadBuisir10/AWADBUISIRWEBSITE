"use client";

import { RollingNumber } from "@/components/RollingNumber";
import { SOCIAL_NETWORKS, SOCIAL_PROFILES } from "@/data/socialCounts";
import { useSocialCounts } from "@/lib/social-count-store";

export function LiveSocialCounter() {
  const count = useSocialCounts();

  return (
    <div>
      <p className="flex items-center gap-2.5 font-mono text-[13px] uppercase tracking-[0.12em] text-navy">
        <span className="status-ping h-2 w-2 rounded-full bg-seafoam-700" aria-hidden="true" />Community Reach
      </p>
      <RollingNumber
        text={count.totalFollowers.toLocaleString("en-US")}
        className="mt-4 block font-display text-5xl font-semibold tracking-[-0.03em] text-navy sm:text-7xl"
      />
      <p className="mt-2 text-sm text-slate">Combined followers across three platforms</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {SOCIAL_NETWORKS.map(network => {
          const profile = SOCIAL_PROFILES[network];
          const value = count.platforms[network];
          return (
            <a key={network} href={profile.url} target="_blank" rel="noreferrer" className="group min-w-0 rounded-lg border border-line bg-white/60 p-3 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-seafoam-700">
              <span className="block font-mono text-[11px] uppercase tracking-[0.08em] text-slate">{profile.label} <span className="inline-block transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span></span>
              <RollingNumber text={value.followers.toLocaleString("en-US")} className="mt-1 block text-xl font-semibold text-navy" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
