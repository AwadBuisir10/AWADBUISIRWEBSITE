"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ProjectTile } from "@/components/ProjectTile";
import { SectionHeader } from "@/components/SectionHeader";
import { projectFocusOptions, projects, type ProjectFocus } from "@/data/projects";
import { cn } from "@/lib/cn";

export function WorkSection() {
  const [focus, setFocus] = useState<ProjectFocus>("all");
  const activeFocus =
    projectFocusOptions.find((option) => option.value === focus) ?? projectFocusOptions[0];
  const visibleProjects =
    focus === "all" ? projects : projects.filter((project) => project.disciplines.includes(focus));

  return (
    <section id="work" className="section-anchor py-24 sm:py-28">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionHeader
          index="02"
          eyebrow="Work"
          title="Selected Projects"
          note="Explore by system type."
        />

        <div className="mt-8 grid gap-5 border-y border-line py-5 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-8">
          <div
            role="group"
            aria-label="Filter projects by system type"
            className="grid max-w-full grid-cols-2 gap-1 rounded-lg border border-line bg-white p-1 shadow-card sm:flex sm:overflow-x-auto"
          >
            {projectFocusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={focus === option.value}
                onClick={() => setFocus(option.value)}
                className={cn(
                  "min-h-10 shrink-0 rounded-md px-4 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-200",
                  focus === option.value
                    ? "bg-navy text-white shadow-button"
                    : "text-steel hover:bg-canvas hover:text-navy"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <motion.div
            key={activeFocus.value}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <p className="text-sm leading-6 text-slate">{activeFocus.summary}</p>
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-seafoam-700">
              {activeFocus.signals.join(" · ")}
            </p>
          </motion.div>
        </div>

        <motion.div layout className="mt-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleProjects.map((project) => (
              <ProjectTile key={project.slug} project={project} index={projects.indexOf(project)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
