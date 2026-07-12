"use client";

import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Linkedin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [desktop, setDesktop] = useState(false);
  const [activePost, setActivePost] = useState(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const firstY = useTransform(scrollYProgress, [0, 1], [24, -20]);
  const secondY = useTransform(scrollYProgress, [0, 1], [52, -28]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const scrollToPost = (index: number) => {
    const carousel = carouselRef.current;
    const card = cardRefs.current[index];
    if (!carousel || !card) return;
    const firstCard = cardRefs.current[0];
    const left = index * ((firstCard?.offsetWidth ?? card.offsetWidth) + 16);
    carousel.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
    setActivePost(index);
  };

  return (
    <section ref={sectionRef} id="linkedin" className="section-anchor overflow-hidden border-t border-navy/10 py-20 sm:py-28">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionHeader
          index="04"
          eyebrow="LinkedIn"
          title="LinkedIn Posts"
          note="Launches, community milestones, and outside perspective."
        />

        <div className="mt-12 grid min-w-0 items-start gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
          <motion.aside
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="min-w-0 lg:sticky lg:top-28"
          >
            <p className="max-w-full font-display text-xl font-medium leading-8 text-navy">
              Public notes from the work, not a second resume.
            </p>
            <p className="mt-3 max-w-full text-[15px] leading-7 text-slate">
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

          <div className="min-w-0 max-w-full">
            <div className="mb-5 flex items-center justify-between sm:hidden">
              <span className="font-mono text-[10px] uppercase tracking-[.12em] text-steel">Document {String(activePost + 1).padStart(2, "0")} / 02</span>
              <div className="flex gap-2">
                <button type="button" aria-label="Previous LinkedIn post" onClick={() => scrollToPost((activePost - 1 + linkedInPosts.length) % linkedInPosts.length)} className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-navy shadow-card"><ArrowLeft className="h-4 w-4" aria-hidden="true" /></button>
                <button type="button" aria-label="Next LinkedIn post" onClick={() => scrollToPost((activePost + 1) % linkedInPosts.length)} className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-navy shadow-card"><ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
              </div>
            </div>
            <div ref={carouselRef} onScroll={(event) => {
              if (desktop) return;
              const carousel = event.currentTarget;
              const center = carousel.scrollLeft + carousel.clientWidth / 2;
              const cards = Array.from(carousel.children) as HTMLElement[];
              let closest = 0;
              cards.forEach((card, index) => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                const currentCenter = cards[closest].offsetLeft + cards[closest].offsetWidth / 2;
                if (Math.abs(cardCenter - center) < Math.abs(currentCenter - center)) closest = index;
              });
              setActivePost(closest);
            }} className="relative -mx-5 flex w-[calc(100%+2.5rem)] snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-10 sm:-mx-8 sm:w-[calc(100%+4rem)] sm:gap-5 sm:px-8 lg:mx-0 lg:grid lg:w-full lg:grid-cols-2 lg:gap-7 lg:overflow-visible lg:px-0 lg:pb-0">
            {linkedInPosts.map((post, index) => (
              <motion.article
                key={post.src}
                ref={(node) => { cardRefs.current[index] = node; }}
                style={{ y: reduced || !desktop ? 0 : index === 0 ? firstY : secondY }}
                initial={false}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: reduced ? 0 : index * 0.1, ease: "easeOut" }}
                className={`relative w-[88vw] max-w-[31.5rem] shrink-0 snap-center before:absolute before:inset-2 before:-z-10 before:translate-x-2 before:translate-y-2 before:rounded-lg before:border before:border-line before:bg-white/60 sm:w-[72vw] lg:w-auto lg:max-w-none ${
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
                  <DeferredLinkedInEmbed src={post.src} title={post.title} />
                </div>
              </motion.article>
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeferredLinkedInEmbed({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const nearViewport = useInView(ref, { once: true, margin: "300px" });

  return (
    <div ref={ref} className="absolute inset-0">
      {nearViewport ? <iframe src={src} title={title} width="504" height="626" loading="lazy" allowFullScreen className="h-full w-full border-0 bg-white" /> : <div className="flex h-full items-center justify-center bg-white font-mono text-[10px] uppercase tracking-[.12em] text-steel">LinkedIn document</div>}
    </div>
  );
}
