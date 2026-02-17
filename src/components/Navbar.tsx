"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        scrolled
          ? "bg-[color-mix(in_srgb,var(--bg-0)_76%,transparent)] backdrop-blur-xl shadow-[0_1px_0_0_var(--border-0)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-semibold text-[17px] tracking-tight text-[var(--text-0)]">
          Cortex
        </span>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-[13px] font-medium text-[var(--text-1)] hover:text-[var(--text-0)] transition-colors duration-200"
          >
            Platform
          </a>
          <a
            href="#investors"
            className="text-[13px] font-medium text-[var(--text-1)] hover:text-[var(--text-0)] transition-colors duration-200"
          >
            Investors
          </a>
          <button className="text-[13px] font-semibold px-5 py-2 rounded-full bg-[var(--surface-1)] text-[var(--text-0)] border border-[var(--border-0)] hover:bg-[color-mix(in_srgb,var(--surface-1)_85%,var(--accent-0)_15%)] transition-all duration-200 shadow-sm hover:shadow-[0_0_24px_-12px_var(--accent-0)]">
            Get Early Access
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-[var(--text-1)] hover:text-[var(--text-0)] transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {isOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-[color-mix(in_srgb,var(--surface-0)_92%,transparent)] backdrop-blur-md border-t border-[var(--border-0)] shadow-lg"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              <a
                href="#features"
                onClick={() => setIsOpen(false)}
                className="text-[14px] font-medium text-[var(--text-1)] hover:text-[var(--text-0)] transition-colors py-2.5"
              >
                Platform
              </a>
              <a
                href="#investors"
                onClick={() => setIsOpen(false)}
                className="text-[14px] font-medium text-[var(--text-1)] hover:text-[var(--text-0)] transition-colors py-2.5"
              >
                Investors
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-2 text-[13px] font-semibold px-5 py-2.5 rounded-full bg-[var(--surface-1)] text-[var(--text-0)] border border-[var(--border-0)] hover:bg-[color-mix(in_srgb,var(--surface-1)_85%,var(--accent-0)_15%)] transition-all duration-200 shadow-sm w-full"
              >
                Get Early Access
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
