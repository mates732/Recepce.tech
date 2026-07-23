"use client";

import { motion } from "framer-motion";
import { typography, colors } from "@/design/tokens";
import { fadeIn, transitions, viewportConfig } from "@/design/animations";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <motion.span
      className={`block font-body ${className ?? ""}`}
      style={{
        fontSize: typography.size.micro,
        letterSpacing: typography.letterSpacing.mega,
        textTransform: "uppercase",
        color: colors.faint,
      }}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      variants={fadeIn}
      transition={transitions.slower}
    >
      {children}
    </motion.span>
  );
}
