"use client";

import { useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_#%";

/**
 * Decodes mono labels from random glyphs, left to right: once when scrolled
 * into view and, optionally, again on hover. The real text is always in the
 * DOM for assistive tech and server HTML.
 */
export function ScrambleText({ text, className, hover = false, onView = true, duration = 650 }: {
  text: string;
  className?: string;
  hover?: boolean;
  onView?: boolean;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [shown, setShown] = useState(text);

  const run = useCallback(() => {
    if (reduced) return;
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const settled = Math.floor(progress * text.length);
      setShown(Array.from(text, (char, index) =>
        index < settled || char === " " ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      ).join(""));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [duration, reduced, text]);

  useEffect(() => setShown(text), [text]);
  useEffect(() => {
    if (onView && inView) run();
  }, [inView, onView, run]);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <span ref={ref} className={className} onMouseEnter={hover ? run : undefined}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
