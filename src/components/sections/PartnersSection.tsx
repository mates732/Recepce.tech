"use client";

import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { colors, typography, spacing, radius } from "@/design/tokens";
import { motion } from "framer-motion";
import { fadeInUp, fadeIn, viewportConfig } from "@/design/animations";

interface Props {
  locale: Locale;
}

const partners = ["Partner", "Partner", "Partner", "Partner", "Partner"];

export default function PartnersSection({ locale }: Props) {
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
          {t(locale, "partners.badge")}
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
          {t(locale, "partners.title")}
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
          transition={{ duration: 0.8, ease: [0.22, 0.8, 0.2, 1], delay: 0.1 }}
        >
          {t(locale, "partners.desc")}
        </motion.p>

        <motion.div
          className="partners-row"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: spacing.stack.xl,
            flexWrap: "wrap",
          }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeIn}
          transition={{ duration: 0.8, ease: [0.22, 0.8, 0.2, 1], delay: 0.2 }}
        >
          {partners.map((name, i) => (
            <motion.div
              key={i}
              style={{
                width: 120,
                height: 40,
                border: `1px solid ${colors.border}`,
                borderRadius: radius.md,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: typography.size.caption,
                color: colors.muted,
                fontFamily: typography.fontFamily.body,
                letterSpacing: typography.letterSpacing.wide,
                textTransform: "uppercase",
              }}
              whileHover={{
                borderColor: colors.borderHi,
                transition: { duration: 0.3 },
              }}
            >
              {name}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
