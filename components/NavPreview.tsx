"use client";

import { useSiteContent } from "@/components/ContentProvider";
import Image from "next/image";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useState } from "react";
import { LiveFollowerTotal } from "@/components/AudienceText";
import { LocalClock } from "@/components/LocalClock";
import { cn } from "@/lib/cn";

const label = "font-mono text-[10px] uppercase tracking-[0.12em]";

/** Hover preview for a nav destination. Returns null for links without a preview. */
export function NavPreview({ href, dark }: { href: string; dark: boolean }) {
  const { projects, experiences, community, creative, contact } = useSiteContent();
  const [copied, setCopied] = useState(false);
  const muted = dark ? "text-white/55" : "text-steel";
  const strong = dark ? "text-white" : "text-navy";
  const row = cn("group flex items-center justify-between gap-4 rounded-lg px-3 py-2 transition-colors", dark ? "hover:bg-white/10" : "hover:bg-navy/[0.05]");

  if (href === "#work" && projects.length) {
    return (
      <div className="p-2">
        <p className={cn(label, muted, "px-3 pb-1 pt-2")}>{projects.length} projects</p>
        {projects.slice(0, 5).map((project, index) => (
          <a key={project.slug} href={`#${project.slug}`} data-open-project={project.slug} className={row}>
            <span className="flex min-w-0 items-center gap-3">
              <span className={cn("font-mono text-[10px]", muted)}>{String(index + 1).padStart(2, "0")}</span>
              <span className={cn("truncate text-sm font-medium", strong)}>{project.title}</span>
            </span>
            <span className={cn(label, "shrink-0 text-seafoam-600 opacity-0 transition-opacity group-hover:opacity-100")}>Open</span>
          </a>
        ))}
      </div>
    );
  }

  if (href === "#experience" && experiences.length) {
    return (
      <div className="p-2">
        {experiences.map((job) => (
          <a key={job.company} href="#experience" className={cn(row, "items-start")}>
            <span className="min-w-0">
              <span className={cn("block truncate text-sm font-medium", strong)}>{job.company}</span>
              <span className={cn("block truncate text-xs", muted)}>{job.role}</span>
            </span>
            <span className={cn(label, "shrink-0 pt-0.5", muted)}>{job.dates.split(/\s[—–-]\s/)[0]}</span>
          </a>
        ))}
      </div>
    );
  }

  if (href === "#community") {
    return (
      <a href="#community" className={cn("block p-5", dark ? "hover:bg-white/5" : "hover:bg-navy/[0.03]")}>
        <p className={cn(label, "flex items-center gap-2", muted)}>
          <span className="status-ping h-1.5 w-1.5 rounded-full bg-seafoam-600" aria-hidden="true" />Live followers
        </p>
        <LiveFollowerTotal className={cn("mt-2 block font-display text-4xl font-semibold tracking-[-0.03em]", strong)} />
        <p className={cn("mt-2 text-sm", muted)}>{community.title} · {community.award}</p>
      </a>
    );
  }

  if (href === "#creative" && creative.storyFrames.length) {
    return (
      <a href="#creative" className="block p-3">
        <div className="grid grid-cols-3 gap-2">
          {creative.storyFrames.slice(0, 3).map((frame) => (
            <span key={frame.image} className="relative block aspect-[3/4] overflow-hidden rounded-lg">
              {frame.image ? <Image src={frame.image} alt="" fill sizes="96px" className="object-cover transition-transform duration-500 hover:scale-105" /> : null}
            </span>
          ))}
        </div>
        <p className={cn("mt-3 px-1 text-sm font-medium", strong)}>{creative.storyTitle}</p>
        <p className={cn(label, "mt-1 px-1", muted)}>{creative.kitEyebrow} · {creative.storyEyebrow}</p>
      </a>
    );
  }

  if (href === "#contact" && contact.email) {
    const copy = async () => {
      try {
        await navigator.clipboard.writeText(contact.email);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      } catch {
        window.location.href = `mailto:${contact.email}`;
      }
    };
    return (
      <div className="p-5">
        <p className={cn(label, muted)}>Boston · <LocalClock /></p>
        <a href={`mailto:${contact.email}`} className={cn("mt-2 flex items-center gap-1.5 break-all text-sm font-medium", strong)}>
          {contact.email}<ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        </a>
        <button type="button" onClick={copy} className={cn(label, "mt-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors", dark ? "border-white/15 text-white/75 hover:border-white/40" : "border-line text-navy hover:border-navy/40")}>
          {copied ? <Check className="h-3.5 w-3.5 text-seafoam-600" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
          {copied ? "Copied" : "Copy email"}
        </button>
      </div>
    );
  }

  return null;
}

/** Whether a nav href has preview content, so the panel never opens empty. */
export const hasNavPreview = (href: string) => ["#work", "#experience", "#community", "#creative", "#contact"].includes(href);
