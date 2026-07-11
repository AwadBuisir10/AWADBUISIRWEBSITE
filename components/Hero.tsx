"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import type { MouseEvent } from "react";
import { GlobeNetwork } from "@/components/GlobeNetwork";
import { SocialLinks } from "@/components/SocialLinks";
import { contact, hero } from "@/data/site";

export function Hero() {
  const reduced = useReducedMotion();

  const scrollToWork = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.querySelector("#work");
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    window.history.pushState(null, "", "#work");
  };

  return (
    <section id="top" className="relative overflow-hidden bg-white">
      {/* One globe instance, repositioned by breakpoint: dim backdrop on mobile,
          accurate Natural Earth network feature on desktop. */}
      <div
        className="absolute left-1/2 top-16 h-[min(92vw,460px)] w-[min(92vw,460px)] -translate-x-1/2 opacity-40 lg:left-auto lg:right-[-7rem] lg:top-1/2 lg:h-[660px] lg:w-[660px] lg:-translate-x-0 lg:-translate-y-1/2 lg:opacity-100 xl:right-[-4rem] xl:h-[720px] xl:w-[720px] 2xl:right-[-3rem] 2xl:h-[820px] 2xl:w-[820px]"
      >
        {/* Ambient glow bed behind the wireframe. */}
        <div
          aria-hidden="true"
          className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_42%_38%,rgba(30,65,153,0.10),rgba(136,222,235,0.14)_58%,transparent_75%)] blur-2xl"
        />
        <GlobeNetwork />
      </div>
      {/* Keeps headline legible where it overlaps the globe. */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-white lg:bg-gradient-to-r lg:from-white lg:via-white/40 lg:to-transparent"
        aria-hidden="true"
      />

      <div className="pointer-events-none relative mx-auto flex min-h-[92svh] max-w-shell flex-col justify-center px-5 pb-16 pt-28 sm:px-8">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl 2xl:max-w-4xl"
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-navy">
              {hero.eyebrow}
            </p>
            <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.11em] text-seafoam-700">
              <span className="h-1.5 w-1.5 rounded-full bg-seafoam-600" aria-hidden="true" />
              {hero.availability}
            </p>
          </div>
          <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.06] tracking-[-0.025em] text-navy sm:text-6xl lg:text-[4.1rem] 2xl:text-[4.75rem]">
            {hero.headline}
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-slate sm:text-lg sm:leading-8">
            {hero.subheadline}
          </p>

          <div className="pointer-events-auto mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#work"
              onClick={scrollToWork}
              className="group inline-flex min-h-12 items-center gap-2.5 rounded-lg bg-navy px-7 text-sm font-medium text-white shadow-button transition-colors duration-150 hover:bg-navy/90 active:scale-95"
            >
              View Work
              <ArrowRight
                className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
            <a
              href={contact.resume}
              download
              className="group inline-flex min-h-12 items-center gap-2.5 rounded-lg border border-navy px-7 text-sm font-medium text-navy transition-colors duration-150 hover:bg-navy hover:text-white active:scale-95"
            >
              Download Resume
              <ArrowDown
                className="h-4 w-4 transition-transform duration-150 group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>

          <div className="pointer-events-auto mt-10 flex items-center gap-4">
            <SocialLinks />
            <span className="hidden h-px w-16 bg-line sm:block" aria-hidden="true" />
            <span className="hidden font-mono text-[13px] uppercase tracking-[0.1em] text-steel sm:block">
              Boston → everywhere
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
