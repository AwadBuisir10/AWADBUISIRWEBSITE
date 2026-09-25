import { INITIAL_SOCIAL_COUNTS, summarizeCounts } from "@/data/socialCounts";

export type Metric = {
  value: number;
  label: string;
  /** Live follower totals remain attached to this card when editors reorder it. */
  source?: "followers" | "manual";
  prefix?: string;
  suffix?: string;
  decimals?: number;
  detail?: string;
};

const followerTotal = summarizeCounts(INITIAL_SOCIAL_COUNTS).totalFollowers;

/** Impact strip under the hero — engineering evidence first. */
export const impactMetrics: Metric[] = [
  { value: 3.84, decimals: 2, label: "GPA", detail: "Northeastern CS, Dean's List", source: "manual" },
  { value: 30, label: "Hours a week automated", detail: "Ya Hala FM internship", source: "manual" },
  { value: 70, label: "Sites supported", detail: "1,000+ cameras, AL Prime Energy", source: "manual" },
  { value: followerTotal, label: "LibyanClub followers", detail: "Founded November 2025", source: "followers" },
  { value: 20, suffix: "M+", label: "Views", detail: "LibyanClub content", source: "manual" }
];

/** LibyanClub section metrics. */
export const communityMetrics: Metric[] = [
  { value: followerTotal, label: "Followers", source: "followers", detail: "across three platforms" }, // Live rendering uses the shared scraper store.
  { value: 20, suffix: "M+", label: "Views", detail: "since launch" },
  { value: 1, suffix: "M+", label: "Interactions", detail: "since launch" },
  { value: 2.5, decimals: 1, suffix: "M+", label: "Accounts reached", detail: "unique accounts" },
  { value: 8000, prefix: "+", suffix: "%", label: "Growth", detail: "first six months" }
];
