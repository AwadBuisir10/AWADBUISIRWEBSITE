"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Linkedin } from "lucide-react";
import { useRef } from "react";
import { SectionHeader } from "@/components/SectionHeader";

const linkedInPosts = [
  {
    label: "Founder update",
    src: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7413672796016496640?collapsed=1",
    href: "https://www.linkedin.com/feed/update/urn:li:ugcPost:7413672796016496640/",
    title: "LinkedIn post by Awad Buisir about LibyanClub"
  },
  {
    label: "Community milestone",
    src: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7396761969028149248?collapsed=1",
    href: "https://www.linkedin.com/feed/update/urn:li:ugcPost:7396761969028149248/",
    title: "LinkedIn post by Awad Buisir about a LibyanClub community milestone"
  }
];

const outsidePerspective =
  "https://www.linkedin.com/posts/nourelhodaa_just-over-two-months-ago-libyanclub-was-activity-7413676082077274112-WIHm?utm_source=share&utm_medium=member_desktop&rcm=ACoAADD4wRoBsE3tqCOgAdV0Px32jbFAPkRy1lY";

export function LinkedInHighlights() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const firstY = useTransform(scrollYProgress, [0, 1], [24, -20]);
  const secondY = useTransform(scrollYProgress, [0, 1], [52, -28]);

  return (
    <section ref={sectionRef} id="linkedin" className="section-anchor overflow-hidden py-24 sm:py-28">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionHeader
          index="04"
          eyebrow="LinkedIn"
          title="LinkedIn Posts"
          note="Launches, community milestones, and outside perspective."
        />

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-[16rem_1fr] lg:gap-16">
          <motion.aside
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="lg:sticky lg:top-28"
          >
            <p className="font-display text-xl font-medium leading-8 text-navy">
              Public notes from the work, not a second resume.
            </p>
            <p className="mt-3 text-[15px] leading-7 text-slate">
              These posts document LibyanClub's growth and the people who saw it happen.
            </p>

            <a
              href={outsidePerspective}
              target="_blank"
              rel="noreferrer"
              className="group mt-8 block border-y border-line py-4"
            >
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-seafoam-700">
                <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
                Outside perspective
              </span>
              <span className="mt-2 flex items-center justify-between gap-4 text-sm font-medium leading-6 text-navy">
                Nourelhodaa on LibyanClub's reach
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </a>
          </motion.aside>

          <div className="grid grid-cols-1 gap-10 pb-4 sm:-mx-8 sm:flex sm:snap-x sm:snap-mandatory sm:gap-5 sm:overflow-x-auto sm:px-8 sm:pb-10 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-7 lg:overflow-visible lg:px-0 lg:pb-0">
            {linkedInPosts.map((post, index) => (
              <motion.article
                key={post.src}
                style={{ y: reduced ? 0 : index === 0 ? firstY : secondY }}
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: reduced ? 0 : index * 0.1, ease: "easeOut" }}
                className={`w-full min-w-0 max-w-[31.5rem] shrink-0 snap-start sm:w-[78vw] lg:w-auto lg:max-w-none ${
                  index === 1 ? "lg:mt-16" : ""
                }`}
              >
                <div className="mb-3 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.1em] text-steel">
                  <span>
                    0{index + 1} / {post.label}
                  </span>
                  <a
                    href={post.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1.5 text-navy transition-colors duration-200 hover:text-seafoam-700"
                  >
                    Open post
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </div>
                <div className="relative aspect-[504/626] w-full overflow-hidden rounded-lg border border-line bg-white shadow-elevated">
                  <iframe
                    src={post.src}
                    title={post.title}
                    width="504"
                    height="626"
                    loading="lazy"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0 bg-white"
                  />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
