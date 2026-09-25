import { navItems, hero, about, community, experiences, skillGroups, contact } from "./site";
import { projects, projectFocusOptions } from "./projects";
import { reels } from "./reels";
import { impactMetrics, communityMetrics } from "./metrics";
import { socialLinks } from "./socialLinks";
import { cities } from "./cities";
import { SOCIAL_NETWORKS, SOCIAL_PROFILES } from "./socialCounts";

const tools = ["Gemini Nano Banana", "Veo", "Midjourney", "ChatGPT", "CapCut", "TikTok"];
const capabilities = [
  { icon: "sparkles", top: "Prompt", bottom: "Engineering" },
  { icon: "layers", top: "Multi-model", bottom: "Workflows" },
  { icon: "clapperboard", top: "Story", bottom: "Direction" }
];
const storyFrames = [
  { image: "/assets/ai-creative/omar-mukhtar-meeting.jpg", alt: "AI-illustrated historical meeting in the Libyan desert", label: "Character continuity" },
  { image: "/assets/ai-creative/desert-convoy.jpg", alt: "AI-illustrated military convoy crossing the desert", label: "World building" },
  { image: "/assets/ai-creative/resistance-riders.png", alt: "AI-illustrated Libyan resistance riders", label: "Cinematic motion" },
  { image: "/assets/ai-creative/desert-battle.png", alt: "Three-panel AI-illustrated desert battle sequence", label: "Sequence design" },
  { image: "/assets/ai-creative/war-room.png", alt: "AI-illustrated officers gathered around a map", label: "Visual consistency" }
];
const workflow = [
  ["01", "Research", "Find the historical moment, characters, places, and visual references."],
  ["02", "Direct", "Engineer prompts around composition, character identity, and a consistent cartoon language."],
  ["03", "Generate", "Move between image and video models, refining frames until the story feels coherent."],
  ["04", "Finish", "Edit, pace, stitch, and polish every scene into one narrative made for young audiences."]
].map(([number, title, copy]) => ({ number, title, copy }));
// Ordered as the story: AI concept → produced jersey → the tournament it funded.
const kitViews = [
  { label: "Concept", stage: "AI concept", image: "/assets/ai-creative/libya-kit-design.png", alt: "Front and back design of an AI-assisted Libya basketball uniform concept" },
  { label: "In use", stage: "AI render", image: "/assets/ai-creative/libya-kit-concept.png", alt: "AI visualization of the Libya basketball jersey concept in use" },
  { label: "Front", stage: "Produced", image: "/assets/ai-creative/libya-jersey-front.jpg", alt: "Front of the produced LibyanClub jersey: cream with brown patterned side panels, the LC logo, the LibyanClub crest, Libya in script, and number 6" },
  { label: "Back", stage: "Produced", image: "/assets/ai-creative/libya-jersey-back.jpg", alt: "Back of the produced jersey with ليبيا, the Libyan flag, SABR and number 6, and LibyanClub" },
  { label: "Champions", stage: "MSA Madness", image: "/assets/ai-creative/msa-madness-champions.jpg", alt: "The team Awad assembled celebrating the MSA Madness championship with the trophy and a Libyan flag" }
];
const kitStats = [
  { value: "200+", label: "Jerseys sold for charity" },
  { value: "$15,000+", label: "Raised" },
  { value: "1st of 15", label: "Teams at MSA Madness" },
  { value: "$2,000", label: "Prize going to charity in Libya" }
];

const linkedInPosts = [
  {
    label: "Founder update",
    src: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7413672796016496640?collapsed=1",
    href: "https://www.linkedin.com/feed/update/urn:li:ugcPost:7413672796016496640/",
    title: "LinkedIn post by Awad Buisir about LibyanClub"
  },
  {
    label: "Community milestone",
    src: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7396761969028149248?collapsed=1",
    href: "https://www.linkedin.com/feed/update/urn:li:ugcPost:7396761969028149248/",
    title: "LinkedIn post by Awad Buisir about a LibyanClub community milestone"
  }
];

const outsidePerspective =
  "https://www.linkedin.com/posts/nourelhodaa_just-over-two-months-ago-libyanclub-was-activity-7413676082077274112-WIHm?utm_source=share&utm_medium=member_desktop&rcm=ACoAADD4wRoBsE3tqCOgAdV0Px32jbFAPkRy1lY";

