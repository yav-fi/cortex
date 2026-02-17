"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ToolModal, { ToolData } from "./ToolModal";

/* ================================================================== */
/*  Tool definitions — px/py are %-positions, deliberately asymmetric  */
/* ================================================================== */

const TOOLS: (ToolData & { px: number; py: number })[] = [
  {
    id: "geo",
    name: "GEO",
    fullName: "Description",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    capabilities: [
      "Bullet 1",
      "Bullet 2",
      "Bullet 3",
      "Bullet 4",
      "Bullet 5",
      "Bullet 6",
    ],
    color: "#3B82F6",
    icon: "🧬",
    px: 14,
    py: 68,
  },
  {
    id: "seurat",
    name: "Seurat",
    fullName: "Description",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    capabilities: [
      "Bullet 1",
      "Bullet 2",
      "Bullet 3",
      "Bullet 4",
      "Bullet 5",
      "Bullet 6",
    ],
    color: "#8B5CF6",
    icon: "🔬",
    px: 32,
    py: 22,
  },
  {
    id: "snapgene",
    name: "SnapGene",
    fullName: "Description",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    capabilities: [
      "Bullet 1",
      "Bullet 2",
      "Bullet 3",
      "Bullet 4",
      "Bullet 5",
      "Bullet 6",
    ],
    color: "#10B981",
    icon: "🧪",
    px: 50,
    py: 86,
  },
  {
    id: "projectils",
    name: "ProjecTILs",
    fullName: "Description",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    capabilities: [
      "Bullet 1",
      "Bullet 2",
      "Bullet 3",
      "Bullet 4",
      "Bullet 5",
      "Bullet 6",
    ],
    color: "#06B6D4",
    icon: "🛡️",
    px: 68,
    py: 22,
  },
  {
    id: "screpertoire",
    name: "scRepertoire",
    fullName: "Description",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    capabilities: [
      "Bullet 1",
      "Bullet 2",
      "Bullet 3",
      "Bullet 4",
      "Bullet 5",
      "Bullet 6",
    ],
    color: "#F59E0B",
    icon: "🔗",
    px: 86,
    py: 68,
  },
];

/* ================================================================== */
/*  SVG — brain-themed network, viewBox 0 0 100 100                    */
/* ================================================================== */

const CTR = { x: 50, y: 50 };

/* quadratic bezier helper */
function qPath(
  x1: number, y1: number,
  x2: number, y2: number,
  curve: number,
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  return `M ${x1} ${y1} Q ${mx - dy * curve} ${my + dx * curve} ${x2} ${y2}`;
}

/* cubic bezier helper — organic brain curves */
function cPath(
  x1: number, y1: number,
  cx1: number, cy1: number,
  cx2: number, cy2: number,
  x2: number, y2: number,
): string {
  return `M ${x1} ${y1} C ${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2}`;
}

/* ---- brain silhouette (very faint outline + central fissure) ---- */
const BRAIN_OUTLINE: string[] = [
  cPath(25, 18, 35, 5, 65, 5, 75, 18),
  cPath(75, 18, 90, 28, 88, 62, 78, 78),
  cPath(78, 78, 68, 90, 32, 90, 22, 78),
  cPath(22, 78, 12, 62, 10, 28, 25, 18),
  cPath(50, 8, 49, 30, 51, 62, 50, 90),
];

/*
 * Spread → Circle layout
 *   Scroll: nodes orbit Cortex hub in an even pentagon (circle)
 *     GEO       (20, 40) — upper-left
 *     Seurat    (32, 22) — upper-left-center
 *     SnapGene  (80, 40) — upper-right
 *     ProjecTILs(68, 22) — upper-right-center
 *     scRep     (69, 76) — lower-right
 *     CENTER    (50, 50) — cortex hub (true screen center)
 */

