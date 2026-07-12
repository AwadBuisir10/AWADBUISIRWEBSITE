"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ProjectTile } from "@/components/ProjectTile";
import { SectionHeader } from "@/components/SectionHeader";
import { projectFocusOptions, projects, type Project, type ProjectFocus } from "@/data/projects";
import { cn } from "@/lib/cn";

const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

export function WorkSection() {
  const [focus, setFocus] = useState<ProjectFocus>("all");
  const [activeSlug, setActiveSlug] = useState(projects[0].slug);
  const activeFocus = projectFocusOptions.find((option) => option.value === focus) ?? projectFocusOptions[0];
  const visibleProjects = focus === "all" ? projects : projects.filter((project) => project.disciplines.includes(focus));
  const activeProject = visibleProjects.find((project) => project.slug === activeSlug) ?? visibleProjects[0];

  useEffect(() => {
    if (!visibleProjects.some((project) => project.slug === activeSlug)) setActiveSlug(visibleProjects[0].slug);
  }, [activeSlug, visibleProjects]);

  return (
    <section id="work" className="section-anchor py-20 sm:py-28">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionHeader index="02" eyebrow="Work" title="Selected Projects" note="Explore by system type." />

        <div className="mt-8 grid gap-5 border-y border-line py-5 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-8">
          <div role="group" aria-label="Filter projects by system type" className="grid max-w-full grid-cols-2 gap-1 rounded-lg border border-line bg-white p-1 shadow-card sm:flex sm:overflow-x-auto">
            {projectFocusOptions.map((option) => (
              <button key={option.value} type="button" aria-pressed={focus === option.value} onClick={() => setFocus(option.value)} className={cn("min-h-10 shrink-0 rounded-md px-4 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-200", focus === option.value ? "bg-navy text-white shadow-button" : "text-steel hover:bg-canvas hover:text-navy")}>
                {option.label}
              </button>
            ))}
          </div>
          <motion.div key={activeFocus.value} initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, ease: "easeOut" }}>
            <p className="text-sm leading-6 text-slate">{activeFocus.summary}</p>
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-seafoam-700">{activeFocus.signals.join(" · ")}</p>
          </motion.div>
        </div>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(22rem,.82fr)_minmax(0,1.18fr)] xl:gap-16">
          <div className="sticky top-24 hidden lg:block">
            <AnimatePresence mode="wait">
              <ProjectPreview key={activeProject.slug} project={activeProject} />
            </AnimatePresence>
          </div>
          <motion.div layout>
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleProjects.map((project) => (
                <ProjectTile key={project.slug} project={project} index={projects.indexOf(project)} active={project.slug === activeProject.slug} onActivate={() => setActiveSlug(project.slug)} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ProjectPreview({ project }: { project: Project }) {
  return (
    <motion.figure initial={false} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .28, ease: "easeOut" }} className="overflow-hidden rounded-xl border border-line bg-white shadow-elevated">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#091f2b]">
        {project.media ? (
          isVideo(project.media) ? (
            <video src={project.media} controls playsInline preload="metadata" className="h-full w-full object-cover" />
          ) : (
            <Image src={project.media} alt={`${project.title} demo`} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_45%,rgba(136,222,235,.2),transparent_32%),linear-gradient(135deg,#071b25,#102f3b)]">
            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(148,239,183,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(148,239,183,.15)_1px,transparent_1px)] [background-size:32px_32px]" />
            <span className="relative rounded-full border border-seafoam-400/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[.14em] text-seafoam-400">System architecture / private demo</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-4 font-mono text-[9px] uppercase tracking-[.12em] text-white/65">
          <span>Evidence window</span><span>{project.tags[0]}</span>
        </div>
      </div>
      <figcaption className="grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="font-display text-xl font-medium text-navy">{project.title}</p>
          <p className="mt-1 text-sm leading-6 text-slate">{project.outcome}</p>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[.12em] text-seafoam-700">Active case file</span>
      </figcaption>
    </motion.figure>
  );
}
