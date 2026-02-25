"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuildStory from "@/components/GuildStory";
import NodeLoader from "@/components/NodeLoader";
import PageTransition from "@/components/PageTransition";

const CENTER = { x: 50, y: 50 };
const GUILD_LOADING_MS = 900;
const ORBIT_SPEED = 0.08;
const ORBIT_R = 33;

const guildNodes = [
  { label: "People",              color: "#3B82F6", startAngle: 0 },
  { label: "Equipment",           color: "#06B6D4", startAngle: (Math.PI * 2) / 7 },
  { label: "External\nResources", color: "#8B5CF6", startAngle: (Math.PI * 4) / 7 },
  { label: "Projects",            color: "#F59E0B", startAngle: (Math.PI * 6) / 7 },
  { label: "Publications",        color: "#10B981", startAngle: (Math.PI * 8) / 7 },
  { label: "Lab\nProtocols",      color: "#EC4899", startAngle: (Math.PI * 10) / 7 },
  { label: "Scientific\nPapers",  color: "#F97316", startAngle: (Math.PI * 12) / 7 },
];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeIO = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const LERP_SPEED = 0.10;

function curvedPath(x: number, y: number): string {
  const mx = (x + CENTER.x) / 2;
  const my = (y + CENTER.y) / 2;
  const dx = CENTER.x - x;
  const dy = CENTER.y - y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const bow = 3;
  const cx = mx + (-dy / len) * bow;
  const cy = my + (dx / len) * bow;
  return `M ${x} ${y} Q ${cx} ${cy} ${CENTER.x} ${CENTER.y}`;
}

/* ================================================================== */

