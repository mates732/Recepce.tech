"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useParallax } from "@/lib/scroll";
import { stagger, fadeUp } from "@/lib/motion";
import SectionHeader from "@/components/lab/SectionHeader";
import type { Locale } from "@/lib/types";
import { getPage } from "@/content/repository";
import StatusPill from "@/components/lab/StatusPill";

interface TrustProofSectionProps {
  locale: Locale;
}

interface ProofSystem {
  index: number;
  name: string;
  status: string;
  problem: string;
  solution: string;
  capabilities: string[];
  impact?: string;
}

export default function TrustProofSection({ locale }: TrustProofSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const data = getPage("home")?.data.trustProof;
  const title = data?.title[locale] ?? "";
  const subtitle = data?.subtitle[locale] ?? "";
  const systems: ProofSystem[] = (data?.systems ?? []).map((s, i) => ({
    index: i + 1,
    name: s.name[locale],
    status: s.status,
    problem: s.problem[locale],
    solution: s.solution[locale],
    capabilities: s.capabilities[locale],
    impact: s.impact ? s.impact[locale] : undefined,
  }));

  const y = useParallax(sectionRef, 30, -30);

  return (
    <section
      id="trust-proof"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ padding: "clamp(48px, 8vw, 110px) clamp(24px, 5vw, 80px)" }}
    >
      <motion.div style={{ y, maxWidth: "1200px" }} className="relative z-10 mx-auto">
        <SectionHeader eyebrow="/ 06" eyebrowColor="#FF4A2E" title={title} subtitle={subtitle} />

        <motion.div
          className="flex flex-col"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {systems.map((system) => (
            <ProofRow key={system.index} system={system} locale={locale} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function ProofRow({ system, locale }: { system: ProofSystem; locale: Locale }) {
  const { index, name, status, problem, solution, capabilities, impact } = system;

  return (
    <motion.div variants={fadeUp} className="border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <div className="py-7 sm:py-9 grid gap-6 lg:grid-cols-12">
        {/* Identity */}
        <div className="lg:col-span-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className="font-mono"
              style={{ fontSize: "var(--text-label)", letterSpacing: "0.2em", color: "#6E7683" }}
            >
              {locale === "cs" ? "SYSTÉM_" : "SYSTEM_"}{String(index).padStart(2, "0")}
            </span>
            <h3 className="font-heading" style={{ fontSize: "var(--text-h3)", color: "#F4F6F8" }}>
              {name}
            </h3>
          </div>
          <StatusPill status={status} locale={locale} />
        </div>

        {/* Problem / Solution */}
        <div className="lg:col-span-5 grid gap-5 sm:grid-cols-2 lg:gap-6">
          <div>
            <span
              className="font-mono"
              style={{ fontSize: "var(--text-label)", letterSpacing: "0.18em", textTransform: "uppercase", color: "#6E7683" }}
            >
              {locale === "cs" ? "Problém" : "Problem"}
            </span>
            <p className="font-body text-sm leading-relaxed mt-1.5" style={{ color: "#C7CDD6" }}>
              {problem}
            </p>
          </div>
          <div>
            <span
              className="font-mono"
              style={{ fontSize: "var(--text-label)", letterSpacing: "0.18em", textTransform: "uppercase", color: "#6E7683" }}
            >
              {locale === "cs" ? "Řešení" : "Solution"}
            </span>
            <p className="font-body text-sm leading-relaxed mt-1.5" style={{ color: "#C7CDD6" }}>
              {solution}
            </p>
          </div>
        </div>

        {/* Technology + impact */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {capabilities.map((t) => (
              <span
                key={t}
                className="rounded-full px-2.5 py-1 font-mono text-label-sm tracking-[0.08em]"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "#C7CDD6",
                }}
              >
                {t}
              </span>
            ))}
          </div>
          {impact && (
            <p className="font-body text-sm leading-relaxed mt-auto" style={{ color: "#34D399" }}>
              {impact}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
