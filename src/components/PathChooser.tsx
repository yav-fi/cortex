"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePageTransition } from "@/components/PageTransition";

/* ------------------------------------------------------------------ */
/*  Arc paths — left rises from below, right descends from above.      */
/*  viewBox 0 0 100 100.                                               */
/* ------------------------------------------------------------------ */

const ARCS = [
  {
    id: "arc-l",
    d: "M -10 115 C 15 88, 30 72, 32 58 C 34 44, 15 12, -10 -15",
    color: "#3B82F6",
    dur: 14,
  },
  {
    id: "arc-r",
    d: "M 110 -15 C 85 12, 70 44, 68 58 C 66 72, 85 88, 110 115",
    color: "#22d3ee",
    dur: 16,
  },
];

const FLOW_OFFSETS = [0, 0.2, 0.4, 0.6, 0.8];

/* ------------------------------------------------------------------ */
/*  Node link                                                          */
/* ------------------------------------------------------------------ */

function NodeLink({
  href,
  title,
  subtitle,
  icon,
  delay,
  color,
  onNavigate,
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: string;
  delay: number;
  color: string;
  onNavigate: (href: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="relative flex flex-col items-center"
    >
      <Link
        href={href}
        onClick={(e) => {
          e.preventDefault();
          onNavigate(href);
        }}
        className="group relative flex h-36 w-36 md:h-44 md:w-44 flex-col items-center justify-center rounded-full bg-slate-900/70 glass border-[2.5px] text-center transition-[border-color,box-shadow] duration-300"
        style={{
          borderColor: `${color}50`,
          boxShadow: `0 4px 24px ${color}15`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = `${color}AA`;
          e.currentTarget.style.boxShadow = `0 4px 40px ${color}30`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = `${color}50`;
          e.currentTarget.style.boxShadow = `0 4px 24px ${color}15`;
        }}
      >
        <span className="text-3xl md:text-4xl select-none">{icon}</span>
        <span
          className="mt-1.5 text-sm md:text-lg font-semibold tracking-tight select-none"
          style={{ color }}
        >
          {title}
        </span>
        <span className="mt-1 px-6 text-[10px] md:text-xs text-slate-400 leading-snug select-none">
          {subtitle}
        </span>
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PathChooser() {
  const { navigateTo } = usePageTransition();

  return (
    <section className="relative flex-1 overflow-hidden">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[18%] left-[16%] h-[480px] w-[480px] rounded-full bg-blue-500/[0.07] blur-[100px]" />
        <div className="absolute top-[22%] right-[14%] h-[420px] w-[420px] rounded-full bg-violet-500/[0.07] blur-[100px]" />
        <div className="absolute bottom-[15%] left-[30%] h-[400px] w-[400px] rounded-full bg-cyan-500/[0.05] blur-[100px]" />
      </div>

      {/* Sweeping arc paths with flowing lights */}
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.1 }}
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        fill="none"
        preserveAspectRatio="none"
      >
        {ARCS.map((arc) => (
          <g key={arc.id}>
            {/* Wide soft glow */}
            <path
              d={arc.d}
              stroke={arc.color}
              strokeWidth="2.5"
              strokeOpacity="0.025"
              fill="none"
            />
            {/* Medium glow */}
            <path
              d={arc.d}
              stroke={arc.color}
              strokeWidth="0.8"
              strokeOpacity="0.06"
              fill="none"
            />
            {/* Visible arc */}
            <path
              id={arc.id}
              d={arc.d}
              stroke={arc.color}
              strokeWidth="0.14"
              strokeOpacity="0.3"
              fill="none"
            />

            {/* Stream of flowing lights */}
            {FLOW_OFFSETS.map((offset, j) => (
              <g key={j}>
                <circle r="2" fill={arc.color} opacity="0.03">
                  <animateMotion
                    dur={`${arc.dur}s`}
                    begin={`${-offset * arc.dur}s`}
                    repeatCount="indefinite"
                  >
                    <mpath href={`#${arc.id}`} />
                  </animateMotion>
                </circle>
                <circle r="0.5" fill={arc.color} opacity="0.4">
                  <animateMotion
                    dur={`${arc.dur}s`}
                    begin={`${-offset * arc.dur}s`}
                    repeatCount="indefinite"
                  >
                    <mpath href={`#${arc.id}`} />
                  </animateMotion>
                </circle>
                <circle r="0.14" fill="white" opacity="0.7">
                  <animateMotion
                    dur={`${arc.dur}s`}
                    begin={`${-offset * arc.dur}s`}
                    repeatCount="indefinite"
                  >
                    <mpath href={`#${arc.id}`} />
                  </animateMotion>
                </circle>
              </g>
            ))}
          </g>
        ))}
      </motion.svg>

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center gap-14 px-6 py-20 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.1,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="max-w-lg text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight leading-[1.15] text-slate-100">
            Your Research,{" "}
            <span className="gradient-text">Supercharged.</span>
          </h1>
          <p className="mt-4 text-sm md:text-[15px] leading-relaxed text-slate-400 max-w-[340px] mx-auto">
            Science-native AI for hypothesis, experiment, and insight.
          </p>
        </motion.div>

        <div className="grid w-full max-w-3xl grid-cols-2 place-items-center gap-6 md:gap-32">
          <NodeLink
            href="/apprentice"
            title="Apprentice"
            subtitle="Personal research engine"
            icon="🧬"
            delay={0.3}
            color="#3B82F6"
            onNavigate={navigateTo}
          />
          <NodeLink
            href="/guild"
            title="Guild"
            subtitle="Lab-wide intelligence"
            icon="🛡️"
            delay={0.4}
            color="#22d3ee"
            onNavigate={navigateTo}
          />
        </div>
      </div>
    </section>
  );
}
