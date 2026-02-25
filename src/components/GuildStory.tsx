"use client";

import { motion } from "framer-motion";

const storySteps = [
  {
    kicker: "Signal 01",
    title: "Capture Lab Intent As Structured Context",
    body:
      "Guild starts by encoding strategic intent, hypotheses, and constraints as a persistent context layer instead of scattered docs and ad-hoc notes.",
    chips: ["Vision", "Hypotheses", "Constraints"],
  },
  {
    kicker: "Signal 02",
    title: "Bind Execution To Shared Memory",
    body:
      "People, equipment, protocols, and project decisions are attached to the same ontology so operational context remains coherent across teams and time.",
    chips: ["People", "Equipment", "Protocols"],
  },
  {
    kicker: "Signal 03",
    title: "Turn Evidence Into Program Intelligence",
    body:
      "Publications, internal project outputs, and external resources feed one substrate that Scholar, Alchemist, and Oracle can reason over in sync.",
    chips: ["Projects", "Publications", "Corpus"],
  },
];

export default function GuildStory() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900/95 to-slate-950 px-6 pt-4 pb-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[14%] left-[8%] h-80 w-80 rounded-full bg-indigo-500/8 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[12%] h-96 w-96 rounded-full bg-blue-500/7 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-3xl space-y-6 md:space-y-8">
        <div className="space-y-6 md:space-y-8">
          {storySteps.map((step, index) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="group rounded-3xl border border-slate-700/70 bg-slate-900/72 p-6 md:p-7 shadow-[0_24px_70px_rgba(2,6,23,0.45)]"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-white">
                  {step.kicker}
                </span>
              </div>
              <h3 className="text-2xl md:text-[1.85rem] leading-[1.14] tracking-tight text-white">
                {step.title}
              </h3>
              <p className="mt-4 text-white leading-relaxed">{step.body}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {step.chips.map((chip) => (
                  <span
                    key={`${step.kicker}-${chip}`}
                    className="rounded-full border border-slate-600/70 bg-slate-800/85 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-white"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
