"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { experiences } from "@/data/site";

export function ExperienceSection() {
  const reduced = useReducedMotion();

  return (
    <section id="experience" className="section-anchor py-24 sm:py-28">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionHeader index="06" eyebrow="Roles" title="Experience" />

        <div className="mt-6">
          {experiences.map((job, i) => (
            <motion.details
              key={job.company}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: reduced ? 0 : i * 0.07, ease: "easeOut" }}
              className="group border-b border-line"
            >
              <summary className="flex cursor-pointer items-baseline gap-6 py-8 sm:gap-10">
                <span className="hidden font-mono text-[13px] text-steel sm:block">
                  {job.dates}
                </span>
                <span className="flex-1">
                  <span className="block font-display text-2xl font-medium tracking-[-0.015em] text-navy transition-colors duration-150 group-hover:text-navy/80 sm:text-3xl">
                    {job.company}
                  </span>
                  <span className="mt-2 block text-[15px] text-slate">{job.summary}</span>
                  <span className="mt-1 block font-mono text-[13px] uppercase tracking-[0.1em] text-steel sm:hidden">
                    {job.dates}
                  </span>
                </span>
                <span className="flex items-center gap-4">
                  <span className="hidden font-mono text-[13px] uppercase tracking-[0.1em] text-steel sm:block">
                    {job.role}
                  </span>
                  <Plus
                    className="h-4 w-4 shrink-0 text-fog transition-transform duration-300 group-open:rotate-45"
                    aria-hidden="true"
                  />
                </span>
              </summary>
              <div className="pb-8 sm:pl-[7.5rem]">
                <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-steel sm:hidden">
                  {job.role}
                </p>
                <ul className="mt-3 space-y-2 sm:mt-0">
                  {job.details.map((line) => (
                    <li key={line} className="max-w-xl text-[15px] leading-7 text-slate">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.details>
          ))}
        </div>

        <p className="mt-10 font-mono text-[13px] uppercase tracking-[0.1em] text-steel">
          Northeastern University · BS Computer Science · GPA 3.84 · Dean's List · Expected Aug 2027
        </p>
      </div>
    </section>
  );
}
