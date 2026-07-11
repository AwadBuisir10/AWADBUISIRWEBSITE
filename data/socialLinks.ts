export type SocialLink = {
  label: string;
  href: string;
  network: "instagram" | "facebook" | "linkedin" | "github";
};

export const socialLinks: SocialLink[] = [
  {
    label: "LibyanClub Instagram",
    href: "https://www.instagram.com/libyansclub/",
    network: "instagram"
  },
  {
    label: "LibyanClub Facebook",
    href: "https://www.facebook.com/979893621873299",
    network: "facebook"
  },
  {
    label: "Personal Instagram",
    href: "https://www.instagram.com/awadbuisir/",
    network: "instagram"
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/awad-buisir-0221a41ab/",
    network: "linkedin"
  }
];

/**
 * Fallback follower counts shown until the Meta Graph API is connected
 * (see app/api/social-count/route.ts). Update these by hand when the
 * real numbers move — they are intentionally round, not fabricated precision.
 */
export const FALLBACK_SOCIAL_COUNTS = {
  instagramFollowers: 23500,
  facebookFollowers: 11000,
};
