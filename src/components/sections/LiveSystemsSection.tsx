"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParallax } from "@/lib/scroll";
import { stagger, fadeUp, cardLightHandler } from "@/lib/motion";
import SectionHeader from "@/components/lab/SectionHeader";
import type { Locale } from "@/lib/types";
import { getPage } from "@/content/repository";

interface LiveSystemsSectionProps {
  locale: Locale;
}

export default function LiveSystemsSection({ locale }: LiveSystemsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const data = getPage("home")?.data.liveSystems;
  const title = data?.title[locale] ?? "";
  const subtitle = data?.subtitle[locale] ?? "";
  const systems = (data?.systems ?? []).map((s) => ({
    name: s.name[locale],
    problem: s.problem[locale],
    ai: s.ai[locale],
    impact: s.impact[locale],
    href: s.href,
  }));

  const y = useParallax(sectionRef, 30, -30);

  return (
    <section
      id="live-systems"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ padding: "clamp(48px, 8vw, 110px) clamp(24px, 5vw, 80px)" }}
    >
      <motion.div style={{ y, maxWidth: "1200px" }} className="relative z-10 mx-auto">
        <SectionHeader eyebrow="/ 02" eyebrowColor="#FF4A2E" title={title} subtitle={subtitle} />

        <motion.div
          className="grid gap-5 sm:gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))" }}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {systems.map((system) => (
            <SystemCard key={system.name} system={system} locale={locale} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

interface System {
  name: string;
  problem: string;
  ai: string;
  impact: string;
  href: string;
}

function SystemCard({ system, locale }: { system: System; locale: Locale }) {
  const { name, problem, ai, impact, href } = system;

  return (
    <motion.div variants={fadeUp} className="h-full">
      <Link href={`/${locale}${href}`} className="block no-underline h-full">
        <div
          className="group relative h-full rounded-2xl p-6 sm:p-7 overflow-hidden transition-all duration-500 card-light"
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
          <h3 className="font-heading mb-5" style={{ fontSize: "var(--text-h3)", color: "#F4F6F8" }}>
            {name}
          </h3>

          <SystemRow
            label={locale === "cs" ? "Řešený problém" : "Problem solved"}
            value={problem}
          />
          <SystemRow
            label={locale === "cs" ? "Co systém umí" : "What the system does"}
            value={ai}
          />
          <SystemRow
            label={locale === "cs" ? "Dopad na byznys" : "Business impact"}
            value={impact}
            accent
            arrow={
              <span
                aria-hidden="true"
                className="flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                style={{ fontSize: 18, color: "rgba(255,255,255,0.22)" }}
              >
                →
              </span>
            }
          />
        </div>
      </Link>
    </motion.div>
  );
}

function SystemRow({
  label,
  value,
  accent,
  arrow,
}: {
  label: string;
  value: string;
  accent?: boolean;
  arrow?: React.ReactNode;
}) {
  return (
    <div
      className={`py-3.5 border-t ${arrow ? "flex items-center justify-between gap-3" : ""}`}
      style={{ borderColor: "rgba(255,255,255,0.07)" }}
    >
      <div className="flex flex-col gap-1">
        <span
          className="font-mono"
          style={{ fontSize: "var(--text-label)", letterSpacing: "0.18em", textTransform: "uppercase", color: "#6E7683" }}
        >
          {label}
        </span>
        <span className="font-body text-sm leading-relaxed" style={{ color: accent ? "#F4F6F8" : "#C7CDD6" }}>
          {value}
        </span>
      </div>
      {arrow}
    </div>
  );
}
