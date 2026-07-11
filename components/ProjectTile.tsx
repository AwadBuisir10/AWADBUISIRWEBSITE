"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useState, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
import type { Project } from "@/data/projects";

const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

type TransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

/** Editorial work row that expands into a proof-oriented project case file. */
export function ProjectTile({ project, index }: { project: Project; index: number }) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const number = String(index + 1).padStart(2, "0");
  const detailsId = `${project.slug}-details`;
  const transitionStyle = {
    viewTransitionName: `project-${index}`
  } as CSSProperties;

  const toggleOpen = () => {
    const update = () => flushSync(() => setOpen((value) => !value));
    const transitionDocument = document as TransitionDocument;

    if (!reduced && transitionDocument.startViewTransition) {
      transitionDocument.startViewTransition(update);
    } else {
      update();
    }
  };

  return (
    <motion.article
      id={project.slug}
      layout
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -10 }}
      transition={{ duration: 0.42, ease: "easeOut", layout: { duration: 0.35 } }}
      style={transitionStyle}
      className="border-b border-line"
    >
      <div className="grid gap-4 py-9 sm:grid-cols-[3.5rem_1fr_auto] sm:items-start sm:gap-8">
        <span className="pt-1 font-mono text-xs text-fog">{number}</span>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={toggleOpen}
              aria-expanded={open}
              aria-controls={detailsId}
              className="group inline-flex items-center gap-2 text-left"
            >
              <h3 className="font-display text-2xl font-medium tracking-[-0.015em] text-navy transition-colors duration-150 group-hover:text-navy/75 sm:text-3xl">
                {project.title}
              </h3>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-fog transition-transform duration-300 ${
                  open ? "rotate-180 text-navy" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.1em] text-navy shadow-card transition-all duration-150 hover:border-navy/40 active:scale-95"
              >
                {project.linkLabel ?? "View"}
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </a>
            ) : null}
          </div>
          <p className="mt-2 max-w-lg text-base leading-7 text-slate">{project.description}</p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 sm:max-w-[19rem] sm:justify-end">
          {project.tags.map((tag) => (
            <span key={tag} className="font-mono text-[11px] uppercase tracking-[0.08em] text-steel">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={detailsId}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-11 sm:pl-[5.5rem]">
              <p className="max-w-2xl text-[15px] leading-7 text-slate">{project.summary}</p>

              <div className="mt-7 grid border-y border-line md:grid-cols-2">
                <CaseFact label="Outcome">{project.outcome}</CaseFact>
                <CaseFact label="Architecture">{project.architecture.join(" → ")}</CaseFact>
                <CaseFact label="Key decision">{project.decision}</CaseFact>
                <CaseFact label="Next iteration" accent>
                  {project.next}
                </CaseFact>
              </div>

              {project.media ? (
                <div
                  className={`mt-7 grid gap-4 ${
                    project.contextImage
                      ? "max-w-4xl lg:grid-cols-[minmax(0,1fr)_11rem] lg:items-end"
                      : "max-w-2xl"
                  }`}
                >
                  {isVideo(project.media) ? (
                    <video
                      src={project.media}
                      controls
                      playsInline
                      preload="metadata"
                      className="h-full w-full rounded-lg border border-line bg-white object-cover shadow-card"
                    />
                  ) : (
                    <img
                      src={project.media}
                      alt={`${project.title} demo`}
                      loading="lazy"
                      className="h-full w-full rounded-lg border border-line bg-white object-cover shadow-card"
                    />
                  )}

                  {project.contextImage ? (
                    <figure className="group relative aspect-[4/5] w-full max-w-[11rem] overflow-hidden rounded-lg border border-line bg-white shadow-card">
                      <img
                        src={project.contextImage}
                        alt={project.contextAlt ?? `${project.title} context`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                      />
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
                        aria-hidden="true"
                      />
                      <figcaption className="absolute inset-x-0 bottom-0 p-4 font-mono text-[10px] uppercase leading-5 tracking-[0.08em] text-white">
                        {project.contextCaption}
                      </figcaption>
                    </figure>
                  ) : null}
                </div>
              ) : (
                <div className="mt-7 flex aspect-video w-full max-w-2xl items-center justify-center rounded-lg border border-dashed border-line bg-white/55">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-fog">
                    Public demo being prepared
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}

function CaseFact({
  label,
  accent = false,
  children
}: {
  label: string;
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-line px-0 py-4 last:border-b-0 md:border-r md:px-5 md:first:pl-0 md:[&:nth-child(2n)]:border-r-0 md:[&:nth-last-child(-n+2)]:border-b-0">
      <p
        className={`font-mono text-[10px] uppercase tracking-[0.12em] ${
          accent ? "text-signal" : "text-steel"
        }`}
      >
        {label}
      </p>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate">{children}</p>
    </div>
  );
}
