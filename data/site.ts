export const navItems = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "LibyanClub", href: "#community" },
  { label: "Creative", href: "#creative" },
  { label: "Contact", href: "#contact" }
];

export const hero = {
  eyebrow: "Computer Science at Northeastern · Boston",
  // TODO(user): once the co-op wraps (Dec 18, 2026), switch this to the next term you're recruiting for.
  availability: "Now: AI SWE Co-op @ NExT Consulting",
  headline: "I build AI that answers phones and watches game film.",
  subheadline:
    "I'm Awad Buisir, a computer science student at Northeastern. Recently I built a bilingual English–Arabic voice agent for emergency-call intake, a phone receptionist that books real appointments, and a YOLOv8 pipeline that turns full soccer matches into highlight clips."
};

export const about = {
  lines: [
    "I study computer science at Northeastern (3.84 GPA, Dean's List) and graduate in August 2027.",
    "This fall I'm an AI Software Engineer co-op at NExT Consulting, building AI-enabled tools for client engagements. Since 2023 I've also run IT for AL Prime Energy across 70 sites and 1,000+ cameras, so I'm used to keeping systems working long after launch."
  ],
  pillars: [
    {
      word: "Build",
      line: "Applied-AI products: voice agents, vision pipelines, and LLM tools.",
      proof: "5 projects",
      signal: "LibyaMed Dispatch · Voice Receptionist · Soccer Vision"
    },
    {
      word: "Automate",
      line: "Scripts and event-driven tools that remove manual steps.",
      proof: "30 hrs/week saved",
      signal: "About 30 hours a week saved at Ya Hala FM"
    },
    {
      word: "Operate",
      line: "Infrastructure a business runs on, and a media operation with a live audience.",
      proof: "70 sites supported",
      signal: "70 sites at AL Prime Energy · 35K+ followers at LibyanClub"
    }
  ]
};

export const community = {
  title: "LibyanClub",
  role: "Founder & President, Northeastern University",
  copy:
    "I founded LibyanClub at Northeastern in November 2025, the first Libyan student association in the US. Within six months it became the most-followed club page at Northeastern. I also built the system behind its content: AI-assisted drafts, a steady publishing schedule, and an analytics review that decides what we post next.",
  /** Square LibyanClub profile logo, shown beside the section heading. */
  crest: "/assets/libyanclub-logo.jpg",
  /** Transparent gold crest used as the low-opacity watermark. */
  watermark: "/assets/libyanclub-crest-gold.png",
  built: [
    "AI-assisted content pipeline with a feedback loop",
    "Analytics review that sets the next brief",
    "Publishing schedule and post formats",
    "Brand identity",
    "Distribution across Instagram, TikTok, and Facebook",
    "Coordination among new Libyan student groups nationwide"
  ],
  /** Resume highlight: the #CleanLibya campaign. */
  campaign: {
    eyebrow: "Campaign I launched",
    title: "#CleanLibya",
    copy: "A grassroots cleanup challenge that grew from four friends to thousands of participants and supporters across six Libyan cities, and earned national television coverage.",
    photo: "/assets/personal/cleanlibya-tv.jpg",
    photoAlt: "Awad Buisir interviewed on Libya's Al Wataniya TV about the Clean Libya initiative, with the Libyan flag behind him",
    photoCaption: "Al Wataniya TV · Interview with the founder of Clean Libya",
    stats: [
      { value: "4", label: "Friends at the start" },
      { value: "1,000s", label: "Participants & supporters" },
      { value: "6", label: "Libyan cities" },
      { value: "TV", label: "National coverage" }
    ]
  }
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
    company: "NExT Consulting",
    role: "AI Software Engineer Co-op",
    dates: "Sep 2026 — Dec 2026",
    summary: "AI-enabled applications and internal tools for client engagements · Northeastern University",
    details: [
      "Develop AI-enabled applications and internal tools for client engagements, contributing across requirements discovery, solution design, implementation, testing, and stakeholder handoff.",
      "Translate business needs into technical requirements, API integrations, and rapid prototypes while collaborating within an Agile consulting team.",
      "Build reusable components, document technical decisions, and evaluate AI-assisted workflows for reliability, usability, and maintainability."
    ]
  },
  {
    company: "AL Prime Energy",
    role: "IT Systems Administrator",
    dates: "May 2023 — Present",
    summary: "70 sites and 1,000+ cameras across Massachusetts",
    details: [
      "Administer IT, networking, surveillance, and fuel-pump technology across 70 sites and 1,000+ cameras, supporting Digital Watchdog, iCMSpro, Socatch, and Rubis systems.",
      "Diagnose and resolve network connectivity, hardware, software, and camera-system incidents across distributed locations to minimize downtime and maintain operations.",
      "Support fuel-pump systems where downtime directly halts revenue, prioritizing incidents by business impact."
      // TODO(user): add a 4th bullet only if true (e.g. a monitoring script or standardized rollout you built)
    ]
  },
  {
    company: "Ya Hala FM",
    role: "AI Software Engineer Intern",
    dates: "May 2024 — Aug 2024",
    summary: "Automated about 30 hours a week of manual media work",
    details: [
      "Built automation scripts and internal tools to organize a 4,000+ song media library across cloud and local storage, eliminating approximately 30 hours of manual organization per week.",
      "Developed, tested, and debugged repeatable workflows for sorting, renaming, and validating media assets across cloud and local storage environments."
    ]
  }
];

export const skillGroups = [
  { title: "Programming", skills: ["Python", "Java", "JavaScript", "TypeScript", "HTML/CSS"] },
  {
    title: "AI Engineering",
    skills: [
      "LLM applications",
      "AI agents",
      "Prompt engineering",
      "Computer vision (YOLOv8)",
      "Voice agents (ElevenLabs)",
      "Workflow automation"
    ]
  },
  {
    title: "Frameworks & Platforms",
    skills: [
      "Next.js / React",
      "Tailwind CSS",
      "Supabase",
      "Vercel",
      "Render",
      "Git/GitHub",
      "Twilio",
      "Google Calendar API",
      "Google Apps Script",
      "Zapier",
      "Shopify"
    ]
  },
  { title: "APIs & Testing", skills: ["REST APIs", "Webhooks", "Unit testing", "End-to-end testing", "Agile development"] },
  {
    title: "Creative",
    skills: ["Photoshop", "Illustrator", "Premiere Pro", "After Effects", "Lightroom"]
  },
  { title: "Spoken Languages", skills: ["Arabic", "English", "Spanish (conversational)"] }
];

export const contact = {
  line: "Hiring for software or applied-AI roles? I'd like to hear about it. I can demo any private project live or walk you through the code.",
  email: "buisir.a@northeastern.edu",
  location: "Boston, MA",
  linkedin: "https://www.linkedin.com/in/awad-buisir/",
  github: "https://github.com/AwadBuisir10",
  instagram: "https://www.instagram.com/awadbuisir/",
  resume: "/Awad_Buisir_Resume.pdf"
};
