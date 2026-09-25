"use client";

import { useSiteContent } from "@/components/ContentProvider";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Command, Menu, X } from "lucide-react";
import { CommandPalette, openCommandPalette } from "@/components/CommandPalette";
import { chapters } from "@/components/ExecutionRail";
import { LocalClock } from "@/components/LocalClock";
import { Magnetic } from "@/components/Magnetic";
import { NavPreview, hasNavPreview } from "@/components/NavPreview";
import { ScrambleText } from "@/components/ScrambleText";
import { cn } from "@/lib/cn";

const intro = { id: "top", number: "00", label: "Intro" };
const PREVIEW_WIDTH = 320;
const OPEN_DELAY = 140;
const CLOSE_DELAY = 160;

export function Navbar() {
  const { navItems, contact, branding, socialLinks } = useSiteContent();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const [overDark, setOverDark] = useState(false);
  const [preview, setPreview] = useState<{ href: string; x: number } | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const previewTimer = useRef(0);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 32, restDelta: 0.001 });
  const floating = scrolled && !open;
  // Over dark sections the floating bar switches to dark glass instead of muddy grey.
  const dark = floating && overDark;
  const chapter = chapters.find((item) => item.id === chapterId) ?? intro;

  useEffect(() => {
    const ids = navItems.map((item) => item.href.replace("#", ""));
    const chapterIds = chapters.map((item) => item.id);
    // Document-relative tops — offsetTop is relative to positioned ancestors
    // (the chapter wrappers), which breaks the comparison.
    const current = (list: string[], position: number) => {
      let next = "";
      let nextTop = -Infinity;
      for (const id of list) {
        const section = document.getElementById(id);
        if (!section) continue;
        const top = section.getBoundingClientRect().top + window.scrollY;
        if (top <= position && top > nextTop) {
          next = id;
          nextTop = top;
        }
      }
      return next;
    };
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const position = window.scrollY + 160;
      setActiveSection(current(ids, position));
      setChapterId(current(chapterIds, position));
      setOverDark(Array.from(document.querySelectorAll("[data-nav-theme='dark']")).some((section) => {
        const box = section.getBoundingClientRect();
        return box.top <= 44 && box.bottom >= 44;
      }));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [navItems]);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", close);
    };
  }, [open]);

  // HashNavigation does the scrolling for every in-page link; links here only close the menu.
  const closeMenu = () => {
    setOpen(false);
    setPreview(null);
  };

  // Hover intent: previews open after a short pause and survive the trip into the panel.
  const showPreview = (href: string, link: HTMLElement) => {
    window.clearTimeout(previewTimer.current);
    const container = linksRef.current;
    if (!container || !hasNavPreview(href)) {
      previewTimer.current = window.setTimeout(() => setPreview(null), CLOSE_DELAY);
      return;
    }
    const box = container.getBoundingClientRect();
    const center = link.offsetLeft + link.offsetWidth / 2;
    const left = Math.max(16 - box.left, Math.min(window.innerWidth - 16 - PREVIEW_WIDTH - box.left, center - PREVIEW_WIDTH / 2));
    const apply = () => setPreview({ href, x: left });
    if (preview) apply();
    else previewTimer.current = window.setTimeout(apply, OPEN_DELAY);
  };
  const hidePreview = () => {
    window.clearTimeout(previewTimer.current);
    previewTimer.current = window.setTimeout(() => setPreview(null), CLOSE_DELAY);
  };
  const keepPreview = () => window.clearTimeout(previewTimer.current);

  useEffect(() => () => window.clearTimeout(previewTimer.current), []);

  return (
    // At the top the bar spans the page; once scrolled it lifts into a floating pill.
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 [transition-timing-function:var(--ease-out-expo)]", floating ? "px-3 pt-3 sm:px-5" : "px-0 pt-0")}>
      <div
        className={cn(
          "relative mx-auto border transition-[max-width,border-radius,background-color,border-color,box-shadow] duration-500 [transition-timing-function:var(--ease-out-expo)]",
          floating
            ? cn("max-w-[calc(88rem-4rem)] rounded-2xl backdrop-blur-xl", dark ? "border-white/10 bg-[#061821]/75 shadow-[0_24px_60px_-24px_rgba(0,0,0,.9)]" : "border-line/80 bg-white/80 shadow-[0_24px_60px_-28px_rgba(17,26,74,.45)]")
            : cn("max-w-full rounded-none border-x-transparent border-t-transparent backdrop-blur-sm", open ? "border-b-line bg-white" : "border-b-transparent bg-white/40")
        )}
      >
        <nav className={cn("mx-auto flex h-16 max-w-shell items-center justify-between transition-[padding] duration-500", floating ? "px-4 sm:px-5" : "px-5 sm:px-8")}>
          <div className="flex min-w-0 items-center gap-4">
            <a
              href="#top"
              onClick={closeMenu}
              className={cn("group shrink-0 font-display text-lg font-semibold tracking-[-0.01em] transition-colors duration-500", dark ? "text-white" : "text-navy")}
              aria-label={`${branding.name} — back to top`}
            >
              <span className="inline-block transition-transform duration-300 group-hover:-translate-y-px">{branding.name}</span>
              <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-signal transition-transform duration-500 group-hover:scale-150" aria-hidden="true" />
            </a>
            <span className={cn("hidden h-5 w-px transition-colors duration-500 sm:block", dark ? "bg-white/15" : "bg-line")} aria-hidden="true" />
            <button
              type="button"
              onClick={openCommandPalette}
              aria-label={`Current section: ${chapter.label}. Open the command menu`}
              className={cn("group hidden items-center gap-2 rounded-lg px-2 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-300 sm:inline-flex", dark ? "text-white/60 hover:bg-white/10 hover:text-white" : "text-steel hover:bg-navy/[0.05] hover:text-navy")}
            >
              <span className="status-ping h-1.5 w-1.5 shrink-0 rounded-full bg-seafoam-600" aria-hidden="true" />
              <span className="w-[6.5rem] text-left"><ScrambleText key={chapter.id} text={`${chapter.number} / ${chapter.label}`} duration={450} /></span>
              <kbd className={cn("hidden items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] transition-colors xl:inline-flex", dark ? "border-white/15 text-white/45 group-hover:border-white/35" : "border-line text-fog group-hover:border-navy/25")}>
                <Command className="h-2.5 w-2.5" aria-hidden="true" />K
              </kbd>
            </button>
          </div>

          <div className="hidden items-center gap-2 lg:flex xl:gap-4">
            <div ref={linksRef} className="relative flex items-center" onMouseLeave={() => { setHovered(null); hidePreview(); }} onMouseEnter={keepPreview}>
              {navItems.map((item) => {
                const isActive = activeSection === item.href.replace("#", "");
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    onMouseEnter={(event) => { setHovered(item.href); showPreview(item.href, event.currentTarget); }}
                    className={cn(
                      "relative rounded-lg px-3 py-2 font-mono text-[13px] uppercase tracking-[0.1em] transition-colors duration-150",
                      isActive ? (dark ? "text-white" : "text-navy") : (dark ? "text-white/55 hover:text-white" : "text-steel hover:text-navy")
                    )}
                  >
                    {hovered === item.href ? (
                      <motion.span layoutId="nav-hover" className={cn("absolute inset-0 rounded-lg", dark ? "bg-white/10" : "bg-navy/[0.06]")} transition={{ type: "spring", stiffness: 500, damping: 38 }} aria-hidden="true" />
                    ) : null}
                    <span className="relative"><ScrambleText text={item.label} hover onView={false} duration={420} /></span>
                    {isActive ? (
                      <motion.span layoutId="nav-underline" className={cn("absolute inset-x-3 -bottom-px h-px", dark ? "bg-white" : "bg-navy")} transition={{ type: "spring", stiffness: 500, damping: 40 }} aria-hidden="true" />
                    ) : null}
                  </a>
                );
              })}

              {/* One panel slides and resizes between destinations instead of popping per link. */}
              <AnimatePresence>
                {preview && !open ? (
                  <motion.div
                    key="nav-preview"
                    className="absolute left-0 top-full pt-3"
                    style={{ width: PREVIEW_WIDTH }}
                    initial={{ opacity: 0, x: preview.x, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, x: preview.x, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.14 } }}
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    onClick={(event) => { if (event.target instanceof Element && event.target.closest("a")) setPreview(null); }}
                  >
                    <motion.div
                      layout
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      className={cn("overflow-hidden rounded-2xl border backdrop-blur-xl", dark ? "border-white/10 bg-[#061821]/90 shadow-[0_30px_70px_-30px_rgba(0,0,0,.9)]" : "border-line/80 bg-white/95 shadow-[0_30px_70px_-30px_rgba(17,26,74,.45)]")}
                    >
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div key={preview.href} initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(4px)" }} transition={{ duration: 0.18 }}>
                          <NavPreview href={preview.href} dark={dark} />
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <span className={cn("hidden items-center gap-2 border-l pl-4 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-500 xl:inline-flex", dark ? "border-white/15 text-white/60" : "border-line text-steel")}>
              <span className={dark ? "text-white/35" : "text-fog"}>BOS</span>
              <LocalClock />
            </span>
            <Magnetic>
              <a
                href={contact.resume}
                download
                className={cn("group relative inline-flex items-center gap-2 overflow-hidden rounded-lg border px-4 py-2 font-mono text-[13px] uppercase tracking-[0.1em] transition-colors duration-300 active:scale-95", dark ? "border-white text-white hover:text-navy" : "border-navy text-navy hover:text-white")}
              >
                <span className={cn("absolute inset-0 translate-y-full transition-transform duration-300 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-y-0", dark ? "bg-white" : "bg-navy")} aria-hidden="true" />
                <span className="relative">Resume</span>
                <ArrowDown className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
            </Magnetic>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
            className={cn("flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 lg:hidden", dark ? "text-white hover:bg-white/10" : "text-navy hover:bg-black/[0.04]")}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span key={open ? "close" : "open"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </nav>

        {/* Reading progress runs along the bar's bottom edge. */}
        <motion.span
          style={{ scaleX: reduced ? scrollYProgress : progress }}
          className={cn("absolute bottom-0 h-px origin-left bg-gradient-to-r from-signal via-seafoam-600 to-cyan transition-[left,right] duration-500", floating ? "inset-x-5" : "inset-x-0")}
          aria-hidden="true"
        />
      </div>

      <div
        id="mobile-navigation"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "absolute inset-x-0 top-full grid bg-white px-5 transition-[grid-template-rows,opacity] duration-300 lg:hidden",
          open ? "h-[calc(100svh-4rem)] grid-rows-[1fr] border-t border-line opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="flex h-full flex-col py-4">
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                initial={false}
                animate={open ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
                transition={{ duration: 0.4, delay: open && !reduced ? 0.06 + index * 0.05 : 0, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "grid grid-cols-[2.5rem_1fr_auto] items-center border-b border-line py-4 font-display text-2xl font-medium",
                  activeSection === item.href.replace("#", "") ? "text-navy" : "text-slate"
                )}
              >
                <span className="font-mono text-[10px] text-fog">{String(index + 1).padStart(2, "0")}</span>
                <span>{item.label}</span>
                <ArrowUpRight className="h-4 w-4 text-fog" aria-hidden="true" />
              </motion.a>
            ))}
            <motion.div
              initial={false}
              animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.4, delay: open && !reduced ? 0.1 + navItems.length * 0.05 : 0 }}
              className="mt-auto grid gap-4 pb-4 pt-8"
            >
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-steel">
                <span className="inline-flex items-center gap-2"><span className="status-ping h-1.5 w-1.5 rounded-full bg-seafoam-600" aria-hidden="true" />Boston</span>
                <LocalClock />
              </div>
              <a href={`mailto:${contact.email}`} className="break-all font-display text-xl font-medium text-navy">{contact.email}</a>
              <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.1em] text-steel">
                {socialLinks.filter((link) => link.href).map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="hover:text-navy">{link.label}</a>
                ))}
              </div>
              <a href={contact.resume} download className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-navy font-mono text-[13px] uppercase tracking-[0.1em] text-white">
                Download Resume<ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
      <CommandPalette />
    </header>
  );
}