/* curve amounts & topology — used for dynamic path updates */
const HUB_PAIRS: [number, number][] = [[0, 2], [1, 3], [2, 4], [3, 0], [4, 1]]; // star pattern
const HUB_CURVES = [0.12, 0.06, -0.12, 0.1, -0.1];
const HUB_COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#06B6D4", "#F59E0B"];
const HUB_DURS = [5, 4.5, 5.5, 5, 5.5];
const CROSS_PAIRS: [number, number][] = [[0, 1], [1, 2], [2, 4], [4, 3], [3, 0]];
const CROSS_CURVES = [0.15, 0.15, -0.1, 0.08, -0.1];
const CROSS_DURS = [6, 6.5, 7, 6, 5.5];
const CROSS_COLOR = "#818CF8";

/* initial hub paths (tool → tool, star pattern — no center accumulation) */
const HUB: { d: string; dur: number; color: string }[] = [
  { d: qPath(14, 68, 50, 86, 0.12), dur: 5, color: "#3B82F6" },     // GEO → SnapGene
  { d: qPath(32, 22, 68, 22, 0.06), dur: 4.5, color: "#8B5CF6" },   // Seurat → ProjecTILs
  { d: qPath(50, 86, 86, 68, -0.12), dur: 5.5, color: "#10B981" },  // SnapGene → scRepertoire
  { d: qPath(68, 22, 14, 68, 0.1), dur: 5, color: "#06B6D4" },      // ProjecTILs → GEO
  { d: qPath(86, 68, 32, 22, -0.1), dur: 5.5, color: "#F59E0B" },   // scRepertoire → Seurat
];

/* initial cross paths (adjacent tools) */
const CROSS: { d: string; dur: number; color: string }[] = [
  { d: qPath(14, 68, 32, 22, 0.15), dur: 6, color: CROSS_COLOR },
  { d: qPath(32, 22, 50, 86, 0.15), dur: 6.5, color: CROSS_COLOR },
  { d: qPath(50, 86, 86, 68, -0.1), dur: 7, color: CROSS_COLOR },
  { d: qPath(86, 68, 68, 22, 0.08), dur: 6, color: CROSS_COLOR },
  { d: qPath(68, 22, 14, 68, -0.1), dur: 5.5, color: CROSS_COLOR },
];

const CONNECTIONS = [...HUB, ...CROSS];

/* dendrite branches — from spread positions */
const DENDRITES: string[] = [
  // GEO (14,68)
  qPath(14, 68, 6, 62, -0.15),
  qPath(14, 68, 8, 74, 0.12),
  qPath(6, 62, 2, 56, -0.1),
  // Seurat (32,22)
  qPath(32, 22, 24, 16, -0.12),
  qPath(32, 22, 26, 28, 0.12),
  qPath(24, 16, 18, 10, -0.08),
  // SnapGene (50,86)
  qPath(50, 86, 44, 92, -0.12),
  qPath(50, 86, 56, 92, 0.12),
  qPath(44, 92, 40, 97, -0.08),
  // ProjecTILs (68,22)
  qPath(68, 22, 76, 16, 0.12),
  qPath(68, 22, 74, 28, -0.15),
  qPath(76, 16, 82, 10, 0.08),
  // scRepertoire (86,68)
  qPath(86, 68, 94, 62, 0.15),
  qPath(86, 68, 92, 74, -0.12),
  qPath(94, 62, 98, 56, 0.08),
  // Center soma
  qPath(50, 48, 42, 40, 0.1),
  qPath(50, 48, 58, 40, -0.08),
  qPath(50, 48, 44, 56, -0.1),
  qPath(50, 48, 56, 56, 0.08),
  qPath(50, 48, 48, 38, 0.06),
  qPath(50, 48, 52, 58, -0.06),
];

/* faint interior mesh — neural pathways */
const FAINT: string[] = [
  // Left hemisphere
  qPath(26, 28, 36, 24, 0.04),
  qPath(36, 24, 44, 34, -0.03),
  qPath(22, 44, 32, 48, 0.05),
  qPath(32, 48, 40, 42, -0.04),
  qPath(20, 56, 30, 52, 0.03),
  qPath(30, 52, 38, 58, -0.04),
  qPath(26, 68, 34, 62, -0.03),
  // Right hemisphere
  qPath(74, 28, 64, 24, -0.04),
  qPath(78, 40, 68, 36, 0.03),
  qPath(76, 56, 66, 52, -0.05),
  qPath(66, 52, 58, 46, 0.04),
  qPath(74, 68, 64, 62, 0.03),
  qPath(64, 62, 56, 58, -0.04),
  qPath(72, 74, 62, 68, -0.03),
  // Cross-hemisphere (bridging fissure)
  qPath(38, 38, 50, 48, 0.04),
  qPath(50, 48, 62, 38, -0.04),
  qPath(38, 58, 50, 48, -0.03),
  qPath(50, 48, 62, 58, 0.03),
  qPath(34, 44, 46, 42, 0.02),
  qPath(54, 42, 66, 44, -0.02),
];

