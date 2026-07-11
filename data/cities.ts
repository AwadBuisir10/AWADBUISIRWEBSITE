export type CityMarker = "origin" | "work" | "purpose" | "inspired" | "network";

export type City = {
  name: string;
  lat: number;
  lng: number;
  /** Origin node - routes animate outward from here. */
  home?: boolean;
  marker: CityMarker;
  /** Keeps dense regional labels readable without changing real coordinates. */
  label: {
    side: "left" | "right";
    offsetY?: number;
  };
  /** Recruiter-facing story revealed when the node is focused or hovered. */
  story: {
    eyebrow: string;
    title: string;
    metric: string;
    detail: string;
    href: string;
  };
};

export const cities: City[] = [
  {
    name: "Boston",
    lat: 42.36,
    lng: -71.06,
    home: true,
    marker: "origin",
    label: { side: "right", offsetY: -4 },
    story: {
      eyebrow: "Origin / Boston",
      title: "America's first Libyan student club",
      metric: "Founded at Northeastern · 31K+ followers",
      detail:
        "LibyanClub began here to inspire Libyan students worldwide and help guide Libya's future.",
      href: "#community"
    }
  },
  {
    name: "Dallas",
    lat: 32.78,
    lng: -96.8,
    marker: "work",
    label: { side: "right", offsetY: 30 },
    story: {
      eyebrow: "AI Software Engineering",
      title: "Media automation at Ya Hala FM",
      metric: "30 hours saved each week",
      detail: "AI-assisted workflows for a 4,000+ song media library.",
      href: "#experience"
    }
  },
  {
    name: "Tripoli",
    lat: 32.89,
    lng: 13.19,
    marker: "purpose",
    label: { side: "right" },
    story: {
      eyebrow: "Purpose / Libya",
      title: "Building toward Libya's future",
      metric: "Identity · ideas · community",
      detail:
        "The north star: give Libyan students around the world a place to connect, contribute, and lead.",
      href: "#community"
    }
  },
  {
    name: "Washington, DC",
    lat: 38.9072,
    lng: -77.0369,
    marker: "inspired",
    label: { side: "right", offsetY: 17 },
    story: {
      eyebrow: "Inspired after Boston",
      title: "LibyanClub / Washington, DC",
      metric: "A U.S. chapter followed",
      detail: "One of four U.S. groups directly inspired by the first chapter in Boston.",
      href: "#community"
    }
  },
  {
    name: "Ohio",
    lat: 40.4173,
    lng: -82.9071,
    marker: "inspired",
    label: { side: "left", offsetY: 18 },
    story: {
      eyebrow: "Inspired after Boston",
      title: "LibyanClub / Ohio",
      metric: "A U.S. chapter followed",
      detail: "One of four U.S. groups directly inspired by the first chapter in Boston.",
      href: "#community"
    }
  },
  {
    name: "Oregon",
    lat: 43.8041,
    lng: -120.5542,
    marker: "inspired",
    label: { side: "right" },
    story: {
      eyebrow: "Inspired after Boston",
      title: "LibyanClub / Oregon",
      metric: "A U.S. chapter followed",
      detail: "One of four U.S. groups directly inspired by the first chapter in Boston.",
      href: "#community"
    }
  },
  {
    name: "Michigan",
    lat: 44.3148,
    lng: -85.6024,
    marker: "inspired",
    label: { side: "left", offsetY: -15 },
    story: {
      eyebrow: "Inspired after Boston",
      title: "LibyanClub / Michigan",
      metric: "A U.S. chapter followed",
      detail: "One of four U.S. groups directly inspired by the first chapter in Boston.",
      href: "#community"
    }
  },
  {
    name: "Toronto",
    lat: 43.6532,
    lng: -79.3832,
    marker: "network",
    label: { side: "right", offsetY: -21 },
    story: {
      eyebrow: "Global network",
      title: "LibyanClub / Toronto",
      metric: "Libyan students across borders",
      detail: "Part of a growing network connecting Libyan students, ideas, and community.",
      href: "#community"
    }
  },
  {
    name: "London",
    lat: 51.5074,
    lng: -0.1278,
    marker: "network",
    label: { side: "right", offsetY: 13 },
    story: {
      eyebrow: "Global network",
      title: "LibyanClub / London",
      metric: "Libyan students across borders",
      detail: "Part of a growing network connecting Libyan students, ideas, and community.",
      href: "#community"
    }
  },
  {
    name: "Manchester",
    lat: 53.4808,
    lng: -2.2426,
    marker: "network",
    label: { side: "left", offsetY: -14 },
    story: {
      eyebrow: "Global network",
      title: "LibyanClub / Manchester",
      metric: "Libyan students across borders",
      detail: "Part of a growing network connecting Libyan students, ideas, and community.",
      href: "#community"
    }
  },
  {
    name: "Qatar",
    lat: 25.2854,
    lng: 51.531,
    marker: "network",
    label: { side: "left" },
    story: {
      eyebrow: "Global network",
      title: "LibyanClub / Qatar",
      metric: "Libyan students across borders",
      detail: "Part of a growing network connecting Libyan students, ideas, and community.",
      href: "#community"
    }
  }
];
