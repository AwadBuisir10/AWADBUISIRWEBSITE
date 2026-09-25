"use client";

import { useSiteContent } from "@/components/ContentProvider";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Linkedin } from "lucide-react";
import { useRef } from "react";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { LiveSocialCounter } from "@/components/LiveSocialCounter";
import { AudienceText, LiveFollowerTotal } from "@/components/AudienceText";
import { Magnetic } from "@/components/Magnetic";
import { SectionHeader } from "@/components/SectionHeader";
import { TiltCard } from "@/components/TiltCard";

const ease = [0.22, 1, 0.36, 1] as const;

export function CommunitySection() {
  const { community, communityMetrics, sectionHeadings } = useSiteContent();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const watermarkRotate = useTransform(scrollYProgress, [0, 1], [-14, 18]);
  const watermarkY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={sectionRef} id="community" className="section-anchor relative overflow-hidden py-20 sm:py-28">
      {community.watermark ? (
        <motion.div style={reduced ? undefined : { rotate: watermarkRotate, y: watermarkY }} className="pointer-events-none absolute -right-36 top-16 w-[34rem] sm:w-[44rem]" aria-hidden="true">
          <Image src={community.watermark} alt="" width={700} height={700} className="w-full opacity-[.055] mix-blend-multiply" />
        </motion.div>
      ) : null}
      <div className="relative mx-auto max-w-shell px-5 sm:px-8">
        <div className="flex items-start justify-between gap-6 sm:gap-10">
          <div className="min-w-0 flex-1">
            <SectionHeader index="05" {...sectionHeadings.community} title={community.title} note={community.role} />
          </div>
          {community.crest ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              whileHover={reduced ? undefined : { rotate: 8, scale: 1.06 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 180, damping: 14 }}
              className="mt-14 shrink-0"
            >
              <motion.div animate={reduced ? undefined : { y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                <Image src={community.crest} alt="LibyanClub logo" width={96} height={96} className="h-16 w-16 rounded-xl border border-line object-cover shadow-elevated sm:h-24 sm:w-24" />
              </motion.div>
            </motion.div>
          ) : null}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(19rem,.82fr)_minmax(0,1.18fr)] lg:gap-16">
          <motion.figure initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.9, ease }} className="relative">
            <TiltCard max={5} className="rounded-xl">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/80 bg-canvas shadow-elevated sm:aspect-[5/4] lg:aspect-[4/5]">
                {community.photo ? <Image src={community.photo} alt={community.photoAlt} fill sizes="(min-width: 1024px) 38vw, 92vw" className="object-cover object-center transition-transform duration-700 hover:scale-[1.025]" /> : null}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071b25]/80 via-transparent to-transparent" aria-hidden="true" />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-5 text-white">
                  <span className="font-display text-2xl font-medium">{community.photoCaption}</span>
                  <span className="font-mono text-[9px] uppercase tracking-[.12em] text-white/70">{community.photoLabel}</span>
                </figcaption>
              </div>
            </TiltCard>
          </motion.figure>

          <div className="flex flex-col justify-between">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, delay: 0.1, ease }}>
              <p className="max-w-2xl font-display text-2xl font-medium leading-snug tracking-[-.02em] text-navy sm:text-3xl"><AudienceText>{community.copy}</AudienceText></p>
              <a href="#linkedin" className="group mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-navy">
                <Linkedin className="h-4 w-4 text-seafoam-700" aria-hidden="true" />View LinkedIn posts
                <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, delay: 0.2, ease }} className="spotlight relative mt-10 rounded-xl border border-white/80 bg-white/70 p-6 shadow-card backdrop-blur-sm sm:p-8">
              <LiveSocialCounter />
              <div className="mt-7 flex flex-wrap gap-3">
                {community.links.map((link) => (
                  <Magnetic key={link.url} strength={0.1}>
                    <a href={link.url} target="_blank" rel="noreferrer" className="group inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white px-5 font-mono text-[12px] uppercase tracking-[.1em] text-navy shadow-card transition-[border-color,transform] hover:-translate-y-0.5 hover:border-navy/40">
                      {link.label.replace("LibyanClub ", "")}<ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </a>
                  </Magnetic>
                ))}
              </div>
            </motion.div>

            <div className="mt-9 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-navy">The system behind the audience</h3>
                <ul className="mt-4 space-y-2.5">
                  {community.built.map((item, i) => (
                    <motion.li key={item} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: reduced ? 0 : i * 0.07, ease }} className="flex items-baseline gap-2.5 text-[15px] text-slate">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-seafoam-600" aria-hidden="true" />{item}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <p className="self-end border-l-2 border-signal pl-4 font-mono text-[12px] uppercase leading-6 tracking-[.1em] text-slate">{community.award}<br />{community.awardOrganization}</p>
            </div>
          </div>
        </div>

        {community.campaign?.title ? (
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease }}
            data-nav-theme="dark"
            className={`spotlight spotlight-dark relative mt-16 grid gap-10 overflow-hidden rounded-xl bg-[#071b25] p-7 text-white sm:p-10 lg:items-center lg:gap-14 ${community.campaign.photo ? "lg:grid-cols-[.95fr_1.05fr]" : ""}`}
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(68,180,139,.28),transparent_65%)] blur-2xl" aria-hidden="true" />
            <div className="relative">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.12em] text-seafoam-400">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />{community.campaign.eyebrow}
              </p>
              <h3 className="mt-4 font-display text-5xl font-semibold tracking-[-.04em] sm:text-6xl"><span className="ink-shift-bright">{community.campaign.title}</span></h3>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/65">{community.campaign.copy}</p>
              {community.campaign.stats.length ? (
                <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-4">
                  {community.campaign.stats.map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: reduced ? 0 : 0.15 + i * 0.08, ease }} className="bg-[#0b2530] p-4">
                      <dt className="sr-only">{stat.label}</dt>
                      <dd>
                        <span className="block font-display text-2xl font-semibold tracking-[-.03em] text-seafoam-400">{stat.value}</span>
                        <span className="mt-1 block font-mono text-[10px] uppercase leading-4 tracking-[.12em] text-white/55" aria-hidden="true">{stat.label}</span>
                      </dd>
                    </motion.div>
                  ))}
                </dl>
              ) : null}
              <a href="#reels" className="group mt-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.1em] text-white/80 transition-colors hover:text-white">
                See the reels<ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
            </div>
            {community.campaign.photo ? (
              <motion.figure initial={{ opacity: 0, y: 24, rotate: 1.5 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.9, delay: 0.15, ease }} className="relative">
                <TiltCard max={3} className="rounded-xl">
                  <div className="relative aspect-[977/536] overflow-hidden rounded-xl border border-white/10 bg-black shadow-[0_30px_60px_-25px_rgba(0,0,0,.8)]">
                    <Image src={community.campaign.photo} alt={community.campaign.photoAlt} fill sizes="(min-width: 1024px) 40vw, 92vw" className="object-cover transition-transform duration-700 hover:scale-[1.03]" />
                  </div>
                </TiltCard>
                {community.campaign.photoCaption ? (
                  <figcaption className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.12em] text-white/55">
                    <span className="status-ping h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />{community.campaign.photoCaption}
                  </figcaption>
                ) : null}
              </motion.figure>
            ) : null}
          </motion.div>
        ) : null}

        <div className="relative mt-16 border-y border-navy/10 py-2">
          <motion.span initial={reduced ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: "easeOut" }} className="absolute left-0 right-0 top-0 h-px origin-left bg-gradient-to-r from-signal via-seafoam-600 to-cyan" aria-hidden="true" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5">
            {communityMetrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: reduced ? 0 : i * 0.08, ease }}
                className="spotlight relative border-b border-navy/10 px-4 py-6 last:border-b-0 sm:border-r sm:[&:nth-child(even)]:border-r-0 lg:border-b-0 lg:[&:nth-child(even)]:border-r lg:last:border-r-0"
              >
                <span className="font-mono text-[9px] text-steel">0{i + 1}</span>
                {metric.source === "followers" ? <LiveFollowerTotal className="mt-3 block font-display text-3xl font-semibold tracking-[-.03em] text-seafoam-700 sm:text-4xl" /> : <AnimatedNumber value={metric.value} decimals={metric.decimals} prefix={metric.prefix} suffix={metric.suffix} className="mt-3 block font-display text-3xl font-semibold tracking-[-.03em] text-seafoam-700 sm:text-4xl" />}
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[.1em] text-navy">{metric.label}</p>
                {metric.detail ? <p className="mt-1 text-xs text-steel">{metric.detail}</p> : null}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
