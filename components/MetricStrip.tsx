"use client";

import { useSiteContent } from "@/components/ContentProvider";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { CSSProperties } from "react";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { LiveFollowerTotal } from "@/components/AudienceText";

/** Full-width impact band under the hero: count-up stats separated by rules. Columns follow the CMS count. */
export function MetricStrip() {
  const { impactMetrics } = useSiteContent();
  const reduced = useReducedMotion();
  if (!impactMetrics.length) return null;
  const numberClass = "font-display text-3xl font-semibold tracking-[-0.02em] text-seafoam-700 2xl:text-4xl";

  return (
    <section aria-label="Impact metrics" className="relative z-10 border-y border-line bg-line lg:-mt-8 lg:mx-auto lg:max-w-[calc(88rem-4rem)] lg:overflow-hidden lg:rounded-xl lg:border lg:shadow-elevated">
      <div
        style={{ "--metric-cols": impactMetrics.length } as CSSProperties}
        className="mx-auto grid max-w-shell grid-cols-2 gap-px lg:[grid-template-columns:repeat(var(--metric-cols),minmax(0,1fr))]"
      >
        {impactMetrics.map((metric, i) => (
          <div
            key={metric.label}
            className={`spotlight relative bg-canvas px-5 py-6 transition-colors duration-300 hover:bg-white lg:px-6 2xl:px-8 2xl:py-8 ${impactMetrics.length % 2 && i === impactMetrics.length - 1 ? "col-span-2 lg:col-span-1" : ""}`}
          >
            {/* Only the content moves in, so the cell grid never flashes as an empty slab. */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: reduced ? 0 : i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {metric.source === "followers" ? (
                <LiveFollowerTotal className={numberClass} />
              ) : (
                <AnimatedNumber value={metric.value} decimals={metric.decimals} prefix={metric.prefix} suffix={metric.suffix} className={numberClass} />
              )}
              <p className="mt-2 font-mono text-[13px] uppercase tracking-[0.1em] text-slate">{metric.label}</p>
              {metric.detail ? <p className="mt-1 text-sm text-steel">{metric.detail}</p> : null}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
