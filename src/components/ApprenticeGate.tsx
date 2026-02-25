"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeroNetwork from "@/components/HeroNetwork";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ApprenticeInterim from "@/components/ApprenticeInterim";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

const APPRENTICE_LOADING_MS = 1100;

export default function ApprenticeGate() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setIsLoading(false),
      APPRENTICE_LOADING_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="interim"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeIn" }}
          className="min-h-screen flex flex-col"
        >
          <ApprenticeInterim />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <PageTransition>
            <Navbar pageName="Apprentice" />
            <HeroNetwork />
            <Features />
            <Footer />
            <ScrollToTop />
          </PageTransition>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
