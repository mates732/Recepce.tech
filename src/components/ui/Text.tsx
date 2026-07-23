"use client";

import { forwardRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { typography, colors } from "@/design/tokens";
import { fadeInUp, transitions, viewportConfig } from "@/design/animations";

interface TextProps {
  children: ReactNode;
  size?: "lg" | "base" | "sm";
  color?: "primary" | "secondary" | "muted";
  maxWidth?: string;
  className?: string;
}

const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ children, size = "base", color = "secondary", maxWidth, className }, ref) => {
    const sizeMap = {
      lg: typography.size.bodyLg,
      base: typography.size.body,
      sm: typography.size.bodySm,
    };

    const colorMap = {
      primary: colors.primary,
      secondary: colors.secondary,
      muted: colors.muted,
    };

    return (
      <motion.p
        ref={ref}
        className={`font-body ${className ?? ""}`}
        style={{
          fontSize: sizeMap[size],
          lineHeight: typography.lineHeight.relaxed,
          letterSpacing: typography.letterSpacing.normal,
          color: colorMap[color],
          maxWidth,
        }}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeInUp}
        transition={transitions.slow}
      >
        {children}
      </motion.p>
    );
  }
);

Text.displayName = "Text";

export default Text;
