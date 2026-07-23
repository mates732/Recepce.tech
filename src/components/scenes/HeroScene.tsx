"use client";

import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { colors, typography, duration, ease } from "@/design/tokens";
import { motion } from "framer-motion";
import type { RefObject } from "react";

interface Props {
  locale: Locale;
  containerRef: RefObject<HTMLDivElement | null>;
  matyasRef: RefObject<HTMLSpanElement | null>;
  vojanRef: RefObject<HTMLSpanElement | null>;
  subtitleRef: RefObject<HTMLParagraphElement | null>;
  ctaRef: RefObject<HTMLAnchorElement | null>;
}

export default function HeroScene({
  locale,
  containerRef,
  matyasRef,
  vojanRef,
  subtitleRef,
  ctaRef,
}: Props) {
  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex flex-col items-center justify-center text-center"
      style={{
        zIndex: 4,
        padding: "clamp(32px, 6vw, 80px)",
        willChange: "opacity",
      }}
    >
      <h1
        className="mx-auto font-heading"
        style={{
          fontSize: typography.size.display,
          lineHeight: "1.02",
          letterSpacing: typography.letterSpacing.tight,
          fontWeight: typography.weight.medium,
          maxWidth: "10ch",
          marginBottom: "clamp(20px, 3vh, 36px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.3,
            ease: [0.22, 0.8, 0.2, 1],
          }}
        >
          <span
            ref={matyasRef}
            className="block"
            style={{ willChange: "transform" }}
          >
            {t(locale, "home.title")}
          </span>
        </motion.div>

        <motion.div
          style={{ marginTop: "clamp(4px, 0.6vh, 8px)" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.45,
            ease: [0.22, 0.8, 0.2, 1],
          }}
        >
          <span
            ref={vojanRef}
            className="block"
            style={{
              willChange: "transform",
              background: "linear-gradient(135deg, #FAFAFA, #888888)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t(locale, "home.titleLine1")}
          </span>
        </motion.div>
      </h1>

      <motion.p
        ref={subtitleRef}
        className="mx-auto font-body"
        style={{
          fontSize: typography.size.bodyLg,
          lineHeight: typography.lineHeight.relaxed,
          letterSpacing: typography.letterSpacing.normal,
          color: colors.secondary,
          maxWidth: "40ch",
          marginBottom: "clamp(32px, 5vh, 56px)",
          willChange: "opacity, filter, transform",
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.6,
          ease: [0.22, 0.8, 0.2, 1],
        }}
      >
        {t(locale, "home.subtitle")}
      </motion.p>

      <motion.a
        ref={ctaRef}
        href={`/${locale}#work`}
          className="inline-flex items-center gap-3 font-body"
          style={{
            color: "rgba(160,160,160,0.6)",
            cursor: "pointer",
            transition: `color ${duration.slow} ${ease.default}, text-shadow ${duration.slow} ${ease.default}`,
          willChange: "opacity, filter, transform",
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.75,
          ease: [0.22, 0.8, 0.2, 1],
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = colors.primary;
          e.currentTarget.style.textShadow =
            "0 0 24px rgba(102,102,102,0.14)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(160,160,160,0.6)";
          e.currentTarget.style.textShadow = "none";
        }}
      >
        <span
          className="font-body"
          style={{
            fontSize: "14px",
            fontWeight: typography.weight.medium,
            letterSpacing: typography.letterSpacing.normal,
          }}
        >
          {t(locale, "nav.work")}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M7 3v8M3 7l4 4 4-4" />
        </svg>
      </motion.a>
    </div>
  );
}
