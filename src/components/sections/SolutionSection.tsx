"use client";

import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { colors, typography, spacing, radius, easing, duration } from "@/design/tokens";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, viewportConfig } from "@/design/animations";
import { useCardTilt } from "@/hooks/useCardTilt";

interface Props {
  locale: Locale;
}

const items = [
  { titleKey: "solution.item1Title" as const, descKey: "solution.item1Desc" as const },
  { titleKey: "solution.item2Title" as const, descKey: "solution.item2Desc" as const },
  { titleKey: "solution.item3Title" as const, descKey: "solution.item3Desc" as const },
];

function SolutionCard({ item, locale }: { item: (typeof items)[0]; locale: Locale }) {
  const { ref, style: tiltStyle, glareStyle, handleMouseMove, handleMouseLeave } = useCardTilt();

  return (
    <motion.div
      ref={ref}
      className="relative"
      style={{
        padding: "clamp(24px, 3vw, 32px)",
        background: "rgba(17,17,17,0.25)",
        border: `1px solid ${colors.border}`,
        borderLeft: `2px solid ${colors.accentMuted}`,
        borderRadius: radius.lg,
        ...tiltStyle,
        transition: "border-color 280ms cubic-bezier(0.22,1,0.36,1), background 280ms cubic-bezier(0.22,1,0.36,1)",
        willChange: "transform",
      }}
      variants={staggerItem}
      onMouseMove={handleMouseMove}
      onMouseLeave={(e) => {
        handleMouseLeave();
        e.currentTarget.style.borderColor = colors.border;
        e.currentTarget.style.background = "rgba(17,17,17,0.25)";
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
        e.currentTarget.style.background = "rgba(17,17,17,0.4)";
      }}
    >
      <div style={glareStyle} />

      <div
        className="mb-5 icon-wrap"
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.full,
          background: colors.violetFaint,
          border: `1px solid ${colors.borderViolet}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 250ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="4" fill={colors.accent} opacity={0.6} />
        </svg>
      </div>

      <h3
        className="font-heading mb-3"
        style={{
          fontSize: typography.size.h4,
          lineHeight: typography.lineHeight.snug,
          fontWeight: typography.weight.medium,
          color: colors.primary,
        }}
      >
        {t(locale, item.titleKey)}
      </h3>

      <p
        className="font-body"
        style={{
          fontSize: typography.size.bodySm,
          lineHeight: typography.lineHeight.relaxed,
          color: colors.secondary,
        }}
      >
        {t(locale, item.descKey)}
      </p>

      <style>{`.group:hover .icon-wrap, [class*="solution"]:hover .icon-wrap { transform: scale(1.04) rotate(2deg); }`}</style>
    </motion.div>
  );
}

export default function SolutionSection({ locale }: Props) {
  return (
    <section
      className="relative w-full"
      style={{ padding: `${spacing.section.py} ${spacing.section.px}` }}
    >
      <div className="mx-auto" style={{ maxWidth: spacing.container.maxWidth }}>
        <motion.span
          className="block font-body mb-12"
          style={{
            fontSize: typography.size.micro,
            letterSpacing: typography.letterSpacing.mega,
            textTransform: "uppercase",
            color: colors.faint,
          }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeInUp}
          transition={{ duration: duration.reveal / 1000, ease: easing.reveal }}
        >
          {t(locale, "solution.badge")}
        </motion.span>

        <motion.h2
          className="font-heading mb-6"
          style={{
            fontSize: typography.size.h2,
            lineHeight: typography.lineHeight.snug,
            letterSpacing: typography.letterSpacing.tight,
            fontWeight: typography.weight.medium,
            color: colors.primary,
          }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeInUp}
          transition={{ duration: duration.reveal / 1000, ease: easing.reveal, delay: 0.05 }}
        >
          {t(locale, "solution.title")}
        </motion.h2>

        <motion.p
          className="font-body mb-16"
          style={{
            fontSize: typography.size.body,
            lineHeight: typography.lineHeight.relaxed,
            color: colors.secondary,
            maxWidth: "50ch",
          }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeInUp}
          transition={{ duration: duration.reveal / 1000, ease: easing.reveal, delay: 0.1 }}
        >
          {t(locale, "solution.desc")}
        </motion.p>

        <motion.div
          className="solution-grid grid gap-6"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={staggerContainer}
        >
          {items.map((item, i) => (
            <SolutionCard key={i} item={item} locale={locale} />
          ))}
        </motion.div>
      </div>


    </section>
  );
}
