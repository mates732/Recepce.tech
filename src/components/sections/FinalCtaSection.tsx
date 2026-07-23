"use client";

import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { colors, typography, spacing, radius, easing, duration } from "@/design/tokens";
import { motion } from "framer-motion";
import { fadeInUp, viewportConfig } from "@/design/animations";
import Link from "next/link";

interface Props {
  locale: Locale;
}

export default function FinalCtaSection({ locale }: Props) {
  return (
    <section
      className="relative w-full"
      style={{ padding: `clamp(100px, 15vw, 180px) ${spacing.section.px}` }}
    >
      <motion.div
        className="mx-auto"
        style={{
          maxWidth: spacing.container.maxWidth,
          position: "relative",
        }}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeInUp}
        transition={{ duration: duration.reveal / 1000, ease: easing.reveal }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(17,17,17,0.25)",
            border: `1px solid ${colors.border}`,
            borderRadius: radius.xl,
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "clamp(40px, 6vw, 80px) clamp(24px, 4vw, 48px)",
            gap: spacing.stack.lg,
          }}
        >
          <motion.span
            className="block font-body"
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
            transition={{ duration: duration.reveal / 1000, ease: easing.reveal, delay: 0.05 }}
          >
            {t(locale, "finalCta.badge")}
          </motion.span>

          <motion.h2
            className="font-heading"
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: typography.lineHeight.tight,
              letterSpacing: typography.letterSpacing.tight,
              fontWeight: typography.weight.bold,
              color: colors.primary,
              maxWidth: "18ch",
            }}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInUp}
            transition={{ duration: duration.reveal / 1000, ease: easing.reveal, delay: 0.1 }}
          >
            {t(locale, "finalCta.title")}
          </motion.h2>

          <motion.p
            className="font-body"
            style={{
              fontSize: typography.size.bodyLg,
              lineHeight: typography.lineHeight.relaxed,
              color: colors.secondary,
              maxWidth: "42ch",
            }}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInUp}
            transition={{ duration: duration.reveal / 1000, ease: easing.reveal, delay: 0.15 }}
          >
            {t(locale, "finalCta.desc")}
          </motion.p>

          <motion.div
            style={{
              display: "flex",
              alignItems: "center",
              gap: spacing.stack.md,
              marginTop: spacing.stack.md,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInUp}
            transition={{ duration: duration.reveal / 1000, ease: easing.reveal, delay: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Link
                href={`/${locale}/contact`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px 40px",
                  background: colors.primary,
                  color: colors.bg,
                  borderRadius: radius.full,
                  fontSize: typography.size.body,
                  fontWeight: typography.weight.medium,
                  fontFamily: typography.fontFamily.body,
                  textDecoration: "none",
                  position: "relative",
                  overflow: "hidden",
                  transition: "box-shadow 280ms cubic-bezier(0.22,1,0.36,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(250,250,250,0.12), 0 0 60px rgba(250,250,250,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
                    backgroundSize: "200% 200%",
                    animation: "shimmer 4s ease infinite",
                  }}
                />
                <span style={{ position: "relative", zIndex: 1 }}>
                  {t(locale, "finalCta.ctaPrimary")}
                </span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Link
                href={`/${locale}/contact`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px 40px",
                  background: "transparent",
                  color: colors.primary,
                  border: `1px solid ${colors.borderHi}`,
                  borderRadius: radius.full,
                  fontSize: typography.size.body,
                  fontWeight: typography.weight.medium,
                  fontFamily: typography.fontFamily.body,
                  textDecoration: "none",
                  transition: "border-color 280ms cubic-bezier(0.22,1,0.36,1), background 280ms cubic-bezier(0.22,1,0.36,1), box-shadow 280ms cubic-bezier(0.22,1,0.36,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(255,255,255,0.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {t(locale, "finalCta.ctaSecondary")}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
