"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/types";

interface HeroSectionProps {
  locale: Locale;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const title = locale === "cs"
    ? "Stavím inteligentní systémy."
    : "I build intelligent systems.";

  const subtitle = locale === "cs"
    ? "Cortex · AI asistenti · Weby · YouTube"
    : "Cortex · AI assistants · Websites · YouTube";

  const ctaLabel = locale === "cs" ? "Prozkoumat projekty" : "Explore projects";

  const words = title.split(" ");

  const isItalicWord = (word: string) =>
    word === "inteligentní" || word === "intelligent";

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        minHeight: "100vh",
        padding: "clamp(24px, 5vw, 80px)",
        paddingTop: "max(80px, 8vh)",
        paddingBottom: "max(40px, 5vh)",
      }}
    >
      <div
        className="relative z-10 w-full flex flex-col items-center"
        style={{ maxWidth: "640px" }}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="block text-center"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: i * 0.18,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span
              className="font-heading leading-none"
              style={{
                fontSize: "clamp(36px, 7vw, 90px)",
                letterSpacing: "-0.03em",
                color: "#111111",
                fontStyle: isItalicWord(word) ? "italic" : "normal",
              }}
            >
              {word}
            </span>
          </motion.span>
        ))}

        <motion.p
          className="font-body mt-8 text-center"
          style={{
            fontSize: "clamp(11px, 1vw, 13px)",
            color: "#5F6368",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: words.length * 0.18 + 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          className="mt-10"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: words.length * 0.18 + 0.25,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <button
            onClick={() => {
              document.getElementById("projekty")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="font-body text-xs tracking-[0.2em] uppercase transition-colors duration-300"
            style={{ color: "#5F6368" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#111111"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#5F6368"; }}
          >
            {ctaLabel}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