/* synaptic junction dots */
const DOTS: { x: number; y: number; r: number }[] = [
  // Brain outline
  { x: 30, y: 10, r: 0.22 }, { x: 60, y: 8, r: 0.2 },
  { x: 86, y: 30, r: 0.24 }, { x: 87, y: 58, r: 0.22 },
  { x: 75, y: 84, r: 0.2 },  { x: 35, y: 86, r: 0.22 },
  { x: 13, y: 58, r: 0.24 }, { x: 14, y: 30, r: 0.2 },
  // Central fissure
  { x: 50, y: 14, r: 0.26 }, { x: 50, y: 32, r: 0.22 },
  { x: 50, y: 60, r: 0.22 }, { x: 50, y: 76, r: 0.24 },
  // Left hemisphere interior
  { x: 26, y: 28, r: 0.22 }, { x: 32, y: 48, r: 0.2 },
  { x: 30, y: 52, r: 0.18 }, { x: 38, y: 58, r: 0.24 },
  { x: 34, y: 62, r: 0.2 },  { x: 22, y: 44, r: 0.18 },
  { x: 40, y: 42, r: 0.22 },
  // Right hemisphere interior
  { x: 74, y: 28, r: 0.22 }, { x: 68, y: 36, r: 0.2 },
  { x: 66, y: 52, r: 0.22 }, { x: 64, y: 62, r: 0.18 },
  { x: 74, y: 68, r: 0.2 },  { x: 78, y: 40, r: 0.22 },
  { x: 58, y: 46, r: 0.2 },
  // Dendrite tips
  { x: 16, y: 26, r: 0.16 }, { x: 26, y: 46, r: 0.18 },
  { x: 36, y: 6, r: 0.16 },  { x: 84, y: 26, r: 0.16 },
  { x: 22, y: 84, r: 0.16 }, { x: 78, y: 84, r: 0.16 },
  // Near center
  { x: 42, y: 40, r: 0.24 }, { x: 58, y: 40, r: 0.24 },
  { x: 44, y: 56, r: 0.22 }, { x: 56, y: 56, r: 0.22 },
  { x: 48, y: 38, r: 0.2 },  { x: 52, y: 58, r: 0.2 },
];

/* target positions — even pentagon (circle) around Cortex hub on scroll
 * Ordered to minimise travel distance from each node's spread position */
const TARGETS_DESKTOP = [
  { x: 20, y: 40 },  // GEO (14,68) → upper-left
  { x: 50, y: 23 },  // Seurat (24,22) → top center (lowered to clear sticky nav)
  { x: 31, y: 76 },  // SnapGene (50,86) → lower-left
  { x: 80, y: 40 },  // ProjecTILs (76,22) → upper-right
  { x: 69, y: 76 },  // scRep (86,68) → lower-right
];

/* Mobile: tighter pentagon, slightly lower to clear navbar, smaller overall */
const TARGETS_MOBILE = [
  { x: 24, y: 42 },  // GEO → upper-left (closer to center)
  { x: 50, y: 27 },  // Seurat → top center (pushed down from 18 to clear navbar)
  { x: 34, y: 72 },  // SnapGene → lower-left (closer)
  { x: 76, y: 42 },  // ProjecTILs → upper-right (closer)
  { x: 66, y: 72 },  // scRep → lower-right (closer)
];

/* ================================================================== */
/*  Helpers                                                             */
/* ================================================================== */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeIO = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* ================================================================== */
/*  Component                                                           */
/* ================================================================== */

