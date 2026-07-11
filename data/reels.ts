export type Reel = {
  /** Instagram shortcode, e.g. "DU5348NgL5t". */
  id: string;
  /** Canonical reel URL — the card, play button, and text link all open this. */
  url: string;
  title: string;
  platform: string;
  /** Approximate view count. TODO: update to match the real reel analytics. */
  views: number;
  /** Thumbnail under public/. Replace these placeholder covers with real
      exported reel frames (same filenames) whenever ready. */
  thumbnail: string;
};

export const reels: Reel[] = [
  {
    id: "DU5348NgL5t",
    url: "https://www.instagram.com/reel/DU5348NgL5t/",
    title: "Flag Raised at Northeastern",
    platform: "Instagram Reels",
    views: 2100000,
    thumbnail: "/assets/reels/flag.jpg"
  },
  {
    id: "DRFphHHktI4",
    url: "https://www.instagram.com/reel/DRFphHHktI4/",
    title: "Libyan Students at the UN",
    platform: "Instagram Reels",
    views: 860000,
    thumbnail: "/assets/reels/un.jpg"
  },
  {
    id: "DRp4_ZnEpfi",
    url: "https://www.instagram.com/reel/DRp4_ZnEpfi/",
    title: "Omar Al-Mukhtar",
    platform: "Instagram Reels",
    views: 720000,
    thumbnail: "/assets/reels/omar.jpg"
  },
  {
    id: "DSnMdACAHD7",
    url: "https://www.instagram.com/reel/DSnMdACAHD7/",
    title: "Libyan Clothing",
    platform: "Instagram Reels",
    views: 540000,
    thumbnail: "/assets/reels/clothing.jpg"
  },
  {
    id: "DUlt44Dktei",
    url: "https://www.instagram.com/reel/DUlt44Dktei/",
    title: "Using AI to Clean Up Libya",
    platform: "Instagram Reels",
    views: 380000,
    thumbnail: "/assets/reels/cleanup.jpg"
  },
  {
    id: "DY7yXDdMSw1",
    url: "https://www.instagram.com/reel/DY7yXDdMSw1/",
    title: "Libyan Gathering",
    platform: "Instagram Reels",
    views: 250000,
    thumbnail: "/assets/reels/gathering.png"
  }
];

export const formatViews = (views: number) =>
  views >= 1_000_000
    ? `${(views / 1_000_000).toFixed(views % 1_000_000 === 0 ? 0 : 1)}M`
    : views >= 1_000
      ? `${Math.round(views / 1_000)}K`
      : `${views}`;
