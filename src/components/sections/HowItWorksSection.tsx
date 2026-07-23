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

const steps = [
  { number: "01", titleKey: "howItWorks.step1Title" as const, descKey: "howItWorks.step1Desc" as const },
  { number: "02", titleKey: "howItWorks.step2Title" as const, descKey: "howItWorks.step2Desc" as const },
  { number: "03", titleKey: "howItWorks.step3Title" as const, descKey: "howItWorks.step3Desc" as const },
];

function StepCard({ step, locale }: { step: (typeof steps)[0]; locale: Locale }) {
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

      <span
        className="block font-mono mb-6"
        style={{
          fontSize: "clamp(40px, 5vw, 64px)",
          fontWeight: typography.weight.regular,
          lineHeight: 1,
          letterSpacing: typography.letterSpacing.tight,
          color: colors.faint,
        }}
      >
        {step.number}
      </span>

      <h3
        className="font-heading mb-3"
        style={{
          fontSize: typography.size.h4,
          lineHeight: typography.lineHeight.snug,
          fontWeight: typography.weight.medium,
          color: colors.primary,
        }}
      >
        {t(locale, step.titleKey)}
      </h3>

      <p
        className="font-body"
        style={{
          fontSize: typography.size.bodySm,
          lineHeight: typography.lineHeight.relaxed,
          color: colors.secondary,
        }}
      >
        {t(locale, step.descKey)}
      </p>
    </motion.div>
  );
}

export default function HowItWorksSection({ locale }: Props) {
  return (
    <section
      id="how-it-works"
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
          {t(locale, "howItWorks.badge")}
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
          {t(locale, "howItWorks.title")}
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
          {t(locale, "howItWorks.desc")}
        </motion.p>

        <motion.div
          className="how-it-works-grid relative"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: spacing.stack.lg,
          }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={staggerContainer}
        >
          {steps.map((step, i) => (
            <StepCard key={i} step={step} locale={locale} />
          ))}

          <div className="step-connector step-connector-1" />
          <div className="step-connector step-connector-2" />
        </motion.div>
      </div>

      <style>{`
        .step-connector {
          position: absolute;
          top: 50%;
          width: 24px;
          height: 1px;
          background: ${colors.border};
          transform: translateY(-50%);
        }
        .step-connector-1 { left: calc(33.333% - 12px); }
        .step-connector-2 { left: calc(66.666% - 12px); }
        @media (max-width: 768px) {
          .step-connector { display: none; }
          .how-it-works-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
