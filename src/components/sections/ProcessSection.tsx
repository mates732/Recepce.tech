"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useParallax } from "@/lib/scroll";
import type { Locale } from "@/lib/types";
import { getPage } from "@/content/repository";

interface ProcessSectionProps {
  locale: Locale;
}

export default function ProcessSection({ locale }: ProcessSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const process = getPage("home")?.data.process;
  const data = (process?.steps ?? []).map((s) => ({
    title: s.title[locale],
    desc: s.desc[locale],
  }));
  const title = process?.title[locale] ?? "";
  const subtitle = process?.subtitle[locale] ?? "";

  const y = useParallax(sectionRef, 40, -40);

  return (
    <section
      id="proces"
      ref={sectionRef}
      className="relative"
      style={{
        padding: "clamp(48px, 8vw, 100px) clamp(24px, 5vw, 80px)",
      }}
    >
      <motion.div style={{ y, maxWidth: "1200px" }} className="relative z-10 mx-auto">
          <div className="text-center mb-10 sm:mb-16">
          <h2
            className="font-heading"
            style={{
              fontSize: "var(--text-h1)",
              letterSpacing: "-0.03em",
              color: "#F4F6F8",
            }}
          >
            {title}
          </h2>
          <p
            className="mt-3 font-body"
            style={{
              fontSize: "var(--text-lead)",
              color: "#9AA1AB",
            }}
          >
            {subtitle}
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-[18px] sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-px"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />

          <div className="relative flex flex-col gap-10 sm:gap-12">
            {data.map((step, i) => (
              <ProcessStep
                key={step.title}
                step={step}
                index={i}
                total={data.length}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function ProcessStep({
  step,
  index,
  total,
}: {
  step: { title: string; desc: string };
  index: number;
  total: number;
}) {
  const isLeft = index % 2 === 0;
  const dotRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex items-start gap-6 sm:gap-8"
      style={{
        paddingLeft: "48px",
        paddingRight: "0",
      }}
    >
      {/* Dot */}
      <div
        ref={dotRef}
        className="absolute left-[11px] sm:left-1/2 sm:-translate-x-1/2 z-10"
        style={{ top: "6px" }}
      >
        <div
          className="w-4 h-4 rounded-full border-2"
          style={{
            borderColor: "var(--color-accent)",
            background: "#121316",
          }}
        />
      </div>

      {/* Content */}
      <div
        className="relative"
        style={{
          width: "100%",
          maxWidth: "480px",
          marginLeft: isLeft ? "0" : "auto",
          marginRight: isLeft ? "auto" : "0",
        }}
      >
        <div
          className="relative overflow-hidden p-6 sm:p-8 rounded-2xl transition-all duration-500"
          style={{
            background: "#FCFCFD",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,255,255,0.06)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.transform = "translateY(0px)";
          }}
        >
          <span
            aria-hidden="true"
            className="absolute top-4 right-5 sm:top-6 sm:right-7 font-heading leading-none select-none"
            style={{ fontSize: "var(--text-h1-lg)", color: "rgba(255,255,255,0.05)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3
            className="font-heading mb-2"
            style={{
              fontSize: "var(--text-h3)",
              color: "#F4F6F8",
            }}
          >
            {step.title}
          </h3>
          <p
            className="font-body text-sm leading-relaxed"
            style={{ color: "#9AA1AB" }}
          >
            {step.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
