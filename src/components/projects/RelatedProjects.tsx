"use client";

import Link from "next/link";
import type { Locale } from "@/lib/types";
import { projects } from "@/data/projects";
import { colors, typography } from "@/design/tokens";
import { motion } from "framer-motion";
import { fadeInUp, transitions, viewportConfig } from "@/design/animations";

interface Props {
  relatedSlugs: string[];
  currentSlug: string;
  locale: Locale;
}

export default function RelatedProjects({ relatedSlugs, currentSlug, locale }: Props) {
  const related = relatedSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  if (related.length === 0) return null;

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
        {locale === "cs" ? "Související projekty" : "Related Projects"}
      </motion.span>

      <div className="grid gap-4 sm:grid-cols-2">
        {related.map((project, i) => (
          <motion.div
            key={project.slug}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInUp}
            transition={{ ...transitions.slow, delay: 0.05 * i }}
          >
            <Link
              href={`/${locale}/projects/${project.slug}`}
              className="group block p-7 rounded-xl transition-all duration-500"
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "10px",
                      letterSpacing: typography.letterSpacing.mega,
                      textTransform: "uppercase",
                      color: project.statusVariant === "active" ? colors.accentMuted : colors.muted,
                    }}
                  >
                    {project.type[locale]}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "10px",
                      letterSpacing: typography.letterSpacing.wider,
                      color: "rgba(102,102,102,0.35)",
                    }}
                  >
                    {project.year}
                  </span>
                </div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  style={{
                    color: colors.faint,
                    transition: `all ${300}ms ease`,
                    transform: "translateX(-2px)",
                    opacity: 0.5,
                  }}
                >
                  <path d="M3 7h8M7 3l4 4-4 4" />
                </svg>
              </div>
              <h3
                className="font-heading mb-2"
                style={{
                  fontSize: typography.size.h3,
                  fontWeight: typography.weight.medium,
                  color: colors.primary,
                  lineHeight: typography.lineHeight.snug,
                }}
              >
                {project.name}
              </h3>
              <p
                className="font-body"
                style={{
                  fontSize: typography.size.bodySm,
                  color: colors.muted,
                  lineHeight: typography.lineHeight.relaxed,
                }}
              >
                {project.description[locale]}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
