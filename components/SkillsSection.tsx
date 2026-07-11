"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/SectionHeader";
import { skillGroups } from "@/data/site";

export function SkillsSection() {
  const reduced = useReducedMotion();

  return (
    <section id="skills" className="section-anchor py-24 sm:py-28">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionHeader index="08" eyebrow="Skills" />

        <div className="mt-8">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.title}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={reduced ? undefined : { x: 4 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: reduced ? 0 : i * 0.05, ease: "easeOut" }}
              className="group -mx-3 grid gap-2 border-b border-line px-3 py-5 transition-colors duration-200 hover:bg-white/70 sm:grid-cols-[200px_1fr] sm:gap-8"
            >
              <h3 className="font-mono text-[13px] uppercase tracking-[0.1em] text-navy transition-colors duration-200 group-hover:text-signal">
                {group.title}
              </h3>
              <p className="text-[15px] leading-7 text-slate transition-colors duration-200 group-hover:text-navy">
                {group.skills.join(" · ")}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