/** Shipped content is both the migration source and the no-CMS fallback. Keep it JSON serializable. */
export const defaultContent = {
  navItems,
  hero: {
    ...hero,
    locationLine: "Boston → everywhere",
    originLabel: "Origin / Boston",
    networkLabel: "Network / Global"
  },
  about: {
    ...about,
    portrait: "/assets/personal/awad-headshot.jpg",
    portraitAlt: "Portrait of Awad Buisir",
    portraitCaption: "Awad / Boston"
  },
  community: {
    ...community,
    photo: "/assets/personal/libyan-youth.jpg",
    photoAlt: "Awad Buisir with Libyan youth holding the Libyan flag",
    photoCaption: "Community in motion",
    photoLabel: "Libyan youth",
    award: "Global Influence Award finalist",
    awardOrganization: "Northeastern University",
    links: SOCIAL_NETWORKS.map(network => ({ label: SOCIAL_PROFILES[network].label, url: SOCIAL_PROFILES[network].url }))
  },
  experiences,
  skillGroups,
  contact,
  projects,
  projectFocusOptions,
  reels,
  impactMetrics,
  communityMetrics,
  socialLinks,
  cities,
  branding: { name: "Awad Buisir", shortName: "Awad", footerName: "Awad Buisir", location: "Boston, MA" },
  education: {
    summary: "Northeastern University · BS Computer Science · GPA 3.84 · Dean's List (Fall 2023, Spring 2024) · Expected Aug 2027",
    coursework: "Distributed Systems · Object-Oriented Design · Computer Organization · Logic and Computation · Web Design"
  },
  certificate: {
    image: "/certificates/google-ai-professional-certificate.webp",
    imageAlt: "Google AI Professional Certificate awarded to Awad M Buisir",
    file: "/certificates/google-ai-professional-certificate.pdf",
    eyebrow: "Google via Coursera · July 2026",
    title: "Google AI Professional Certificate",
    description: "Seven-course professional program covering AI-assisted research, communication, content creation, data analysis, app building, and responsible prompting.",
    verificationUrl: "https://coursera.org/verify/professional-cert/C1A1H99S1YFE"
  },
  linkedIn: {
    posts: linkedInPosts,
    outsidePerspectiveUrl: outsidePerspective,
    outsidePerspectiveLabel: "Nourelhodaa on LibyanClub's reach",
    intro: "What I've posted about LibyanClub, and what others have said about it.",
    description: "Launch updates, milestones, and the people who helped along the way."
  },
  creative: {
    tools,
    capabilities,
    storyFrames,
    workflow,
    kitViews,
    kitStats,
    intro: "I also use image and video models as a creative tool, mostly to tell stories from Libyan history and to try out design ideas.",
    storyEyebrow: "Historical storytelling",
    storyTitle: "Libyan history, illustrated for younger audiences.",
    storyDescription: "I start from reference images of the real people and places, then write prompts that keep each character consistent from frame to frame and from one model to the next.",
    workflowEyebrow: "From reference to reel",
    workflowTitle: "How a story gets made.",
    workflowDescription: "Each piece takes research, many rounds of prompting, switching between models, and editing until the story reads clearly.",
    kitEyebrow: "From AI concept to the court",
    kitTitle: "A Libya basketball kit, designed with AI and brought to life.",
    kitDescription: "I used AI to explore patterns, materials, and how the jersey would look in use, and the concept drew interest from the Libyan Basketball Federation. Then I produced it and sold 200+ jerseys for charity for the MSA Madness tournament, raising $15,000+. I also put together, played on, and coached the team I registered. We won the tournament out of 15 teams, and I'm donating the $2,000 prize to charitable work in Libya.",
    kitCaption: "Concept → product → champions",
    kitOutcome: "AI concept → 200+ jerseys sold → tournament champions"
  },
  sectionHeadings: {
    about: { eyebrow: "About" },
    work: { eyebrow: "Projects", title: "Things I've built", note: "Filter by system type, then open a project to see how it's built." },
    experience: { eyebrow: "Experience", title: "Where I've worked", note: "An AI engineering co-op, IT operations since 2023, and a software internship." },
    community: { eyebrow: "Community" },
    linkedIn: { eyebrow: "LinkedIn", title: "Posts about LibyanClub", note: "Launch updates and milestones, plus what others wrote." },
    reels: { eyebrow: "Instagram", title: "Most-watched reels", note: "Drag to explore. Tap a card to watch on Instagram." },
    creative: { eyebrow: "AI Creative Works", title: "Ideas, directed with AI.", note: "Historical storytelling and apparel design, from reference to finished piece." },
    contact: { eyebrow: "Contact", title: "Let's talk." }
  }
};

export type SiteContent = typeof defaultContent;
