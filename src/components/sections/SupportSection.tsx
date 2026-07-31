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
  {
    titleKey: "support.item1Title" as const,
    descKey: "support.item1Desc" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    titleKey: "support.item2Title" as const,
    descKey: "support.item2Desc" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    titleKey: "support.item3Title" as const,
    descKey: "support.item3Desc" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

function SupportCard({ item, locale }: { item: (typeof items)[0]; locale: Locale }) {
  const { ref, style: tiltStyle, glareStyle, handleMouseMove, handleMouseLeave } = useCardTilt();

  return (
    <motion.div
      ref={ref}
      className="relative"
      style={{
        padding: "clamp(24px, 3vw, 32px)",
        background: "rgba(17,17,17,0.25)",
        border: `1px solid ${colors.border}`,
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
          width: 44,
          height: 44,
          borderRadius: radius.full,
          background: colors.violetFaint,
          border: `1px solid ${colors.borderViolet}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 250ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {item.icon}
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

      <style>{`.support-card:hover .icon-wrap { transform: scale(1.04) rotate(2deg); }`}</style>
    </motion.div>
  );
}

export default function SupportSection({ locale }: Props) {
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
          {t(locale, "support.badge")}
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
          {t(locale, "support.title")}
        </motion.h2>

        <motion.p
          className="font-body mb-12 sm:mb-16"
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
          {t(locale, "support.desc")}
        </motion.p>

        <motion.div
          className="support-grid grid md:[grid-template-columns:repeat(2,1fr)] lg:[grid-template-columns:repeat(3,1fr)]"
          style={{
            gap: spacing.stack.lg,
          }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={staggerContainer}
        >
          {items.map((item, i) => (
            <SupportCard key={i} item={item} locale={locale} />
          ))}
        </motion.div>
      </div>


    </section>
  );
}
