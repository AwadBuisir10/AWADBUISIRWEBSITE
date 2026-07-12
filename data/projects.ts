export type ProjectFocus = "all" | "ai" | "automation" | "creative";
export type ProjectDiscipline = Exclude<ProjectFocus, "all">;

export const projectFocusOptions: {
  value: ProjectFocus;
  label: string;
  summary: string;
  signals: string[];
}[] = [
  {
    value: "all",
    label: "All Work",
    summary: "Four systems built to automate work, interpret media, or move information faster.",
    signals: ["Production logic", "AI workflows", "APIs + analytics"]
  },
  {
    value: "ai",
    label: "Applied AI",
    summary: "Voice agents, computer vision, and LLM systems built around real workflows.",
    signals: ["LLMs", "Computer vision", "Voice AI"]
  },
  {
    value: "automation",
    label: "Automation",
    summary: "Event-driven tools that remove repetitive steps and keep operations moving.",
    signals: ["Webhooks", "APIs", "Workflow logic"]
  },
  {
    value: "creative",
    label: "Creative Systems",
    summary: "Tools that turn audience behavior and media data into the next creative decision.",
    signals: ["Analytics", "Content systems", "Media"]
  }
];

export type Project = {
  slug: string;
  title: string;
  description: string;
  /** Longer write-up shown when the row is expanded. */
  summary: string;
  /** Demo video (.mp4/.webm) or image under /public. Null shows a "demo coming soon" placeholder. */
  media: string | null;
  /** Static first-paint image for video media, especially required by mobile Safari. */
  poster?: string;
  /** Personal or process image that adds context beside the demo. */
  contextImage?: string;
  contextAlt?: string;
  contextCaption?: string;
  tags: string[];
  disciplines: ProjectDiscipline[];
  outcome: string;
  architecture: string[];
  decision: string;
  next: string;
  /** Demo, repo, or case-study URL. Leave null until there is something to show. */
  link: string | null;
  linkLabel?: string;
};

export const projects: Project[] = [
  {
    slug: "ai-voice-receptionist",
    title: "AI Voice Receptionist",
    description: "Answers calls, checks availability, and books appointments on its own.",
    summary:
      "A voice agent built for a real service business. It answers the phone, understands what the caller needs, checks live availability against the calendar, and books the appointment with no human in the loop. ElevenLabs drives the voice layer; webhooks wire it into the Google Calendar API.",
    media: null,
    tags: ["ElevenLabs", "Webhooks", "Google Calendar API"],
    disciplines: ["ai", "automation"],
    outcome: "Automates phone intake, availability checks, and appointment booking without a manual handoff.",
    architecture: ["ElevenLabs voice agent", "Webhook orchestration", "Google Calendar availability + booking"],
    decision: "Keep scheduling rules in deterministic webhooks instead of trusting the voice model with business logic.",
    next: "Add call recordings, failure-mode testing, and production monitoring as public proof.",
    link: null,
    linkLabel: "Demo"
  },
  {
    slug: "soccer-vision-system",
    title: "Soccer Vision System",
    description: "Tracks players in match footage and cuts highlights automatically.",
    summary:
      "A YOLOv8-based vision pipeline that detects and tracks every player across full match footage, keeps identities stable through occlusions, and cuts highlight clips around key moments — turning hours of raw film into shareable edits automatically.",
    media: "/demos/SoccerDemo.mp4",
    poster: "/demos/posters/soccer-vision.jpg",
    contextImage: "/assets/personal/awad-soccer.jpg",
    contextAlt: "Awad Buisir on a soccer field wearing a red jersey",
    contextCaption: "Built by someone who plays the game",
    tags: ["YOLOv8", "Computer Vision", "Tracking"],
    disciplines: ["ai"],
    outcome: "Turns long match footage into tracked movement and automatically selected highlight clips.",
    architecture: ["YOLOv8 detection", "Multi-object tracking", "Highlight extraction"],
    decision: "Separate player detection from identity tracking so occlusion handling can improve independently.",
    next: "Benchmark identity switches and add player/team calibration across different camera angles.",
    link: null,
    linkLabel: "Demo"
  },
  {
    slug: "llm-content-engine",
    title: "LLM Content Engine",
    description: "Turns retention data into video ideas, scripts, and captions.",
    summary:
      "An automation loop between analytics and content. Retention and engagement data from published reels feeds an LLM pipeline that proposes the next video ideas, writes scripts, and drafts captions — so every new post is informed by what actually performed.",
    media: "/demos/DEMO.mp4",
    poster: "/demos/posters/llm-content-engine.jpg",
    tags: ["LLMs", "Prompt Design", "Analytics"],
    disciplines: ["ai", "automation", "creative"],
    outcome: "Closes the loop between audience retention data and the next creative brief.",
    architecture: ["Analytics ingestion", "LLM concept + script generation", "Human review and publishing"],
    decision: "Generate from measured audience behavior rather than starting every prompt from a blank page.",
    next: "Add experiment tracking and prompt evaluation by content format.",
    link: "https://github.com/AwadBuisir10/viral-content-engine",
    linkLabel: "Repo"
  },
  {
    slug: "shopify-restock-monitor",
    title: "Shopify Restock Monitor",
    description: "Watches limited drops and fires instant Discord alerts.",
    summary:
      "A lightweight watcher for limited-release Shopify stores. It polls product endpoints, detects stock changes the moment they happen, and fires structured Discord alerts fast enough to act on a drop.",
    media: "/demos/Monitor.png",
    tags: ["JavaScript", "Shopify", "Discord"],
    disciplines: ["automation"],
    outcome: "Detects inventory changes and delivers structured release alerts quickly enough to act.",
    architecture: ["Product endpoint poller", "Stock-delta detector", "Discord webhook delivery"],
    decision: "Keep the watcher lightweight and event-focused to minimize alert latency.",
    next: "Add adaptive backoff, reusable store adapters, and deployment monitoring.",
    link: "https://github.com/AwadBuisir10/shopify-restock-monitor",
    linkLabel: "Repo"
  }
];
