"use client";

import { motion } from "framer-motion";

export default function Investors() {
  return (
    <section
      id="investors"
      className="relative py-28 px-6 bg-slate-950 overflow-hidden"
    >
      {/* Background gradient accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-indigo-500/10 via-violet-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-blue-500/8 via-indigo-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-gradient-to-r from-violet-500/6 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5">
            Invest in the Future of
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Scientific Intelligence
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We&apos;re building the reasoning infrastructure that will power the
            next generation of scientific breakthroughs. Join us at the ground
            floor.
          </p>
        </motion.div>

        {/* Key points grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid md:grid-cols-3 gap-5 mb-14"
        >
          {[
            {
              label: "Market",
              title: "$71B+",
              description:
                "Life sciences AI market by 2030 — growing at 28% CAGR as pharma and biotech race to integrate intelligent tools.",
            },
            {
              label: "Opportunity",
              title: "10x Faster",
              description:
                "Drug discovery timelines compressed from years to months. Cortex sits at the critical reasoning layer every lab needs.",
            },
            {
              label: "Traction",
              title: "Early Access",
              description:
                "Active pilots with research institutions and biotech teams. Strong demand signal from scientists who need reasoning — not just retrieval.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-indigo-400/20 transition-all duration-300"
            >
              <span className="text-xs font-medium text-indigo-400 tracking-wide uppercase">
                {item.label}
              </span>
              <p className="text-2xl font-bold text-white mt-2 mb-3 tracking-tight">
                {item.title}
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <a
            href="mailto:hello@apprenticebio.ai"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white font-semibold text-[15px] shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] transition-all duration-300"
          >
            Request Investor Materials
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
