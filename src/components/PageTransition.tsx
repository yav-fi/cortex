"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const EXIT_S = 0.4;

interface PageTransitionCtx {
  navigateTo: (href: string) => void;
  isLeaving: boolean;
}

const Ctx = createContext<PageTransitionCtx>({
  navigateTo: () => {},
  isLeaving: false,
});

export function usePageTransition() {
  return useContext(Ctx);
}

export default function PageTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const [target, setTarget] = useState<string | null>(null);

  const navigateTo = useCallback(
    (href: string) => {
      if (target) return;
      if (href === window.location.pathname) return;
      setTarget(href);
    },
    [target],
  );

  useEffect(() => {
    if (!target) return;
    const timer = setTimeout(() => router.push(target), EXIT_S * 1000);
    return () => clearTimeout(timer);
  }, [target, router]);

  return (
    <Ctx.Provider value={{ navigateTo, isLeaving: !!target }}>
      <motion.div
        animate={{
          opacity: target ? 0 : 1,
          y: target ? 6 : 0,
        }}
        transition={{ duration: EXIT_S, ease: "easeInOut" }}
        className={className}
      >
        {children}
      </motion.div>
    </Ctx.Provider>
  );
}
