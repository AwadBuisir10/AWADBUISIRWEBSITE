"use client";

import { motion, type Variants } from "framer-motion";
import { Fragment } from "react";
import { ScrambleText } from "@/components/ScrambleText";

type SectionHeaderProps = {
  index: string;
  eyebrow: string;
  title?: string;
  note?: string;
  dark?: boolean;
};

const ease = [0.22, 1, 0.36, 1] as const;
const words: Variants = { hidden: {}, shown: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } } };
const word: Variants = { hidden: { y: "110%", rotate: 3 }, shown: { y: "0%", rotate: 0, transition: { duration: 0.9, ease } } };

/** Editorial section opener: drawn rule, decoding eyebrow, masked word-by-word title, optional note. */
export function SectionHeader({ index, eyebrow, title, note, dark = false }: SectionHeaderProps) {
  return (
    <motion.div data-section-start initial="hidden" whileInView="shown" viewport={{ once: true, margin: "-80px" }} className="relative pt-5">
      <motion.span
        aria-hidden="true"
        variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1, transition: { duration: 1.1, ease } } }}
        className={`absolute inset-x-0 top-0 h-px origin-left ${dark ? "bg-white/15" : "bg-line"}`}
      />
      <div className="flex items-baseline justify-between gap-6">
        <p className={`flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.1em] ${dark ? "text-white" : "text-navy"}`}>
          <span className="status-ping h-1.5 w-1.5 shrink-0 rounded-full bg-seafoam-600" aria-hidden="true" />
          <ScrambleText text={index} className={dark ? "text-white/40" : "text-fog"} />
          <ScrambleText text={eyebrow} hover />
        </p>
        {note ? (
          <motion.p
            variants={{ hidden: { opacity: 0, y: 10 }, shown: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.35, ease } } }}
            className={`hidden max-w-xs text-right text-[15px] leading-7 sm:block ${dark ? "text-white/55" : "text-slate"}`}
          >
            {note}
          </motion.p>
        ) : null}
      </div>
      {title ? (
        <motion.h2 variants={words} className={`mt-6 max-w-4xl font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl 2xl:text-[3.5rem] ${dark ? "text-white" : "text-navy"}`}>
          {title.split(" ").map((part, i) => (
            <Fragment key={`${part}-${i}`}>
              <span className="word-mask"><motion.span variants={word} className="inline-block">{part}</motion.span></span>{" "}
            </Fragment>
          ))}
        </motion.h2>
      ) : <h2 className="sr-only">{eyebrow}</h2>}
      {note ? (
        <motion.p
          variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 0.8, delay: 0.3 } } }}
          className={`mt-4 max-w-md text-sm leading-6 sm:hidden ${dark ? "text-white/55" : "text-slate"}`}
        >
          {note}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
