"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { list, getPage } from "@/content/repository";
import type { ProjectContent } from "@/content/types";
import StateNotice from "@/components/StateNotice";

interface Props {
  locale: Locale;
}

const WEB_PROJECT_IDS = ["ponici", "zlaty-hreben"];

export default function WebsitesContent({ locale }: Props) {
  const isCs = locale === "cs";
  const page = getPage("webs");
  const badge = page?.data.badge[locale] ?? "";
  const title = page?.data.title[locale] ?? "";
  const subtitle = page?.data.subtitle[locale] ?? "";
  const projects = list("project").filter((p) => WEB_PROJECT_IDS.includes(p.id));

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{
        minHeight: "100vh",
        padding: "clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)",
      }}
    >
      <div className="flex flex-col items-center w-full max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-label font-mono font-semibold tracking-[0.15em] uppercase mb-6"
          style={{ color: "#6E7683" }}
        >
          {badge}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading leading-tight text-center"
          style={{ fontSize: "var(--text-h1-md)", letterSpacing: "-0.03em", color: "#F4F6F8", maxWidth: "16ch" }}
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="font-body mt-4 leading-relaxed text-center"
          style={{ fontSize: "var(--text-body)", color: "#9AA1AB", maxWidth: "52ch" }}
        >
          {subtitle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading mt-6 text-center"
          style={{
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            fontSize: "var(--text-h4)",
            letterSpacing: "-0.01em",
            color: "#F4F6F8",
          }}
        >
          {locale === "cs"
            ? "Každý projekt začíná pochopením. Design je až výsledek."
            : "Every project starts with understanding. Design is the result."}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading mt-2 text-center"
          style={{
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(18px, 2.2vw, 26px)",
            color: "#9AA1AB",
          }}
        >
          {locale === "cs"
            ? "Vytváříme digitální prostředí pro značky, které mají skutečný příběh."
            : "We create digital environments for brands with a real story."}
        </motion.p>

        {projects.length === 0 ? (
          <div className="mt-12 w-full max-w-[320px]">
            <StateNotice variant="empty" message={t(locale, "ui.noProjectFound")} />
          </div>
        ) : (
          <div
            className="grid gap-6 mt-12 sm:mt-14 w-full"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))" }}
          >
            {projects.map((project, i) => (
              <WebProjectCard key={project.id} project={project} locale={locale} index={i} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4, ease: [0.22, 0.8, 0.2, 1] }}
          className="mt-12 sm:mt-14"
        >
          <Link
            href={`/${locale}/projekty`}
            className="inline-block transition-all duration-200 hover:opacity-60"
            style={{
              fontSize: "var(--text-body)",
              color: "rgba(255,255,255,0.25)",
              fontWeight: 400,
            }}
          >
            &larr; {t(locale, "ui.back")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function WebProjectCard({
  project,
  locale,
  index,
}: {
  project: ProjectContent;
  locale: Locale;
  index: number;
}) {
  const name = project.name[locale];
  const desc = project.tagline[locale];
  const category = project.category?.[locale];
  const tags = project.tags?.[locale] ?? [];
  const outcome = project.outcome?.[locale];
  const liveHref = project.liveHref;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link href={`/${locale}${project.href}`} className="group block no-underline h-full">
        <div
          className="relative h-full rounded-2xl overflow-hidden transition-all duration-500 group-hover:-translate-y-1"
          style={{
            background: "#121316",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 2px 12px rgba(255,255,255,0.04)",
          }}
        >
          <div className="relative overflow-hidden" style={{ aspectRatio: "16/11", background: "#1B1D22" }}>
            <Image
              src={project.poster}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>

          <div
            className="p-6 sm:p-7 flex flex-col gap-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {category && (
              <span
                className="font-mono"
                style={{
                  fontSize: "var(--text-label)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                }}
              >
                {category}
              </span>
            )}
            <h3
              className="font-heading"
              style={{ fontSize: "var(--text-h3)", color: "#F4F6F8", letterSpacing: "-0.02em" }}
            >
              {name}
            </h3>
            <p className="font-body text-sm leading-relaxed" style={{ color: "#9AA1AB" }}>
              {desc}
            </p>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-2.5 py-1 font-mono text-label-sm tracking-[0.08em]"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      color: "#C7CDD6",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {outcome && (
              <p
                className="font-mono"
                style={{
                  fontSize: "var(--text-label)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  marginTop: 2,
                }}
              >
                {outcome}
              </p>
            )}

            {liveHref && (
              <a
                href={liveHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 font-mono transition-opacity duration-200 hover:opacity-60"
                style={{
                  fontSize: "var(--text-label)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#9AA1AB",
                  marginTop: 2,
                }}
              >
                {liveHref.replace(/^https:\/\//, "").replace(/\/$/, "")}
                <span aria-hidden="true" style={{ fontSize: 10 }}>↗</span>
              </a>
            )}

            <span
              className="group/link inline-flex items-center gap-2 font-mono text-label-fluid tracking-[0.16em] uppercase transition-colors duration-300 mt-2"
              style={{ color: "#9AA1AB" }}
            >
              <span className="transition-colors duration-300 group-hover/link:text-[var(--color-accent)]">
                {locale === "cs" ? "Zobrazit případovou studii" : "View case study"}
              </span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="transition-transform duration-300 group-hover/link:translate-x-1"
              >
                <path d="M1 8h12m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
