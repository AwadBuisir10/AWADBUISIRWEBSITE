"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Clapperboard, Layers3, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";

const tools = ["Gemini Nano Banana", "Veo", "Midjourney", "ChatGPT", "CapCut", "TikTok"];

const capabilities = [
  { icon: Sparkles, top: "Prompt", bottom: "Engineering" },
  { icon: Layers3, top: "Multi-model", bottom: "Workflows" },
  { icon: Clapperboard, top: "Story", bottom: "Direction" }
];

const storyFrames = [
  { image: "/assets/ai-creative/omar-mukhtar-meeting.jpg", alt: "AI-illustrated historical meeting in the Libyan desert", label: "Character continuity" },
  { image: "/assets/ai-creative/desert-convoy.jpg", alt: "AI-illustrated military convoy crossing the desert", label: "World building" },
  { image: "/assets/ai-creative/resistance-riders.png", alt: "AI-illustrated Libyan resistance riders", label: "Cinematic motion" },
  { image: "/assets/ai-creative/desert-battle.png", alt: "Three-panel AI-illustrated desert battle sequence", label: "Sequence design" },
  { image: "/assets/ai-creative/war-room.png", alt: "AI-illustrated officers gathered around a map", label: "Visual consistency" }
];

const workflow = [
  ["01", "Research", "Find the historical moment, characters, places, and visual references."],
  ["02", "Direct", "Engineer prompts around composition, character identity, and a consistent cartoon language."],
  ["03", "Generate", "Move between image and video models, refining frames until the story feels coherent."],
  ["04", "Finish", "Edit, pace, stitch, and polish every scene into one narrative made for young audiences."]
];

export function CreativeGallery() {
  const reduced = useReducedMotion();

  return (
    <section id="creative" className="section-anchor overflow-hidden bg-[#071b25] py-24 text-white sm:py-28">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionHeader
          index="07"
          eyebrow="AI Creative Works"
          title="Ideas, directed with AI."
          note="Prompt engineering, visual storytelling, and creative systems across image, video, and design."
          dark
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="max-w-3xl"
          >
            <p className="font-display text-3xl font-medium leading-[1.12] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
              I turn ambitious ideas into coherent visual worlds—combining precise prompts, reference-led direction, and the right AI tool for every step.
            </p>
          </motion.div>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10">
            {capabilities.map(({ icon: Icon, top, bottom }) => {
              return (
                <div key={top} className="bg-[#0b2530] p-4 sm:p-5">
                  <Icon className="mb-5 h-5 w-5 text-seafoam-400" aria-hidden="true" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">{top}</p>
                  <p className="mt-1 text-sm font-medium text-white">{bottom}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-20 border-t border-white/10 pt-8">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-seafoam-400">Historical storytelling</p>
              <h3 className="mt-3 max-w-2xl font-display text-3xl font-medium tracking-[-0.03em] sm:text-4xl">Making history vivid for a new generation.</h3>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/60">Reference images anchor the people, places, and art direction. Carefully structured prompts carry that identity from one frame—and one model—to the next.</p>
          </div>

          <div className="grid h-[38rem] grid-cols-2 grid-rows-2 gap-2 sm:h-[44rem] sm:grid-cols-4 lg:h-[36rem] lg:grid-cols-5 lg:grid-rows-1">
            {storyFrames.map((frame, i) => (
              <motion.figure
                key={frame.image}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: reduced ? 0 : i * 0.06 }}
                className={`group relative overflow-hidden rounded-md ${i === 0 ? "col-span-2 sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <img src={frame.image} alt={frame.alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04] group-hover:brightness-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-4 font-mono text-[10px] uppercase tracking-[0.12em] text-white/80">{frame.label}</figcaption>
              </motion.figure>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-10 border-t border-white/10 pt-8 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-seafoam-400">From reference to reel</p>
            <h3 className="mt-3 font-display text-3xl font-medium tracking-[-0.03em] sm:text-4xl">A repeatable creative workflow.</h3>
            <p className="mt-5 max-w-md text-base leading-7 text-white/60">The craft is not a single prompt. It is research, iteration, model selection, continuity, editing, and knowing when the story is finally working.</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {tools.map((tool) => <span key={tool} className="rounded-full border border-white/15 bg-white/[.04] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-white/75">{tool}</span>)}
            </div>
          </div>
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {workflow.map(([number, title, copy], i) => (
              <motion.li key={number} initial={reduced ? false : { opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: reduced ? 0 : i * .06 }} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5 sm:grid-cols-[3rem_8rem_1fr] sm:items-center">
                <span className="font-mono text-xs text-seafoam-400">{number}</span>
                <strong className="font-display text-lg font-medium">{title}</strong>
                <span className="col-start-2 text-sm leading-6 text-white/55 sm:col-start-auto">{copy}</span>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="mt-20 overflow-hidden rounded-xl bg-[#f0eadb] text-navy">
          <div className="grid lg:grid-cols-2">
            <div className="grid grid-cols-2 gap-px bg-navy/10 p-px">
              <img src="/assets/ai-creative/libya-kit-design.png" alt="Front and back design of an AI-assisted Libya basketball uniform concept" loading="lazy" className="h-full min-h-[26rem] w-full bg-[#f0eadb] object-cover" />
              <img src="/assets/ai-creative/libya-kit-concept.png" alt="AI visualization of the Libya basketball jersey concept in use" loading="lazy" className="h-full min-h-[26rem] w-full bg-[#f0eadb] object-cover" />
            </div>
            <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ocean">AI-assisted apparel design</p>
                <h3 className="mt-4 font-display text-4xl font-medium leading-tight tracking-[-0.04em] sm:text-5xl">A national identity, translated into a basketball kit.</h3>
                <p className="mt-6 max-w-xl text-base leading-7 text-slate">I use AI as a creative partner beyond film—rapidly exploring clothing concepts, cultural patterns, materials, and real-world presentation. This Libya national basketball jersey concept attracted interest from the Libyan Basketball Federation.</p>
              </div>
              <div className="mt-10 flex items-center gap-3 border-t border-navy/15 pt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-navy/60">
                <ArrowDown className="h-4 w-4" aria-hidden="true" /> Concept → visualization → stakeholder interest
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
