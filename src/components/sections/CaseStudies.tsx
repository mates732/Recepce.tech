"use client";

import Link from "next/link";
import type { Locale } from "@/lib/types";
import { projects } from "@/data/projects";
import { colors, typography, spacing, radius } from "@/design/tokens";
import { motion } from "framer-motion";
import {
  fadeIn,
  fadeInUp,
  staggerContainer,
  staggerItem,
  transitions,
  viewportConfig,
} from "@/design/animations";

interface Props {
  locale: Locale;
}

const statusColors = {
  active: colors.accentMuted,
  concept: colors.violetMuted,
  client: colors.muted,
} as const;

function CaseStudyRow({
  project,
  locale,
  index,
}: {
  project: (typeof projects)[number];
  locale: Locale;
  index: number;
}) {
  const padIndex = String(index + 1).padStart(2, "0");
  const detailHref = `/${locale}/projects/${project.slug}`;
  const outcomeText = project.sections.currentStatus[locale];

  return (
    <motion.article
      variants={staggerItem}
      className="relative"
    >
      {/* ── Divider ─────────────────────────────────────────── */}
      <div
        style={{
          height: "1px",
          background: "rgba(255,255,255,0.06)",
        }}
      />

      {/* ── Inner padding ───────────────────────────────────── */}
      <div
        style={{
          padding: `clamp(40px, 6vw, 72px) 0`,
        }}
      >
        {/* ── Header: index · name · year/status ──────────── */}
        <motion.div
          className="flex items-baseline gap-4 flex-wrap mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeInUp}
          transition={transitions.slow}
        >
          <span
            className="font-mono shrink-0"
            style={{
              fontSize: "11px",
              letterSpacing: typography.letterSpacing.wider,
              color: colors.muted,
            }}
          >
            {padIndex}
          </span>

          <h3
            className="font-heading font-medium"
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              lineHeight: typography.lineHeight.tight,
              letterSpacing: typography.letterSpacing.tight,
              color: colors.primary,
            }}
          >
            {project.name}
          </h3>

          <span className="flex-1 hidden sm:block" />

          <div className="flex items-center gap-2.5 shrink-0">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: statusColors[project.statusVariant],
                animation:
                  project.statusVariant === "active"
                    ? "pulse-dot 2.8s ease-in-out infinite"
                    : undefined,
              }}
            />
            <span
              className="font-mono"
              style={{
                fontSize: "10px",
                letterSpacing: typography.letterSpacing.wider,
                textTransform: "uppercase" as const,
                color: statusColors[project.statusVariant],
              }}
            >
              {project.status[locale]}
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: "10px",
                color: "rgba(102,102,102,0.25)",
              }}
            >
              ·
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: "10px",
                letterSpacing: typography.letterSpacing.wider,
                color: colors.muted,
              }}
            >
              {project.year}
            </span>
          </div>
        </motion.div>

        {/* ── Tagline ───────────────────────────────────────── */}
        <motion.p
          className="font-body mb-12"
          style={{
            fontSize: typography.size.bodyLg,
            lineHeight: typography.lineHeight.relaxed,
            color: colors.secondary,
            maxWidth: "52ch",
          }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeInUp}
          transition={{ ...transitions.slow, delay: 0.05 }}
        >
          {project.tagline[locale]}
        </motion.p>

        {/* ── Problem + Solution grid ───────────────────────── */}
        <div
          className="grid gap-10 mb-12"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))" }}
        >
          {/* Problem */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInUp}
            transition={{ ...transitions.slow, delay: 0.1 }}
          >
            <span
              className="block font-mono mb-4"
              style={{
                fontSize: "9px",
                letterSpacing: typography.letterSpacing.mega,
                textTransform: "uppercase" as const,
                color: colors.faint,
              }}
            >
              {locale === "cs" ? "Problém" : "Problem"}
            </span>
            <p
              className="font-body"
              style={{
                fontSize: typography.size.bodySm,
                lineHeight: typography.lineHeight.relaxed,
                color: colors.secondary,
              }}
            >
              {project.sections.problem[locale]}
            </p>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInUp}
            transition={{ ...transitions.slow, delay: 0.15 }}
          >
            <span
              className="block font-mono mb-4"
              style={{
                fontSize: "9px",
                letterSpacing: typography.letterSpacing.mega,
                textTransform: "uppercase" as const,
                color: colors.faint,
              }}
            >
              {locale === "cs" ? "Řešení" : "Solution"}
            </span>
            <p
              className="font-body"
              style={{
                fontSize: typography.size.bodySm,
                lineHeight: typography.lineHeight.relaxed,
                color: colors.secondary,
              }}
            >
              {project.sections.solution[locale]}
            </p>
          </motion.div>
        </div>

        {/* ── Technologies ──────────────────────────────────── */}
        <motion.div
          className="mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeInUp}
          transition={{ ...transitions.slow, delay: 0.2 }}
        >
          <span
            className="block font-mono mb-4"
            style={{
              fontSize: "9px",
              letterSpacing: typography.letterSpacing.mega,
              textTransform: "uppercase" as const,
              color: colors.faint,
            }}
          >
            {locale === "cs" ? "Technologie" : "Technologies"}
          </span>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="font-mono"
                style={{
                  fontSize: "10px",
                  letterSpacing: typography.letterSpacing.wider,
                  color: colors.muted,
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${colors.border}`,
                  padding: "5px 12px",
                  borderRadius: radius.full,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Outcome ───────────────────────────────────────── */}
        <motion.div
          className="mb-10 py-6 px-6 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.015)",
            border: `1px solid ${colors.border}`,
          }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeInUp}
          transition={{ ...transitions.slow, delay: 0.25 }}
        >
          <span
            className="block font-mono mb-3"
            style={{
              fontSize: "9px",
              letterSpacing: typography.letterSpacing.mega,
              textTransform: "uppercase" as const,
              color: colors.faint,
            }}
          >
            {locale === "cs" ? "Výsledek" : "Outcome"}
          </span>

          {project.stats ? (
            <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))" }}>
              {project.stats.map((stat) => (
                <div key={stat.label[locale]}>
                  <span
                    className="block font-heading mb-1"
                    style={{
                      fontSize: "clamp(28px, 4vw, 40px)",
                      lineHeight: 1,
                      fontWeight: typography.weight.medium,
                      color: colors.primary,
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="font-body"
                    style={{
                      fontSize: "11px",
                      color: colors.muted,
                    }}
                  >
                    {stat.label[locale]}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p
              className="font-body"
              style={{
                fontSize: typography.size.bodySm,
                lineHeight: typography.lineHeight.relaxed,
                color: colors.accentMuted,
                maxWidth: "52ch",
              }}
            >
              {outcomeText}
            </p>
          )}
        </motion.div>

        {/* ── CTA ────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeInUp}
          transition={{ ...transitions.slow, delay: 0.3 }}
        >
          <Link
            href={project.href || detailHref}
            className="group inline-flex items-center gap-3 font-body"
            style={{
              fontSize: typography.size.bodySm,
              color: colors.muted,
              transition: `color ${280}ms cubic-bezier(0.22,1,0.36,1)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.muted;
            }}
          >
            <span>{locale === "cs" ? "Prozkoumat projekt" : "View case study"}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M3 7h8M7 3l4 4-4 4" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </motion.article>
  );
}

