"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useParallax } from "@/lib/scroll";
import type { Locale } from "@/lib/types";

interface ProcessSectionProps {
  locale: Locale;
}

const steps = {
  cs: [
    { title: "Nápad", desc: "Definice problému, cílů a vize. Žádné zbytečnosti." },
    { title: "Design", desc: "Architektura řešení, UX, vizuální jazyk. Každý prvek má důvod." },
    { title: "AI", desc: "Trénink modelů, prompt engineering, integrace. Inteligence jako základ." },
    { title: "Vývoj", desc: "Čistý kód, API, infrastruktura. Stavíme pro produkci." },
    { title: "Launch", desc: "Nasazení, monitoring, optimalizace. Hotovo není nikdy." },
    { title: "Optimalizace", desc: "Data, feedback, iterace. Každý cyklus je lepší." },
  ],
  en: [
    { title: "Idea", desc: "Define the problem, goals, and vision. No fluff." },
    { title: "Design", desc: "Solution architecture, UX, visual language. Every element has a reason." },
    { title: "AI", desc: "Model training, prompt engineering, integration. Intelligence as foundation." },
    { title: "Development", desc: "Clean code, APIs, infrastructure. Built for production." },
    { title: "Launch", desc: "Deployment, monitoring, optimization. Never truly done." },
    { title: "Optimization", desc: "Data, feedback, iteration. Every cycle is better." },
  ],
};

export default function ProcessSection({ locale }: ProcessSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const data = steps[locale];
  const title = locale === "cs" ? "Jak vznikají systémy" : "How systems are built";
  const subtitle = locale === "cs"
    ? "Od nápadu po produkci. Každá fáze má svůj význam."
    : "From idea to production. Every phase matters.";

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
              fontSize: "clamp(32px, 5vw, 64px)",
              letterSpacing: "-0.03em",
              color: "#111111",
            }}
          >
            {title}
          </h2>
          <p
            className="mt-3 font-body"
            style={{
              fontSize: "clamp(14px, 1.2vw, 18px)",
              color: "#5F6368",
            }}
          >
            {subtitle}
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-[18px] sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-px"
            style={{ background: "rgba(17,17,17,0.08)" }}
          />

          <div className="relative flex flex-col gap-10 sm:gap-12">
            {data.map((step, i) => (
              <ProcessStep
                key={step.title}
                step={step}
                index={i}
                total={data.length}
                shouldReduceMotion={!!shouldReduceMotion}
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
  shouldReduceMotion,
}: {
  step: { title: string; desc: string };
  index: number;
  total: number;
  shouldReduceMotion: boolean;
}) {
  const isLeft = index % 2 === 0;
  const dotRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 40 }}
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
          className="w-4 h-4 rounded-full border-2 transition-all duration-500 group-hover:scale-125"
          style={{
            borderColor: "#111111",
            background: "#FFFFFF",
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
          className="p-6 sm:p-8 rounded-2xl transition-all duration-500"
          style={{
            background: "#FCFCFD",
            border: "1px solid rgba(17,17,17,0.06)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(17,17,17,0.15)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(17,17,17,0.06)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(17,17,17,0.06)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.transform = "translateY(0px)";
          }}
        >
          <h3
            className="font-heading mb-2"
            style={{
              fontSize: "clamp(20px, 2vw, 28px)",
              color: "#111111",
            }}
          >
            {step.title}
          </h3>
          <p
            className="font-body text-sm leading-relaxed"
            style={{ color: "#5F6368" }}
          >
            {step.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
