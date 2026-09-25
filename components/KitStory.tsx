"use client";

import { useSiteContent } from "@/components/ContentProvider";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TiltCard } from "@/components/TiltCard";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;
const mono = "font-mono uppercase tracking-[.12em]";
const STEP_MS = 4200;
// Design renders are transparent-edged PNGs; photos get a blurred backdrop instead of letterboxing.
const isRender = (src: string) => /\.png(?:[?#]|$)/i.test(src);
const pad = (value: number) => String(value).padStart(2, "0");

/**
 * The Libya kit as a short case study: AI concept → produced jersey → the
 * tournament it funded. Views auto-advance while visible and pause as soon as
 * the visitor points at or tabs into the viewer.
 */
export function KitStory() {
  const { creative } = useSiteContent();
  const { kitViews, kitStats } = creative;
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "-20% 0px" });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = kitViews.length;
  const current = kitViews[Math.min(index, count - 1)];
  const playing = !reduced && !paused && inView && count > 1;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setIndex((value) => (value + 1) % count), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [count, index, playing]);

  if (!current) return null;
  const photo = Boolean(current.image) && !isRender(current.image);

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease }}
      className="mt-20 overflow-hidden rounded-xl bg-[#f0eadb] text-navy"
    >
      {/* minmax(0,1fr): the scrollable filmstrip must not widen the column on phones. */}
      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2">
        <div
          className="flex min-h-[30rem] min-w-0 flex-col bg-[#e9e1cf] sm:min-h-[40rem]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="flex items-center justify-between gap-4 p-4 sm:p-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={current.stage || current.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className={cn(mono, "inline-flex items-center gap-2 rounded-full border border-navy/10 bg-[#f0eadb]/90 px-3 py-1.5 text-[10px] text-navy shadow-card")}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", /ai/i.test(current.stage) ? "bg-seafoam-600" : "status-ping bg-signal")} aria-hidden="true" />
                {current.stage || current.label}
              </motion.span>
            </AnimatePresence>
            <span className={cn(mono, "shrink-0 text-[10px] text-navy/45")}>{pad(index + 1)} / {pad(count)}<span className="hidden sm:inline"> · {creative.kitCaption}</span></span>
          </div>

          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              {current.image ? (
                <motion.div
                  key={current.image}
                  initial={{ opacity: 0, scale: 0.97, rotate: -1 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.55, ease }}
                  className="absolute inset-0 px-4 sm:px-6"
                >
                  <TiltCard max={photo ? 3 : 0} glare={photo} className="relative h-full overflow-hidden rounded-xl">
                    {photo ? (
                      <Image src={current.image} alt="" aria-hidden="true" fill sizes="10vw" className="scale-110 object-cover opacity-50 blur-2xl" />
                    ) : null}
                    <Image src={current.image} alt={current.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className={cn("relative object-contain", photo ? "drop-shadow-[0_24px_40px_rgba(17,26,74,.25)]" : "")} />
                  </TiltCard>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {count > 1 ? (
            <div role="group" aria-label="Kit story views" className="flex gap-2 overflow-x-auto p-4 sm:p-6">
              {kitViews.map((view, viewIndex) => {
                const selected = viewIndex === index;
                return (
                  <button
                    key={`${view.label}-${viewIndex}`}
                    type="button"
                    aria-pressed={selected}
                    aria-label={`${view.label}${view.stage ? ` (${view.stage})` : ""}`}
                    onClick={() => setIndex(viewIndex)}
                    className={cn("group relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-[#f0eadb] transition-[transform,border-color] duration-300 hover:-translate-y-0.5 sm:h-[4.5rem] sm:w-[4.5rem]", selected ? "border-navy" : "border-navy/10")}
                  >
                    {view.image ? <Image src={view.image} alt="" fill sizes="72px" className={cn("transition-[opacity,transform] duration-300 group-hover:scale-105", isRender(view.image) ? "object-contain p-1" : "object-cover", selected ? "opacity-100" : "opacity-60 group-hover:opacity-100")} /> : null}
                    <span className={cn(mono, "absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#f0eadb] via-[#f0eadb]/85 to-transparent px-1 pb-1 pt-3 text-center text-[8px] text-navy")}>{view.label}</span>
                    {selected && playing ? (
                      <motion.span key={`progress-${index}`} className="absolute inset-x-0 top-0 h-0.5 origin-left bg-signal" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: STEP_MS / 1000, ease: "linear" }} aria-hidden="true" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col justify-between p-6 sm:p-10 lg:p-12">
          <div>
            <p className={cn(mono, "text-[11px] text-seafoam-700")}>{creative.kitEyebrow}</p>
            <h3 className="mt-3 font-display text-3xl font-medium leading-tight tracking-[-.03em] sm:text-4xl">{creative.kitTitle}</h3>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate">{creative.kitDescription}</p>
          </div>
          {kitStats.length ? (
            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-navy/10 bg-navy/10">
              {kitStats.map((stat, statIndex) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: reduced ? 0 : 0.1 + statIndex * 0.08, ease }} className="spotlight relative bg-[#f6f1e4] p-4 sm:p-5">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-2xl font-semibold tracking-[-.03em] text-seafoam-700 sm:text-3xl">{stat.value}</span>
                    <span className={cn(mono, "mt-1 block text-[10px] leading-4 text-navy/60")} aria-hidden="true">{stat.label}</span>
                  </dd>
                </motion.div>
              ))}
            </dl>
          ) : null}
          {creative.kitOutcome ? (
            <p className={cn(mono, "mt-8 flex items-center gap-3 border-t border-navy/15 pt-5 text-[10px] text-navy/60")}>
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />{creative.kitOutcome}
            </p>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
