"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/types";

interface ProjectContentProps {
  locale: Locale;
  title: string;
  description: string;
}

export default function ProjectContent({ locale, title, description }: ProjectContentProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const backLabel = locale === "cs" ? "Zpět na přehled" : "Back to overview";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center"
      style={{
        padding: "clamp(120px, 15vw, 200px) clamp(24px, 5vw, 80px)",
        background: "#F7F8FA",
      }}
    >
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : y }}
        className="relative z-10 mx-auto w-full"
      >
        <motion.div
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 mb-10 text-sm font-body transition-all duration-300 group"
              style={{ color: "#5F6368" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#111111"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#5F6368"; }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-hover:-translate-x-0.5">
                <path d="M11 7H3m0 0l4 4m-4-4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {backLabel}
            </Link>
          </motion.div>

          <motion.h1
            className="font-heading font-bold leading-tight"
            style={{
              fontSize: "clamp(36px, 6vw, 72px)",
              letterSpacing: "-0.03em",
              color: "#111111",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {title}
          </motion.h1>

          <motion.p
            className="font-body mt-6 leading-relaxed"
            style={{
              fontSize: "clamp(16px, 1.4vw, 20px)",
              color: "#5F6368",
              maxWidth: "50ch",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {description}
          </motion.p>

          <motion.div
            className="mt-12 sm:mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="w-full h-px"
              style={{ background: "rgba(17,17,17,0.06)" }}
            />
            <div className="flex items-center gap-3 mt-6">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "rgba(17,17,17,0.15)" }}
              />
              <span className="font-mono text-xs" style={{ color: "rgba(17,17,17,0.3)" }}>
                {locale === "cs" ? "Více informací brzy" : "More details coming soon"}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
