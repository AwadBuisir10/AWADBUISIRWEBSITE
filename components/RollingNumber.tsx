"use client";

import { useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useRef, type CSSProperties } from "react";

const COLUMN = Array.from({ length: 20 }, (_, index) => index % 10);

/**
 * Odometer-style number. Server HTML parks every digit column on its final
 * value, so the number is correct before hydration, under reduced motion, and
 * if an animation never runs. Motion only slides the columns: once on first
 * view, then again whenever a live value (like follower counts) changes.
 */
export function RollingNumber({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const reduced = useReducedMotion();
  const rolling = inView && !reduced;
  let digitIndex = 0;

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex items-start tabular-nums">
        {Array.from(text).map((char, index) => {
          if (!/\d/.test(char)) return <span key={index} className="digit-static">{char}</span>;
          const delay = digitIndex++ * 70;
          return (
            <span key={index} className="digit">
              <span className="invisible">{char}</span>
              <span
                className={`digit__column ${rolling ? "is-rolling" : ""}`}
                style={{ "--digit": Number(char), "--delay": `${delay}ms` } as CSSProperties}
              >
                {COLUMN.map((digit, row) => <span key={row}>{digit}</span>)}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
