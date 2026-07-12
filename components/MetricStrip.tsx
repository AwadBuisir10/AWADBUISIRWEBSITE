"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { impactMetrics } from "@/data/metrics";

/** Full-width impact band under the hero: six count-up stats separated by rules. */
export function MetricStrip() {
  const reduced = useReducedMotion();

  return (
    <section aria-label="Impact metrics" className="relative z-10 border-y border-line bg-canvas lg:-mt-8 lg:mx-auto lg:max-w-[calc(88rem-4rem)] lg:rounded-xl lg:border lg:shadow-elevated">
      <div className="mx-auto grid max-w-shell grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {impactMetrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: reduced ? 0 : i * 0.06, ease: "easeOut" }}
            className="border-b border-r border-line px-5 py-6 transition-colors duration-300 hover:bg-white sm:[&:nth-child(n+4)]:border-b-0 sm:[&:nth-child(3n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(3n)]:border-r lg:last:border-r-0 lg:px-6 2xl:px-8 2xl:py-8"
          >
            <AnimatedNumber
              value={metric.value}
              decimals={metric.decimals}
              prefix={metric.prefix}
              suffix={metric.suffix}
              className="font-display text-3xl font-semibold tracking-[-0.02em] text-seafoam-700 2xl:text-4xl"
            />
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
