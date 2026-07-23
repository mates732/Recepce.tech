"use client";

import { forwardRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { typography, colors, duration, ease } from "@/design/tokens";

interface TextLinkProps {
  children: ReactNode;
  href: string;
  className?: string;
}

const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(
  ({ children, href, className }, ref) => {
    return (
      <motion.a
        ref={ref}
        href={href}
        className={`group inline-flex items-center gap-3 font-body ${className ?? ""}`}
        style={{
          fontSize: typography.size.body,
          fontWeight: typography.weight.medium,
          letterSpacing: typography.letterSpacing.normal,
          color: "rgba(160,160,160,0.6)",
          transition: `color ${duration.slow} ${ease.default}, text-shadow ${duration.slow} ${ease.default}`,
        }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: [0.22, 0.8, 0.2, 1] }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = colors.primary;
          e.currentTarget.style.textShadow = "0 0 24px rgba(102,102,102,0.14)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(160,160,160,0.6)";
          e.currentTarget.style.textShadow = "none";
        }}
      >
        <span>{children}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="transition-transform duration-500 ease-out will-change-transform group-hover:translate-x-1"
        >
          <path d="M3 7h8M7 3l4 4-4 4" />
        </svg>
      </motion.a>
    );
  }
);

TextLink.displayName = "TextLink";

export default TextLink;
