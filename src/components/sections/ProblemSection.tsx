"use client";

import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { colors, typography, spacing, radius } from "@/design/tokens";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import type { Variants } from "framer-motion";

export default function ProblemSection({ locale }: { locale: Locale }) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            duration: 0.7,
            delay: i * 0.12,
            ease: [0.22, 0.8, 0.2, 1],
          },
    }),
  };

  const stats = [
    { value: t(locale, "problem.stat1Value"), label: t(locale, "problem.stat1Label") },
    { value: t(locale, "problem.stat2Value"), label: t(locale, "problem.stat2Label") },
    { value: t(locale, "problem.stat3Value"), label: t(locale, "problem.stat3Label") },
  ];

  return (
    <section
      ref={ref}
      style={{
        padding: `${spacing.section.py} ${spacing.section.px}`,
      }}
    >
      <div
        style={{
          maxWidth: spacing.container.maxWidth,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: spacing.stack.xl,
        }}
      >
        <motion.span
          custom={0}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          style={{
            fontFamily: typography.fontFamily.mono,
            fontSize: typography.size.micro,
            letterSpacing: typography.letterSpacing.ultra,
            textTransform: "uppercase" as const,
            color: colors.muted,
            border: `1px solid ${colors.borderHi}`,
            padding: `${spacing.stack.sm} ${spacing.stack.md}`,
            borderRadius: radius.full,
          }}
        >
          {t(locale, "problem.badge").toUpperCase()}
        </motion.span>

        <motion.h2
          custom={1}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          style={{
            fontFamily: typography.fontFamily.heading,
            fontSize: typography.size.h2,
            lineHeight: typography.lineHeight.tight,
            letterSpacing: typography.letterSpacing.tight,
            fontWeight: typography.weight.bold,
            color: colors.primary,
          }}
        >
          {t(locale, "problem.title")}
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.muted})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t(locale, "problem.titleHighlight")}
          </span>
        </motion.h2>

        <motion.p
          custom={2}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          style={{
            fontSize: typography.size.bodyLg,
            lineHeight: typography.lineHeight.relaxed,
            color: colors.secondary,
            maxWidth: "50ch",
          }}
        >
          {t(locale, "problem.desc")}
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={4 + i}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={fadeUp}
              style={{
                background: colors.accentFaint,
                border: `1px solid ${colors.border}`,
                borderRadius: radius.lg,
                padding: spacing.stack.xl,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: spacing.stack.sm,
              }}
            >
              <span
                style={{
                  fontFamily: typography.fontFamily.heading,
                  fontSize: typography.size.h3,
                  fontWeight: typography.weight.bold,
                  color: colors.primary,
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: typography.size.bodySm,
                  color: colors.muted,
                }}
              >
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
