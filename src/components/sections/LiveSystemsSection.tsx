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
    title: s.title?.[locale] ?? s.name[locale],
    subtitle: s.subtitle?.[locale] ?? "",
    description: s.description?.[locale] ?? "",
    metadata: s.metadata?.[locale] ?? [],
    badge: s.badge ?? "",
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
  title: string;
  subtitle: string;
  description: string;
  metadata: string[];
  badge: string;
  problem: string;
  ai: string;
  impact: string;
  href: string;
}

function SystemCard({ system, locale }: { system: System; locale: Locale }) {
  const { title, subtitle, description, metadata, badge, href } = system;

  return (
    <motion.div variants={fadeUp} className="h-full">
      <Link href={`/${locale}${href}`} className="block no-underline h-full">
        <div
          className="group relative h-full rounded-2xl overflow-hidden transition-all duration-500 card-light"
          style={{
            background: "linear-gradient(135deg, rgba(18,19,22,0.95) 0%, rgba(10,10,11,0.98) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            padding: "clamp(28px, 3vw, 40px)",
          }}
          onMouseMove={cardLightHandler}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-accent-border)";
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,74,46,0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
            e.currentTarget.style.transform = "translateY(0px)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {/* Top row: badge + arrow */}
          <div className="flex items-center justify-between mb-6">
            {badge && (
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full font-mono"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#FF4A2E",
                  background: "rgba(255,74,46,0.08)",
                  border: "1px solid rgba(255,74,46,0.15)",
                }}
              >
                {badge}
              </span>
            )}
            <span
              className="flex-shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
              style={{ fontSize: 20, color: "rgba(255,255,255,0.15)", opacity: 0.5 }}
              aria-hidden="true"
            >
              →
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-heading mb-2"
            style={{
              fontSize: "clamp(28px, 3vw, 40px)",
              fontWeight: 500,
              lineHeight: "var(--leading-heading)",
              letterSpacing: "-0.025em",
              color: "#F4F6F8",
            }}
          >
            {title}
          </h3>

          {/* Subtitle */}
          {subtitle && (
            <p
              className="font-body mb-5"
              style={{
                fontSize: "clamp(16px, 1.5vw, 19px)",
                lineHeight: 1.5,
                color: "rgba(244,246,248,0.5)",
              }}
            >
              {subtitle}
            </p>
          )}

          {/* Description */}
          {description && (
            <p
              className="font-body mb-6"
              style={{
                fontSize: "clamp(14px, 1.2vw, 16px)",
                lineHeight: 1.65,
                color: "#9AA1AB",
              }}
            >
              {description}
            </p>
          )}

          {/* Metadata tags */}
          {metadata.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto">
              {metadata.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg font-mono"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#6E7683",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Subtle glow on hover */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,74,46,0.04) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
        </div>
      </Link>
    </motion.div>
  );
}
