"use client";

import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { useElementScrollProgress, useParallax, OFFSET_ENTRY_EXIT } from "@/lib/scroll";
import { stagger, fadeUp } from "@/lib/motion";
import SectionHeader from "@/components/lab/SectionHeader";
import type { Locale } from "@/lib/types";
import { getPage } from "@/content/repository";

interface SystemsSectionProps {
  locale: Locale;
}

const NODE_COLORS = [
  "#FF4A2E",
  "#FF4A2E",
  "#FF4A2E",
  "#FF4A2E",
  "#FF4A2E",
];

export default function SystemsSection({ locale }: SystemsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const data = getPage("home")?.data.systems;
  const title = data?.title[locale] ?? "";
  const subtitle = data?.subtitle[locale] ?? "";
  const statement = data?.statement[locale] ?? "";
  const stages = (data?.stages ?? []).map((s) => ({
    label: s.label[locale],
    desc: s.desc[locale],
  }));

  const y = useParallax(sectionRef, 30, -30);
  const bgY = useParallax(sectionRef, 90, -90);
  const flowProgress = useElementScrollProgress(flowRef, OFFSET_ENTRY_EXIT);
  const lineScale = useTransform(flowProgress, [0, 0.75], [0, 1]);

  return (
    <section
      id="architektura"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ padding: "clamp(48px, 8vw, 110px) clamp(24px, 5vw, 80px)" }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          y: bgY,
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(255,74,46,0.05) 0%, transparent 65%)",
        }}
      />
      <motion.div style={{ y, maxWidth: "1200px" }} className="relative z-10 mx-auto">
        <SectionHeader
          eyebrow="/ 04"
          eyebrowColor="#FF4A2E"
          title={title}
          subtitle={subtitle}
          align="center"
        />

        <div ref={flowRef} className="relative max-w-3xl mx-auto">
          {/* Animated pipeline line */}
          <motion.div
            aria-hidden="true"
            className="absolute left-[13px] top-2 bottom-2 w-px origin-top"
            style={{
              background: "linear-gradient(to bottom, var(--color-accent-hover), var(--color-accent) 50%, var(--color-accent-deep))",
              scaleY: lineScale,
              willChange: "transform",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute left-[13px] top-2 bottom-2 w-px"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          {/* Data flow — částice cestující architekturou */}
          <div aria-hidden="true" className="absolute left-[13px] top-2 bottom-2 w-px overflow-visible">
            <span className="flow-particle" style={{ background: "#FF4A2E", boxShadow: "0 0 8px rgba(255,74,46,0.9)", animationDelay: "0s" }} />
            <span className="flow-particle" style={{ background: "#FF6B3D", boxShadow: "0 0 8px rgba(255,107,61,0.9)", animationDelay: "2.7s" }} />
            <span className="flow-particle" style={{ background: "#E8341F", boxShadow: "0 0 8px rgba(232,52,31,0.9)", animationDelay: "5.4s" }} />
          </div>

          <motion.div
            className="relative flex flex-col"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {stages.map((stage, i) => (
              <motion.div
                key={stage.label}
                variants={fadeUp}
                className="relative flex items-start gap-6 sm:gap-8 pb-8 sm:pb-10 last:pb-0"
              >
                <div
                  className="relative z-10 mt-1 w-[27px] h-[27px] rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "#0A0A0B",
                    border: `2px solid ${NODE_COLORS[i % NODE_COLORS.length]}`,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="w-2 h-2 rounded-full"
                    style={{ background: NODE_COLORS[i % NODE_COLORS.length], animation: "pulse-dot 2.4s ease-in-out infinite" }}
                  />
                </div>
                <div className="flex-1 pt-0.5">
                  <h3
                    className="font-heading"
                    style={{ fontSize: "var(--text-h3)", color: "#F4F6F8" }}
                  >
                    {stage.label}
                  </h3>
                  <p className="font-body text-sm mt-1 leading-relaxed" style={{ color: "#9AA1AB" }}>
                    {stage.desc}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="font-mono select-none mt-0.5"
                  style={{ fontSize: "var(--text-label)", color: NODE_COLORS[i % NODE_COLORS.length], letterSpacing: "0.2em" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.p
          className="font-heading mx-auto text-center mt-12 sm:mt-16"
          style={{
            fontSize: "var(--text-h2-lg)",
            letterSpacing: "-0.02em",
            color: "#F4F6F8",
            maxWidth: "24ch",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="gradient-text">{statement}</span>
        </motion.p>
      </motion.div>
    </section>
  );
}
