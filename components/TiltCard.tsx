"use client";

import { motion, useSpring } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const spring = { stiffness: 170, damping: 18, mass: 0.5 };

/** 3D tilt toward the mouse with a soft moving glare. Touch and reduced motion stay flat. */
export function TiltCard({ children, className, max = 7, glare = true }: { children: ReactNode; className?: string; max?: number; glare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);

  const tilt = (event: PointerEvent) => {
    if (reduced || event.pointerType !== "mouse" || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width;
    const py = (event.clientY - box.top) / box.height;
    rotateY.set((px - 0.5) * max * 2);
    rotateX.set((0.5 - py) * max * 2);
    ref.current.style.setProperty("--glare-x", `${px * 100}%`);
    ref.current.style.setProperty("--glare-y", `${py * 100}%`);
  };

  const settle = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div ref={ref} onPointerMove={tilt} onPointerLeave={settle} style={{ rotateX, rotateY, transformPerspective: 1100 }} className={cn("group/tilt relative will-change-transform", className)}>
      {children}
      {glare ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
          style={{ background: "radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,.28), transparent 55%)" }}
        />
      ) : null}
    </motion.div>
  );
}
