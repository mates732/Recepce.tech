"use client";

import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { typography, colors, spacing } from "@/design/tokens";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, staggerContainer, staggerItem, transitions, viewportConfig } from "@/design/animations";

interface Props {
  locale: Locale;
}

const sections = [
  { labelKey: "about.builds.label" as const, textKey: "about.builds.text" as const },
  { labelKey: "about.philosophy.label" as const, textKey: "about.philosophy.text" as const },
  { labelKey: "about.focus.label" as const, textKey: "about.focus.text" as const },
];

export default function About({ locale }: Props) {
  return (
    <section
      id="about"
      className="relative w-full"
      style={{
        padding: `clamp(80px, 12vw, 160px) ${spacing.section.px}`,
      }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: "720px" }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={staggerContainer}
        >
          {/* ── Label ─────────────────────────────────────────── */}
          <motion.span
            variants={staggerItem}
            className="block font-body mb-16"
            style={{
              fontSize: typography.size.micro,
              letterSpacing: typography.letterSpacing.mega,
              textTransform: "uppercase",
              color: colors.faint,
            }}
          >
            {t(locale, "about.label")}
          </motion.span>

          {/* ── Name (hero heading) ───────────────────────────── */}
          <motion.h1
            variants={staggerItem}
            className="font-heading mb-4"
            style={{
              fontSize: "clamp(40px, 7vw, 80px)",
              lineHeight: typography.lineHeight.tight,
              letterSpacing: typography.letterSpacing.tight,
              fontWeight: typography.weight.medium,
              color: colors.primary,
            }}
          >
            {t(locale, "about.name")}
          </motion.h1>

          {/* ── Intro ─────────────────────────────────────────── */}
          <motion.p
            variants={staggerItem}
            className="font-body mb-20"
            style={{
              fontSize: typography.size.bodyLg,
              lineHeight: typography.lineHeight.relaxed,
              color: colors.secondary,
            }}
          >
            {t(locale, "about.intro")}
          </motion.p>

          {/* ── Content blocks ────────────────────────────────── */}
          {sections.map((section, i) => (
            <motion.div
              key={section.labelKey}
              variants={staggerItem}
              style={{
                paddingTop: i === 0 ? 0 : "clamp(32px, 5vw, 56px)",
                borderTop: i === 0 ? "none" : `1px solid ${colors.border}`,
              }}
            >
              <span
                className="block font-mono mb-5"
                style={{
                  fontSize: "9px",
                  letterSpacing: typography.letterSpacing.mega,
                  textTransform: "uppercase",
                  color: colors.faint,
                }}
              >
                {t(locale, section.labelKey)}
              </span>

              <p
                className="font-body"
                style={{
                  fontSize: typography.size.bodyLg,
                  lineHeight: typography.lineHeight.relaxed,
                  color: colors.secondary,
                  maxWidth: "48ch",
                }}
              >
                {t(locale, section.textKey)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
