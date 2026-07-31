"use client";

import { motion } from "framer-motion";
import { colors, typography, spacing, radius, easing, duration } from "@/design/tokens";
import { t } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import { fadeInUp, viewportConfig } from "@/design/animations";

const QuoteIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.12 }}>
    <path
      d="M11.3 4.5C7.5 4.5 4.5 7.5 4.5 11.3c0 3 2 5.5 4.7 6.3-.3-1-.5-2.1-.5-3.3 0-3.8 3.1-7 7-7V4.5zm10 0C17.5 4.5 14.5 7.5 14.5 11.3c0 3 2 5.5 4.7 6.3-.3-1-.5-2.1-.5-3.3 0-3.8 3.1-7 7-7V4.5z"
      fill={colors.muted}
    />
  </svg>
);

export default function SocialProofSection({ locale }: { locale: Locale }) {
  return (
    <section
      className="relative w-full"
      style={{ padding: `${spacing.section.py} ${spacing.section.px}` }}
    >
      {/* Local overlay to reduce ambient background distraction */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(9,9,9,0.7) 0%, rgba(9,9,9,0.4) 50%, transparent 100%)",
          zIndex: 0,
        }}
      />

      <div className="relative mx-auto" style={{ maxWidth: spacing.container.maxWidth, zIndex: 1 }}>
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
          {t(locale, "socialProof.badge")}
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
          {t(locale, "socialProof.title")}
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
          {t(locale, "socialProof.desc")}
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeInUp}
          transition={{ duration: duration.reveal / 1000, ease: easing.reveal, delay: 0.15 }}
        >
          <div
            className="testimonial-coming-soon"
            style={{
              padding: "clamp(32px, 4vw, 48px) clamp(28px, 4vw, 48px)",
              borderRadius: radius.lg,
              background: "rgba(17,17,17,0.35)",
              border: `1px solid ${colors.border}`,
              boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: spacing.stack.lg,
              transition: `border-color ${duration.card}ms cubic-bezier(0.22,1,0.36,1), box-shadow ${duration.card}ms cubic-bezier(0.22,1,0.36,1), transform ${duration.card}ms cubic-bezier(0.22,1,0.36,1)`,
              willChange: "transform",
              maxWidth: "640px",
              marginInline: "auto",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              e.currentTarget.style.boxShadow =
                "0 12px 40px rgba(0,0,0,0.35), 0 0 60px rgba(255,255,255,0.02), 0 1px 2px rgba(0,0,0,0.2)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <QuoteIcon />

            <p
              className="font-body"
              style={{
                fontSize: typography.size.bodyLg,
                lineHeight: "1.8",
                color: colors.secondary,
                fontStyle: "italic",
                maxWidth: "38ch",
              }}
            >
              &ldquo;{locale === "cs"
                ? "Zákazníci pilotního programu právě testují Recepce.tech. Skutečné příběhy zveřejníme brzy."
                : "Pilot customers are currently testing Recepce.tech. Real customer stories will be published soon."
              }&rdquo;
            </p>

            <div
              style={{
                width: "32px",
                height: "1px",
                background: colors.border,
                margin: `${spacing.stack.sm} 0`,
              }}
            />

            <p
              className="font-heading"
              style={{
                fontSize: typography.size.bodySm,
                fontWeight: typography.weight.medium,
                color: colors.muted,
                letterSpacing: typography.letterSpacing.wide,
              }}
            >
              {locale === "cs" ? "Brzy k dispozici" : "Coming soon"}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
