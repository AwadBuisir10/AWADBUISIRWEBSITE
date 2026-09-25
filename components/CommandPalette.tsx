"use client";

import { useSiteContent } from "@/components/ContentProvider";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Copy, CornerDownLeft, Download, FileText, Github, Hash, Linkedin, Mail, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { openProject } from "@/lib/project-events";
import { scrollToHash } from "@/lib/scroll-to-hash";

type Command = {
  id: string;
  group: "Jump to" | "Projects" | "Actions";
  label: string;
  hint?: string;
  icon: LucideIcon;
  keywords: string;
  run: () => void | "keep-open";
};

const OPEN_EVENT = "palette:open";

/** Opens the palette from anywhere (e.g. the navbar's "you are here" label). */
export const openCommandPalette = () => window.dispatchEvent(new Event(OPEN_EVENT));

/**
 * Label hits rank first, then keyword hits. Loose subsequence matching ("lmd" →
 * "LibyaMed Dispatch") only applies to the short label, so long keyword lists
 * don't match everything.
 */
function score(query: string, label: string, keywords: string) {
  const needle = query.toLowerCase().trim();
  if (!needle) return 1;
  const title = label.toLowerCase();
  if (title.includes(needle)) return 4 - title.indexOf(needle) / 100;
  if (keywords.toLowerCase().includes(needle)) return 2;
  let position = 0;
  for (const char of needle.replace(/\s+/g, "")) {
    position = title.indexOf(char, position);
    if (position === -1) return 0;
    position += 1;
  }
  return 1;
}

const jumpTargets = [
  { href: "#about", label: "About", keywords: "bio intro origin" },
  { href: "#work", label: "Projects", keywords: "work build case studies" },
  { href: "#experience", label: "Experience", keywords: "jobs roles proof co-op resume" },
  { href: "#skills", label: "Skills", keywords: "stack languages tools" },
  { href: "#community", label: "LibyanClub", keywords: "community reach followers cleanlibya" },
  { href: "#linkedin", label: "LinkedIn posts", keywords: "posts social" },
  { href: "#reels", label: "Reels", keywords: "instagram videos views" },
  { href: "#creative", label: "AI creative work", keywords: "art design kit story" },
  { href: "#contact", label: "Contact", keywords: "email talk hire" }
];

