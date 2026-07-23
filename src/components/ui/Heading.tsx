"use client";

import { forwardRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { typography, colors } from "@/design/tokens";
import { fadeInUp, transitions, viewportConfig } from "@/design/animations";

interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
  gradient?: boolean;
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ children, level = 2, className, gradient }, ref) => {
    const Tag = `h${level}` as "h1" | "h2" | "h3";

    const sizeMap = {
      1: typography.size.h1,
      2: typography.size.h2,
      3: typography.size.h3,
    };

    const lineHeightMap = {
      1: typography.lineHeight.tight,
      2: typography.lineHeight.snug,
      3: typography.lineHeight.snug,
    };

    const style: React.CSSProperties = {
      fontFamily: typography.fontFamily.heading,
      fontSize: sizeMap[level],
      fontWeight: typography.weight.medium,
      lineHeight: lineHeightMap[level],
      letterSpacing: typography.letterSpacing.tight,
      color: colors.primary,
    };

    if (gradient) {
      style.background = "linear-gradient(135deg, #FAFAFA, #666666)";
      style.WebkitBackgroundClip = "text";
      style.WebkitTextFillColor = "transparent";
      style.backgroundClip = "text";
    }

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeInUp}
        transition={transitions.slow}
      >
        <Tag className={className} style={style}>
          {children}
        </Tag>
      </motion.div>
    );
  }
);

Heading.displayName = "Heading";

export default Heading;
