"use client";

import { ArrowUpRight, Download } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { contact } from "@/data/site";

const links = [
  { label: "LinkedIn", href: contact.linkedin, external: true },
  { label: "GitHub", href: contact.github, external: true },
  { label: "Instagram", href: contact.instagram, external: true }
];

export function ContactSection() {
  return (
    <section id="contact" className="section-anchor relative overflow-hidden bg-[#061821] py-20 text-white sm:py-32">
      <div className="absolute -right-32 -top-32 h-[38rem] w-[38rem] rounded-full border border-cyan/10 bg-[radial-gradient(circle_at_center,rgba(136,222,235,.10),transparent_64%)]" aria-hidden="true" />
      <div className="absolute bottom-0 left-[8%] top-0 w-px bg-gradient-to-b from-transparent via-white/10 to-signal/60" aria-hidden="true" />
      <span className="absolute bottom-[18%] left-[calc(8%-5px)] h-2.5 w-2.5 rounded-full bg-signal shadow-[0_0_22px_rgba(236,101,43,.8)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-shell px-5 sm:px-8">
        <SectionHeader index="09" eyebrow="Contact" title="Let's make it visible." dark />
        <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">{contact.line}</p>
        <a href={`mailto:${contact.email}`} className="group mt-10 flex max-w-max flex-wrap items-center gap-3 font-display text-[clamp(1.75rem,7vw,4rem)] font-medium tracking-[-.035em] text-white [overflow-wrap:anywhere] hover:text-cyan">
          {contact.email}<ArrowUpRight className="h-6 w-6 shrink-0 text-white/35 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan" aria-hidden="true" />
        </a>
        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-6">
          {links.map((link) => <a key={link.label} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noreferrer" : undefined} className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[.1em] text-white/60 transition-colors hover:text-white">{link.label}<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></a>)}
          <a href={contact.resume} download className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[.1em] text-white/60 hover:text-white">Resume<Download className="h-3.5 w-3.5" aria-hidden="true" /></a>
          <span className="font-mono text-[11px] uppercase tracking-[.1em] text-white/35">{contact.location}</span>
        </div>
      </div>
    </section>
  );
}
