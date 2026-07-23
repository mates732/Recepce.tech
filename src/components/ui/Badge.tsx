"use client";

import { motion } from "framer-motion";
import { typography, colors, radius } from "@/design/tokens";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "violet" | "muted";
  pulse?: boolean;
  className?: string;
}

export default function Badge({ children, variant = "default", pulse, className }: BadgeProps) {
  const variantStyles = {
    default: {
      color: colors.muted,
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${colors.border}`,
    },
    accent: {
      color: colors.accentMuted,
      background: colors.accentFaint,
      border: `1px solid ${colors.borderHi}`,
    },
    violet: {
      color: colors.violetMuted,
      background: colors.violetFaint,
      border: `1px solid ${colors.borderViolet}`,
    },
    muted: {
      color: "rgba(160,160,160,0.5)",
      background: "rgba(255,255,255,0.03)",
      border: `1px solid rgba(255,255,255,0.06)`,
    },
  };

  const style = variantStyles[variant];

  return (
    <motion.span
      className={`inline-flex items-center gap-2 font-mono ${className ?? ""}`}
      style={{
        fontSize: "9px",
        letterSpacing: typography.letterSpacing.wider,
        textTransform: "uppercase",
        padding: "4px 10px",
        borderRadius: radius.full,
        ...style,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, ease: [0.22, 0.8, 0.2, 1] }}
    >
      {pulse && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: colors.accent,
            animation: "pulse-dot 2.8s ease-in-out infinite",
          }}
        />
      )}
      {children}
    </motion.span>
  );
}
