import { INITIAL_SOCIAL_COUNTS, summarizeCounts } from "@/data/socialCounts";

export type Metric = {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  detail?: string;
};

/** Impact strip under the hero — engineering evidence first. */
export const impactMetrics: Metric[] = [
  { value: 3.84, decimals: 2, label: "GPA", detail: "Northeastern CS" },
  { value: 5, label: "AI systems built", detail: "Voice · vision · dispatch" },
  { value: 30, label: "Hrs/week automated", detail: "Ya Hala FM" },
  { value: 70, label: "Sites supported", detail: "AL Prime Energy" },
  { value: 1000, suffix: "+", label: "Cameras operated", detail: "Distributed infra" },
  { value: 20, suffix: "M+", label: "Views", detail: "Campaign milestone" }
];

/** LibyanClub section metrics. */
export const communityMetrics: Metric[] = [
  { value: summarizeCounts(INITIAL_SOCIAL_COUNTS).totalFollowers, label: "Followers", detail: "across three platforms" }, // Live rendering uses the shared scraper store.
  { value: 20, suffix: "M+", label: "Views", detail: "campaign milestone" },
  { value: 1, suffix: "M+", label: "Interactions", detail: "campaign milestone" },
  { value: 2.5, decimals: 1, suffix: "M+", label: "Accounts reached", detail: "campaign milestone" },
  { value: 8000, prefix: "+", suffix: "%", label: "Growth", detail: "first six months" }
];
