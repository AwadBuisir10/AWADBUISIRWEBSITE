"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { experiences, skillGroups } from "@/data/site";

export function CredentialsChapter() {
  const reduced = useReducedMotion();

  return (
    <section id="experience" className="section-anchor py-20 sm:py-28">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionHeader index="06" eyebrow="Proof" title="Experience" note="Roles, systems, and the tools behind the work." />
        <div className="mt-10 grid gap-16 lg:grid-cols-[1.15fr_.85fr] lg:gap-24">
          <div>
            <div className="relative before:absolute before:bottom-4 before:left-[.42rem] before:top-5 before:w-px before:bg-line">
              {experiences.map((job, index) => (
                <motion.details key={job.company} initial={false} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="group relative pl-9">
                  <span className="absolute left-0 top-9 z-10 h-3.5 w-3.5 rounded-full border-2 border-[#fffdf8] bg-seafoam-600 shadow-[0_0_0_1px_rgba(17,26,74,.15)] transition-transform group-open:scale-125" aria-hidden="true" />
                  <summary className="flex cursor-pointer items-start gap-6 border-b border-line py-7">
                    <span className="flex-1">
                      <span className="block font-mono text-[10px] uppercase tracking-[.1em] text-steel">{job.dates}</span>
                      <span className="mt-2 block font-display text-2xl font-medium tracking-[-.02em] text-navy sm:text-3xl">{job.company}</span>
                      <span className="mt-2 block text-[15px] leading-6 text-slate">{job.summary}</span>
                    </span>
                    <span className="flex items-center gap-3 pt-6"><span className="hidden font-mono text-[10px] uppercase tracking-[.1em] text-steel sm:block">{job.role}</span><Plus className="h-4 w-4 text-fog transition-transform duration-300 group-open:rotate-45" aria-hidden="true" /></span>
                  </summary>
                  <div className="border-b border-line pb-7 pt-5">
                    <p className="font-mono text-[10px] uppercase tracking-[.1em] text-steel sm:hidden">{job.role}</p>
                    <ul className="mt-3 space-y-2 sm:mt-0">{job.details.map((line) => <li key={line} className="max-w-xl text-[15px] leading-7 text-slate">{line}</li>)}</ul>
                  </div>
                </motion.details>
              ))}
            </div>
            <p className="mt-10 border-l-2 border-signal pl-4 font-mono text-[11px] uppercase leading-6 tracking-[.1em] text-steel">Northeastern University · BS Computer Science · GPA 3.84 · Dean&apos;s List · Expected Aug 2027</p>
          </div>

          <aside id="skills" className="section-anchor lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-center gap-3 border-b border-line pb-4 font-mono text-[11px] uppercase tracking-[.12em] text-navy"><span className="text-fog">08</span><span className="h-1.5 w-1.5 rounded-full bg-seafoam-600" aria-hidden="true" />Skills ledger</div>
            <div className="mt-4 space-y-7">
              {skillGroups.map((group, index) => (
                <motion.div key={group.title} initial={false} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: reduced ? 0 : index * .04 }}>
                  <h3 className="font-mono text-[10px] uppercase tracking-[.12em] text-steel">{group.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">{group.skills.map((skill) => <span key={skill} className="rounded-full border border-line bg-white px-3 py-2 text-sm text-slate shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-seafoam-600/50 hover:text-navy">{skill}</span>)}</div>
                </motion.div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
