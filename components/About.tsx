"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { about } from "@/data/site";

export function About() {
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const activePillar = about.pillars[activeIndex];

  return (
    <section id="about" className="section-anchor py-20 sm:py-28">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionHeader index="01" eyebrow="About" />

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <motion.p
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-xl font-display text-2xl font-medium leading-snug tracking-[-0.01em] text-navy sm:text-3xl"
            >
              {about.lines[0]}{" "}
              <span className="text-steel">{about.lines[1]}</span>
            </motion.p>

            <div className="mt-10 grid max-w-xl grid-cols-[8rem_1fr] items-start gap-5 sm:grid-cols-[9rem_1fr] sm:gap-7">
              <motion.figure
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-line bg-canvas shadow-card">
                  <Image
                    src="/assets/personal/awad-headshot.jpg"
                    alt="Portrait of Awad Buisir"
                    fill
                    sizes="(max-width: 639px) 128px, 144px"
                    className="object-cover object-top"
                  />
                </div>
                <figcaption className="mt-2 font-mono text-[9px] uppercase tracking-[0.08em] text-steel">
                  Awad / Boston
                </figcaption>
              </motion.figure>

              <div className="min-h-[7.5rem] border-l-2 border-signal pl-5 sm:pl-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.11em] text-steel">
                  Proof / {String(activeIndex + 1).padStart(2, "0")} {activePillar.word}
                </p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activePillar.word}
                    initial={reduced ? false : { opacity: 0, y: 7 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -5 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <p className="mt-2 font-display text-2xl font-medium text-navy sm:text-3xl">
                      {activePillar.proof}
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-seafoam-700">
                      {activePillar.signal}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div role="group" aria-label="How I work">
            {about.pillars.map((pillar, i) => (
              <motion.button
                key={pillar.word}
                type="button"
                aria-pressed={activeIndex === i}
                onMouseEnter={() => setActiveIndex(i)}
                onFocus={() => setActiveIndex(i)}
                onClick={() => setActiveIndex(i)}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={reduced ? undefined : { x: 4 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: reduced ? 0 : i * 0.08, ease: "easeOut" }}
                className={`group grid w-full grid-cols-[2.25rem_1fr] items-start gap-3 border-b border-line py-5 text-left transition-colors duration-200 first:pt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/20 ${
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
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