export default function HeroNetwork() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const networkRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const coreRef = useRef<HTMLDivElement>(null);
  const expandLabelRef = useRef<HTMLDivElement>(null);
  const decoRef = useRef<SVGGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const animateScrollRef = useRef<(targetY: number, duration: number) => void>(() => {});

  /* ---- scroll-driven animation + snap ---- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const starts = TOOLS.map((t) => ({ x: t.px, y: t.py }));

    /* ---- cached geometry (avoid getBoundingClientRect in scroll) ---- */
    let sTop = 0;
    let sDist = 0;
    let cW = 0;
    let cH = 0;
    let isMobile = false;

    const measure = () => {
      sTop = section.offsetTop;
      sDist = section.offsetHeight - window.innerHeight;
      const container = networkRef.current?.parentElement;
      if (container) {
        cW = container.offsetWidth;
        cH = container.offsetHeight;
      }
      isMobile = window.innerWidth < 768;
    };
    measure();
    window.addEventListener("resize", measure);

    let snapTimer: ReturnType<typeof setTimeout> | null = null;
    let isSnapping = false;
    let isProgrammaticScroll = false;
    let rafId = 0;
    let prevPointerEvents = "auto";
    let isTouching = false;

    /* apply visual state — transform & opacity only (compositor-friendly) */
    const applyProgress = (p: number) => {
      /* text + circle: fade out & scale down */
      const tp = easeIO(clamp01((p - 0.02) / 0.35));
      if (textRef.current) {
        textRef.current.style.opacity = String(1 - tp);
        textRef.current.style.transform = `translateY(${-tp * 40}px) scale(${1 - tp * 0.15})`;
        const pe = tp > 0.5 ? "none" : "auto";
        if (pe !== prevPointerEvents) {
          const inner = textRef.current.firstElementChild as HTMLElement | null;
          if (inner) inner.style.pointerEvents = pe;
          prevPointerEvents = pe;
        }
      }

      /* decorative SVG elements fade (brain outline, dendrites, dots, soma) */
      const sp = easeIO(clamp01((p - 0.05) / 0.45));
      if (decoRef.current) {
        decoRef.current.style.opacity = String(1 - sp);
      }

      /* nodes: converge toward core via transform (no left/top changes) */
      const targets = isMobile ? TARGETS_MOBILE : TARGETS_DESKTOP;
      const maxScale = isMobile ? 1.12 : 1.45;
      const np = easeIO(clamp01((p - 0.08) / 0.65));
      nodeRefs.current.forEach((el, i) => {
        if (!el) return;
        const dx = ((targets[i].x - starts[i].x) / 100) * cW * np;
        const dy = ((targets[i].y - starts[i].y) / 100) * cH * np;
        const s = lerp(1, maxScale, np);
        el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${s})`;

        const detail = el.querySelector("[data-detail]") as HTMLElement | null;
        if (detail) {
          detail.style.opacity = String(easeIO(clamp01((p - 0.4) / 0.35)));
        }
      });

      /* dynamic SVG connection paths — follow node movement */
      const curNodes = starts.map((s, i) => ({
        x: lerp(s.x, targets[i].x, np),
        y: lerp(s.y, targets[i].y, np),
      }));
      // Hub paths (tool → tool, star pattern): refs 0..4
      HUB_PAIRS.forEach(([a, b], i) => {
        const el = pathRefs.current[i];
        if (el) el.setAttribute("d", qPath(curNodes[a].x, curNodes[a].y, curNodes[b].x, curNodes[b].y, HUB_CURVES[i]));
      });
      // Cross paths (tool → tool): refs 5..9
      CROSS_PAIRS.forEach(([a, b], i) => {
        const el = pathRefs.current[5 + i];
        if (el) el.setAttribute("d", qPath(curNodes[a].x, curNodes[a].y, curNodes[b].x, curNodes[b].y, CROSS_CURVES[i]));
      });

      /* core: fade IN earlier — overlaps with node convergence */
      const cp = easeIO(clamp01((p - 0.55) / 0.25));
      const coreUpPx = 0;
      if (coreRef.current) {
        coreRef.current.style.opacity = String(cp);
        coreRef.current.style.transform = `translate(-50%, calc(-50% - ${coreUpPx}px))`;
      }

      /* "explore" label */
      const lp = easeIO(clamp01((p - 0.55) / 0.3));
      if (expandLabelRef.current) {
        expandLabelRef.current.style.opacity = String(lp);
        expandLabelRef.current.style.transform = `translateY(${(1 - lp) * 12}px)`;
      }
    };

    /* custom smooth scroll with controlled duration — lets the scroll-driven
       transition play out at a comfortable pace instead of the instant native jump */
    const animateScrollTo = (targetY: number, duration: number) => {
      const startY = window.scrollY;
      const delta = targetY - startY;
      if (Math.abs(delta) < 1) return;

      isProgrammaticScroll = true;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        /* ease-in-out cubic for a natural feel */
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        window.scrollTo(0, startY + delta * eased);

        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          /* give the snap-logic time to see the final position before re-enabling */
          setTimeout(() => { isProgrammaticScroll = false; }, 200);
        }
      };
      requestAnimationFrame(step);
    };
    animateScrollRef.current = animateScrollTo;

    const onScroll = () => {
      if (rafId) return; /* already queued — skip until next frame */

      rafId = requestAnimationFrame(() => {
        rafId = 0;
        if (sDist <= 0) return;

        const scrolled = Math.max(0, window.scrollY - sTop);
        const raw = clamp01(scrolled / sDist);
        applyProgress(raw);

        /* snap logic — disabled during programmatic scroll or active touch */
        if (isSnapping || isProgrammaticScroll || isTouching) return;
        if (snapTimer) clearTimeout(snapTimer);
        const snapDelay = isMobile ? 350 : 90;
        snapTimer = setTimeout(() => {
          if (isTouching) return; /* re-check — user may have started touching again */
          const s2 = Math.max(0, window.scrollY - sTop);
          const p2 = clamp01(s2 / sDist);
          /* snap if not already at a pole — any in-between position resolves */
          if (p2 > 0.01 && p2 < 0.99) {
            isSnapping = true;
            const snapTarget = p2 >= 0.3 ? 1 : 0;
            const targetY = sTop + snapTarget * sDist;
            if (isMobile) {
              /* use custom smooth scroll on mobile — native scrollTo fights touch inertia */
              animateScrollTo(targetY, 600);
              setTimeout(() => { isSnapping = false; }, 700);
            } else {
              window.scrollTo({ top: targetY, behavior: "smooth" });
              setTimeout(() => { isSnapping = false; }, 550);
            }
          }
        }, snapDelay);
      });
    };

    /* touch tracking — prevent snap from fighting touch inertia on mobile */
    const onTouchStart = () => {
      isTouching = true;
      if (snapTimer) { clearTimeout(snapTimer); snapTimer = null; }
    };
    const onTouchEnd = () => { isTouching = false; };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    applyProgress(0);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      if (snapTimer) clearTimeout(snapTimer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  /* ---- mouse parallax (desktop) ---- */
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
        const nx = ((e.clientX - r.left) / r.width - 0.5) * 8;
        const ny = ((e.clientY - r.top) / r.height - 0.5) * 5;
        el.style.transform = `translate(${nx}px, ${ny}px)`;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (mRaf) cancelAnimationFrame(mRaf);
    };
  }, []);

  const selectedToolData = TOOLS.find((t) => t.id === selectedTool);

  /* ================================================================ */
  /*  Render                                                            */
  /* ================================================================ */

  return (
    <section ref={sectionRef} id="tools" className="relative h-[140vh] -mt-16">
      <div className="relative sticky top-0 h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* soft bg orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[20%] left-[16%] w-[480px] h-[480px] rounded-full bg-blue-500/10 blur-[100px]" />
          <div className="absolute top-[28%] right-[14%] w-[420px] h-[420px] rounded-full bg-violet-500/10 blur-[100px]" />
          <div className="absolute bottom-[18%] left-[32%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px]" />
        </div>

        <div className="relative z-10 h-full block">

          {/* ========= HERO TEXT ========= */}
          <div
            ref={textRef}
            className="absolute z-40 inset-0 flex items-center justify-center will-change-[transform,opacity] pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="relative max-w-lg mx-auto text-center pointer-events-auto"
            >

              <div className="relative z-10 md:flex md:flex-col md:justify-center md:h-[460px] lg:h-[500px]">
                <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight leading-[1.15] text-slate-100 mb-3">
                  Supercharge{" "}
                  <span className="gradient-text">Scientific Discovery</span>
                </h1>

                <p className="text-sm md:text-[15px] text-slate-300 mb-5 leading-relaxed max-w-[340px] mx-auto">
                  Science-native AI integrating your knowledge, constraints, and
                  the full research corpus.
                </p>

                <div className="flex justify-center mt-2">
                  <button
                    onClick={() => {
                      const section = sectionRef.current;
                      if (section) {
                        animateScrollRef.current(
                          section.offsetTop + section.offsetHeight - window.innerHeight,
                          1400,
                        );
                      }
                    }}
                    className="group flex items-center justify-center h-11 w-11 rounded-full border border-slate-400/40 bg-slate-900/80 text-slate-100 shadow-lg shadow-slate-950/40 transition-all duration-300 hover:border-slate-200/70 hover:bg-slate-900/80 hover:shadow-xl active:scale-95"
                    aria-label="Scroll to explore tools"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* expand label — now integrated into center core element */}
          <div ref={expandLabelRef} className="hidden" />

          {/* ========= NETWORK ========= */}
          <div className="absolute inset-0 z-[45] pointer-events-none">
            <div
              ref={networkRef}
              className="absolute inset-0 transition-transform duration-[400ms] ease-out will-change-transform"
            >
              {/* ---------- SVG — brain network ---------- */}
              <svg
                ref={svgRef}
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                fill="none"
                preserveAspectRatio="none"
              >
                {/* ---- decorative group — fades on scroll ---- */}
                <g ref={decoRef} style={{ willChange: "opacity" }}>
                  {/* brain silhouette outline */}
                  {BRAIN_OUTLINE.map((d, i) => (
                    <path
                      key={`bo-${i}`}
                      d={d}
                      stroke="rgba(148,163,184,0.045)"
                      strokeWidth="0.15"
                      fill="none"
                    />
                  ))}

                  {/* dendrite branches */}
                  {DENDRITES.map((d, i) => (
                    <path
                      key={`dn-${i}`}
                      d={d}
                      stroke="rgba(148,163,184,0.055)"
                      strokeWidth="0.06"
                      fill="none"
                    />
                  ))}

                  {/* faint interior mesh */}
                  {FAINT.map((d, i) => (
                    <path
                      key={`fl-${i}`}
                      d={d}
                      stroke="rgba(148,163,184,0.05)"
                      strokeWidth="0.08"
                      fill="none"
                    />
                  ))}

                  {/* synaptic junction dots */}
                  {DOTS.map((dot, i) => (
                    <circle
                      key={`dot-${i}`}
                      cx={dot.x}
                      cy={dot.y}
                      r={dot.r}
                      className="dot-pulse"
                      style={{ animationDelay: `${i * 0.3}s` }}
                      fill="rgba(148,163,184,0.2)"
                    />
                  ))}

                  {/* center soma — concentric neural rings */}
                  <circle cx={CTR.x} cy={CTR.y} r="8" fill="rgba(99,102,241,0.015)" />
                  <circle cx={CTR.x} cy={CTR.y} r="5.5" fill="rgba(99,102,241,0.025)" />
                  <circle cx={CTR.x} cy={CTR.y} r="3.5" fill="rgba(99,102,241,0.035)" />
                  <circle cx={CTR.x} cy={CTR.y} r="1.8" fill="rgba(99,102,241,0.05)" />

                  {/* neural activity pulse rings */}
                  <circle
                    cx={CTR.x} cy={CTR.y} r="6"
                    fill="none" stroke="rgba(99,102,241,0.05)"
                    strokeWidth="0.08" className="dot-pulse"
                  />
                  <circle
                    cx={CTR.x} cy={CTR.y} r="10"
                    fill="none" stroke="rgba(99,102,241,0.03)"
                    strokeWidth="0.06" className="dot-pulse"
                    style={{ animationDelay: "2s" }}
                  />
                  <circle
                    cx={CTR.x} cy={CTR.y} r="14"
                    fill="none" stroke="rgba(99,102,241,0.018)"
                    strokeWidth="0.05" className="dot-pulse"
                    style={{ animationDelay: "3.5s" }}
                  />
                </g>

                {/* ---- connection paths — stay visible, update dynamically ---- */}
                {CONNECTIONS.map((c, i) => (
                  <path
                    key={`cb-${i}`}
                    ref={(el) => { pathRefs.current[i] = el; }}
                    id={`conn-${i}`}
                    d={c.d}
                    stroke="rgba(148,163,184,0.09)"
                    strokeWidth="0.12"
                    fill="none"
                  />
                ))}

                {/* animated flow dots (neural impulses) */}
                {CONNECTIONS.map((c, i) => (
                  <g key={`cf-${i}`}>
                    <circle r="0.9" opacity="0.1" fill={c.color}>
                      <animateMotion dur={`${c.dur}s`} repeatCount="indefinite">
                        <mpath href={`#conn-${i}`} />
                      </animateMotion>
                    </circle>
                    <circle r="0.28" opacity="0.5" fill={c.color}>
                      <animateMotion dur={`${c.dur}s`} repeatCount="indefinite">
                        <mpath href={`#conn-${i}`} />
                      </animateMotion>
                    </circle>
                    <circle r="0.18" opacity="0.35" fill={c.color}>
                      <animateMotion
                        dur={`${c.dur}s`}
                        begin={`-${c.dur * 0.45}s`}
                        repeatCount="indefinite"
                      >
                        <mpath href={`#conn-${i}`} />
                      </animateMotion>
                    </circle>
                  </g>
                ))}
              </svg>

              {/* ---------- CENTER "EXPLORE TOOLS" LABEL ---------- */}
              <div
                ref={coreRef}
                className="absolute z-20 will-change-[transform,opacity] opacity-0 pointer-events-none"
                style={{
                  left: `${CTR.x}%`,
                  top: `${CTR.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <h2 className="text-lg md:text-4xl font-bold tracking-tight text-slate-100 whitespace-nowrap select-none">
                    Explore Tools
                  </h2>
                  <p className="text-[11px] md:text-base text-slate-300 whitespace-nowrap select-none">
                    Tap any node to learn more
                  </p>
                </div>
              </div>

              {/* ---------- TOOL NODES ---------- */}
              {TOOLS.map((tool, i) => (
                <div
                  key={tool.id}
                  ref={(el) => {
                    nodeRefs.current[i] = el;
                  }}
                  className="absolute z-30 will-change-transform"
                  style={{
                    left: `${tool.px}%`,
                    top: `${tool.py}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.55,
                      delay: 0.4 + i * 0.08,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedTool(tool.id)}
                    className="flex flex-col items-center gap-1.5 group outline-none pointer-events-auto"
                  >
                    <div
                      className="w-[52px] h-[52px] md:w-[88px] md:h-[88px] rounded-full bg-slate-900/70 glass border-[2.5px] [border-color:var(--tool-border)] flex items-center justify-center transition-[border-color,box-shadow] duration-300 group-hover:[border-color:var(--tool-border-hover)] group-hover:shadow-lg group-hover:shadow-slate-950/30"
                      style={{
                        boxShadow: `0 4px 24px ${tool.color}15`,
                        ["--tool-border" as string]: `${tool.color}55`,
                        ["--tool-border-hover" as string]: `${tool.color}AA`,
                      }}
                    >
                      <span className="text-[18px] md:text-[32px] select-none">
                        {tool.icon}
                      </span>
                    </div>
                    <span
                      className="text-[9px] md:text-[13px] font-semibold tracking-tight whitespace-nowrap select-none"
                      style={{ color: tool.color }}
                    >
                      {tool.name}
                    </span>
                    <span
                      data-detail
                      className="text-[10px] text-slate-300 font-medium whitespace-nowrap opacity-0"
                    >
                      {tool.fullName}
                    </span>
                  </motion.button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* modal */}
      <AnimatePresence>
        {selectedTool && selectedToolData && (
          <ToolModal
            tool={selectedToolData}
            onClose={() => setSelectedTool(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
