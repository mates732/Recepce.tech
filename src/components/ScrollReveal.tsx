"use client";

import { forwardRef, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { viewportConfig } from "@/design/animations";
import { easing, duration } from "@/design/tokens";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: "fade" | "fadeUp" | "fadeLeft" | "fadeRight" | "scale";
  delay?: number;
  className?: string;
}

const variants: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0, filter: "blur(4px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  fadeUp: {
    hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -24, filter: "blur(4px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)" },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 24, filter: "blur(4px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)" },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.96, filter: "blur(4px)" },
    visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
  },
};

const ScrollReveal = forwardRef<HTMLDivElement, ScrollRevealProps>(
  ({ children, variant = "fadeUp", delay = 0, className }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={variants[variant]}
        transition={{
          duration: duration.reveal / 1000,
          ease: easing.reveal,
          delay,
          filter: {
            duration: duration.reveal / 1000,
            ease: easing.reveal,
            delay,
          },
        }}
      >
        {children}
      </motion.div>
    );
  }
);

ScrollReveal.displayName = "ScrollReveal";

export default ScrollReveal;
