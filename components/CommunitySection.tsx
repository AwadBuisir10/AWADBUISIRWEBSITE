"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Linkedin } from "lucide-react";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { LiveSocialCounter } from "@/components/LiveSocialCounter";
import { SectionHeader } from "@/components/SectionHeader";
import { communityMetrics } from "@/data/metrics";
import { socialLinks } from "@/data/socialLinks";
import { community } from "@/data/site";

const clubLinks = socialLinks.filter((link) => link.label.startsWith("LibyanClub"));

/** The strongest section on the page: LibyanClub, live audience, and proof. */
export function CommunitySection() {
  const reduced = useReducedMotion();

  return (
    <section id="community" className="section-anchor py-24 sm:py-28">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        {/* Header row: section header takes the free space, LibyanClub logo
            sits in-flow beside it so the role note never runs underneath. */}
        <div className="flex items-start justify-between gap-6 sm:gap-10">
          <div className="min-w-0 flex-1">
            <SectionHeader
              index="03"
              eyebrow="Community"
              title={community.title}
              note={community.role}
            />
          </div>
          <img
            src={community.crest}
            alt="LibyanClub logo"
            className="mt-14 h-16 w-16 shrink-0 rounded-lg border border-line object-cover shadow-card sm:h-20 sm:w-20"
          />
        </div>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mt-6 max-w-xl text-lg leading-8 text-slate"
        >
          {community.copy}
        </motion.p>

        <a
          href="#linkedin"
          className="group mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-navy"
        >
          <Linkedin className="h-4 w-4 text-seafoam-700" aria-hidden="true" />
          View LinkedIn posts
          <ArrowDown
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-y-0.5"
            aria-hidden="true"
          />
        </a>

        <div className="mt-10 grid gap-12 lg:grid-cols-[14rem_1fr] xl:grid-cols-[14rem_0.9fr_1.1fr] xl:gap-12">
          <motion.figure
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-[13rem] sm:max-w-[14rem]"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-md border border-line bg-canvas shadow-card">
              <img
                src="/assets/personal/libyan-youth.jpg"
                alt="Awad Buisir with Libyan youth holding the Libyan flag"
                loading="lazy"
                className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.025]"
              />
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between gap-4 border-b border-line pb-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-navy">
                Libyan youth
              </span>
              <span className="text-right text-xs text-steel">Community in motion</span>
            </figcaption>
          </motion.figure>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <LiveSocialCounter />

            <div className="mt-9 flex flex-wrap gap-3">
              {clubLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white px-5 font-mono text-[13px] uppercase tracking-[0.1em] text-navy shadow-card transition-all duration-150 hover:border-navy/40 active:scale-95"
                >
                  {link.label.replace("LibyanClub ", "")}
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>

            {/* What I built for LibyanClub */}
            <div className="mt-12">
              <h3 className="font-mono text-[13px] uppercase tracking-[0.12em] text-navy">
                What I built for LibyanClub
              </h3>
              <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {community.built.map((item) => (
                  <li key={item} className="flex items-baseline gap-2.5 text-[15px] text-slate">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-seafoam-600" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-10 border-l-2 border-navy/60 pl-4 font-mono text-[13px] uppercase leading-6 tracking-[0.1em] text-slate">
              Global Influence Award finalist
              <br />
              Northeastern University
            </p>
          </motion.div>

          <div className="relative lg:col-span-2 xl:col-span-1">
            <div>
              {communityMetrics.map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: reduced ? 0 : i * 0.06, ease: "easeOut" }}
                  className="flex items-baseline justify-between gap-6 border-b border-line py-5 first:pt-0"
                >
                  <div>
                    <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-slate">
                      {metric.label}
                    </p>
                    {metric.detail ? (
                      <p className="mt-1 text-sm text-steel">{metric.detail}</p>
                    ) : null}
                  </div>
                  <AnimatedNumber
                    value={metric.value}
                    decimals={metric.decimals}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                    className="font-display text-3xl font-semibold tracking-[-0.02em] text-seafoam-700 sm:text-4xl"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
