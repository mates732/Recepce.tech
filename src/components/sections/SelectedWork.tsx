"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { projects } from "@/data/projects";
import { colors, typography, duration, ease } from "@/design/tokens";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, transitions, viewportConfig } from "@/design/animations";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";

interface Props {
  locale: Locale;
}

const statusColors = {
  active: "accent",
  concept: "violet",
  client: "muted",
} as const;

export default function SelectedWork({ locale }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <Section id="work">
      <Container>
        <SectionLabel>
          {locale === "cs" ? "Vybraná práce" : "Selected work"}
        </SectionLabel>

        <motion.div
          className="mt-12 flex flex-col"
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={staggerContainer}
          transition={transitions.slow}
        >
          {projects.map((project, index) => {
            const isHovered = hoveredId === project.id;
            const padIndex = String(index + 1).padStart(2, "0");

            return (
              <motion.div
                key={project.id}
                className="group relative"
                variants={staggerItem}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Link
                  href={`/${locale}/projects/${project.slug}`}
                  className="block relative py-5 px-4 -mx-4 rounded-lg cursor-pointer"
                  style={{
                    background: isHovered ? "rgba(255,255,255,0.015)" : "transparent",
                    transition: `all ${duration.normal} ${ease.default}`,
                  }}
                >
                  <div className="flex items-center gap-6">
                    <span
                      className="font-mono shrink-0"
                      style={{
                        fontSize: "11px",
                        letterSpacing: typography.letterSpacing.wider,
                        color: isHovered ? colors.muted : "rgba(102,102,102,0.3)",
                        transition: `color ${duration.normal} ${ease.default}`,
                      }}
                    >
                      {padIndex}
                    </span>

                    <span
                      className="font-heading font-medium shrink-0"
                      style={{
                        fontSize: "clamp(18px, 2.2vw, 28px)",
                        letterSpacing: typography.letterSpacing.tight,
                        color: colors.primary,
                        transition: `transform ${duration.slow} ${ease.default}`,
                        transform: isHovered ? "translateX(4px)" : "translateX(0)",
                      }}
                    >
                      {project.name}
                    </span>

                    <span
                      className="font-body tracking-[0.04em] uppercase shrink-0 hidden md:block"
                      style={{
                        fontSize: "11px",
                        color: "rgba(102,102,102,0.4)",
                      }}
                    >
                      {project.type[locale]}
                    </span>

                    <span className="flex-1" />

                    <Badge variant={statusColors[project.statusVariant]}>
                      {project.status[locale]}
                    </Badge>

                    <span
                      className="font-mono shrink-0 hidden sm:block"
                      style={{
                        fontSize: "11px",
                        letterSpacing: typography.letterSpacing.wider,
                        color: "rgba(102,102,102,0.35)",
                      }}
                    >
                      {project.year}
                    </span>

                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      className="shrink-0"
                      style={{
                        color: isHovered ? colors.muted : "transparent",
                        transition: `all ${duration.slow} ${ease.default}`,
                        transform: isHovered ? "translateX(2px)" : "translateX(-4px)",
                        opacity: isHovered ? 1 : 0,
                      }}
                    >
                      <path d="M3 7h8M7 3l4 4-4 4" />
                    </svg>
                  </div>

                  <div
                    className="overflow-hidden"
                    style={{
                      maxHeight: isHovered ? "80px" : "0",
                      opacity: isHovered ? 1 : 0,
                      transition: `max-height ${duration.normal} ${ease.default}, opacity ${duration.normal} ${ease.default}`,
                    }}
                  >
                    <p
                      className="font-body pt-3 pl-11"
                      style={{
                        fontSize: typography.size.bodySm,
                        color: colors.muted,
                        maxWidth: "50ch",
                      }}
                    >
                      {project.description[locale]}
                    </p>
                  </div>
                </Link>

                <div
                  style={{
                    height: "1px",
                    background: isHovered
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(255,255,255,0.04)",
                    transition: `background ${duration.normal} ${ease.default}`,
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </Section>
  );
}
