"use client";

import { motion } from "framer-motion";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { list, getPage } from "@/content/repository";
import ProjectCard from "@/components/ProjectCard";
import StateNotice from "@/components/StateNotice";

interface Props {
  locale: Locale;
}

export default function ProjectsContent({ locale }: Props) {
  const isCs = locale === "cs";
  const page = getPage("projekty");
  const badge = page?.data.badge[locale] ?? "";
  const title = page?.data.title[locale] ?? "";
  const subtitle = page?.data.subtitle[locale] ?? "";
  const projects = list("project");

  return (
    <div
      className="relative"
      style={{
        background: "#0A0A0B",
        minHeight: "100vh",
        padding: "clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-label font-mono font-semibold tracking-[0.15em] uppercase mb-6 sm:mb-8"
          style={{ color: "#6E7683" }}
        >
          {badge}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading leading-tight"
          style={{ fontSize: "var(--text-h1-md)", letterSpacing: "-0.03em", color: "#F4F6F8", maxWidth: "14ch" }}
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="font-body mt-4 leading-relaxed"
          style={{ fontSize: "var(--text-body)", color: "#9AA1AB", maxWidth: "44ch" }}
        >
          {subtitle}
        </motion.p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12 sm:mt-16">
          {projects.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3">
              <StateNotice variant="empty" message={t(locale, "ui.emptyProjects")} />
            </div>
          ) : (
            projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              locale={locale}
              name={project.name[locale]}
              desc={project.tagline[locale]}
              badge={project.badge[locale]}
              poster={project.poster}
              href={project.href}
              external={project.external}
              index={i}
            />
          ))
          )}
        </div>
      </div>
    </div>
  );
}
