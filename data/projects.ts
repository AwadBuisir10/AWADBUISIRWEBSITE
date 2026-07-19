export type ProjectFocus = "all" | "ai" | "automation" | "creative";
export type ProjectDiscipline = Exclude<ProjectFocus, "all">;

export type ProjectStackLayer = {
  /** The system boundary this layer owns. */
  label: string;
  /** The concrete technology or implementation pattern used here. */
  tool: string;
  /** Plain-language explanation of why this layer exists. */
  responsibility: string;
};

export const projectFocusOptions: {
  value: ProjectFocus;
  label: string;
  summary: string;
  signals: string[];
}[] = [
  {
    value: "all",
    label: "All Work",
    summary: "Five working systems spanning bilingual voice AI, computer vision, LLM pipelines, and event-driven automation.",
    signals: ["Applied AI", "Event-driven services", "APIs + webhooks"]
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
  /** Short evidence label shown beside the active preview. */
  proof: string;
  outcome: string;
  stack: ProjectStackLayer[];
  decision: string;
  next: string;
  /** Demo, repo, or case-study URL. Leave null until there is something to show. */
  link: string | null;
  linkLabel?: string;
};

export const projects: Project[] = [
  {
    slug: "libyamed-dispatch",
    title: "LibyaMed Dispatch",
    description: "A bilingual, safety-first AI incident-intake platform for controlled hospital and government demonstrations.",
    summary:
      "LibyaMed Dispatch is an AI-assisted emergency-call intake dashboard built for controlled demonstrations. Its voice agent begins in English and switches between English and Arabic with the caller, using high-quality speech recognition, patient turn-taking, noise handling, and low-latency Flash speech. The system combines a real-time incident feed, secure one-time location requests, audit logs, and per-step latency telemetry. A GPS issue in demo mode was identified and fixed: real inbound demo calls can send WhatsApp location links, while the simulator remains permanently isolated from real phone numbers. The production build reduced local runtime memory from roughly 5.1 GB in development to about 117 MB and passed 49 unit tests, 6 end-to-end browser tests, linting, a production build, and live configuration verification.",
    media: "/demos/DispatchDemo.mp4",
    poster: "/demos/posters/dispatch-demo.jpg",
    tags: ["Next.js + TypeScript", "ElevenLabs", "Twilio + WhatsApp"],
    disciplines: ["ai", "automation"],
    proof: "49 unit tests · 6 E2E tests",
    outcome: "Integrates bilingual AI intake, secure GPS consent flows, live operational dashboards, latency observability, and human-in-the-loop controls.",
    stack: [
      {
        label: "Operations UI",
        tool: "Next.js · React · TypeScript",
        responsibility: "Presents the real-time incident feed, dispatcher controls, audit history, and latency telemetry."
      },
      {
        label: "Voice intake",
        tool: "ElevenLabs Voice AI",
        responsibility: "Runs low-latency bilingual conversations with language switching, turn-taking, noise handling, and high-quality ASR."
      },
      {
        label: "Calls + location",
        tool: "Twilio Voice · WhatsApp",
        responsibility: "Handles inbound demo calls and sends consent-based, one-time GPS links without exposing real numbers to the simulator."
      },
      {
        label: "Application layer",
        tool: "TypeScript API routes",
        responsibility: "Coordinates incidents, AI tools, transcripts, GPS events, dashboard updates, audit logging, and per-step timing."
      },
      {
        label: "Data model",
        tool: "Supabase-ready schema",
        responsibility: "Defines a production-ready path for persistent incident records, events, locations, and operational reporting."
      }
    ],
    decision: "The AI can collect and structure information, but it cannot diagnose, assign severity, dispatch ambulances, select hospitals, or promise emergency response; human dispatchers retain control.",
    next: "Connect the prepared data model to Supabase and validate the complete workflow in a controlled stakeholder pilot.",
    link: null,
    linkLabel: "Demo"
  },
  {
    slug: "ai-voice-receptionist",
    title: "AI Voice Receptionist",
    description: "Answers real customer calls and books appointments end to end — no human in the loop.",
    summary:
      "A voice agent built for a real service business. It answers inbound calls, works out what the caller needs, checks live availability against Google Calendar, and books the appointment in a single call. ElevenLabs drives the speech layer; every scheduling action runs through deterministic webhooks so the model can never invent an opening. Client build — the code stays private, but I can demo it live on request.",
    media: null,
    tags: ["ElevenLabs", "Webhooks", "Google Calendar API"],
    disciplines: ["ai", "automation"],
    proof: "Private client system",
    outcome: "Handles phone intake, availability checks, and booking for a real business with no manual handoff.",
    stack: [
      {
        label: "Conversation",
        tool: "ElevenLabs Voice AI",
        responsibility: "Runs the live call from spoken request to a natural voice response."
      },
      {
        label: "Orchestration",
        tool: "Deterministic webhooks",
        responsibility: "Validates the caller's intent and turns it into controlled scheduling actions."
      },
      {
        label: "System of record",
        tool: "Google Calendar API",
        responsibility: "Reads live availability and writes only appointments the calendar confirms."
      }
    ],
    decision: "Business logic lives in webhooks, not the model — the agent can only book slots the calendar API confirms.",
    next: "Add call transcripts, failure-mode tests for ambiguous requests, and booking-success metrics.",
    link: null,
    linkLabel: "Demo"
  },
  {
    slug: "soccer-vision-system",
    title: "Soccer Vision System",
    description: "A YOLOv8 pipeline that tracks every player in match footage and auto-cuts highlights.",
    summary:
      "A computer-vision pipeline: YOLOv8 detects players frame by frame, a multi-object tracker keeps identities stable through occlusions and camera movement, and a highlight stage cuts clips around key moments. Hours of raw match film become tracked movement data and shareable edits with no manual scrubbing. The code is private — the demo shows the pipeline running on real footage.",
    media: "/demos/SoccerDemo.mp4",
    poster: "/demos/posters/soccer-vision.jpg",
    contextImage: "/assets/personal/awad-soccer.jpg",
    contextAlt: "Awad Buisir on a soccer field wearing a red jersey",
    contextCaption: "Built by someone who plays the game",
    tags: ["YOLOv8", "Computer Vision", "Tracking"],
    disciplines: ["ai"],
    proof: "Working video demo",
    outcome: "Converts full match recordings into stable player tracks and automatically selected highlight clips.",
    stack: [
      {
        label: "Detection",
        tool: "YOLOv8",
        responsibility: "Finds every player frame by frame and returns the locations the rest of the pipeline follows."
      },
      {
        label: "Tracking",
        tool: "Multi-object tracking",
        responsibility: "Links detections over time and keeps player identities stable through motion and occlusion."
      },
      {
        label: "Output",
        tool: "Highlight extraction",
        responsibility: "Scores key moments and cuts the surrounding footage into shareable clips."
      }
    ],
    decision: "Detection and tracking are decoupled stages, so occlusion handling can improve without touching the detector.",
    next: "Benchmark identity-switch rates and add player/team calibration across camera angles.",
    link: null,
    linkLabel: "Demo"
  },
  {
    slug: "llm-content-engine",
    title: "LLM Content Engine",
    description: "Plans, voices, sources, renders, and QA-checks complete videos in one local-first pipeline.",
    summary:
      "A local-first content engine that turns a niche into upload-ready video. It researches, writes, plans scenes, generates voiceover, sources footage, renders captions, and blocks release until a QA pass succeeds. Every stage streams progress to the interface and writes an inspectable job record, so the AI workflow behaves like a production system instead of one opaque prompt.",
    media: "/demos/DEMO.mp4",
    poster: "/demos/posters/llm-content-engine.jpg",
    tags: ["OpenAI", "Express + SSE", "FFmpeg"],
    disciplines: ["ai", "automation", "creative"],
    proof: "Public repo · QA-gated renders",
    outcome: "Produces upload-ready Shorts and long-form videos only after a blocking QA review passes.",
    stack: [
      {
        label: "Control plane",
        tool: "Node.js · Express · SSE",
        responsibility: "Orchestrates each job and streams stage, timing, retry, and cancellation updates to the local UI."
      },
      {
        label: "AI layer",
        tool: "OpenAI · ElevenLabs",
        responsibility: "Researches and writes the story, plans scenes, generates voice, transcribes captions, and checks frames."
      },
      {
        label: "Media pipeline",
        tool: "Stock APIs · FFmpeg",
        responsibility: "Sources candidate footage, composes scenes, burns captions, and renders the final video."
      },
      {
        label: "Observability",
        tool: "SSE · JSON manifests",
        responsibility: "Keeps every run inspectable with live progress, source records, render metadata, and QA results."
      }
    ],
    decision: "Model generation as an observable, repairable job pipeline instead of hiding the work inside one AI call.",
    next: "Swap local JSON storage for SQLite before expanding beyond a single local user.",
    link: "https://github.com/AwadBuisir10/viral-content-engine",
    linkLabel: "Repo"
  },
  {
    slug: "shopify-restock-monitor",
    title: "Shopify Restock Monitor",
    description: "Polls limited-drop Shopify stores and fires structured Discord alerts the moment stock changes.",
    summary:
      "A lightweight watcher for limited-release Shopify stores. It polls product endpoints, diffs inventory state to catch restocks the moment they land, and delivers structured Discord alerts fast enough to act on a drop. Deliberately minimal: a polling loop, a stock-delta detector, and webhook delivery — no queue or database it doesn't need.",
    media: "/demos/Monitor.png",
    tags: ["Node.js", "Shopify", "Discord"],
    disciplines: ["automation"],
    proof: "Public repo · live poller",
    outcome: "Detects stock changes within one polling cycle and delivers structured, actionable alerts to Discord.",
    stack: [
      {
        label: "Runtime",
        tool: "Node.js · native fetch",
        responsibility: "Runs a small ES-module service with environment-driven stores, keywords, and polling intervals."
      },
      {
        label: "Source",
        tool: "Shopify /products.json",
        responsibility: "Reads public product and variant availability, then normalizes each store into one shape."
      },
      {
        label: "Change detection",
        tool: "JavaScript · in-memory Map",
        responsibility: "Diffs the latest snapshot against prior state to identify new products, restocks, and sellouts."
      },
      {
        label: "Delivery",
        tool: "Discord webhook embeds",
        responsibility: "Packages each change with the product, variant count, status, image, and link needed to act."
      }
    ],
    decision: "Kept the watcher stateless and event-focused to minimize time from stock change to alert.",
    next: "Adaptive per-store backoff, reusable store adapters, and uptime monitoring.",
    link: "https://github.com/AwadBuisir10/shopify-restock-monitor",
    linkLabel: "Repo"
  }
];
