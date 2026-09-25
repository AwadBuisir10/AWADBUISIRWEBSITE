"use client";

import { useSiteContent } from "@/components/ContentProvider";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Clapperboard, Layers3, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { KitStory } from "@/components/KitStory";
import { SectionHeader } from "@/components/SectionHeader";

// One set of type tokens for every sub-block, so labels, titles, and copy stay in step.
const ease = [0.22, 1, 0.36, 1] as const;
const mono = "font-mono uppercase tracking-[.12em]";
const label = `${mono} text-[11px]`;
const meta = `${mono} text-[10px]`;
const subTitle = "mt-3 font-display text-3xl font-medium leading-tight tracking-[-.03em] sm:text-4xl";
const body = "text-base leading-7";
const pad = (value: number) => String(value).padStart(2, "0");

export function CreativeGallery() {
  const { creative, sectionHeadings } = useSiteContent();
  const { tools, storyFrames, workflow } = creative;
  const icons: Record<string, typeof Sparkles> = { sparkles: Sparkles, layers: Layers3, clapperboard: Clapperboard };
  const capabilities = creative.capabilities.map(capability => ({ ...capability, icon: icons[capability.icon] ?? Sparkles }));
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  // The dark panel starts as an inset card and opens to full bleed as it scrolls in.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "start 20%"] });
  const inset = useTransform(scrollYProgress, [0, 1], [2.5, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], [44, 0]);
  const clipPath = useMotionTemplate`inset(0% ${inset}% round ${radius}px)`;
  const [activeFrame, setActiveFrame] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const selectedFrame = lightbox === null ? undefined : storyFrames[lightbox];
  const step = (direction: number) => setLightbox((value) => value === null ? null : (value + direction + storyFrames.length) % storyFrames.length);

  useEffect(() => {
    if (lightbox === null || !storyFrames.length) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowLeft") setLightbox((value) => value === null ? null : (value - 1 + storyFrames.length) % storyFrames.length);
      if (event.key === "ArrowRight") setLightbox((value) => value === null ? null : (value + 1) % storyFrames.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", close); };
  }, [lightbox, storyFrames.length]);

  return (
    <section ref={sectionRef} id="creative" data-nav-theme="dark" className="section-anchor relative overflow-hidden py-20 text-white sm:py-28">
      <motion.div style={reduced ? undefined : { clipPath }} className="absolute inset-0 bg-[#071b25]" aria-hidden="true" />
      <div className="relative mx-auto max-w-shell px-5 sm:px-8">
        <SectionHeader index="08" {...sectionHeadings.creative} dark />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16">
          <motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease }} className="max-w-2xl font-display text-2xl font-medium leading-snug tracking-[-.02em] text-white sm:text-3xl">
            {creative.intro}
          </motion.p>
          {capabilities.length ? (
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3">
              {capabilities.map(({ icon: Icon, top, bottom }, index) => (
                <motion.div key={top} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: reduced ? 0 : 0.1 + index * 0.1, ease }} className="spotlight spotlight-dark group/cap relative flex items-center gap-4 bg-[#0b2530] p-4 sm:block sm:p-5">
                  <Icon className="h-5 w-5 shrink-0 text-seafoam-400 transition-transform duration-500 group-hover/cap:rotate-12 group-hover/cap:scale-125 sm:mb-5" aria-hidden="true" />
                  <div><p className={`${meta} text-white/50`}>{top}</p><p className="mt-1 text-sm font-medium text-white">{bottom}</p></div>
                </motion.div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-20 border-t border-white/10 pt-8">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end sm:gap-10">
            <div>
              <p className={`${label} text-seafoam-400`}>{creative.storyEyebrow}</p>
              <h3 className={`${subTitle} max-w-2xl`}>{creative.storyTitle}</h3>
            </div>
            <p className={`${body} max-w-md text-white/60`}>{creative.storyDescription}</p>
          </div>

          {storyFrames.length ? (
            <div className="mb-4 flex items-center justify-between">
              <span className={`${meta} text-white/50`}>Frame {pad(Math.min(activeFrame + 1, storyFrames.length))} / {pad(storyFrames.length)}</span>
              <span className={`${meta} text-seafoam-400`}>Select a frame to enlarge</span>
            </div>
          ) : null}
          <div className="-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-3 sm:mx-0 sm:h-[34rem] sm:overflow-visible sm:px-0">
            {storyFrames.map((frame, index) => (
              // Entrance moves only y: opacity stays with the class so inactive frames can dim.
              <motion.button key={frame.image} type="button" aria-label={`Enlarge frame ${index + 1}: ${frame.label}`} initial={{ y: 40 }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, delay: reduced ? 0 : index * 0.08, ease }} onClick={() => { setActiveFrame(index); setLightbox(index); }} onMouseEnter={() => setActiveFrame(index)} onFocus={() => setActiveFrame(index)} className={`group relative h-[29rem] w-[82vw] max-w-[22rem] shrink-0 snap-center overflow-hidden rounded-xl border border-white/10 text-left transition-[flex-grow,opacity] duration-500 sm:h-full sm:w-auto sm:max-w-none ${activeFrame === index ? "sm:flex-[2.1]" : "sm:flex-1 sm:opacity-60 sm:hover:opacity-100"}`}>
                {frame.image ? <Image src={frame.image} alt={frame.alt} fill sizes="(max-width: 639px) 82vw, 30vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" /> : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" aria-hidden="true" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
                  <span className={`${meta} text-white/85`}>{frame.label}</span>
                  <span className="font-mono text-[10px] text-white/50">{pad(index + 1)}</span>
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-10 border-t border-white/10 pt-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
          <div>
            <p className={`${label} text-seafoam-400`}>{creative.workflowEyebrow}</p>
            <h3 className={subTitle}>{creative.workflowTitle}</h3>
            <p className={`${body} mt-5 max-w-md text-white/60`}>{creative.workflowDescription}</p>
            {tools.length ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {tools.map((tool) => <span key={tool} className={`${meta} rounded-full border border-white/15 bg-white/[.04] px-3 py-2 text-white/75`}>{tool}</span>)}
              </div>
            ) : null}
          </div>
          {workflow.length ? (
            // The rail runs through the centre of the 2rem step markers (1rem in).
            <ol className="relative before:absolute before:bottom-9 before:left-[calc(1rem-0.5px)] before:top-9 before:w-px before:bg-white/10">
              <motion.span initial={reduced ? false : { scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }} className="absolute bottom-9 left-[calc(1rem-0.5px)] top-9 w-px origin-top bg-gradient-to-b from-seafoam-400 to-cyan" aria-hidden="true" />
              {workflow.map(({ number, title, copy }, index) => (
                <motion.li key={number} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, delay: reduced ? 0 : 0.2 + index * 0.12, ease }} className="group/step relative grid grid-cols-[3rem_1fr] gap-x-4 gap-y-1 border-b border-white/10 py-5 last:border-b-0 sm:grid-cols-[3rem_8rem_1fr] sm:items-center">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-seafoam-400/50 bg-[#071b25] font-mono text-[10px] text-seafoam-400 transition-[background-color,color,transform] duration-300 group-hover/step:scale-110 group-hover/step:bg-seafoam-400 group-hover/step:text-[#071b25]">{number}</span>
                  <strong className="self-center font-display text-lg font-medium">{title}</strong>
                  <span className="col-start-2 text-sm leading-6 text-white/60 transition-colors duration-300 group-hover/step:text-white/85 sm:col-start-auto">{copy}</span>
                </motion.li>
              ))}
            </ol>
          ) : null}
        </div>

        <KitStory />
      </div>

      {selectedFrame?.image && lightbox !== null ? (
        <div role="dialog" aria-modal="true" aria-label={selectedFrame.label} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 sm:p-8" onClick={() => setLightbox(null)}>
          <button autoFocus type="button" onClick={() => setLightbox(null)} aria-label="Close image" className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white transition-colors hover:bg-white/10"><X className="h-5 w-5" /></button>
          <div className="relative h-full w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <Image src={selectedFrame.image} alt={selectedFrame.alt} fill sizes="100vw" priority className="object-contain" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-gradient-to-t from-black/80 to-transparent p-5 text-white">
              <button type="button" onClick={() => step(-1)} aria-label="Previous frame" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 transition-colors hover:bg-white/10"><ArrowLeft className="h-4 w-4" /></button>
              <p className={`${meta} text-center`}>{pad(lightbox + 1)} / {pad(storyFrames.length)} · {selectedFrame.label}</p>
              <button type="button" onClick={() => step(1)} aria-label="Next frame" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 transition-colors hover:bg-white/10"><ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
