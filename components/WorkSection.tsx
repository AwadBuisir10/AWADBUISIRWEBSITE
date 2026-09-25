"use client";

import { useSiteContent } from "@/components/ContentProvider";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ProjectTile } from "@/components/ProjectTile";
import { SectionHeader } from "@/components/SectionHeader";
import { SystemTrace } from "@/components/SystemTrace";
import { TiltCard } from "@/components/TiltCard";
import { type Project, type ProjectFocus } from "@/data/projects";
import { onProjectOpen } from "@/lib/project-events";
import { cn } from "@/lib/cn";

const isVideo = (src: string) => /\.(mp4|webm|mov)(?:[?#]|$)/i.test(src);

export function WorkSection() {
  const { projects, projectFocusOptions, sectionHeadings } = useSiteContent();
  const [focus, setFocus] = useState<ProjectFocus>("all");
  const [activeSlug, setActiveSlug] = useState(projects[0]?.slug ?? "");
  const activeFocus = projectFocusOptions.find((option) => option.value === focus) ?? projectFocusOptions[0];
  const effectiveFocus = activeFocus?.value ?? "all";
  const visibleProjects = effectiveFocus === "all" ? projects : projects.filter((project) => project.disciplines.includes(effectiveFocus));
  const activeProject = visibleProjects.find((project) => project.slug === activeSlug) ?? visibleProjects[0];

  // A project opened from the command palette or nav preview must be visible.
  useEffect(() => onProjectOpen((slug) => {
    setFocus("all");
    setActiveSlug(slug);
  }), []);

  useEffect(() => {
    if (!visibleProjects.some((project) => project.slug === activeSlug)) setActiveSlug(visibleProjects[0]?.slug ?? "");
  }, [activeSlug, visibleProjects]);

  return (
    <section id="work" className="section-anchor py-20 sm:py-28">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionHeader index="02" {...sectionHeadings.work} />

        <div className="mt-8 grid gap-5 border-y border-line py-5 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-8">
          <div role="group" aria-label="Filter projects by system type" className="grid max-w-full grid-cols-2 gap-1 rounded-lg border border-line bg-white p-1 shadow-card sm:flex sm:overflow-x-auto">
            {projectFocusOptions.map((option) => {
              const selected = effectiveFocus === option.value;
              return (
                <button key={option.value} type="button" aria-pressed={selected} onClick={() => setFocus(option.value)} className={cn("relative min-h-11 shrink-0 rounded-md px-4 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-200", selected ? "text-white" : "text-steel hover:bg-canvas hover:text-navy")}>
                  {selected ? <motion.span layoutId="work-filter-pill" className="absolute inset-0 rounded-md bg-navy shadow-button" transition={{ type: "spring", stiffness: 420, damping: 34 }} aria-hidden="true" /> : null}
                  <span className="relative">{option.label}</span>
                </button>
              );
            })}
          </div>
          {activeFocus ? <motion.div key={activeFocus.value} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
            <p className="text-sm leading-6 text-slate">{activeFocus.summary}</p>
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-seafoam-700">{activeFocus.signals.join(" · ")}</p>
          </motion.div> : null}
          <p className="sr-only" aria-live="polite">Showing {visibleProjects.length} {visibleProjects.length === 1 ? "project" : "projects"}.</p>
        </div>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(22rem,.82fr)_minmax(0,1.18fr)] xl:gap-16">
          <div className="sticky top-24 hidden lg:block">
            <AnimatePresence mode="wait">
              {activeProject ? <ProjectPreview key={activeProject.slug} project={activeProject} /> : null}
            </AnimatePresence>
          </div>
          <motion.div layout>
            <AnimatePresence mode="popLayout">
              {visibleProjects.map((project) => (
                <ProjectTile key={project.slug} project={project} index={projects.indexOf(project)} active={project.slug === activeProject?.slug} onActivate={() => setActiveSlug(project.slug)} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ProjectPreview({ project }: { project: Project }) {
  const reduced = useReducedMotion();

  return (
    <motion.figure
      initial={reduced ? false : { opacity: 0, y: 14, scale: 0.98, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={reduced ? undefined : { opacity: 0, y: -10, scale: 0.98, filter: "blur(4px)" }}
      transition={{ duration: reduced ? 0 : 0.32, ease: "easeOut" }}
    >
      <TiltCard max={3} className="overflow-hidden rounded-xl border border-line bg-white shadow-elevated">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#091f2b]">
          {project.media ? (
            isVideo(project.media) ? (
              <video src={project.media} poster={project.poster} controls playsInline preload="metadata" aria-label={`${project.title} visual demo`} className="h-full w-full object-cover" />
            ) : (
              <Image src={project.media} alt={`${project.title} demo`} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            )
          ) : (
            <SystemTrace project={project} />
          )}
          {project.media ? (
            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-4 font-mono text-[9px] uppercase tracking-[.12em] text-white/65">
              <span>Evidence window</span><span>{project.tags[0]}</span>
            </div>
          ) : null}
        </div>
        <figcaption className="grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="font-display text-xl font-medium text-navy">{project.title}</p>
            <p className="mt-1 text-sm leading-6 text-slate">{project.outcome}</p>
          </div>
          <span className="text-right font-mono text-[9px] uppercase leading-5 tracking-[.12em] text-seafoam-700">Active case file<br /><span className="text-steel">{project.proof}</span></span>
        </figcaption>
      </TiltCard>
    </motion.figure>
  );
}
