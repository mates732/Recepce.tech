"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParallax } from "@/lib/scroll";
import { stagger, fadeUp, cardLightHandler } from "@/lib/motion";
import SectionHeader from "@/components/lab/SectionHeader";
import type { Locale } from "@/lib/types";
import { getPage } from "@/content/repository";

interface LaboratorySectionProps {
  locale: Locale;
}

export default function LaboratorySection({ locale }: LaboratorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const lab = getPage("home")?.data.laboratory;
  const title = lab?.title[locale] ?? "";
  const subtitle = lab?.subtitle[locale] ?? "";
  const experiments = (lab?.experiments ?? []).map((e, i) => ({
    index: i + 1,
    name: e.name[locale],
    problem: e.problem[locale],
    capabilities: e.capabilities[locale],
    href: e.href,
  }));

  const y = useParallax(sectionRef, 30, -30);

  return (
    <section
      id="laborator"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ padding: "clamp(48px, 8vw, 110px) clamp(24px, 5vw, 80px)" }}
    >
      <motion.div style={{ y, maxWidth: "1200px" }} className="relative z-10 mx-auto">
        <SectionHeader eyebrow="/ 01" eyebrowColor="#FF4A2E" title={title} subtitle={subtitle} />

        <motion.div
          className="grid gap-5 sm:gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
          }}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {experiments.map((exp) => (
            <ExperimentCard key={exp.index} experiment={exp} locale={locale} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

interface Experiment {
  index: number;
  name: string;
  problem: string;
  capabilities: string[];
  href: string;
}

function ExperimentCard({ experiment, locale }: { experiment: Experiment; locale: Locale }) {
  const { index, name, problem, capabilities, href } = experiment;

  return (
    <motion.div variants={fadeUp} className="h-full">
      <Link href={`/${locale}${href}`} className="block no-underline h-full">
        <div
          className="group relative h-full rounded-2xl p-6 sm:p-8 overflow-hidden transition-all duration-500 card-light"
          style={{
            background: "#121316",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onMouseMove={cardLightHandler}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-accent-border)";
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.transform = "translateY(0px)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span
            aria-hidden="true"
            className="absolute top-5 right-6 font-mono select-none"
            style={{ fontSize: "var(--text-h1-lg)", color: "rgba(255,255,255,0.05)", letterSpacing: "-0.03em" }}
          >
            {String(index).padStart(2, "0")}
          </span>

          <div className="flex items-center justify-between gap-3 mb-5">
            <span
              className="font-mono"
              style={{ fontSize: "var(--text-label)", letterSpacing: "0.2em", color: "#6E7683" }}
            >
              {locale === "cs" ? "SYSTÉM_" : "SYSTEM_"}{String(index).padStart(2, "0")}
            </span>
          </div>

          <h3
            className="font-heading mb-3"
            style={{ fontSize: "var(--text-h3)", color: "#F4F6F8" }}
          >
            {name}
          </h3>
          <p className="font-body text-sm leading-relaxed mb-5" style={{ color: "#9AA1AB" }}>
            {problem}
          </p>

          <ul className="flex flex-col gap-1.5 mb-6">
            {capabilities.map((c) => (
              <li key={c} className="flex items-start gap-2.5 font-body text-sm" style={{ color: "#6E7683" }}>
                <span aria-hidden="true" className="mt-2 inline-block w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--color-accent)" }} />
                {c}
              </li>
            ))}
          </ul>

          <span
            className="inline-flex items-center gap-2 font-mono text-label-fluid tracking-[0.16em] uppercase transition-colors duration-300"
            style={{ color: "#9AA1AB" }}
          >
            <span className="transition-colors duration-300 group-hover:text-[var(--color-accent)]">
              {locale === "cs" ? "Otevřít systém" : "Open system"}
            </span>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M1 8h12m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
