"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Download } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { contact } from "@/data/site";

const links = [
  { label: "LinkedIn", href: contact.linkedin, external: true },
  { label: "GitHub", href: contact.github, external: true },
  { label: "Instagram", href: contact.instagram, external: true }
];

export function ContactSection() {
  const reduced = useReducedMotion();

  return (
    <section id="contact" className="section-anchor py-24 sm:py-32">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionHeader index="09" eyebrow="Contact" title="Let's make it visible." />

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate">{contact.line}</p>

          <a
            href={`mailto:${contact.email}`}
            className="group mt-10 inline-flex items-baseline gap-3 font-display text-2xl font-medium tracking-[-0.015em] text-navy transition-colors duration-150 hover:text-navy/80 sm:text-4xl"
          >
            {contact.email}
            <ArrowUpRight
              className="h-5 w-5 self-center text-fog transition-transform duration-150 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-navy sm:h-6 sm:w-6"
              aria-hidden="true"
            />
          </a>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="group inline-flex items-center gap-1.5 font-mono text-[13px] uppercase tracking-[0.1em] text-slate transition-colors duration-150 hover:text-navy"
              >
                {link.label}
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            ))}
            <a
              href={contact.resume}
              download
              className="group inline-flex items-center gap-1.5 font-mono text-[13px] uppercase tracking-[0.1em] text-slate transition-colors duration-150 hover:text-navy"
            >
              Resume
              <Download
                className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </a>
            <span className="font-mono text-[13px] uppercase tracking-[0.1em] text-steel">
              {contact.location}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