export function CommandPalette() {
  const { projects, contact } = useSiteContent();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const listId = useId();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCopied(false);
    returnFocus.current?.focus({ preventScroll: true });
  }, []);

  const go = useCallback((href: string) => {
    close();
    // Let the dialog unmount (and release scroll) before moving the page.
    requestAnimationFrame(() => {
      if (scrollToHash(href) && window.location.hash !== href) window.history.pushState(null, "", href);
    });
  }, [close]);

  const commands = useMemo<Command[]>(() => {
    const external = (url: string) => () => { window.open(url, "_blank", "noopener,noreferrer"); };
    const list: Command[] = [
      ...jumpTargets.map((target) => ({
        id: target.href, group: "Jump to" as const, label: target.label, icon: Hash, keywords: target.keywords,
        run: () => go(target.href)
      })),
      ...projects.map((project) => ({
        id: `project-${project.slug}`, group: "Projects" as const, label: project.title, hint: project.proof, icon: ArrowRight,
        keywords: `${project.tags.join(" ")} ${project.stack.map((layer) => layer.tool).join(" ")}`,
        run: () => { openProject(project.slug); go(`#${project.slug}`); }
      })),
      {
        id: "copy-email", group: "Actions", label: copied ? "Copied to clipboard" : "Copy email address", hint: contact.email, icon: copied ? Check : Copy, keywords: "email contact",
        run: () => {
          void navigator.clipboard?.writeText(contact.email).then(() => {
            setCopied(true);
            window.setTimeout(close, 700);
          });
          return "keep-open";
        }
      },
      { id: "email", group: "Actions", label: "Send an email", hint: contact.email, icon: Mail, keywords: "mail contact hire", run: () => { window.location.href = `mailto:${contact.email}`; close(); } },
      {
        id: "resume", group: "Actions", label: "Download resume", hint: "PDF", icon: Download, keywords: "cv pdf",
        run: () => { const link = document.createElement("a"); link.href = contact.resume; link.download = ""; link.click(); close(); }
      },
      { id: "resume-view", group: "Actions", label: "Open resume in a new tab", icon: FileText, keywords: "cv pdf view", run: () => { external(contact.resume)(); close(); } }
    ];
    if (contact.github) list.push({ id: "github", group: "Actions", label: "Open GitHub", hint: contact.github.split("/").filter(Boolean).pop(), icon: Github, keywords: "code repos", run: () => { external(contact.github)(); close(); } });
    if (contact.linkedin) list.push({ id: "linkedin", group: "Actions", label: "Open LinkedIn", icon: Linkedin, keywords: "profile connect", run: () => { external(contact.linkedin)(); close(); } });
    return list;
  }, [close, contact, copied, go, projects]);

  const results = useMemo(() => {
    const matches = commands
      .filter((command) => !command.id.startsWith("#") || typeof document === "undefined" || document.getElementById(command.id.slice(1)))
      .map((command) => ({ command, score: score(query, command.label, `${command.keywords} ${command.hint ?? ""}`) }))
      .filter((entry) => entry.score > 0);
    if (query) matches.sort((a, b) => b.score - a.score);
    return matches.map((entry) => entry.command);
  }, [commands, query]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing = event.target instanceof HTMLElement && (event.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName));
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !typing && !open)) {
        event.preventDefault();
        if (!open) returnFocus.current = document.activeElement as HTMLElement | null;
        setOpen((value) => !value);
      }
    };
    const onOpen = () => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
    };
  }, [open]);

  const onInputKey = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") { event.preventDefault(); close(); }
    if (event.key === "ArrowDown") { event.preventDefault(); setActive((index) => (index + 1) % Math.max(1, results.length)); }
    if (event.key === "ArrowUp") { event.preventDefault(); setActive((index) => (index - 1 + results.length) % Math.max(1, results.length)); }
    if (event.key === "Enter") { event.preventDefault(); results[active]?.run(); }
  };

  useEffect(() => {
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, listId]);

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center bg-navy/25 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-white/95 shadow-[0_40px_120px_-30px_rgba(17,26,74,.55)] backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="h-4 w-4 shrink-0 text-steel" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKey}
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={results.length ? `${listId}-${active}` : undefined}
                aria-autocomplete="list"
                placeholder="Jump to a section, project, or action…"
                className="h-14 flex-1 bg-transparent text-[15px] text-navy outline-none placeholder:text-fog"
              />
              <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-steel">ESC</kbd>
            </div>
            <ul id={listId} role="listbox" aria-label="Results" className="max-h-[min(60vh,26rem)] overflow-y-auto p-2">
              {results.length ? results.map((command, index) => {
                const header = command.group !== lastGroup ? command.group : null;
                lastGroup = command.group;
                const Icon = command.icon;
                const selected = index === active;
                return (
                  <li key={command.id} role="presentation">
                    {header ? <p className="px-3 pb-1.5 pt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-fog">{header}</p> : null}
                    <div
                      id={`${listId}-${index}`}
                      role="option"
                      aria-selected={selected}
                      onMouseMove={() => setActive(index)}
                      onClick={() => command.run()}
                      className="relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5"
                    >
                      {selected ? <motion.span layoutId="palette-active" className="absolute inset-0 rounded-lg bg-navy/[0.06]" transition={{ type: "spring", stiffness: 520, damping: 40 }} aria-hidden="true" /> : null}
                      <Icon className={`relative h-4 w-4 shrink-0 ${selected ? "text-seafoam-700" : "text-steel"}`} aria-hidden="true" />
                      <span className="relative flex-1 truncate text-[15px] text-navy">{command.label}</span>
                      {command.hint ? <span className="relative hidden truncate font-mono text-[10px] uppercase tracking-[0.1em] text-steel sm:block">{command.hint}</span> : null}
                      {selected ? <CornerDownLeft className="relative h-3.5 w-3.5 text-steel" aria-hidden="true" /> : null}
                    </div>
                  </li>
                );
              }) : <li className="px-3 py-8 text-center text-sm text-steel">Nothing matches “{query}”.</li>}
            </ul>
            <div className="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-fog">
              <span>↑↓ to move · ↵ to select</span>
              <span>⌘K to toggle</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
