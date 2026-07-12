"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { impactMetrics } from "@/data/metrics";

/** Full-width impact band under the hero: six count-up stats separated by rules. */
export function MetricStrip() {
  const reduced = useReducedMotion();

  return (
    <section aria-label="Impact metrics" className="border-y border-line bg-canvas">
      <div className="mx-auto grid max-w-shell grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {impactMetrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: reduced ? 0 : i * 0.06, ease: "easeOut" }}
            className="border-b border-r border-line px-5 py-6 transition-colors duration-300 last:border-r-0 hover:bg-white sm:border-b-0 lg:px-6 2xl:px-8 2xl:py-8"
          >
            {metric.label === "Cameras" ? (
              <span className="font-display text-3xl font-semibold tracking-[-0.02em] text-seafoam-700 2xl:text-4xl">
                1,000+
              </span>
            ) : (
              <AnimatedNumber
                value={metric.value}
                decimals={metric.decimals}
                prefix={metric.prefix}
                suffix={metric.suffix}
                className="font-display text-3xl font-semibold tracking-[-0.02em] text-seafoam-700 2xl:text-4xl"
              />
            )}
            <p className="mt-2 font-mono text-[13px] uppercase tracking-[0.1em] text-slate">
              {metric.label}
            </p>
            {metric.detail ? <p className="mt-1 text-sm text-steel">{metric.detail}</p> : null}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
