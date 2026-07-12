"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, Clapperboard, Layers3, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";

const tools = ["Gemini Nano Banana", "Veo", "Midjourney", "ChatGPT", "CapCut", "TikTok"];
const capabilities = [
  { icon: Sparkles, top: "Prompt", bottom: "Engineering" },
  { icon: Layers3, top: "Multi-model", bottom: "Workflows" },
  { icon: Clapperboard, top: "Story", bottom: "Direction" }
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
];
const kitViews = [
  { label: "Concept", image: "/assets/ai-creative/libya-kit-design.png", alt: "Front and back design of an AI-assisted Libya basketball uniform concept" },
  { label: "In use", image: "/assets/ai-creative/libya-kit-concept.png", alt: "AI visualization of the Libya basketball jersey concept in use" }
];

export function CreativeGallery() {
  const reduced = useReducedMotion();
  const [activeFrame, setActiveFrame] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [kitView, setKitView] = useState(0);

  useEffect(() => {
    if (lightbox === null) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowLeft") setLightbox((value) => value === null ? null : (value - 1 + storyFrames.length) % storyFrames.length);
      if (event.key === "ArrowRight") setLightbox((value) => value === null ? null : (value + 1) % storyFrames.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", close); };
  }, [lightbox]);

  return (
    <section id="creative" className="section-anchor overflow-hidden bg-[#071b25] py-20 text-white sm:py-28">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionHeader index="07" eyebrow="AI Creative Works" title="Ideas, directed with AI." note="Prompt engineering, visual storytelling, and creative systems across image, video, and design." dark />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
          <p className="max-w-3xl font-display text-3xl font-medium leading-[1.12] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">I turn ambitious ideas into coherent visual worlds—combining precise prompts, reference-led direction, and the right AI tool for every step.</p>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {capabilities.map(({ icon: Icon, top, bottom }) => <div key={top} className="flex items-center gap-4 bg-[#0b2530] p-4 sm:block sm:p-5"><Icon className="h-5 w-5 shrink-0 text-seafoam-400 sm:mb-5" aria-hidden="true" /><div><p className="font-mono text-[10px] uppercase tracking-[.14em] text-white/50">{top}</p><p className="mt-1 text-sm font-medium text-white">{bottom}</p></div></div>)}
          </div>
        </div>

        <div className="mt-20 border-t border-white/10 pt-8">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="font-mono text-[11px] uppercase tracking-[.16em] text-seafoam-400">Historical storytelling</p><h3 className="mt-3 max-w-2xl font-display text-3xl font-medium tracking-[-.03em] sm:text-4xl">Making history vivid for a new generation.</h3></div>
            <p className="max-w-md text-sm leading-6 text-white/60">Reference images anchor the people, places, and art direction. Carefully structured prompts carry that identity from one frame—and one model—to the next.</p>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[.12em] text-white/45">Frame {String(activeFrame + 1).padStart(2, "0")} / 05</span>
            <span className="font-mono text-[10px] uppercase tracking-[.12em] text-seafoam-400">Tap to inspect</span>
          </div>
          <div className="-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-3 sm:mx-0 sm:h-[34rem] sm:overflow-visible sm:px-0">
            {storyFrames.map((frame, index) => (
              <motion.button key={frame.image} type="button" onClick={() => { setActiveFrame(index); setLightbox(index); }} onMouseEnter={() => setActiveFrame(index)} onFocus={() => setActiveFrame(index)} className={`group relative h-[29rem] w-[82vw] max-w-[22rem] shrink-0 snap-center overflow-hidden rounded-lg border border-white/10 text-left transition-[flex-grow,filter,opacity] duration-500 sm:h-full sm:w-auto sm:max-w-none ${activeFrame === index ? "sm:flex-[2.1]" : "sm:flex-1 sm:opacity-65 hover:sm:opacity-100"}`}>
                <Image src={frame.image} alt={frame.alt} fill sizes="(max-width: 639px) 82vw, 30vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" aria-hidden="true" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4"><span className="font-mono text-[10px] uppercase tracking-[.12em] text-white/80">{frame.label}</span><span className="font-mono text-[9px] text-white/45">0{index + 1}</span></span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-10 border-t border-white/10 pt-8 lg:grid-cols-[.72fr_1.28fr]">
          <div><p className="font-mono text-[11px] uppercase tracking-[.16em] text-seafoam-400">From reference to reel</p><h3 className="mt-3 font-display text-3xl font-medium tracking-[-.03em] sm:text-4xl">A repeatable creative workflow.</h3><p className="mt-5 max-w-md text-base leading-7 text-white/60">The craft is not a single prompt. It is research, iteration, model selection, continuity, editing, and knowing when the story is finally working.</p><div className="mt-8 flex flex-wrap gap-2">{tools.map((tool) => <span key={tool} className="rounded-full border border-white/15 bg-white/[.04] px-3 py-2 font-mono text-[10px] uppercase tracking-[.1em] text-white/75">{tool}</span>)}</div></div>
          <ol className="relative border-y border-white/10 before:absolute before:bottom-5 before:left-[1.18rem] before:top-5 before:w-px before:bg-white/10 sm:before:left-[1.45rem]">
            <motion.span initial={reduced ? false : { scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }} className="absolute bottom-5 left-[1.18rem] top-5 w-px origin-top bg-gradient-to-b from-seafoam-400 to-cyan sm:left-[1.45rem]" aria-hidden="true" />
            {workflow.map(([number, title, copy]) => <li key={number} className="relative grid grid-cols-[2.5rem_1fr] gap-4 py-5 sm:grid-cols-[3rem_8rem_1fr] sm:items-center"><span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border border-seafoam-400/50 bg-[#071b25] font-mono text-[8px] text-seafoam-400 sm:h-7 sm:w-7">{number}</span><strong className="font-display text-lg font-medium">{title}</strong><span className="col-start-2 text-sm leading-6 text-white/55 sm:col-start-auto">{copy}</span></li>)}
          </ol>
        </div>

        <div className="mt-20 overflow-hidden rounded-xl bg-[#f0eadb] text-navy">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[31rem] bg-[#e9e1cf] sm:min-h-[38rem]">
              <Image key={kitViews[kitView].image} src={kitViews[kitView].image} alt={kitViews[kitView].alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-3 sm:p-6" />
              <div className="absolute left-4 top-4 flex rounded-full border border-navy/10 bg-[#f0eadb]/90 p-1 shadow-card backdrop-blur sm:left-6 sm:top-6">
                {kitViews.map((view, index) => <button key={view.label} type="button" aria-pressed={kitView === index} onClick={() => setKitView(index)} className={`rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[.1em] transition-colors ${kitView === index ? "bg-navy text-white" : "text-navy/55"}`}>{view.label}</button>)}
              </div>
              <span className="absolute bottom-4 right-4 font-mono text-[9px] uppercase tracking-[.12em] text-navy/45">Concept → application</span>
            </div>
            <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
              <div><p className="font-mono text-[11px] uppercase tracking-[.16em] text-ocean">AI-assisted apparel design</p><h3 className="mt-4 font-display text-[clamp(2.35rem,8vw,3rem)] font-medium leading-tight tracking-[-.04em]">A national identity, translated into a basketball kit.</h3><p className="mt-6 max-w-xl text-base leading-7 text-slate">I use AI as a creative partner beyond film—rapidly exploring clothing concepts, cultural patterns, materials, and real-world presentation. This Libya national basketball jersey concept attracted interest from the Libyan Basketball Federation.</p></div>
              <div className="mt-10 flex items-center gap-3 border-t border-navy/15 pt-5 font-mono text-[10px] uppercase tracking-[.12em] text-navy/60"><ArrowDown className="h-4 w-4" aria-hidden="true" />Concept → visualization → stakeholder interest</div>
            </div>
          </div>
        </div>
      </div>

      {lightbox !== null ? (
        <div role="dialog" aria-modal="true" aria-label={storyFrames[lightbox].label} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 sm:p-8" onClick={() => setLightbox(null)}>
          <button autoFocus type="button" onClick={() => setLightbox(null)} aria-label="Close image" className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white"><X className="h-5 w-5" /></button>
          <div className="relative h-full w-full max-w-6xl" onClick={(event) => event.stopPropagation()}><Image src={storyFrames[lightbox].image} alt={storyFrames[lightbox].alt} fill sizes="100vw" priority className="object-contain" /><p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 text-center font-mono text-[10px] uppercase tracking-[.12em] text-white">{storyFrames[lightbox].label}</p></div>
        </div>
      ) : null}
    </section>
  );
}
