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
  { value: 12, suffix: "M+", label: "Views", detail: "Media system output" }
];

/** LibyanClub section metrics. */
export const communityMetrics: Metric[] = [
  { value: 35, suffix: "K+", label: "Followers", detail: "in under six months" },
  { value: 12, suffix: "M+", label: "Views", detail: "across campaigns" },
  { value: 600, suffix: "K+", label: "Interactions", detail: "likes, comments, shares" },
  { value: 2, decimals: 1, suffix: "M+", label: "Accounts reached", detail: "unique audience" },
  { value: 8000, prefix: "+", suffix: "%", label: "Growth", detail: "since founding" }
];
