"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useParallax } from "@/lib/scroll";
import type { Locale } from "@/lib/types";

interface FinalCtaSectionProps {
  locale: Locale;
}

export default function FinalCtaSection({ locale }: FinalCtaSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const title = locale === "cs"
    ? "Pojďme postavit něco inteligentního."
    : "Let's build something intelligent.";
  const subtitle = locale === "cs"
    ? "Máte projekt, nápad nebo problém? Ozvěte se."
    : "Have a project, idea or problem? Reach out.";
  const cta = locale === "cs" ? "Napsat zprávu" : "Send a message";
  const altCta = locale === "cs" ? "Prozkoumat projekty" : "Explore projects";

  const y = useParallax(sectionRef, 40, -40);

  return (
    <section
      id="kontakt"
      ref={sectionRef}
      className="relative"
      style={{
        padding: "clamp(64px, 10vw, 130px) clamp(24px, 5vw, 80px)",
        overflow: "hidden",
      }}
    >
      {/* Subtle background gradient */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "min(800px, 80vw)",
          height: "min(800px, 80vw)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(17,17,17,0.03) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(100px)",
        }}
      />

      <motion.div
        style={{ y, maxWidth: "800px" }}
        className="relative z-10 mx-auto text-center"
      >
        <motion.h2
          className="font-heading mx-auto"
          style={{
            fontSize: "clamp(32px, 5vw, 64px)",
            letterSpacing: "-0.03em",
            color: "#111111",
            lineHeight: 1.1,
            maxWidth: "12ch",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {title.split(" ").map((word, i) => (
            <span
              key={i}
              style={{ fontStyle: word === "inteligentního" || word === "intelligent" ? "italic" : undefined }}
            >
              {word}{" "}
            </span>
          ))}
        </motion.h2>

        <motion.p
          className="mt-6 font-body"
          style={{
            fontSize: "clamp(14px, 1.2vw, 18px)",
            color: "#5F6368",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href={`/${locale}/contact`}
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium transition-all duration-300"
            style={{
              background: "#111111",
              color: "#FFFFFF",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(17,17,17,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {cta}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
              <path d="M1 8h12m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          <a
            href={`/${locale}/projekty`}
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium transition-all duration-300"
            style={{
              color: "#5F6368",
              border: "1px solid rgba(17,17,17,0.08)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(17,17,17,0.2)";
              e.currentTarget.style.color = "#111111";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(17,17,17,0.08)";
              e.currentTarget.style.color = "#5F6368";
            }}
          >
            {altCta}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