export default function CaseStudies({ locale }: Props) {
  return (
    <section
      id="work"
      className="relative w-full"
      style={{
        padding: `${spacing.section.py} ${spacing.section.px}`,
      }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: spacing.container.maxWidth }}
      >
        {/* ── Section header ─────────────────────────────────── */}
        <motion.div
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={staggerContainer}
        >
          <motion.span
            variants={staggerItem}
            className="block font-body mb-4"
            style={{
              fontSize: typography.size.micro,
              letterSpacing: typography.letterSpacing.mega,
              textTransform: "uppercase",
              color: colors.faint,
            }}
          >
            {locale === "cs" ? "Případové studie" : "Case studies"}
          </motion.span>

          <motion.h2
            variants={staggerItem}
            className="font-heading"
            style={{
              fontSize: typography.size.h2,
              lineHeight: typography.lineHeight.snug,
              letterSpacing: typography.letterSpacing.tight,
              fontWeight: typography.weight.medium,
              color: colors.primary,
            }}
          >
            {locale === "cs" ? "Projekty" : "Projects"}
          </motion.h2>
        </motion.div>

        {/* ── Case study list ────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={staggerContainer}
          transition={transitions.slow}
        >
          {projects.map((project, index) => (
            <CaseStudyRow
              key={project.id}
              project={project}
              locale={locale}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
