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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_34%,rgba(136,222,235,.16),transparent_34%),radial-gradient(circle_at_10%_85%,rgba(68,180,139,.08),transparent_26%)]" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-[92svh] max-w-shell items-center gap-8 px-5 pb-20 pt-28 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(32rem,.92fr)] lg:gap-4 lg:pb-24 lg:pt-24">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 max-w-3xl 2xl:max-w-4xl"
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-navy">{hero.eyebrow}</p>
            <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.11em] text-seafoam-700">
              <span className="h-1.5 w-1.5 rounded-full bg-seafoam-600" aria-hidden="true" />
              {hero.availability}
            </p>
          </div>

          <h1 className="mt-6 font-display text-[clamp(2.55rem,7vw,4.75rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-navy">
            {hero.headline}
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-slate sm:text-lg sm:leading-8">{hero.subheadline}</p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#work" onClick={scrollToWork} className="group inline-flex min-h-12 items-center gap-2.5 rounded-lg bg-navy px-7 text-sm font-medium text-white shadow-button transition-all duration-200 hover:-translate-y-0.5 hover:bg-navy/90 active:scale-95">
              View Work
              <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a href={contact.resume} download className="group inline-flex min-h-12 items-center gap-2.5 rounded-lg border border-navy px-7 text-sm font-medium text-navy transition-all duration-200 hover:-translate-y-0.5 hover:bg-navy hover:text-white active:scale-95">
              Download Resume
              <ArrowDown className="h-4 w-4 transition-transform duration-150 group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <SocialLinks />
            <span className="hidden h-px w-16 bg-line sm:block" aria-hidden="true" />
            <span className="hidden font-mono text-[13px] uppercase tracking-[0.1em] text-steel sm:block">Boston → everywhere</span>
          </div>
        </motion.div>

        <div className="relative -mx-2 h-[21rem] overflow-hidden rounded-2xl border border-line/80 bg-white/55 shadow-[0_24px_80px_rgba(17,26,74,.08)] backdrop-blur-sm sm:mx-0 sm:h-[28rem] lg:h-[min(72vh,46rem)] lg:overflow-visible lg:border-0 lg:bg-transparent lg:shadow-none">
          <div className="absolute inset-[-9%] lg:inset-[-12%]">
            <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_42%_38%,rgba(30,65,153,0.10),rgba(136,222,235,0.14)_58%,transparent_75%)] blur-2xl" aria-hidden="true" />
            <GlobeNetwork />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-line/70 bg-white/80 px-4 py-3 backdrop-blur-md lg:hidden">
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-steel">Origin / Boston</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-seafoam-700">Network / Global</span>
          </div>
        </div>
      </div>
    </section>
  );
}
