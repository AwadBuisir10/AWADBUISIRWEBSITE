"use client";

import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { formatViews, reels, type Reel } from "@/data/reels";

const SPEED = 24;
const GAP = 20;
const wrap = (min: number, max: number, value: number) => min + (((value - min) % (max - min)) + (max - min)) % (max - min);

export function ReelCarousel() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const distanceRef = useRef(0);
  const visibleRef = useRef(false);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const movedRef = useRef(0);
  const [coarse, setCoarse] = useState(false);
  const [active, setActive] = useState(0);
  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (value) => distanceRef.current ? wrap(-distanceRef.current, 0, value) : 0);

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse), (max-width: 767px)");
    const update = () => setCoarse(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => { visibleRef.current = entry.isIntersecting; }, { rootMargin: "150px" });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const measure = () => { distanceRef.current = group.getBoundingClientRect().width + GAP; };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(group);
    return () => observer.disconnect();
  }, [coarse]);

  useAnimationFrame((_, delta) => {
    if (reduced || coarse || pausedRef.current || draggingRef.current || !visibleRef.current || document.hidden || !distanceRef.current) return;
    baseX.set(baseX.get() - (delta / 1000) * SPEED);
  });

  const swallowDragClicks = (event: MouseEvent) => {
    if (movedRef.current > 8) { event.preventDefault(); event.stopPropagation(); }
  };

  const moveMobile = (direction: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.children[0] as HTMLElement | undefined;
    const distance = (card?.getBoundingClientRect().width ?? 280) + GAP;
    scroller.scrollBy({ left: direction * distance, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section ref={sectionRef} id="reels" className="section-anchor overflow-hidden border-t border-navy/10 py-20 sm:py-28">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionHeader index="05" eyebrow="Media evidence" title="Featured Reels" note="Drag to explore. Tap a card to watch on Instagram." />
        {(coarse || reduced) ? (
          <>
            <div className="mt-8 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[.12em] text-steel">Reel {String(active + 1).padStart(2, "0")} / {String(reels.length).padStart(2, "0")}</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => moveMobile(-1)} aria-label="Previous reel" className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-navy"><ArrowLeft className="h-4 w-4" /></button>
                <button type="button" onClick={() => moveMobile(1)} aria-label="Next reel" className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-navy"><ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
            <div ref={scrollerRef} onScroll={(event) => {
              const scroller = event.currentTarget;
              const center = scroller.scrollLeft + scroller.clientWidth / 2;
              const cards = Array.from(scroller.children) as HTMLElement[];
              let closest = 0;
              cards.forEach((card, index) => { if (Math.abs(card.offsetLeft + card.offsetWidth / 2 - center) < Math.abs(cards[closest].offsetLeft + cards[closest].offsetWidth / 2 - center)) closest = index; });
              setActive(closest);
            }} className="-mx-5 mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-5 sm:-mx-8 sm:px-8">
              {reels.map((reel, index) => <ReelCard key={reel.id} reel={reel} active={index === active} />)}
            </div>
          </>
        ) : (
          <div className="relative mt-12 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]" onMouseEnter={() => (pausedRef.current = true)} onMouseLeave={() => (pausedRef.current = false)} onFocusCapture={() => (pausedRef.current = true)} onBlurCapture={() => (pausedRef.current = false)} onClickCapture={swallowDragClicks}>
            <motion.div className="flex w-max cursor-grab gap-5 px-12 active:cursor-grabbing" style={{ x, touchAction: "pan-y" }} onPanStart={() => { draggingRef.current = true; movedRef.current = 0; }} onPan={(_, info) => { movedRef.current += Math.abs(info.delta.x); baseX.set(baseX.get() + info.delta.x); }} onPanEnd={() => { draggingRef.current = false; }}>
              <div ref={groupRef} className="flex gap-5">{reels.map((reel) => <ReelCard key={reel.id} reel={reel} />)}</div>
              <div className="flex gap-5" aria-hidden="true">{reels.map((reel) => <ReelCard key={`copy-${reel.id}`} reel={reel} duplicate />)}</div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

function ReelCard({ reel, active = false, duplicate = false }: { reel: Reel; active?: boolean; duplicate?: boolean }) {
  return (
    <article className={`w-[78vw] max-w-[330px] shrink-0 snap-center transition-all duration-300 sm:w-[330px] ${active ? "scale-100 opacity-100" : "scale-[.96] opacity-80 sm:scale-100 sm:opacity-100"}`}>
      <a href={reel.url} target="_blank" rel="noreferrer" aria-label={`Watch “${reel.title}” on Instagram`} draggable={false} tabIndex={duplicate ? -1 : undefined} className="group relative block aspect-[4/5] overflow-hidden rounded-xl border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
        <Image src={reel.thumbnail} alt="" fill sizes="(max-width: 767px) 78vw, 330px" draggable={false} className="select-none object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" aria-hidden="true" />
        <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-navy/65 text-white backdrop-blur-sm transition-transform group-hover:scale-110" aria-hidden="true"><Play className="ml-0.5 h-5 w-5 fill-current" /></span>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="font-display text-xl font-medium text-white">{reel.title}</p>
          <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[.1em] text-white/80">{reel.platform} · {formatViews(reel.views)} views</p>
        </div>
      </a>
      <a href={reel.url} target="_blank" rel="noreferrer" tabIndex={duplicate ? -1 : undefined} className="group mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[.1em] text-slate">View on Instagram<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></a>
    </article>
  );
}
