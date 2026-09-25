"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import type { Project } from "@/data/projects";

const STEP_MS = 900;
const HOLD_MS = 2600;

/**
 * Stand-in for a private build with no recorded demo: replays the project's
 * real stack layers as a looping request trace. It visualizes the architecture
 * described in the CMS; it is labelled as an illustration, not a recording.
 */
export function SystemTrace({ project }: { project: Project }) {
  const reduced = useReducedMotion();
  const layers = project.stack;
  const [step, setStep] = useState(0);
  const done = reduced || step > layers.length;

  useEffect(() => {
    if (reduced) return;
    const delay = step > layers.length ? HOLD_MS : STEP_MS;
    const timer = window.setTimeout(() => setStep((value) => (value > layers.length ? 0 : value + 1)), delay);
    return () => window.clearTimeout(timer);
  }, [layers.length, reduced, step]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_50%_45%,rgba(136,222,235,.18),transparent_42%),linear-gradient(135deg,#071b25,#102f3b)] p-6 font-mono text-seafoam-400">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(148,239,183,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(148,239,183,.15)_1px,transparent_1px)] [background-size:32px_32px]" aria-hidden="true" />
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-seafoam-400/10 to-transparent"
        animate={reduced ? undefined : { y: ["-30%", "430%"] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between text-[9px] uppercase tracking-[.14em] text-white/60">
          <span className="flex items-center gap-2"><span className="status-ping h-1.5 w-1.5 rounded-full bg-seafoam-400" aria-hidden="true" />System flow · illustration</span>
          <span>{project.tags[0]}</span>
        </div>
        <p className="mt-6 text-[11px] text-white/45">$ trace {project.slug}</p>
        <ol className="mt-4 space-y-3" aria-label={`${project.title} system flow`}>
          {layers.map((layer, index) => {
            const reached = done || step > index;
            const active = !done && step === index + 1;
            return (
              <motion.li
                key={`${layer.label}-${layer.tool}`}
                initial={false}
                animate={{ opacity: reached || active ? 1 : 0.25, x: reached || active ? 0 : -6 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-white/10 pb-3 text-[11px]"
              >
                <span className="text-white/35">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0">
                  <span className="block truncate uppercase tracking-[.1em] text-white">{layer.label}</span>
                  <span className="mt-0.5 block truncate text-seafoam-400/80">{layer.tool}</span>
                  <span className="mt-2 block h-px overflow-hidden bg-white/10">
                    <motion.span
                      className="block h-full origin-left bg-gradient-to-r from-seafoam-400 to-cyan"
                      initial={false}
                      animate={{ scaleX: reached ? 1 : active ? 0.6 : 0 }}
                      transition={{ duration: reached ? 0.25 : STEP_MS / 1000, ease: "easeOut" }}
                    />
                  </span>
                </span>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors duration-300 ${reached ? "border-seafoam-400 bg-seafoam-400 text-[#071b25]" : "border-white/20 text-transparent"}`}>
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
              </motion.li>
            );
          })}
        </ol>
        <div className="mt-auto flex items-center justify-between gap-4 pt-5 text-[10px] uppercase tracking-[.14em]">
          <span className={`transition-opacity duration-500 ${done ? "opacity-100" : "opacity-0"}`}>{project.proof}</span>
          <span className="rounded-full border border-seafoam-400/40 px-3 py-1.5 text-seafoam-400">Private build — demo on request<span className="blink-caret" aria-hidden="true">_</span></span>
        </div>
      </div>
    </div>
  );
}
