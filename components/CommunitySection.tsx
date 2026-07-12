"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Linkedin } from "lucide-react";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { LiveSocialCounter } from "@/components/LiveSocialCounter";
import { SectionHeader } from "@/components/SectionHeader";
import { communityMetrics } from "@/data/metrics";
import { socialLinks } from "@/data/socialLinks";
import { community } from "@/data/site";

const clubLinks = socialLinks.filter((link) => link.label.startsWith("LibyanClub"));

export function CommunitySection() {
  const reduced = useReducedMotion();

  return (
    <section id="community" className="section-anchor relative overflow-hidden py-20 sm:py-28">
      <Image src={community.watermark} alt="" width={700} height={700} aria-hidden="true" className="pointer-events-none absolute -right-36 top-16 w-[34rem] opacity-[.055] mix-blend-multiply sm:w-[44rem]" />
      <div className="relative mx-auto max-w-shell px-5 sm:px-8">
        <div className="flex items-start justify-between gap-6 sm:gap-10">
          <div className="min-w-0 flex-1">
            <SectionHeader index="03" eyebrow="Reach" title={community.title} note={community.role} />
          </div>
          <Image src={community.crest} alt="LibyanClub logo" width={96} height={96} className="mt-14 h-16 w-16 shrink-0 rounded-xl border border-line object-cover shadow-elevated sm:h-24 sm:w-24" />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(19rem,.82fr)_minmax(0,1.18fr)] lg:gap-16">
          <motion.figure initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/80 bg-canvas shadow-elevated sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image src="/assets/personal/libyan-youth.jpg" alt="Awad Buisir with Libyan youth holding the Libyan flag" fill sizes="(min-width: 1024px) 38vw, 92vw" className="object-cover object-center transition-transform duration-700 hover:scale-[1.025]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071b25]/80 via-transparent to-transparent" aria-hidden="true" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-5 text-white">
                <span className="font-display text-2xl font-medium">Community in motion</span>
                <span className="font-mono text-[9px] uppercase tracking-[.12em] text-white/70">Libyan youth</span>
              </figcaption>
            </div>
          </motion.figure>

          <div className="flex flex-col justify-between">
            <div>
              <p className="max-w-2xl font-display text-2xl font-medium leading-snug tracking-[-.02em] text-navy sm:text-3xl">{community.copy}</p>
              <a href="#linkedin" className="group mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-navy">
                <Linkedin className="h-4 w-4 text-seafoam-700" aria-hidden="true" />View LinkedIn posts
                <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-10 rounded-xl border border-white/80 bg-white/70 p-6 shadow-card backdrop-blur-sm sm:p-8">
              <LiveSocialCounter />
              <div className="mt-7 flex flex-wrap gap-3">
                {clubLinks.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="group inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white px-5 font-mono text-[12px] uppercase tracking-[.1em] text-navy shadow-card transition-all hover:-translate-y-0.5 hover:border-navy/40">
                    {link.label.replace("LibyanClub ", "")}<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-9 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-navy">What I built for LibyanClub</h3>
                <ul className="mt-4 space-y-2.5">
                  {community.built.map((item) => <li key={item} className="flex items-baseline gap-2.5 text-[15px] text-slate"><span className="h-1 w-1 shrink-0 rounded-full bg-seafoam-600" aria-hidden="true" />{item}</li>)}
                </ul>
              </div>
              <p className="self-end border-l-2 border-signal pl-4 font-mono text-[12px] uppercase leading-6 tracking-[.1em] text-slate">Global Influence Award finalist<br />Northeastern University</p>
            </div>
          </div>
        </div>

        <div className="relative mt-16 border-y border-navy/10 py-2">
          <motion.span initial={reduced ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: "easeOut" }} className="absolute left-0 right-0 top-0 h-px origin-left bg-gradient-to-r from-signal via-seafoam-600 to-cyan" aria-hidden="true" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5">
            {communityMetrics.map((metric, i) => (
              <div key={metric.label} className="border-b border-navy/10 px-4 py-6 last:border-b-0 sm:border-r sm:[&:nth-child(even)]:border-r-0 lg:border-b-0 lg:[&:nth-child(even)]:border-r lg:last:border-r-0">
                <span className="font-mono text-[9px] text-steel">0{i + 1}</span>
                <AnimatedNumber value={metric.value} decimals={metric.decimals} prefix={metric.prefix} suffix={metric.suffix} className="mt-3 block font-display text-3xl font-semibold tracking-[-.03em] text-seafoam-700 sm:text-4xl" />
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[.1em] text-navy">{metric.label}</p>
                {metric.detail ? <p className="mt-1 text-xs text-steel">{metric.detail}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
