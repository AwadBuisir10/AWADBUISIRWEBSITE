export const SOCIAL_REFRESH_SECONDS = 300;
export const SOCIAL_NETWORKS = ["instagram", "tiktok", "facebook"] as const;
export type SocialNetwork = typeof SOCIAL_NETWORKS[number];
export const SOCIAL_PROFILES = {
  instagram: { label: "Instagram", url: "https://www.instagram.com/libyansclub/" },
  tiktok: { label: "TikTok", url: "https://www.tiktok.com/@libyanclub" },
  facebook: { label: "Facebook", url: "https://www.facebook.com/979893621873299" }
} as const;
export type FollowerCount = {
  followers: number;
  approximate: boolean;
  source: "public-page" | "confirmed";
  observedAt: string;
  checkedAt: string | null;
  status: "updated" | "saved";
};
// September 4 public-page observations; Facebook confirmed by the owner.
// Its public metadata labels 17,042 as likes, so never scrape likes as followers.
export const INITIAL_SOCIAL_COUNTS: Record<SocialNetwork, FollowerCount> = {
  instagram: { followers: 26000, approximate: true, source: "public-page", observedAt: "2026-09-04", checkedAt: null, status: "saved" },
  tiktok: { followers: 11965, approximate: false, source: "public-page", observedAt: "2026-09-04", checkedAt: null, status: "saved" },
  facebook: { followers: 17042, approximate: false, source: "confirmed", observedAt: "2026-09-04", checkedAt: null, status: "saved" }
};
export type SocialCountsResponse = {
  platforms: Record<SocialNetwork, FollowerCount>;
  totalFollowers: number;
  approximate: boolean;
  refreshSeconds: number;
};
export function summarizeCounts(platforms: Record<SocialNetwork, FollowerCount>): SocialCountsResponse {
  return {
    platforms,
    totalFollowers: SOCIAL_NETWORKS.reduce((total, network) => total + platforms[network].followers, 0),
    approximate: SOCIAL_NETWORKS.some(network => platforms[network].approximate),
    refreshSeconds: SOCIAL_REFRESH_SECONDS
  };
}
