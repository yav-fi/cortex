"use client";

import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-50 bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-semibold text-[17px] tracking-tight text-slate-900">
          Cortex
        </span>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors duration-200"
          >
            Platform
          </a>
          <a
            href="#investors"
            className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors duration-200"
          >
            Investors
          </a>
          <button className="text-[13px] font-semibold px-5 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow-md">
            Get Early Access
          </button>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 text-slate-600">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </motion.nav>
  );
}
