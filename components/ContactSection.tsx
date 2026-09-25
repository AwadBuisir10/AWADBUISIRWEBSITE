"use client";

import { useSiteContent } from "@/components/ContentProvider";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ArrowUpRight, Check, Copy, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "@/components/Magnetic";
import { SectionHeader } from "@/components/SectionHeader";

const letters: Variants = { hidden: {}, shown: { transition: { staggerChildren: 0.022, delayChildren: 0.15 } } };
const letter: Variants = { hidden: { y: "105%", opacity: 0 }, shown: { y: "0%", opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };

export function ContactSection() {
  const { contact, sectionHeadings } = useSiteContent();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end end"] });
  const signalTop = useTransform(scrollYProgress, [0, 1], ["8%", "82%"]);
  const links = [
    { label: "LinkedIn", href: contact.linkedin, external: true },
    { label: "GitHub", href: contact.github, external: true },
    { label: "Instagram", href: contact.instagram, external: true }
  ];

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  return (
    <section ref={sectionRef} id="contact" data-nav-theme="dark" className="spotlight spotlight-dark section-anchor relative z-[2] overflow-hidden rounded-b-[2rem] bg-[#061821] py-20 text-white shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)] sm:rounded-b-[3rem] sm:py-32">
      <motion.div
        className="absolute -right-32 -top-32 h-[38rem] w-[38rem]"
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 rounded-full border border-cyan/10 bg-[radial-gradient(circle_at_center,rgba(136,222,235,.10),transparent_64%)]" />
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan shadow-[0_0_18px_rgba(136,222,235,.9)]" />
      </motion.div>
      <div className="absolute bottom-0 left-4 top-0 hidden w-px bg-gradient-to-b from-transparent via-white/10 to-signal/60 sm:block lg:left-5" aria-hidden="true" />
      <motion.span
        style={{ top: reduced ? "82%" : signalTop }}
        className="absolute left-[calc(1rem-5px)] hidden h-2.5 w-2.5 rounded-full bg-signal shadow-[0_0_22px_rgba(236,101,43,.8)] sm:block lg:left-[calc(1.25rem-5px)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-shell px-5 sm:px-8">
        <SectionHeader index="09" {...sectionHeadings.contact} dark />
        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-6 max-w-xl text-lg leading-8 text-white/60">{contact.line}</motion.p>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-5">
          <Magnetic strength={0.04}>
            <motion.a
              href={`mailto:${contact.email}`}
              aria-label={`Email ${contact.email}`}
              variants={letters}
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, margin: "-60px" }}
              className="group flex max-w-max flex-wrap items-center gap-3 font-display text-[clamp(1.75rem,7vw,4rem)] font-medium tracking-[-.035em] text-white transition-colors hover:text-cyan"
            >
              <span className="flex flex-wrap" aria-hidden="true">
                {Array.from(contact.email).map((char, i) => (
                  <span key={i} className="word-mask">
                    <motion.span variants={letter} className="inline-block">
                      <span className="inline-block transition-transform duration-300 group-hover:-translate-y-[0.12em]" style={{ transitionDelay: `${i * 14}ms` }}>{char}</span>
                    </motion.span>
                  </span>
                ))}
              </span>
              <ArrowUpRight className="h-6 w-6 shrink-0 text-white/35 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan" aria-hidden="true" />
            </motion.a>
          </Magnetic>
          <button type="button" onClick={copyEmail} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 px-4 font-mono text-[11px] uppercase tracking-[.1em] text-white/70 transition-[border-color,color,transform] hover:border-white/40 hover:text-white active:scale-95">
            {copied ? <Check className="h-3.5 w-3.5 text-seafoam-400" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            {copied ? "Copied" : "Copy email"}
          </button>
          <span className="sr-only" aria-live="polite">{copied ? "Email address copied" : ""}</span>
        </div>
        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-6">
          {links.filter(link => link.href).map((link) => <a key={link.label} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noreferrer" : undefined} className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[.1em] text-white/60 transition-colors hover:text-white">{link.label}<ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></a>)}
          <a href={contact.resume} download className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[.1em] text-white/60 hover:text-white">Resume<Download className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden="true" /></a>
          <span className="font-mono text-[11px] uppercase tracking-[.1em] text-white/35">{contact.location}</span>
        </div>
      </div>
    </section>
  );
}
