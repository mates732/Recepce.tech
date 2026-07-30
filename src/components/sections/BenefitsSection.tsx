"use client";

import { motion } from "framer-motion";
import { colors, typography, spacing, radius, easing, duration } from "@/design/tokens";
import { t } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import { fadeInUp, staggerContainer, staggerItem, viewportConfig } from "@/design/animations";
import { useCardTilt } from "@/hooks/useCardTilt";

const icons = [
  <svg key="clock" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  <svg key="phone" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /><line x1="1" y1="1" x2="23" y2="23" /></svg>,
  <svg key="dollar" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  <svg key="rocket" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>,
];

const benefits = [
  { titleKey: "benefits.b1Title" as const, descKey: "benefits.b1Desc" as const },
  { titleKey: "benefits.b2Title" as const, descKey: "benefits.b2Desc" as const },
  { titleKey: "benefits.b3Title" as const, descKey: "benefits.b3Desc" as const },
  { titleKey: "benefits.b4Title" as const, descKey: "benefits.b4Desc" as const },
];

function BenefitCard({ benefit, icon, locale }: { benefit: (typeof benefits)[0]; icon: React.ReactNode; locale: Locale }) {
  const { ref, style: tiltStyle, glareStyle, handleMouseMove, handleMouseLeave } = useCardTilt();

  return (
    <motion.div
      ref={ref}
      style={{
        padding: "clamp(24px, 3vw, 32px)",
        borderRadius: radius.lg,
        background: "rgba(17,17,17,0.25)",
        border: `1px solid ${colors.border}`,
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
        className="icon-wrap"
        style={{
          width: 48,
          height: 48,
          borderRadius: radius.md,
          background: colors.violetFaint,
          border: `1px solid ${colors.borderViolet}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.stack.md,
          transition: "transform 250ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {icon}
      </div>
      <h3
        className="font-heading mb-3"
        style={{
          fontSize: typography.size.h4,
          fontWeight: typography.weight.medium,
          color: colors.primary,
        }}
      >
        {t(locale, benefit.titleKey)}
      </h3>
      <p
        className="font-body"
        style={{
          fontSize: typography.size.bodySm,
          color: colors.secondary,
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        {t(locale, benefit.descKey)}
      </p>

      <style>{`.benefit-card:hover .icon-wrap { transform: scale(1.04) rotate(2deg); }`}</style>
    </motion.div>
  );
}

export default function BenefitsSection({ locale }: { locale: Locale }) {
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
          {t(locale, "benefits.badge")}
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
          {t(locale, "benefits.title")}
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
          {t(locale, "benefits.desc")}
        </motion.p>

        <motion.div
          className="benefits-grid grid gap-6"
          style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={staggerContainer}
        >
          {benefits.map((benefit, i) => (
            <BenefitCard key={i} benefit={benefit} icon={icons[i]} locale={locale} />
          ))}
        </motion.div>
      </div>


    </section>
  );
}
