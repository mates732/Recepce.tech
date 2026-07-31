"use client";

import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { colors, typography, spacing, radius } from "@/design/tokens";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem, viewportConfig } from "@/design/animations";

interface Props {
  locale: Locale;
}

const steps = [
  { titleKey: "onboarding.step1Title" as const, descKey: "onboarding.step1Desc" as const },
  { titleKey: "onboarding.step2Title" as const, descKey: "onboarding.step2Desc" as const },
  { titleKey: "onboarding.step3Title" as const, descKey: "onboarding.step3Desc" as const },
];

export default function OnboardingSection({ locale }: Props) {
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
          transition={{ duration: 0.8, ease: [0.22, 0.8, 0.2, 1] }}
        >
          {t(locale, "onboarding.badge")}
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
          transition={{ duration: 0.8, ease: [0.22, 0.8, 0.2, 1], delay: 0.05 }}
        >
          {t(locale, "onboarding.title")}
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
          transition={{ duration: 0.8, ease: [0.22, 0.8, 0.2, 1], delay: 0.1 }}
        >
          {t(locale, "onboarding.desc")}
        </motion.p>

        <motion.div
          className="onboarding-steps"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: spacing.stack.xl,
          }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={staggerContainer}
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="onboarding-step"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                position: "relative",
              }}
              variants={staggerItem}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: radius.full,
                  background: colors.accentFaint,
                  border: `1px solid ${colors.borderHi}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: spacing.stack.lg,
                  fontFamily: typography.fontFamily.heading,
                  fontSize: typography.size.h4,
                  fontWeight: typography.weight.bold,
                  color: colors.primary,
                }}
              >
                {i + 1}
              </div>

              {i < steps.length - 1 && (
                <div
                  className="onboarding-connector"
                  style={{
                    position: "absolute",
                    top: 28,
                    left: "calc(50% + 32px)",
                    width: "calc(100% - 64px)",
                    height: 1,
                    background: colors.borderHi,
                  }}
                />
              )}

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
                  maxWidth: "30ch",
                }}
              >
                {t(locale, step.descKey)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>


    </section>
  );
}
