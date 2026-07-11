"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import { navItems } from "@/data/site";
import { contact } from "@/data/site";
import { cn } from "@/lib/cn";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const ids = navItems.map((item) => item.href.replace("#", ""));
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const scrollPosition = window.scrollY + 160;
      let nextActive = "";
      for (const id of ids) {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= scrollPosition) nextActive = id;
      }
      setActiveSection(nextActive);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    setOpen(false);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    window.history.pushState(null, "", href);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "border-b border-line bg-white/90 backdrop-blur-md"
          : "border-b border-transparent bg-white/40 backdrop-blur-sm"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-shell items-center justify-between px-5 sm:px-8">
        <a
          href="#top"
          onClick={(event) => handleAnchorClick(event, "#top")}
          className="font-display text-lg font-semibold tracking-[-0.01em] text-navy"
          aria-label="Awad Buisir — back to top"
        >
          Awad Buisir
        </a>

        <div className="hidden items-center gap-5 lg:flex xl:gap-7">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => handleAnchorClick(event, item.href)}
                className={cn(
                  "relative py-2 font-mono text-[13px] uppercase tracking-[0.1em] transition-colors duration-150",
                  isActive ? "text-navy" : "text-steel hover:text-navy"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-0 -bottom-px h-px origin-left bg-navy transition-transform duration-300",
                    isActive ? "scale-x-100" : "scale-x-0"
                  )}
                  aria-hidden="true"
                />
              </a>
            );
          })}
          <a
            href={contact.resume}
            download
            className="rounded-lg border border-navy px-4 py-2 font-mono text-[13px] uppercase tracking-[0.1em] text-navy transition-colors duration-150 hover:bg-navy hover:text-white active:scale-95"
          >
            Resume
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-navy transition-colors duration-150 hover:bg-black/[0.04] lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        className={cn(
          "grid bg-white px-5 transition-[grid-template-rows] duration-300 lg:hidden",
          open ? "grid-rows-[1fr] border-t border-line" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col py-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => handleAnchorClick(event, item.href)}
                className={cn(
                  "border-b border-line py-4 font-display text-2xl font-medium",
                  activeSection === item.href.replace("#", "") ? "text-navy" : "text-slate"
                )}
              >
                {item.label}
              </a>
            ))}
            <a
              href={contact.resume}
              download
              className="py-4 font-mono text-[13px] uppercase tracking-[0.1em] text-steel"
            >
              Download Resume ↓
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
