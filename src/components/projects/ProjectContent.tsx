"use client";

import Link from "next/link";
import type { Locale } from "@/lib/types";
import type { Project } from "@/data/projects";
import { colors, typography } from "@/design/tokens";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, transitions, viewportConfig } from "@/design/animations";
import DevelopmentLog from "./DevelopmentLog";
import ProjectGallery from "./ProjectGallery";
import RelatedProjects from "./RelatedProjects";
import ProjectNavigation from "./ProjectNavigation";

interface Props {
  project: Project;
  locale: Locale;
  children?: React.ReactNode;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="block font-mono mb-5"
      style={{
        fontSize: "10px",
        letterSpacing: typography.letterSpacing.mega,
        textTransform: "uppercase",
        color: colors.faint,
      }}
    >
      {children}
    </span>
  );
}

function Section({ label, delay, children, className = "" }: { label: string; delay: number; children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`my-20 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      variants={fadeInUp}
      transition={{ ...transitions.slow, delay }}
    >
      <SectionLabel>{label}</SectionLabel>
      {children}
    </motion.div>
  );
}

export default function ProjectContent({ project, locale, children }: Props) {
  const { sections } = project;

  return (
    <section
      className="relative w-full min-h-screen"
      style={{ paddingTop: "clamp(120px, 18vh, 180px)", paddingBottom: "clamp(80px, 12vh, 120px)" }}
    >
      <div className="mx-auto" style={{ maxWidth: "960px", padding: "0 clamp(24px, 5vw, 64px)" }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={transitions.slow}
        >
          <Link
            href={`/${locale}#work`}
            className="group inline-flex items-center gap-2 mb-16 transition-all duration-300"
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
              style={{ fontSize: "11px", letterSpacing: typography.letterSpacing.wider, textTransform: "uppercase" }}
            >
              {locale === "cs" ? "Zpět" : "Back"}
            </span>
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.div
          className="mb-32"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={transitions.slow}
        >
          <div className="flex items-center gap-3 mb-8 flex-wrap">
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
            <span className="font-mono" style={{ fontSize: "10px", color: "rgba(102,102,102,0.2)" }}>·</span>
            <span
              className="font-mono"
              style={{
                fontSize: "10px",
                letterSpacing: typography.letterSpacing.mega,
                textTransform: "uppercase",
                color: project.statusVariant === "active" ? colors.accentMuted : colors.muted,
              }}
            >
              {project.status[locale]}
            </span>
            <span className="font-mono" style={{ fontSize: "10px", color: "rgba(102,102,102,0.2)" }}>·</span>
            <span
              className="font-mono"
              style={{ fontSize: "10px", letterSpacing: typography.letterSpacing.wider, color: colors.muted }}
            >
              {project.started} — {project.lastUpdate}
            </span>
          </div>

          <h1
            className="font-heading mb-8"
            style={{
              fontSize: "clamp(44px, 8vw, 96px)",
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              fontWeight: typography.weight.medium,
              color: colors.primary,
            }}
          >
            {project.name}
          </h1>

          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="font-mono"
              style={{
                fontSize: "10px",
                letterSpacing: typography.letterSpacing.wider,
                textTransform: "uppercase",
                color: colors.muted,
              }}
            >
              {project.category[locale]}
            </span>
            <span className="font-mono" style={{ fontSize: "10px", color: "rgba(102,102,102,0.2)" }}>·</span>
            <span
              className="font-mono"
              style={{
                fontSize: "10px",
                letterSpacing: typography.letterSpacing.wider,
                textTransform: "uppercase",
                color: colors.muted,
              }}
            >
              {project.projectType[locale]}
            </span>
          </div>
        </motion.div>

        {/* Overview — editorial lead */}
        <Section label={locale === "cs" ? "Přehled" : "Overview"} delay={0}>
          <p className="font-body" style={{ fontSize: typography.size.bodyLg, lineHeight: 1.8, color: colors.secondary, maxWidth: "50ch" }}>
            {sections.overview[locale]}
          </p>
        </Section>

        {/* Problem */}
        <Section label={locale === "cs" ? "Problém" : "Problem"} delay={0.05}>
          <p className="font-body" style={{ fontSize: typography.size.body, lineHeight: typography.lineHeight.relaxed, color: colors.secondary, maxWidth: "50ch" }}>
            {sections.problem[locale]}
          </p>
        </Section>

        {/* Solution */}
        <Section label={locale === "cs" ? "Řešení" : "Solution"} delay={0.1}>
          <p className="font-body" style={{ fontSize: typography.size.body, lineHeight: typography.lineHeight.relaxed, color: colors.secondary, maxWidth: "50ch" }}>
            {sections.solution[locale]}
          </p>
        </Section>

        {children}

        {/* Stats — visual break */}
        {project.stats && (
          <motion.div
            className="my-24 py-16"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInUp}
            transition={transitions.slow}
          >
            <div className="grid gap-8 sm:grid-cols-3">
              {project.stats.map((stat, i) => (
                <motion.div
                  key={stat.label[locale]}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportConfig}
                  variants={fadeInUp}
                  transition={{ ...transitions.slow, delay: 0.1 * i }}
                >
                  <span
                    className="block font-heading mb-2"
                    style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1, fontWeight: typography.weight.medium, color: colors.primary }}
                  >
                    {stat.value}
                  </span>
                  <span className="font-body" style={{ fontSize: typography.size.caption, color: colors.muted }}>
                    {stat.label[locale]}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Industries */}
        {project.industries && (
          <Section label={locale === "cs" ? "Odvětví" : "Industries"} delay={0.05}>
            <div className="grid gap-5 sm:grid-cols-2" style={{ maxWidth: "60ch" }}>
              {project.industries.map((ind, i) => (
                <motion.div
                  key={ind.name[locale]}
                  className="py-5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportConfig}
                  variants={fadeInUp}
                  transition={{ ...transitions.slow, delay: 0.04 * i }}
                >
                  <span className="block font-heading mb-1.5" style={{ fontSize: typography.size.body, fontWeight: typography.weight.medium, color: colors.primary }}>
                    {ind.name[locale]}
                  </span>
                  <span className="font-body" style={{ fontSize: typography.size.caption, color: colors.muted }}>
                    {ind.desc[locale]}
                  </span>
                </motion.div>
              ))}
            </div>
          </Section>
        )}

        {/* Demo Links */}
        {project.demoLinks && (
          <Section label={locale === "cs" ? "Živé demo" : "Live demos"} delay={0.05}>
            <p className="font-body mb-8" style={{ fontSize: typography.size.bodySm, color: colors.muted, maxWidth: "42ch" }}>
              {locale === "cs"
                ? "Vyzkoušejte AI recepční na konkrétních profesiích. Klepněte na mikrofon a mluvte."
                : "Try the AI receptionist on specific professions. Tap the microphone and speak."}
            </p>
            <div className="flex flex-wrap gap-3">
              {project.demoLinks.map((demo, i) => (
                <motion.div
                  key={demo.slug}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportConfig}
                  variants={fadeInUp}
                  transition={{ ...transitions.slow, delay: 0.03 * i }}
                >
                  <Link
                    href={`/${locale}/profese/${demo.slug}`}
                    className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300"
                    style={{
                      background: "rgba(237,237,237,0.04)",
                      border: "1px solid rgba(237,237,237,0.08)",
                      color: colors.accentMuted,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(237,237,237,0.08)";
                      e.currentTarget.style.borderColor = "rgba(237,237,237,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(237,237,237,0.04)";
                      e.currentTarget.style.borderColor = "rgba(237,237,237,0.08)";
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    >
                      <path d="M2 6h8M7 3l3 3-3 3" />
                    </svg>
                    <span className="font-body text-sm">{demo.label[locale]}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Section>
        )}

        {/* Architecture — distinct visual block */}
        <motion.div
          className="my-24 py-12 px-8 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.015)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeInUp}
          transition={transitions.slow}
        >
          <SectionLabel>{locale === "cs" ? "Architektura" : "Architecture"}</SectionLabel>
          <p className="font-body" style={{ fontSize: typography.size.body, lineHeight: typography.lineHeight.relaxed, color: colors.secondary, maxWidth: "50ch" }}>
            {sections.architecture[locale]}
          </p>
        </motion.div>

        {/* Features */}
        <Section label={locale === "cs" ? "Funkce" : "Features"} delay={0.05}>
          <div className="grid gap-4" style={{ maxWidth: "48ch" }}>
            {sections.features[locale].map((feature, i) => (
              <motion.div
                key={feature}
                className="flex items-center gap-3.5"
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                variants={fadeInUp}
                transition={{ ...transitions.slow, delay: 0.04 * i }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round">
                  <path d="M3 7l3 3 5-5" />
                </svg>
                <span className="font-body" style={{ fontSize: typography.size.body, color: colors.secondary }}>
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Current Status — accent callout */}
        <motion.div
          className="my-24 py-10 px-8 rounded-xl"
          style={{
            background: "rgba(237,237,237,0.03)",
            border: "1px solid rgba(237,237,237,0.06)",
          }}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeInUp}
          transition={transitions.slow}
        >
          <SectionLabel>{locale === "cs" ? "Aktuální stav" : "Current Status"}</SectionLabel>
          <p className="font-body" style={{ fontSize: typography.size.body, lineHeight: typography.lineHeight.relaxed, color: colors.accentMuted, maxWidth: "50ch" }}>
            {sections.currentStatus[locale]}
          </p>
        </motion.div>

        {/* Development Timeline — vertical line */}
        <Section label={locale === "cs" ? "Harmonogram vývoje" : "Development Timeline"} delay={0.05}>
          <div className="relative flex flex-col gap-0" style={{ maxWidth: "50ch" }}>
            {sections.timeline.map((entry, i) => (
              <motion.div
                key={entry.date}
                className="relative flex items-start gap-6"
                style={{
                  paddingTop: i === 0 ? 0 : "20px",
                  paddingBottom: i === sections.timeline.length - 1 ? 0 : "20px",
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
                      width: "6px",
                      height: "6px",
                      background: colors.accent,
                      marginTop: "5px",
                    }}
                  />
                  {i < sections.timeline.length - 1 && (
                    <span
                      className="block"
                      style={{
                        width: "1px",
                        flex: 1,
                        background: "rgba(237,237,237,0.12)",
                        marginTop: "6px",
                      }}
                    />
                  )}
                </div>
                <div className="pt-0">
                  <span
                    className="block font-mono mb-1.5"
                    style={{ fontSize: "10px", letterSpacing: typography.letterSpacing.wider, color: colors.accentMuted }}
                  >
                    {entry.date}
                  </span>
                  <span
                    className="font-body"
                    style={{ fontSize: typography.size.bodySm, lineHeight: typography.lineHeight.relaxed, color: colors.secondary }}
                  >
                    {entry.label[locale]}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Future Plans */}
        <Section label={locale === "cs" ? "Budoucí plány" : "Future Plans"} delay={0.05}>
          <p className="font-body" style={{ fontSize: typography.size.body, lineHeight: typography.lineHeight.relaxed, color: colors.secondary, maxWidth: "50ch" }}>
            {sections.futurePlans[locale]}
          </p>
        </Section>

        {/* Gallery — more breathing room */}
        <div className="my-28">
          <ProjectGallery locale={locale} />
        </div>

        {/* Dev Log — editorial separation */}
        <div className="my-28">
          <DevelopmentLog projectSlug={project.slug} locale={locale} />
        </div>

        {/* Related Projects */}
        <div className="my-28">
          <RelatedProjects relatedSlugs={project.relatedSlugs} currentSlug={project.slug} locale={locale} />
        </div>

        {/* Navigation */}
        <ProjectNavigation currentSlug={project.slug} locale={locale} />
      </div>
    </section>
  );
}
