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
    titleKey: "security.item1Title" as const,
    descKey: "security.item1Desc" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    titleKey: "security.item2Title" as const,
    descKey: "security.item2Desc" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    titleKey: "security.item3Title" as const,
    descKey: "security.item3Desc" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
  },
  {
    titleKey: "security.item4Title" as const,
    descKey: "security.item4Desc" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

function SecurityCard({ item, locale }: { item: (typeof items)[0]; locale: Locale }) {
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

      <style>{`.security-card:hover .icon-wrap { transform: scale(1.04) rotate(2deg); }`}</style>
    </motion.div>
  );
}

export default function SecuritySection({ locale }: Props) {
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
          {t(locale, "security.badge")}
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
          {t(locale, "security.title")}
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
          {t(locale, "security.desc")}
        </motion.p>

        <motion.div
          className="security-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: spacing.stack.lg,
          }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={staggerContainer}
        >
          {items.map((item, i) => (
            <SecurityCard key={i} item={item} locale={locale} />
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .security-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
