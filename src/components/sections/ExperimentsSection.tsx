"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useParallax } from "@/lib/scroll";
import { stagger, fadeUp } from "@/lib/motion";
import SectionHeader from "@/components/lab/SectionHeader";
import type { Locale } from "@/lib/types";
import { getPage } from "@/content/repository";

interface ExperimentsSectionProps {
  locale: Locale;
}

const PHASE_COLORS = ["#FF4A2E", "#FF4A2E", "#FF4A2E"];

export default function ExperimentsSection({ locale }: ExperimentsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const data = getPage("home")?.data.experiments;
  const title = data?.title[locale] ?? "";
  const subtitle = data?.subtitle[locale] ?? "";
  const phases = (data?.phases ?? []).map((p, i) => ({
    index: i,
    label: p.label[locale],
    phaseTitle: p.title[locale],
    items: p.items.map((it) => ({ name: it.name[locale], desc: it.desc[locale] })),
  }));

  const y = useParallax(sectionRef, 30, -30);

  return (
    <section
      id="experimenty"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ padding: "clamp(48px, 8vw, 110px) clamp(24px, 5vw, 80px)" }}
    >
      <motion.div style={{ y, maxWidth: "1200px" }} className="relative z-10 mx-auto">
        <SectionHeader eyebrow="/ 10" eyebrowColor="#FF4A2E" title={title} subtitle={subtitle} />

        <motion.div
          className="grid gap-5 sm:gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))" }}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {phases.map((phase) => (
            <motion.div
              key={phase.label}
              variants={fadeUp}
              className="relative rounded-2xl p-6 sm:p-7"
              style={{
                background: "#121316",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span
                className="font-mono"
                style={{ fontSize: "var(--text-label)", letterSpacing: "0.2em", textTransform: "uppercase", color: PHASE_COLORS[phase.index % PHASE_COLORS.length] }}
              >
                {phase.label}
              </span>
              <h3
                className="font-heading mt-2 mb-5"
                style={{ fontSize: "var(--text-h3)", color: "#F4F6F8" }}
              >
                {phase.phaseTitle}
              </h3>

              <ul className="flex flex-col">
                {phase.items.map((item) => (
                  <li
                    key={item.name}
                    className="py-4 border-t"
                    style={{ borderColor: "rgba(255,255,255,0.07)" }}
                  >
                    <p className="font-body text-sm font-medium" style={{ color: "#F4F6F8" }}>
                      {item.name}
                    </p>
                    <p className="font-body text-xs leading-relaxed mt-1" style={{ color: "#6E7683" }}>
                      {item.desc}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
