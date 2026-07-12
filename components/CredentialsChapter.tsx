"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, FileText, Plus } from "lucide-react";
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

        <div className="mt-16 border-t border-line pt-8">
          <div className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.12em] text-navy"><span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />Professional certificate</div>
          <article className="grid overflow-hidden rounded-xl border border-line bg-white shadow-elevated lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,.75fr)]">
            <a href="/certificates/google-ai-professional-certificate.pdf" target="_blank" rel="noreferrer" className="group relative aspect-[22/17] overflow-hidden bg-[#eef3f8]">
              <Image src="/certificates/google-ai-professional-certificate.webp" alt="Google AI Professional Certificate awarded to Awad M Buisir" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-contain transition-transform duration-500 group-hover:scale-[1.015]" />
              <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/85 text-navy shadow-card backdrop-blur" aria-hidden="true"><ArrowUpRight className="h-4 w-4" /></span>
            </a>
            <div className="flex flex-col justify-between p-6 sm:p-8">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.12em] text-seafoam-700">Google / Coursera · Jul 12, 2026</p>
                <h3 className="mt-4 font-display text-3xl font-medium leading-tight tracking-[-.03em] text-navy">Google AI Professional Certificate</h3>
                <p className="mt-4 text-[15px] leading-7 text-slate">Seven-course professional program covering AI-assisted research, communication, content creation, data analysis, app building, and responsible prompting.</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/certificates/google-ai-professional-certificate.pdf" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-navy px-5 font-mono text-[10px] uppercase tracking-[.1em] text-white"><FileText className="h-4 w-4" aria-hidden="true" />View certificate</a>
                <a href="https://coursera.org/verify/professional-cert/C1A1H99S1YFE" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line px-5 font-mono text-[10px] uppercase tracking-[.1em] text-navy">Verify credential<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
