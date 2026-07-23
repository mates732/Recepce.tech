"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, typography, spacing, radius } from "@/design/tokens";
import { t } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import { fadeInUp, viewportConfig } from "@/design/animations";

const faqItems = [1, 2, 3, 4, 5, 6];

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      color: colors.muted,
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 200ms cubic-bezier(0.22, 0.8, 0.2, 1)",
      flexShrink: 0,
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function FaqSection({ locale }: { locale: Locale }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section
      id="faq"
      className="relative w-full"
      style={{ padding: `${spacing.section.py} ${spacing.section.px}` }}
    >
      <div className="mx-auto" style={{ maxWidth: spacing.container.narrow }}>
        <motion.span
          className="block font-body mb-12 text-center"
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
          {t(locale, "faq.badge")}
        </motion.span>

        <motion.h2
          className="font-heading mb-6 text-center"
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
          {t(locale, "faq.title")}
        </motion.h2>

        <motion.p
          className="font-body mb-16 text-center"
          style={{
            fontSize: typography.size.body,
            lineHeight: typography.lineHeight.relaxed,
            color: colors.secondary,
            maxWidth: "50ch",
            margin: "0 auto",
          }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeInUp}
          transition={{ duration: 0.8, ease: [0.22, 0.8, 0.2, 1], delay: 0.1 }}
        >
          {t(locale, "faq.desc")}
        </motion.p>

        <div>
          {faqItems.map((num, i) => (
            <div
              key={num}
              style={{
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <button
                id={`faq-trigger-${num}`}
                aria-controls={`faq-panel-${num}`}
                aria-expanded={openIndex === i}
                onClick={() => toggle(i)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: spacing.stack.md,
                  padding: `${spacing.stack.md} 0`,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  color: colors.primary,
                  fontSize: typography.size.body,
                  fontWeight: typography.weight.medium,
                  fontFamily: typography.fontFamily.body,
                }}
              >
                <span>{t(locale, `faq.q${num}` as any)}</span>
                <ChevronIcon open={openIndex === i} />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="answer"
                    id={`faq-panel-${num}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${num}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 0.8, 0.2, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <p
                      className="font-body"
                      style={{
                        paddingBottom: spacing.stack.md,
                        fontSize: typography.size.bodySm,
                        color: colors.secondary,
                        lineHeight: typography.lineHeight.relaxed,
                      }}
                    >
                      {t(locale, `faq.a${num}` as any)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
