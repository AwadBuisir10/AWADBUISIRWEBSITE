"use client";

import { useEffect, useState } from "react";
import { INITIAL_SOCIAL_COUNTS, SOCIAL_NETWORKS, SOCIAL_PROFILES, SOCIAL_REFRESH_SECONDS, summarizeCounts, type SocialCountsResponse } from "@/data/socialCounts";

function validResponse(data: SocialCountsResponse): boolean {
  return Boolean(data?.platforms) && SOCIAL_NETWORKS.every(network => {
    const count = data.platforms[network];
    return count && Number.isSafeInteger(count.followers) && count.followers >= 0 &&
      typeof count.approximate === "boolean" && ["updated", "saved"].includes(count.status) &&
      typeof count.observedAt === "string" && Number.isFinite(Date.parse(count.observedAt));
  });
}

export function LiveSocialCounter() {
  const [count, setCount] = useState(() => summarizeCounts(INITIAL_SOCIAL_COUNTS));
  useEffect(() => {
    let cancelled = false;
    let lastFetch = 0;
    let controller: AbortController | null = null;
    const refresh = async () => {
      if (document.hidden || Date.now() - lastFetch < SOCIAL_REFRESH_SECONDS * 1000) return;
      lastFetch = Date.now();
      controller = new AbortController();
      const timeout = window.setTimeout(() => controller?.abort(), 15000);
      try {
        const response = await fetch("/api/social-count", { signal: controller.signal });
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled && validResponse(data)) setCount(summarizeCounts(data.platforms));
      } catch { /* Keep the last available numbers on network failure. */ }
      finally { window.clearTimeout(timeout); }
    };
    void refresh();
    const interval = window.setInterval(refresh, SOCIAL_REFRESH_SECONDS * 1000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      cancelled = true;
      controller?.abort();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

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
          const recent = value.status === "updated" && Date.now() - Date.parse(value.observedAt) < 15 * 60 * 1000;
          return (
            <a key={network} href={profile.url} target="_blank" rel="noreferrer" className="min-w-0 rounded-lg border border-line bg-white/60 p-3 transition-colors hover:border-seafoam-700">
              <span className="block font-mono text-[11px] uppercase tracking-[0.08em] text-slate">{profile.label} ↗</span>
              <span className="mt-1 block text-xl font-semibold text-navy">{value.approximate ? "≈ " : ""}{value.followers.toLocaleString("en-US")}</span>
              <span className="mt-1 block text-xs leading-5 text-slate">
                {recent ? "Public page" : value.source === "confirmed" ? "Owner confirmed" : "Saved count"}
                {" · "}<time dateTime={value.observedAt}>{new Date(value.observedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}</time>
              </span>
            </a>
          );
        })}
      </div>
      <p className="mt-3 text-xs leading-5 text-slate">Checks public profiles about every 5 minutes while the site is in use. Saved counts stay visible when updates are unavailable. Rounded counts are marked ≈.</p>
    </div>
  );
}
