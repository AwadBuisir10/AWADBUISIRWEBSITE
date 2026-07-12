"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform
} from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import { useEffect, useRef, type MouseEvent } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { formatViews, reels, type Reel } from "@/data/reels";

const SPEED = 28; // marquee px/s
const DRAG_CLICK_THRESHOLD = 8; // px of pan before a click is swallowed

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return min + (((v - min) % range) + range) % range;
};

/**
 * Featured reels: an infinite marquee (autoplay, drag, pause on hover/focus).
 * Every card is a straight link to its reel on Instagram — thumbnail,
 * title, platform, views, with a play overlay on hover. Reduced motion
 * falls back to a scroll-snap list with no autoplay.
 */
export function ReelCarousel() {
  const reduced = useReducedMotion();

  const trackRef = useRef<HTMLDivElement>(null);
  const halfRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const movedRef = useRef(0);

  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (v) => (halfRef.current ? wrap(-halfRef.current, 0, v) : 0));

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      halfRef.current = track.scrollWidth / 2;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [reduced]);

  useAnimationFrame((_, delta) => {
    if (reduced || pausedRef.current || draggingRef.current) return;
    if (!halfRef.current) return;
    baseX.set(baseX.get() - (delta / 1000) * SPEED);
  });

  // A real drag should not fire the link click that follows it.
  const swallowDragClicks = (event: MouseEvent) => {
    if (movedRef.current > DRAG_CLICK_THRESHOLD) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <section id="reels" className="section-anchor overflow-hidden py-24 sm:py-28">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionHeader
          index="05"
          eyebrow="LibyanClub Media"
          title="Featured Reels"
          note="Drag to explore. Tap a card to watch on Instagram."
        />
      </div>

      {reduced ? (
        <div className="relative mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8">
          {reels.map((reel) => (
            <ReelCard key={reel.id} reel={reel} className="snap-start" />
          ))}
        </div>
      ) : (
        <div
          className="relative mt-12"
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
          onFocusCapture={() => (pausedRef.current = true)}
          onBlurCapture={() => (pausedRef.current = false)}
          onClickCapture={swallowDragClicks}
        >
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-3 bg-gradient-to-r from-canvas/70 to-transparent sm:w-24 sm:from-canvas"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-3 bg-gradient-to-l from-canvas/70 to-transparent sm:w-24 sm:from-canvas"
            aria-hidden="true"
          />

          <motion.div
            ref={trackRef}
            className="flex w-max cursor-grab gap-5 active:cursor-grabbing"
            style={{ x, touchAction: "pan-y" }}
            onPanStart={() => {
              draggingRef.current = true;
              movedRef.current = 0;
            }}
            onPan={(_, info) => {
              movedRef.current += Math.abs(info.delta.x);
              baseX.set(baseX.get() + info.delta.x);
            }}
            onPanEnd={() => {
              draggingRef.current = false;
            }}
          >
            {[...reels, ...reels].map((reel, i) => (
              <ReelCard key={`${reel.id}-${i}`} reel={reel} />
            ))}
          </motion.div>
        </div>
      )}
    </section>
  );
}

function ReelCard({ reel, className = "" }: { reel: Reel; className?: string }) {
  return (
    <article className={`w-[72vw] max-w-[330px] shrink-0 sm:w-[330px] ${className}`}>
      <a
        href={reel.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Watch “${reel.title}” on Instagram`}
        draggable={false}
        className="group relative block aspect-[4/5] overflow-hidden rounded-lg border border-line bg-white shadow-card transition-shadow duration-300 hover:shadow-elevated"
      >
        <img
          src={reel.thumbnail}
          alt=""
          draggable={false}
          loading="lazy"
          className="h-full w-full select-none object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        {/* readability scrim, slightly deeper on hover */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20 transition-opacity duration-300"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />

        {/* play button — always visible on touch, scales up on hover */}
        <span
          className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-navy/60 text-white backdrop-blur-sm transition-all duration-300 ease-pop group-hover:scale-110 group-hover:bg-navy/80"
          aria-hidden="true"
        >
          <Play className="ml-0.5 h-5 w-5 fill-current" />
        </span>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="font-display text-xl font-medium tracking-[-0.01em] text-white">
            {reel.title}
          </p>
          <p className="mt-1.5 font-mono text-[13px] uppercase tracking-[0.1em] text-white/80">
            {reel.platform} · {formatViews(reel.views)} views
          </p>
        </div>
      </a>

      <a
        href={reel.url}
        target="_blank"
        rel="noreferrer"
        draggable={false}
        className="group mt-3 inline-flex items-center gap-1.5 font-mono text-[13px] uppercase tracking-[0.1em] text-slate transition-colors duration-150 hover:text-navy"
      >
        View on Instagram
        <ArrowUpRight
          className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </a>
    </article>
  );
}
