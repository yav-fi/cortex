"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Footer from "@/components/Footer";
import PathChooser from "@/components/PathChooser";
import HomeInterim from "@/components/HomeInterim";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

const HOME_LOADING_MS = 700;

export default function HomeGate() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), HOME_LOADING_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="interim"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeIn" }}
          className="flex-1 flex flex-col"
        >
          <HomeInterim />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex-1 flex flex-col"
        >
          <PageTransition className="flex-1 flex flex-col">
            <Navbar />
            <PathChooser />
            <Footer />
          </PageTransition>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
