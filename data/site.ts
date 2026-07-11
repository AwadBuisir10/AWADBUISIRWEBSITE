export const navItems = [
  { label: "Work", href: "#work" },
  { label: "Community", href: "#community" },
  { label: "LinkedIn", href: "#linkedin" },
  { label: "Experience", href: "#experience" },
  { label: "AI Creative", href: "#creative" },
  { label: "Contact", href: "#contact" }
];

export const hero = {
  eyebrow: "CS @ Northeastern · Boston",
  availability: "Open to internships, co-ops & project work",
  headline: "I build software, AI workflows, and media systems that create visible impact.",
  subheadline:
    "I turn operational problems into working products — from voice agents and computer vision to media systems used at scale."
};

export const about = {
  lines: [
    "Computer science at Northeastern.",
    "I turn ideas into software, automated systems, and audiences that grow."
  ],
  pillars: [
    {
      word: "Build",
      line: "Web apps, APIs, internal tools.",
      proof: "70 sites supported",
      signal: "Web · APIs · distributed IT"
    },
    {
      word: "Automate",
      line: "LLMs, voice AI, vision, workflows.",
      proof: "30 hrs/week saved",
      signal: "Built for a live media operation"
    },
    {
      word: "Grow",
      line: "Campaigns, analytics, community.",
      proof: "35K+ community",
      signal: "12M+ views · 1.3M+ engagement"
    }
  ]
};

export const community = {
  title: "LibyanClub",
  role: "Founder & President — Northeastern University",
  copy:
    "Founded at Northeastern as America's first Libyan student club. Now a 31K+ network connecting Libyan students worldwide around the country's future.",
  /** Square LibyanClub profile logo, shown beside the section heading. */
  crest: "/assets/libyanclub-logo.jpg",
  /** Transparent gold crest used as the low-opacity watermark. */
  watermark: "/assets/libyanclub-crest-gold.png",
  built: [
    "Brand identity",
    "Short-form content system",
    "Event campaigns",
    "Growth strategy",
    "Cross-platform community presence"
  ]
};

export type Experience = {
  company: string;
  role: string;
  dates: string;
  summary: string;
  details: string[];
};

export const experiences: Experience[] = [
  {
    company: "AL Prime Energy",
    role: "IT Systems Administrator",
    dates: "May 2023 — Present",
    summary: "70 sites · 1,000+ cameras · distributed IT systems",
    details: [
      "Security, network, hardware, and fuel-pump support across Massachusetts.",
      "Digital Watchdog, iCMSpro, and Socatch camera platforms."
    ]
  },
  {
    company: "Ya Hala FM",
    role: "AI Software Engineer Intern",
    dates: "May 2024 — Aug 2024",
    summary: "4,000+ song library · 30 hrs/week saved · AI-assisted automation",
    details: [
      "Automated cloud and local media workflows for a Dallas radio station.",
      "Scripting, file organization, QA, and debugging."
    ]
  }
];

export type CreativeItem = {
  title: string;
  category: string;
  image: string;
};

export const creativeGallery: CreativeItem[] = [
  { title: "LibyanClub UN Trip Campaign", category: "Campaign visuals", image: "/assets/gallery/cultural-campaign.svg" },
  { title: "Short-form Sports Edits", category: "Video edits", image: "/assets/gallery/sports-edit-real.jpg" },
  { title: "MSA Madness Event Identity", category: "Event identity", image: "/assets/gallery/event-identity.svg" },
  { title: "Libyan National Team Concept Kit", category: "Brand concept", image: "/assets/gallery/national-team-kit.jpg" },
  { title: "LibyanClub Reels System", category: "Content system", image: "/assets/gallery/short-form-board.svg" },
  { title: "Community Analytics Graphics", category: "Social graphics", image: "/assets/gallery/community-analytics.svg" }
];

export const skillGroups = [
  { title: "Code", skills: ["Python", "Java", "JavaScript", "HTML/CSS"] },
  {
    title: "AI / Automation",
    skills: ["LLMs", "Prompt Engineering", "Computer Vision", "Workflow Automation", "ElevenLabs"]
  },
  {
    title: "Platforms",
    skills: ["Git/GitHub", "Google Calendar API", "Twilio", "Zapier", "Google Apps Script", "Shopify"]
  },
  {
    title: "Creative",
    skills: ["Photoshop", "Illustrator", "Premiere Pro", "After Effects", "Lightroom"]
  },
  { title: "Languages", skills: ["Arabic", "English", "Spanish (conversational)"] }
];

export const contact = {
  line: "Open to software, AI, creative technology, and community-driven opportunities.",
  email: "buisir.a@northeastern.edu",
  location: "Boston, MA",
  linkedin: "https://www.linkedin.com/in/awad-buisir-0221a41ab/",
  // TODO: add real GitHub profile URL
  github: "https://github.com/ABuisir10",
  instagram: "https://www.instagram.com/awadbuisir/",
  resume: "/Awad_Buisir_Resume.pdf"
};
