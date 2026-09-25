"use client";

import { motion, useSpring } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const spring = { stiffness: 260, damping: 18, mass: 0.35 };

/** Pulls its child toward a mouse pointer, then springs back on leave. */
export function Magnetic({ children, strength = 0.14, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  const pull = (event: PointerEvent) => {
    if (reduced || event.pointerType !== "mouse" || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    x.set((event.clientX - (box.left + box.width / 2)) * strength);
    y.set((event.clientY - (box.top + box.height / 2)) * strength);
  };

  const release = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span ref={ref} onPointerMove={pull} onPointerLeave={release} style={{ x, y }} className={cn("inline-flex", className)}>
      {children}
    </motion.span>
  );
}
