"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useParallax } from "@/lib/scroll";
import type { Locale } from "@/lib/types";

interface AboutSectionProps {
  locale: Locale;
}

export default function AboutSection({ locale }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const name = "Matyáš Vojan";
  const handle = "recepce.tech";

  const philosophy = locale === "cs" ? {
    title: "Filozofie",
    text: "Jednoduchost jako cíl, ne jako výchozí bod. Každý krok musí dávat smysl. Žádné zbytečnosti. Stavím systémy, které fungují samy.",
  } : {
    title: "Philosophy",
    text: "Simplicity as a goal, not a starting point. Every step must make sense. No fluff. I build systems that work on their own.",
  };

  const approach = locale === "cs" ? {
    title: "Přístup",
    text: "AI + software + web. Tři vrstvy, které se navzájem posilují. Každý projekt začíná problémem, ne technologií.",
  } : {
    title: "Approach",
    text: "AI + software + web. Three layers that reinforce each other. Every project starts with a problem, not a technology.",
  };

  const focus = locale === "cs" ? {
    title: "Zaměření",
    text: "Inteligentní systémy, které doručují reálnou hodnotu. AI recepční, chatboti, automatizace, interní nástroje — vše, co posouvá byznys dopředu.",
  } : {
    title: "Focus",
    text: "Intelligent systems that deliver real value. AI receptionists, chatbots, automations, internal tools — everything that moves businesses forward.",
  };

  const y = useParallax(sectionRef, 40, -40);

  return (
    <section
      id="o-mne"
      ref={sectionRef}
      className="relative"
      style={{
        padding: "clamp(48px, 8vw, 100px) clamp(24px, 5vw, 80px)",
      }}
    >
      <motion.div style={{ y, maxWidth: "1200px" }} className="relative z-10 mx-auto">
        {/* Header */}
        <div className="mb-10 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold"
              style={{
                background: "linear-gradient(135deg, #333333, #666666)",
              }}
            >
              M
            </div>
            <div>
              <h3
                className="font-heading"
                style={{
                  fontSize: "clamp(18px, 2vw, 24px)",
                  color: "#111111",
                }}
              >
                {name}
              </h3>
              <p
                className="text-xs font-mono"
                style={{ color: "#9CA3AF" }}
              >
                {handle}
              </p>
            </div>
          </div>

          <p
            className="font-heading leading-tight"
            style={{
              fontSize: "clamp(28px, 4vw, 52px)",
              color: "#111111",
              letterSpacing: "-0.03em",
              maxWidth: "16ch",
            }}
          >
            {locale === "cs"
              ? "Stavím inteligentní systémy. Ne weby."
              : "I build intelligent systems. Not websites."}
          </p>
        </div>

        {/* Grid */}
        <div
          className="grid gap-6 sm:gap-8"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
          }}
        >
          {[philosophy, approach, focus].map((item, i) => (
            <motion.div
              key={item.title}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="p-6 sm:p-8 rounded-2xl h-full"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(17,17,17,0.06)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(17,17,17,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  className="w-8 h-0.5 rounded-full mb-5"
                  style={{
                    background: i === 0
                      ? "#111111"
                      : i === 1
                      ? "#5F6368"
                      : "#9CA3AF",
                  }}
                />
                <h4
                  className="font-heading mb-3"
                  style={{
                    fontSize: "clamp(18px, 1.8vw, 24px)",
                    color: "#111111",
                  }}
                >
                  {item.title}
                </h4>
                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: "#5F6368" }}
                >
                  {item.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
