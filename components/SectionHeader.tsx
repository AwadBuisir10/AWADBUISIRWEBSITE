"use client";

import { motion, useReducedMotion } from "framer-motion";

type SectionHeaderProps = {
  index: string;
  eyebrow: string;
  title?: string;
  note?: string;
  dark?: boolean;
};

/** Editorial section opener: top rule, tag-with-dot eyebrow, display title, optional note. */
export function SectionHeader({ index, eyebrow, title, note, dark = false }: SectionHeaderProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative pt-5"
    >
      <motion.span
        aria-hidden="true"
        initial={false}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`absolute inset-x-0 top-0 h-px origin-left ${dark ? "bg-white/15" : "bg-line"}`}
      />
      <div className="flex items-baseline justify-between gap-6">
        <p className={`flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.1em] ${dark ? "text-white" : "text-navy"}`}>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-seafoam-600" aria-hidden="true" />
          <span className={dark ? "text-white/40" : "text-fog"}>{index}</span>
          {eyebrow}
        </p>
        {note ? (
          <p className={`hidden max-w-xs text-right text-[15px] leading-7 sm:block ${dark ? "text-white/55" : "text-slate"}`}>{note}</p>
        ) : null}
      </div>
      {title ? (
        <h2 className={`mt-6 max-w-4xl font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl 2xl:text-[3.5rem] ${dark ? "text-white" : "text-navy"}`}>
          {title}
        </h2>
      ) : <h2 className="sr-only">{eyebrow}</h2>}
      {note ? (
        <p className={`mt-4 max-w-md text-sm leading-6 sm:hidden ${dark ? "text-white/55" : "text-slate"}`}>{note}</p>
      ) : null}
    </motion.div>
  );
}
