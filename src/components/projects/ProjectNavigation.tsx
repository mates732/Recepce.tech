"use client";

import Link from "next/link";
import type { Locale } from "@/lib/types";
import { projects } from "@/data/projects";
import { colors, typography } from "@/design/tokens";
import { motion } from "framer-motion";
import { fadeInUp, transitions, viewportConfig } from "@/design/animations";

interface Props {
  currentSlug: string;
  locale: Locale;
}

export default function ProjectNavigation({ currentSlug, locale }: Props) {
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug);
  const prev = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const next = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <motion.div
      className="pt-16 mt-20"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      variants={fadeInUp}
      transition={transitions.slow}
    >
      <Link
        href={`/${locale}#work`}
        className="group inline-flex items-center gap-2 mb-10 transition-all duration-300"
        style={{ color: colors.muted }}
        onMouseEnter={(e) => { e.currentTarget.style.color = colors.primary; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = colors.muted; }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="transition-transform duration-300 group-hover:-translate-x-1"
        >
          <path d="M11 7H3M7 3L3 7l4 4" />
        </svg>
        <span
          className="font-body"
          style={{
            fontSize: "11px",
            letterSpacing: typography.letterSpacing.wider,
            textTransform: "uppercase",
          }}
        >
          {locale === "cs" ? "Zpět do archivu" : "Back to Archive"}
        </span>
      </Link>

      <div className="grid gap-4 sm:grid-cols-2">
        {prev && (
          <Link
            href={`/${locale}/projects/${prev.slug}`}
            className="group block p-6 rounded-xl transition-all duration-500"
            style={{
              background: "rgba(255,255,255,0.012)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.012)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
            }}
          >
            <span
              className="block font-mono mb-3"
              style={{ fontSize: "10px", letterSpacing: typography.letterSpacing.wider, textTransform: "uppercase", color: colors.muted }}
            >
              {locale === "cs" ? "Předchozí" : "Previous"}
            </span>
            <div className="flex items-center gap-3">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="transition-transform duration-300 group-hover:-translate-x-1 shrink-0"
                style={{ color: colors.muted }}
              >
                <path d="M11 7H3M7 3L3 7l4 4" />
              </svg>
              <span
                className="font-heading"
                style={{
                  fontSize: typography.size.h3,
                  fontWeight: typography.weight.medium,
                  color: colors.primary,
                  lineHeight: typography.lineHeight.snug,
                }}
              >
                {prev.name}
              </span>
            </div>
          </Link>
        )}
        {next && (
          <Link
            href={`/${locale}/projects/${next.slug}`}
            className="group block p-6 rounded-xl text-right transition-all duration-500"
            style={{
              background: "rgba(255,255,255,0.012)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.012)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
            }}
          >
            <span
              className="block font-mono mb-3"
              style={{ fontSize: "10px", letterSpacing: typography.letterSpacing.wider, textTransform: "uppercase", color: colors.muted }}
            >
              {locale === "cs" ? "Další" : "Next"}
            </span>
            <div className="flex items-center justify-end gap-3">
              <span
                className="font-heading"
                style={{
                  fontSize: typography.size.h3,
                  fontWeight: typography.weight.medium,
                  color: colors.primary,
                  lineHeight: typography.lineHeight.snug,
                }}
              >
                {next.name}
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="transition-transform duration-300 group-hover:translate-x-1 shrink-0"
                style={{ color: colors.muted }}
              >
                <path d="M3 7h8M7 3l4 4-4 4" />
              </svg>
            </div>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
