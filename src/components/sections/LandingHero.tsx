"use client";

import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { colors, typography, spacing, radius } from "@/design/tokens";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { Variants } from "framer-motion";
import { useRef } from "react";

export default function LandingHero({ locale }: { locale: Locale }) {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 0]);
  const fgY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const splitX1 = useTransform(scrollYProgress, [0, 0.3], [0, -20]);
  const splitX2 = useTransform(scrollYProgress, [0, 0.3], [0, 20]);
  const splitRotate1 = useTransform(scrollYProgress, [0, 0.3], [0, -1]);
  const splitRotate2 = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

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
            ease: [0.22, 1, 0.36, 1],
          },
    }),
  };

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.section.px,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          y: bgY,
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(237,237,237,0.04) 0%, transparent 70%)",
          top: "15%",
          left: "50%",
          translateX: "-50%",
          opacity: glowOpacity,
          filter: "blur(60px)",
        }}
      />

      {/* Foreground glow */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          y: glowY,
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(136,136,136,0.05) 0%, transparent 70%)",
          bottom: "20%",
          right: "15%",
          filter: "blur(40px)",
        }}
      />

      {/* Content */}
      <div
        style={{
          maxWidth: "1240px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <motion.div style={{ y: fgY, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div className={shouldReduceMotion ? "" : "hero-float"} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", width: "100%", gap: "clamp(20px, 3vw, 32px)" }}>
            <motion.span
              custom={0}
              initial="hidden"
              animate="visible"
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
              {t(locale, "landing.hero.badge")}
            </motion.span>

            <div style={{ position: "relative", maxWidth: "22ch" }}>
              <motion.h1
                custom={1}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                style={{
                  fontFamily: typography.fontFamily.heading,
                  fontSize: typography.size.display,
                  lineHeight: typography.lineHeight.tight,
                  letterSpacing: typography.letterSpacing.tight,
                  fontWeight: typography.weight.bold,
                  color: colors.primary,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <motion.span
                  className="block"
                  style={{
                    x: shouldReduceMotion ? 0 : splitX1,
                    rotate: shouldReduceMotion ? 0 : splitRotate1,
                    willChange: "transform",
                  }}
                >
                  {t(locale, "landing.hero.title")}
                </motion.span>
                <motion.span
                  className="block gradient-headline"
                  style={{
                    x: shouldReduceMotion ? 0 : splitX2,
                    rotate: shouldReduceMotion ? 0 : splitRotate2,
                    willChange: "transform",
                    marginTop: "clamp(4px, 0.6vw, 8px)",
                    backgroundImage: "linear-gradient(135deg, #FAFAFA 0%, #888888 40%, #FAFAFA 80%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {t(locale, "landing.hero.titleLine1")}
                </motion.span>
              </motion.h1>
            </div>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              style={{
                fontSize: typography.size.bodyLg,
                lineHeight: "1.7",
                color: colors.secondary,
                maxWidth: "56ch",
              }}
            >
              {t(locale, "landing.hero.subtitle")}
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            >
              <MagneticButton
                href={`/${locale}/profese`}
                variant="primary"
              >
                {t(locale, "landing.hero.ctaPrimary")}
              </MagneticButton>

              <MagneticButton
                href={`/${locale}/contact`}
                variant="secondary"
              >
                {t(locale, "landing.hero.ctaSecondary")}
              </MagneticButton>
            </motion.div>

            <motion.p
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              style={{
                fontSize: typography.size.caption,
                color: colors.muted,
                letterSpacing: typography.letterSpacing.wide,
              }}
            >
              {t(locale, "landing.hero.trustedBy")}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Magnetic CTA Button ────────────────────────────────────────────── */

function MagneticButton({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "primary" | "secondary";
  children: React.ReactNode;
}) {
  const isPrimary = variant === "primary";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Link
        href={href}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 36px",
          background: isPrimary ? colors.primary : "transparent",
          color: isPrimary ? colors.bg : colors.primary,
          border: isPrimary ? "none" : "1px solid rgba(255,255,255,0.12)",
          borderRadius: radius.full,
          fontSize: typography.size.body,
          fontWeight: typography.weight.medium,
          fontFamily: typography.fontFamily.body,
          textDecoration: "none",
          position: "relative",
          overflow: "hidden",
          transition: "all 280ms cubic-bezier(0.22,1,0.36,1)",
        }}
        onMouseEnter={(e) => {
          if (isPrimary) {
            e.currentTarget.style.boxShadow = "0 0 30px rgba(250,250,250,0.12), 0 0 60px rgba(250,250,250,0.04)";
          } else {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(255,255,255,0.03)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
          if (!isPrimary) {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            e.currentTarget.style.background = "transparent";
          }
        }}
      >
        {isPrimary && (
          <span
            className="absolute inset-0 opacity-0 transition-opacity duration-500"
            style={{
              background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)",
              backgroundSize: "200% 200%",
              animation: "shimmer 3s ease infinite",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          />
        )}
        <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      </Link>
    </motion.div>
  );
}
