"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTransition } from "@/components/PageTransition";

const PAGE_ROUTES: Record<string, string> = {
  Apprentice: "/apprentice",
  Guild: "/guild",
};

interface NavbarProps {
  pageName?: string;
}

export default function Navbar({ pageName }: NavbarProps) {
  const { navigateTo } = usePageTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems =
    pageName === "Apprentice"
      ? ["Guild"]
      : pageName === "Guild"
        ? ["Apprentice"]
        : ["Apprentice", "Guild"];

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
      className={`sticky top-0 z-50 font-display transition-[border-color,box-shadow,background-color] duration-300 ${
        scrolled
          ? "bg-slate-950/75 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,6,23,0.55)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="inline-flex items-baseline gap-2">
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("/");
            }}
            className="cursor-pointer font-bold text-[17px] tracking-tight text-slate-100"
          >
            Cortex
          </Link>
          {!!pageName && (
            <span className="inline-flex items-baseline text-[16px] font-normal tracking-tight text-white/95">
              <span className="text-white/75">/</span>
              <span className="ml-2">{pageName}</span>
            </span>
          )}
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const href = PAGE_ROUTES[item];
            if (href) {
              return (
                <Link
                  key={item}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(href);
                  }}
                  className="text-[13px] font-medium text-slate-300 hover:text-slate-100 transition-colors"
                >
                  {item}
                </Link>
              );
            }
            return (
              <span
                key={item}
                className="text-[13px] font-medium text-slate-300 select-none"
              >
                {item}
              </span>
            );
          })}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-slate-300 hover:text-slate-100 transition-colors"
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
            className="md:hidden overflow-hidden bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 shadow-[0_20px_40px_rgba(2,6,23,0.65)]"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navItems.map((item) => {
                const href = PAGE_ROUTES[item];
                if (href) {
                  return (
                    <Link
                      key={item}
                      href={href}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(false);
                        navigateTo(href);
                      }}
                      className="text-left text-[14px] font-medium text-slate-300 py-2.5 hover:text-slate-100 transition-colors"
                    >
                      {item}
                    </Link>
                  );
                }
                return (
                  <span
                    key={item}
                    className="text-left text-[14px] font-medium text-slate-300 py-2.5"
                  >
                    {item}
                  </span>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
