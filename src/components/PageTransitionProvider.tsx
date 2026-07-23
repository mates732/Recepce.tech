"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { type ReactNode, useEffect, useRef, useState } from "react";

interface Props {
  children: ReactNode;
}

export default function PageTransitionProvider({ children }: Props) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const first = useRef(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setMounted(true);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  const panelDuration = reducedMotion ? 0 : 0.55;
  const ease = [0.76, 0, 0.24, 1] as const;

  return (
    <div className="relative" style={{ minHeight: "inherit" }}>
      <AnimatePresence>
        {mounted && (
          <motion.div
            key={`overlay-${pathname}`}
            className="fixed pointer-events-none"
            style={{
              left: 0,
              top: 0,
              bottom: 0,
              width: "100vw",
              zIndex: 100,
              background:
                "linear-gradient(135deg, #0a0a0a 0%, #111111 40%, #0d0d0d 100%)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: ["0%", "100%"] }}
            transition={{
              duration: panelDuration * 2,
              times: [0.45, 1],
              ease,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.02) 50%, transparent 100%)",
                opacity: 0.5,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={first.current || reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={{
            duration: reducedMotion ? 0 : 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
