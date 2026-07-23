"use client";

import type { Locale } from "@/lib/types";
import { devLog } from "@/data/developmentLog";
import { colors, typography } from "@/design/tokens";
import { motion } from "framer-motion";
import { fadeInUp, transitions, viewportConfig } from "@/design/animations";

interface Props {
  projectSlug: string;
  locale: Locale;
}

export default function DevelopmentLog({ projectSlug, locale }: Props) {
  const entries = devLog.filter((e) => e.projectSlug === projectSlug);

  if (entries.length === 0) return null;

  return (
    <div>
      <motion.span
        className="block font-mono mb-10"
        style={{
          fontSize: "10px",
          letterSpacing: typography.letterSpacing.mega,
          textTransform: "uppercase",
          color: colors.faint,
        }}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeInUp}
        transition={transitions.slow}
      >
        {locale === "cs" ? "Vývojový deník" : "Development Log"}
      </motion.span>

      <div className="relative flex flex-col gap-0">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            className="relative flex items-start gap-6"
            style={{
              paddingTop: i === 0 ? 0 : "24px",
              paddingBottom: i === entries.length - 1 ? 0 : "24px",
            }}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInUp}
            transition={{ ...transitions.slow, delay: 0.05 * i }}
          >
            <div className="relative flex flex-col items-center shrink-0" style={{ width: "1px" }}>
              <span
                className="block rounded-full shrink-0"
                style={{
                  width: "5px",
                  height: "5px",
                  background: colors.accent,
                  marginTop: "6px",
                }}
              />
              {i < entries.length - 1 && (
                <span
                  className="block"
                  style={{
                    width: "1px",
                    flex: 1,
                    background: "rgba(237,237,237,0.08)",
                    marginTop: "8px",
                  }}
                />
              )}
            </div>
            <div className="pt-0">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="font-mono"
                  style={{
                    fontSize: "10px",
                    letterSpacing: typography.letterSpacing.wider,
                    color: colors.accentMuted,
                  }}
                >
                  {entry.date}
                </span>
              </div>
              <h4
                className="font-heading mb-2"
                style={{
                  fontSize: typography.size.body,
                  fontWeight: typography.weight.medium,
                  color: colors.primary,
                  lineHeight: typography.lineHeight.snug,
                }}
              >
                {entry.title[locale]}
              </h4>
              <p
                className="font-body mb-3"
                style={{
                  fontSize: typography.size.bodySm,
                  lineHeight: typography.lineHeight.relaxed,
                  color: colors.secondary,
                  maxWidth: "50ch",
                }}
              >
                {entry.description[locale]}
              </p>
              <p
                className="font-body inline-flex items-center gap-1.5"
                style={{
                  fontSize: typography.size.caption,
                  color: colors.muted,
                }}
              >
                <span style={{ color: colors.faint }}>
                  {locale === "cs" ? "Dopad" : "Impact"}
                </span>
                {entry.impact[locale]}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
