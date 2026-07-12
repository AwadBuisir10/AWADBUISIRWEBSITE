"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { Project } from "@/data/projects";

const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

export function ProjectTile({ project, index, active, onActivate }: { project: Project; index: number; active: boolean; onActivate: () => void }) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const number = String(index + 1).padStart(2, "0");
  const detailsId = `${project.slug}-details`;

  const toggleOpen = () => {
    onActivate();
    setOpen((value) => !value);
  };

  return (
    <motion.article
      id={project.slug}
      layout
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -10 }}
      transition={{ duration: 0.32, ease: "easeOut", layout: { duration: 0.3 } }}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={`group relative border-b border-line transition-colors duration-300 ${active ? "bg-white/75" : "bg-transparent"}`}
    >
      <span className={`absolute inset-y-0 left-0 w-0.5 origin-top bg-signal transition-transform duration-300 ${active ? "scale-y-100" : "scale-y-0"}`} aria-hidden="true" />
      <div className="px-4 py-7 sm:px-5 sm:py-8">
        <div className="flex items-start gap-4 sm:gap-6">
          <span className="pt-1 font-mono text-xs text-fog">{number}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-display text-2xl font-medium tracking-[-0.015em] text-navy sm:text-3xl">
                <button type="button" onClick={toggleOpen} aria-expanded={open} aria-controls={detailsId} className="group/title inline-flex items-center gap-2 text-left">
                  {project.title}
                  <ChevronDown className={`h-4 w-4 shrink-0 text-fog transition-transform duration-300 ${open ? "rotate-180 text-navy" : ""}`} aria-hidden="true" />
                </button>
              </h3>
              {project.link ? (
                <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-navy shadow-card transition-all hover:border-navy/40">
                  {project.linkLabel ?? "View"}<ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
              ) : null}
            </div>
            <p className="mt-2 max-w-xl text-base leading-7 text-slate">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {project.tags.map((tag) => <span key={tag} className="font-mono text-[10px] uppercase tracking-[0.08em] text-steel">{tag}</span>)}
            </div>

            {project.media ? (
              <div className="relative mt-5 aspect-video overflow-hidden rounded-lg border border-line bg-white shadow-card lg:hidden">
                {isVideo(project.media) ? <video src={project.media} poster={project.poster} controls playsInline preload="metadata" className="h-full w-full object-cover" /> : <Image src={project.media} alt={`${project.title} preview`} fill sizes="(max-width: 1023px) 90vw" className="object-cover" />}
              </div>
            ) : null}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div id={detailsId} initial={reduced ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={reduced ? undefined : { height: 0, opacity: 0 }} transition={{ duration: .34, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
              <div className="pt-7 sm:pl-10">
                <p className="max-w-2xl text-[15px] leading-7 text-slate">{project.summary}</p>
                <div className="mt-7 grid border-y border-line md:grid-cols-2">
                  <CaseFact label="Outcome">{project.outcome}</CaseFact>
                  <CaseFact label="Architecture">{project.architecture.join(" → ")}</CaseFact>
                  <CaseFact label="Key decision">{project.decision}</CaseFact>
                  <CaseFact label="Next iteration" accent>{project.next}</CaseFact>
                </div>
                {project.contextImage ? (
                  <figure className="relative mt-6 aspect-[16/7] max-w-xl overflow-hidden rounded-lg border border-line lg:hidden">
                    <Image src={project.contextImage} alt={project.contextAlt ?? `${project.title} context`} fill sizes="90vw" className="object-cover" />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 font-mono text-[9px] uppercase tracking-[.1em] text-white">{project.contextCaption}</figcaption>
                  </figure>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

function CaseFact({ label, accent = false, children }: { label: string; accent?: boolean; children: ReactNode }) {
  return (
    <div className="border-b border-line py-4 md:border-r md:px-5 md:first:pl-0 md:[&:nth-child(2n)]:border-r-0 md:[&:nth-last-child(-n+2)]:border-b-0">
      <p className={`font-mono text-[10px] uppercase tracking-[0.12em] ${accent ? "text-signal" : "text-steel"}`}>{label}</p>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate">{children}</p>
    </div>
  );
}