function GuildNodeModel() {
  const sectionRef = useRef<HTMLElement>(null);
  const networkRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const lightsRef = useRef<SVGGElement>(null);
  const guildScaleRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const nodesContainerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const animateScrollRef = useRef<(y: number, d: number) => void>(() => {});

  /* ---------- single rAF loop: orbit + smoothed scroll progress ---------- */
  useEffect(() => {
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = (now - start) / 1000;

      const target = targetProgressRef.current;
      const current = progressRef.current;
      const diff = target - current;
      progressRef.current =
        Math.abs(diff) < 0.001 ? target : current + diff * LERP_SPEED;

      const p = progressRef.current;
      const ep = easeIO(clamp01(p / 0.85));
      const currentR = ORBIT_R * (1 - ep);
      const nodeScale = Math.max(0.01, 1 - ep);
      const nodeOpacity = clamp01(1 - ep * 1.3);

      guildNodes.forEach((node, i) => {
        const angle = node.startAngle + t * ORBIT_SPEED;
        const x = CENTER.x + currentR * Math.cos(angle);
        const y = CENTER.y + currentR * Math.sin(angle);

        const el = nodeRefs.current[i];
        if (el) {
          el.style.left = `${x}%`;
          el.style.top = `${y}%`;
          el.style.transform = `translate(-50%, -50%) scale(${nodeScale})`;
          el.style.opacity = String(nodeOpacity);
        }

        const pathEl = pathRefs.current[i];
        if (pathEl) {
          pathEl.setAttribute("d", curvedPath(x, y));
          pathEl.setAttribute("stroke-opacity", String(0.18 * nodeOpacity));
        }
      });

      if (lightsRef.current) lightsRef.current.style.opacity = String(nodeOpacity);

      if (nodesContainerRef.current) {
        nodesContainerRef.current.style.zIndex = p > 0.01 ? "20" : "40";
      }

      if (guildScaleRef.current) {
        guildScaleRef.current.style.transform = `scale(${1 + ep * 0.18})`;
      }

      const fadeP = easeIO(clamp01(p / 0.15));
      if (arrowRef.current) arrowRef.current.style.opacity = String(1 - fadeP);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ---------- scroll-driven progress + snap ---------- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let sTop = 0;
    let sDist = 0;
    const measure = () => {
      sTop = section.offsetTop;
      sDist = section.offsetHeight - window.innerHeight;
    };
    measure();
    window.addEventListener("resize", measure);

    let snapTimer: ReturnType<typeof setTimeout> | null = null;
    let isSnapping = false;
    let isProgrammaticScroll = false;
    let rafId = 0;
    let isTouching = false;
    let lastScrollY = window.scrollY;
    let lastScrollDir: -1 | 0 | 1 = 0;

    const animateScrollTo = (targetY: number, duration: number) => {
      const startY = window.scrollY;
      const delta = targetY - startY;
      if (Math.abs(delta) < 1) return;
      isProgrammaticScroll = true;
      const startTime = performance.now();
      const step = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        window.scrollTo(0, startY + delta * eased);
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          setTimeout(() => { isProgrammaticScroll = false; }, 200);
        }
      };
      requestAnimationFrame(step);
    };
    animateScrollRef.current = animateScrollTo;

    const getSnapDuration = (fromY: number, toY: number) => {
      const distance = Math.abs(toY - fromY);
      const viewport = Math.max(window.innerHeight, 1);
      return Math.round(800 + clamp01(distance / (viewport * 1.35)) * 700);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        if (sDist <= 0) return;

        const yNow = window.scrollY;
        const dy = yNow - lastScrollY;
        if (Math.abs(dy) > 0.5) lastScrollDir = dy > 0 ? 1 : -1;
        lastScrollY = yNow;

        const scrolled = Math.max(0, yNow - sTop);
        const raw = clamp01(scrolled / sDist);
        targetProgressRef.current = raw;

        if (isSnapping || isProgrammaticScroll || isTouching) return;
        if (snapTimer) clearTimeout(snapTimer);

        snapTimer = setTimeout(() => {
          if (isTouching) return;
          const s2 = Math.max(0, window.scrollY - sTop);
          const p2 = clamp01(s2 / sDist);
          if (p2 > 0.01 && p2 < 0.99) {
            const snapTarget: 0 | 1 = lastScrollDir > 0 ? 1 : 0;
            isSnapping = true;
            const overshoot = snapTarget === 1 ? window.innerHeight * 0.4 : 0;
            const targetY = sTop + snapTarget * sDist + overshoot;
            const dur = getSnapDuration(window.scrollY, targetY);
            animateScrollTo(targetY, dur);
            setTimeout(() => { isSnapping = false; }, dur + 140);
          }
        }, 160);
      });
    };

    const onTouchStart = () => {
      isTouching = true;
      if (snapTimer) { clearTimeout(snapTimer); snapTimer = null; }
    };
    const onTouchEnd = () => { isTouching = false; };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      if (snapTimer) clearTimeout(snapTimer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  /* ---------- mouse parallax ---------- */
  useEffect(() => {
    const el = networkRef.current;
    if (!el) return;
    let mRaf = 0;
    const onMove = (e: MouseEvent) => {
      if (mRaf) return;
      mRaf = requestAnimationFrame(() => {
        mRaf = 0;
        const parent = el.parentElement;
        if (!parent) return;
        const r = parent.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width - 0.5) * 10;
        const ny = ((e.clientY - r.top) / r.height - 0.5) * 6;
        el.style.transform = `translate(${nx}px, ${ny}px)`;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (mRaf) cancelAnimationFrame(mRaf);
    };
  }, []);

  const initials = guildNodes.map((n) => {
    const x = CENTER.x + ORBIT_R * Math.cos(n.startAngle);
    const y = CENTER.y + ORBIT_R * Math.sin(n.startAngle);
    return { x, y, d: curvedPath(x, y) };
  });

  return (
    <section ref={sectionRef} className="relative h-[145vh] -mt-16">
      <div className="sticky top-0 h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900/95 to-slate-950">
        {/* background orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[12%] left-[10%] w-[380px] h-[380px] rounded-full bg-blue-500/10 blur-[100px]" />
          <div className="absolute top-[20%] right-[8%] w-[340px] h-[340px] rounded-full bg-violet-500/8 blur-[100px]" />
          <div className="absolute bottom-[15%] left-[30%] w-[360px] h-[360px] rounded-full bg-cyan-500/8 blur-[100px]" />
          <div className="absolute bottom-[10%] right-[15%] w-[300px] h-[300px] rounded-full bg-indigo-500/7 blur-[110px]" />
        </div>

        <div
          ref={networkRef}
          className="absolute inset-0 transition-transform duration-[400ms] ease-out will-change-transform"
        >
          {/* -------- SVG layer -------- */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
            fill="none"
            aria-hidden
          >
            {guildNodes.map((node, i) => (
              <path
                key={`conn-${i}`}
                ref={(el) => { pathRefs.current[i] = el; }}
                id={`guild-conn-${i}`}
                d={initials[i].d}
                stroke={node.color}
                strokeOpacity="0.18"
                strokeWidth="0.16"
                fill="none"
              />
            ))}

            <g ref={lightsRef} style={{ willChange: "opacity" }}>
              {guildNodes.map((node, i) => {
                const dur = 3.5 + i * 0.3;
                return (
                  <g key={`lights-${i}`}>
                    <circle r="0.9" opacity="0.10" fill={node.color}>
                      <animateMotion dur={`${dur}s`} repeatCount="indefinite">
                        <mpath href={`#guild-conn-${i}`} />
                      </animateMotion>
                    </circle>
                    <circle r="0.32" opacity="0.55" fill={node.color}>
                      <animateMotion dur={`${dur}s`} repeatCount="indefinite">
                        <mpath href={`#guild-conn-${i}`} />
                      </animateMotion>
                    </circle>
                    <circle r="0.2" opacity="0.4" fill={node.color}>
                      <animateMotion
                        dur={`${dur}s`}
                        begin={`-${dur * 0.5}s`}
                        repeatCount="indefinite"
                      >
                        <mpath href={`#guild-conn-${i}`} />
                      </animateMotion>
                    </circle>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* -------- orbiting node circles -------- */}
          <div ref={nodesContainerRef} className="absolute inset-0 z-40 pointer-events-none">
            {guildNodes.map((node, i) => (
              <div
                key={node.label}
                ref={(el) => { nodeRefs.current[i] = el; }}
                className="pointer-events-none absolute will-change-[transform,opacity]"
                style={{
                  left: `${initials[i].x}%`,
                  top: `${initials[i].y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.65,
                    delay: 0.2 + i * 0.08,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <div
                    className="w-[82px] h-[82px] sm:w-[118px] sm:h-[118px] rounded-full flex items-center justify-center text-center"
                    style={{
                      background: "rgb(30, 41, 59)",
                      borderColor: `${node.color}35`,
                      borderWidth: "2px",
                      borderStyle: "solid",
                      boxShadow: `0 8px 28px rgba(2,6,23,0.5), 0 0 22px ${node.color}0C`,
                    }}
                  >
                    <span className="text-[10px] sm:text-[14px] font-semibold leading-tight tracking-tight text-white px-2">
                      {node.label.split("\n").map((line) => (
                        <span key={`${node.label}-${line}`} className="block">{line}</span>
                      ))}
                    </span>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* -------- center Guild circle -------- */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div
                ref={guildScaleRef}
                className="relative h-[210px] w-[210px] sm:h-[300px] sm:w-[300px]"
              >
                <div className="guild-ring-pulse absolute inset-[-14px] rounded-full border border-slate-500/15" />
                <div className="guild-ring-pulse-outer absolute inset-[-34px] rounded-full border border-slate-500/8" />
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full glass-strong shadow-[0_0_60px_rgba(99,102,241,0.08)]">
                  <div className="text-5xl sm:text-7xl leading-none tracking-tight text-white drop-shadow-[0_2px_14px_rgba(148,163,184,0.18)]">
                    Guild
                  </div>
                  <div className="mt-2 px-6 text-center text-[10px] sm:text-[13px] uppercase tracking-[0.12em] text-slate-300">
                    Unified Lab Ontology
                  </div>
                  <div ref={arrowRef} className="mt-4">
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.0 }}
                    >
                      <button
                        onClick={() => {
                          const section = sectionRef.current;
                          if (section) {
                            animateScrollRef.current(
                              section.offsetTop + section.offsetHeight - window.innerHeight + window.innerHeight * 0.4,
                              2000,
                            );
                          }
                        }}
                        className="pointer-events-auto flex items-center justify-center h-10 w-10 rounded-full border border-slate-400/30 bg-slate-800/50 text-slate-200 transition-all duration-300 hover:border-slate-200/60 hover:bg-slate-800/80 active:scale-95"
                        aria-label="Scroll to explore Guild"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>



      </div>
    </section>
  );
}

/* ================================================================== */

export default function GuildPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), GUILD_LOADING_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <main className="bg-slate-950 min-h-screen">
        <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 pt-14 pb-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="absolute left-12 top-1/3 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute right-12 bottom-14 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />
          </div>
          <div className="relative">
            <NodeLoader />
          </div>
        </section>
      </main>
    );
  }

  return (
    <PageTransition>
      <main className="bg-slate-950 min-h-screen flex flex-col">
        <Navbar pageName="Guild" />
        <GuildNodeModel />
        <GuildStory />
        <Footer />
      </main>
    </PageTransition>
  );
}
