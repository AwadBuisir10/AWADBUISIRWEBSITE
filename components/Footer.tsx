"use client";

import { useSiteContent } from "@/components/ContentProvider";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LocalClock } from "@/components/LocalClock";
import { Magnetic } from "@/components/Magnetic";
import { ScrambleText } from "@/components/ScrambleText";
import { cn } from "@/lib/cn";

const label = "font-mono text-[11px] uppercase tracking-[.12em]";

/**
 * Curtain-reveal footer: it sits fixed behind the page and the contact section
 * lifts off it. The reveal is only used when the footer fits in the viewport
 * and motion is allowed; otherwise it is an ordinary footer in the flow.
 */
export function Footer() {
  const { branding, navItems, socialLinks, contact, hero } = useSiteContent();
  const reduced = useReducedMotion();
  const shellRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [height, setHeight] = useState(0);
  const [reveal, setReveal] = useState(false);
  const { scrollYProgress } = useScroll({ target: shellRef, offset: ["start end", "end end"] });

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const measure = () => {
      const next = footer.offsetHeight;
      setHeight(next);
      setReveal(!reduced && window.innerWidth >= 768 && next <= window.innerHeight - 24);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(footer);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduced]);

  const backToTop = () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  const profiles = socialLinks.filter((link) => link.href);

  return (
    // Tucks under the contact section's rounded bottom edge; clip-path confines the fixed footer to this box.
    <div
      ref={shellRef}
      className="relative -mt-12"
      style={reveal ? { height, clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" } : undefined}
    >
      <footer ref={footerRef} data-nav-theme="dark" className={cn("spotlight spotlight-dark overflow-hidden bg-[#02090d] text-white", reveal ? "fixed inset-x-0 bottom-0" : "relative")}>
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,transparent,black_35%,black_70%,transparent)]" />
          <div className="aurora absolute -left-[10%] bottom-[-35%] h-[80%] w-[60%] rounded-full bg-[radial-gradient(circle,rgba(68,180,139,.22),transparent_62%)] blur-3xl" />
          <div className="aurora absolute -right-[12%] top-[4%] h-[75%] w-[55%] rounded-full bg-[radial-gradient(circle,rgba(30,65,153,.32),transparent_62%)] blur-3xl [animation-delay:-9s]" />
        </div>

        <div className="relative mx-auto max-w-shell px-5 pb-6 pt-24 sm:px-8 sm:pt-28">
          <div className="grid gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_auto] md:gap-8">
            <div className="sm:col-span-2 md:col-span-1">
              <p className={`${label} inline-flex items-center gap-2 text-seafoam-400`}>
                <span className="status-ping h-1.5 w-1.5 rounded-full bg-seafoam-400" aria-hidden="true" />{hero.availability}
              </p>
              <p className="mt-5 max-w-sm font-display text-3xl font-medium leading-tight tracking-[-.03em]">Thanks for scrolling all the way down.</p>
              <a href={`mailto:${contact.email}`} className="group mt-5 inline-flex items-center gap-2 text-lg text-white/75 transition-colors hover:text-white">
                {contact.email}<ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
              <p className={`${label} mt-6 text-white/45`}>{branding.location} · <LocalClock seconds className="text-white/80" /></p>
            </div>

            <FooterColumn title="Index" links={navItems.map((item) => ({ label: item.label, href: item.href }))} />
            <FooterColumn title="Elsewhere" links={profiles.map((link) => ({ label: link.label, href: link.href, external: true }))} />

            <div className="flex items-start sm:col-span-2 md:col-span-1 md:justify-end">
              <Magnetic strength={0.2}>
                <button type="button" onClick={backToTop} aria-label="Back to top" className="group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/20 text-white transition-colors duration-300 hover:border-white hover:text-[#02090d]">
                  <span className="absolute inset-0 scale-0 rounded-full bg-white transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-100" aria-hidden="true" />
                  <ArrowUp className="relative h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" aria-hidden="true" />
                </button>
              </Magnetic>
            </div>
          </div>

          <Wordmark text={branding.footerName} progress={scrollYProgress} reduced={reduced} />

          <div className={`${label} flex flex-col gap-3 border-t border-white/10 pt-5 text-[10px] text-white/40 sm:flex-row sm:items-center sm:justify-between`}>
            <span>© {new Date().getFullYear()} {branding.footerName} · {branding.location}</span>
            <span>Built with Next.js, Sanity &amp; Framer Motion</span>
            <a href={contact.resume} download className="inline-flex items-center gap-1.5 text-white/60 transition-colors hover:text-white">Resume<ArrowUpRight className="h-3 w-3" aria-hidden="true" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string; external?: boolean }[] }) {
  if (!links.length) return null;
  return (
    <nav aria-label={title}>
      <p className={`${label} text-white/40`}>{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="group inline-flex items-center text-[15px] text-white/70 transition-colors duration-200 hover:text-white"
            >
              <span className="h-px w-0 bg-seafoam-400 transition-[width,margin] duration-300 group-hover:mr-2 group-hover:w-4" aria-hidden="true" />
              <ScrambleText text={link.label} hover onView={false} duration={380} />
              {link.external ? <ArrowUpRight className="ml-2 h-3.5 w-3.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true" /> : null}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Full-width name, fitted to the container, whose letters rise in as the footer is revealed. */
function Wordmark({ text, progress, reduced }: { text: string; progress: MotionValue<number>; reduced: boolean }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [size, setSize] = useState<number | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    const element = textRef.current;
    if (!box || !element) return;
    let ratio = 0;
    const fit = () => {
      if (!ratio) {
        const previous = element.style.fontSize;
        element.style.fontSize = "100px";
        ratio = element.getBoundingClientRect().width / 100;
        element.style.fontSize = previous;
      }
      if (ratio) setSize(Math.floor((box.clientWidth / ratio) * 100) / 100);
    };
    fit();
    document.fonts?.ready.then(() => { ratio = 0; fit(); });
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, [text]);

  if (!text) return null;
  const letters = Array.from(text);

  return (
    <div ref={boxRef} className="py-10 sm:py-12" aria-hidden="true">
      <p ref={textRef} style={size ? { fontSize: size } : undefined} className="inline-flex whitespace-nowrap font-display text-[15vw] font-semibold leading-[0.82] tracking-[-0.055em]">
        {letters.map((char, index) => <Letter key={index} char={char} index={index} count={letters.length} progress={progress} reduced={reduced} />)}
      </p>
    </div>
  );
}

function Letter({ char, index, count, progress, reduced }: { char: string; index: number; count: number; progress: MotionValue<number>; reduced: boolean }) {
  const start = 0.3 + (index / count) * 0.35;
  // Function form on purpose: framer hardware-accelerates opacity mapped straight
  // from useScroll via a native ViewTimeline, which stays at 0 for this fixed,
  // clip-path revealed footer. A computed value keeps it on the JS path.
  const rise = useTransform(() => Math.min(1, Math.max(0, (progress.get() - start) / 0.3)));
  const y = useTransform(rise, (value) => `${(1 - value) * 70}%`);
  if (char === " ") return <span className="inline-block w-[0.24em]" />;
  return (
    <motion.span style={reduced ? undefined : { y, opacity: rise }} className="inline-block">
      <span className="inline-block bg-gradient-to-b from-white to-white/20 bg-clip-text pb-[0.06em] text-transparent transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] hover:-translate-y-[0.08em] hover:from-seafoam-400 hover:to-cyan">
        {char}
      </span>
    </motion.span>
  );
}
