"use client";

import { useSiteContent } from "@/components/ContentProvider";
import { motion, useAnimationFrame, useInView, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useRef, type ReactNode } from "react";

const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

/** Two copies of a row slide forever; page scroll speed boosts and reverses them. */
function MarqueeRow({ baseVelocity, children }: { baseVelocity: number; children: (copy: number) => ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { margin: "120px" });
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 1.8], { clamp: false });
  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`);
  const direction = useRef(1);
  const slowed = useRef(false);

  useAnimationFrame((_, delta) => {
    if (reduced || !inView) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000) * (slowed.current ? 0.2 : 1);
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div ref={ref} className="overflow-hidden" onMouseEnter={() => (slowed.current = true)} onMouseLeave={() => (slowed.current = false)}>
      <motion.div className="flex w-max" style={{ x }}>
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 items-center">
            {children(copy)}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function VelocityMarquee() {
  const { projects, skillGroups } = useSiteContent();
  const skills = skillGroups.flatMap((group) => group.skills).slice(0, 12);
  if (!projects.length && !skills.length) return null;

  return (
    <section aria-label="Projects and skills" className="relative select-none overflow-hidden border-b border-line bg-white py-8 sm:py-10">
      {projects.length ? (
        <MarqueeRow baseVelocity={-1.1}>
          {(copy) => projects.map((project) => (
            <a
              key={`${copy}-${project.slug}`}
              href={`#${project.slug}`}
              tabIndex={copy ? -1 : undefined}
             
              className="group/marquee flex items-center"
            >
              <span className="whitespace-nowrap font-display text-[clamp(1.9rem,4.4vw,4rem)] font-semibold leading-none tracking-[-0.04em] text-navy transition-colors duration-300 group-hover/marquee:text-seafoam-700">
                {project.title}
              </span>
              <span className="mx-5 h-2 w-2 shrink-0 rounded-full bg-signal transition-transform duration-300 group-hover/marquee:scale-150 sm:mx-8 sm:h-2.5 sm:w-2.5" aria-hidden="true" />
            </a>
          ))}
        </MarqueeRow>
      ) : null}
      {skills.length ? (
        <div className="mt-2 sm:mt-3" aria-hidden="true">
          <MarqueeRow baseVelocity={0.8}>
            {(copy) => skills.map((skill) => (
              <span key={`${copy}-${skill}`} className="flex items-center">
                <span className="text-outline whitespace-nowrap font-display text-[clamp(1.35rem,2.8vw,2.5rem)] font-semibold leading-none tracking-[-0.03em]">{skill}</span>
                <span className="mx-4 font-mono text-xs text-seafoam-600 sm:mx-6" aria-hidden="true">/</span>
              </span>
            ))}
          </MarqueeRow>
        </div>
      ) : null}
    </section>
  );
}
