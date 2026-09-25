"use client";

import { useSiteContent } from "@/components/ContentProvider";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Fragment, useRef, type CSSProperties } from "react";
import { GlobeNetwork } from "@/components/GlobeNetwork";
import { Magnetic } from "@/components/Magnetic";
import { SocialLinks } from "@/components/SocialLinks";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export function Hero() {
  const { hero, contact } = useSiteContent();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);
  const globeY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const words = hero.headline.split(" ");

  return (
    <section ref={sectionRef} id="top" className="spotlight relative overflow-hidden bg-white [--spot-color:rgba(136,222,235,.22)] [--spot-size:760px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_34%,rgba(136,222,235,.16),transparent_34%),radial-gradient(circle_at_10%_85%,rgba(68,180,139,.08),transparent_26%)]" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-[92svh] max-w-shell items-center gap-8 px-5 pb-20 pt-28 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(32rem,.92fr)] lg:gap-4 lg:pb-24 lg:pt-24">
        <motion.div style={reduced ? undefined : { y: copyY, opacity: copyOpacity }} className="relative z-10 max-w-3xl 2xl:max-w-4xl">
          <div className="fade-rise flex flex-wrap items-center gap-x-5 gap-y-3" style={delay(0)}>
            <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-navy">{hero.eyebrow}</p>
            <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.11em] text-seafoam-700">
              <span className="status-ping h-1.5 w-1.5 rounded-full bg-seafoam-600" aria-hidden="true" />
              {hero.availability}
            </p>
          </div>

          <h1 className="mt-6 font-display text-[clamp(2.55rem,7vw,4.75rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-navy">
            {words.map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                <span className="word-mask">
                  <span className="word-rise" style={delay(120 + i * 65)}>
                    {/^AI[.,!?]?$/.test(word) ? <span className="ink-shift">{word}</span> : word}
                  </span>
                </span>{" "}
              </Fragment>
            ))}
          </h1>
          <p className="fade-rise mt-7 max-w-xl text-base leading-7 text-slate sm:text-lg sm:leading-8" style={delay(180 + words.length * 65)}>{hero.subheadline}</p>

          <div className="fade-rise mt-9 flex flex-wrap items-center gap-4" style={delay(300 + words.length * 65)}>
            <Magnetic>
              <a href="#work" className="group relative inline-flex min-h-12 items-center gap-2.5 overflow-hidden rounded-lg bg-navy px-7 text-sm font-medium text-white shadow-button transition-[background-color,transform] duration-200 hover:-translate-y-0.5 active:scale-95">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden="true" />
                View Work
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href={contact.resume} download className="group inline-flex min-h-12 items-center gap-2.5 rounded-lg border border-navy px-7 text-sm font-medium text-navy transition-[background-color,color,transform] duration-200 hover:-translate-y-0.5 hover:bg-navy hover:text-white active:scale-95">
                Download Resume
                <ArrowDown className="h-4 w-4 transition-transform duration-150 group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
            </Magnetic>
          </div>

          <div className="fade-rise mt-10 flex items-center gap-4" style={delay(420 + words.length * 65)}>
            <SocialLinks />
            <span className="hidden h-px w-16 bg-line sm:block" aria-hidden="true" />
            <span className="hidden font-mono text-[13px] uppercase tracking-[0.1em] text-steel sm:block">{hero.locationLine}</span>
          </div>
        </motion.div>

        <motion.div
          style={reduced ? undefined : { y: globeY, scale: globeScale }}
          className="relative -mx-2 h-[21rem] overflow-hidden rounded-2xl border border-line/80 bg-white/55 shadow-[0_24px_80px_rgba(17,26,74,.08)] backdrop-blur-sm sm:mx-0 sm:h-[28rem] lg:h-[min(72vh,46rem)] lg:overflow-visible lg:border-0 lg:bg-transparent lg:shadow-none"
        >
          <div className="scale-rise absolute inset-[-9%] lg:inset-[-12%]" style={delay(250)}>
            <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_42%_38%,rgba(30,65,153,0.10),rgba(136,222,235,0.14)_58%,transparent_75%)] blur-2xl" aria-hidden="true" />
            <GlobeNetwork />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-line/70 bg-white/80 px-4 py-3 backdrop-blur-md lg:hidden">
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-steel">{hero.originLabel}</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-seafoam-700">{hero.networkLabel}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
