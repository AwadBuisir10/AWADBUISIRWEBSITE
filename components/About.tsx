"use client";

import { useSiteContent } from "@/components/ContentProvider";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { AudienceText } from "@/components/AudienceText";
import { TiltCard } from "@/components/TiltCard";

const CYCLE_MS = 4500;
const ease = [0.22, 1, 0.36, 1] as const;

export function About() {
  const { about, sectionHeadings } = useSiteContent();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: "-20% 0px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const activePillar = about.pillars[activeIndex] ?? about.pillars[0];
  const cycling = !reduced && !paused && inView && about.pillars.length > 1;

  // Walk through the pillars on their own until the visitor takes over.
  useEffect(() => {
    if (!cycling) return;
    const timer = window.setTimeout(() => setActiveIndex((index) => (index + 1) % about.pillars.length), CYCLE_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, about.pillars.length, cycling]);

  return (
    <section ref={sectionRef} id="about" className="section-anchor py-20 sm:py-28">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionHeader index="01" {...sectionHeadings.about} />

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease }}
              className="max-w-xl font-display text-2xl font-medium leading-snug tracking-[-0.01em] text-navy sm:text-3xl"
            >
              {about.lines[0]}{" "}
              <span className="text-steel">{about.lines.slice(1).join(" ")}</span>
            </motion.p>

            <div className="mt-10 grid max-w-xl grid-cols-[8rem_1fr] items-start gap-5 sm:grid-cols-[9rem_1fr] sm:gap-7">
              <motion.figure
                initial={{ opacity: 0, y: 24, rotate: -3 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: 0.1, ease }}
              >
                <TiltCard max={10} className="rounded-md">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-line bg-canvas shadow-card">
                    {about.portrait ? <Image
                      src={about.portrait}
                      alt={about.portraitAlt}
                      fill
                      sizes="(max-width: 639px) 128px, 144px"
                      className="object-cover object-top"
                    /> : null}
                  </div>
                </TiltCard>
                <figcaption className="mt-2 font-mono text-[9px] uppercase tracking-[0.08em] text-steel">
                  {about.portraitCaption}
                </figcaption>
              </motion.figure>

              {activePillar ? <div className="min-h-[7.5rem] border-l-2 border-signal pl-5 sm:pl-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.11em] text-steel">
                  Proof / {String(activeIndex + 1).padStart(2, "0")} {activePillar.word}
                </p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activePillar.word}
                    initial={reduced ? false : { opacity: 0, y: 12, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={reduced ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <p className="mt-2 font-display text-2xl font-medium text-navy sm:text-3xl">
                      <AudienceText>{activePillar.proof}</AudienceText>
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-seafoam-700">
                      <AudienceText>{activePillar.signal}</AudienceText>
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div> : null}
            </div>
          </div>

          <div
            role="group"
            aria-label="How I work"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            {about.pillars.map((pillar, i) => (
              <motion.button
                key={pillar.word}
                type="button"
                aria-pressed={activeIndex === i}
                onMouseEnter={() => setActiveIndex(i)}
                onFocus={() => setActiveIndex(i)}
                onClick={() => setActiveIndex(i)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={reduced ? undefined : { x: 6 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: reduced ? 0 : i * 0.1, ease }}
                className={`group relative grid w-full grid-cols-[2.25rem_1fr] items-start gap-3 border-b border-line py-5 text-left transition-colors duration-200 first:pt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/20 ${
                  activeIndex === i ? "text-navy" : "text-steel hover:text-navy"
                }`}
              >
                <span className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em]">
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${
                      activeIndex === i ? "bg-signal" : "bg-mist group-hover:bg-seafoam-600"
                    }`}
                    aria-hidden="true"
                  />
                  0{i + 1}
                </span>
                <span className="flex items-baseline justify-between gap-5">
                  <span className="font-display text-2xl font-medium tracking-[-0.01em]">
                    {pillar.word}
                  </span>
                  <span className="max-w-[15rem] text-right text-[15px] leading-6 text-slate">
                    {pillar.line}
                  </span>
                </span>
                {activeIndex === i && cycling ? (
                  <motion.span
                    key={`progress-${activeIndex}`}
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-px h-px origin-left bg-signal"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
                  />
                ) : null}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
