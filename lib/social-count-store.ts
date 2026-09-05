"use client";

import { useSyncExternalStore } from "react";
import { INITIAL_SOCIAL_COUNTS, SOCIAL_NETWORKS, SOCIAL_REFRESH_SECONDS, summarizeCounts, type SocialCountsResponse } from "@/data/socialCounts";

const initial = summarizeCounts(INITIAL_SOCIAL_COUNTS);
let snapshot = initial;
let lastFetch = 0;
let inFlight = false;
let interval: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function validResponse(data: SocialCountsResponse): boolean {
  return Boolean(data?.platforms) && SOCIAL_NETWORKS.every(network => {
    const count = data.platforms[network];
    return count && Number.isSafeInteger(count.followers) && count.followers >= 0 &&
      typeof count.approximate === "boolean" && ["updated", "saved"].includes(count.status);
  });
}

async function refresh() {
  if (document.hidden || inFlight || Date.now() - lastFetch < SOCIAL_REFRESH_SECONDS * 1000) return;
  lastFetch = Date.now();
  inFlight = true;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch("/api/social-count", { signal: controller.signal });
    if (!response.ok) return;
    const data = await response.json();
    if (validResponse(data)) {
      snapshot = summarizeCounts(data.platforms);
      listeners.forEach(listener => listener());
    }
  } catch { /* Retain the shared snapshot when a request fails. */ }
  finally { clearTimeout(timeout); inFlight = false; }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    void refresh();
    interval = setInterval(refresh, SOCIAL_REFRESH_SECONDS * 1000);
    document.addEventListener("visibilitychange", refresh);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
    }
  };
}

// Every counter and inline mention subscribes to this one snapshot and timer.
export function useSocialCounts() {
  return useSyncExternalStore(subscribe, () => snapshot, () => initial);
}
