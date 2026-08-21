"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParallax } from "@/lib/scroll";
import type { Locale } from "@/lib/types";
import { getPage } from "@/content/repository";

interface FinalCtaSectionProps {
  locale: Locale;
}

export default function FinalCtaSection({ locale }: FinalCtaSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const finalCta = getPage("home")?.data.finalCta;
  const title = finalCta?.title[locale] ?? "";
  const emphasis = finalCta?.emphasis[locale] ?? [];
  const subtitle = finalCta?.subtitle[locale] ?? "";
  const cta = finalCta?.cta[locale] ?? "";
  const altCta = finalCta?.altCta[locale] ?? "";

  const y = useParallax(sectionRef, 40, -40);
  const bgY = useParallax(sectionRef, 110, -110);

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
      {/* Ambient glow — pomalejší pohyb než obsah */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          width: "min(700px, 80vw)",
          height: "min(700px, 80vw)",
          top: "50%",
          left: "50%",
          y: bgY,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,74,46,0.12) 0%, rgba(232,52,31,0.06) 40%, transparent 70%)",
            transform: "translate(-50%, -50%)",
            filter: "blur(80px)",
          }}
        />
      </motion.div>

      <motion.div
        style={{ y, maxWidth: "760px" }}
        className="relative z-10 mx-auto"
      >
        <div
          className="relative rounded-2xl p-8 sm:p-14 text-center overflow-hidden"
          style={{
            background: "rgba(18,19,22,0.85)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* Terminal header */}
          <div
            className="flex items-center justify-between px-1 mb-8"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 12 }}
          >
            <span
              className="font-mono flex items-center gap-2"
              style={{ fontSize: "var(--text-label)", letterSpacing: "0.18em", textTransform: "uppercase", color: "#6E7683" }}
            >
              <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "#34D399", animation: "pulse-dot 2.4s ease-in-out infinite" }} />
              contact_terminal
            </span>
            <span
              aria-hidden="true"
              className="font-mono"
              style={{ fontSize: "var(--text-label)", color: "#34D399", animation: "blink 1.2s step-end infinite" }}
            >
              ▍
            </span>
          </div>

          <motion.h2
            className="font-heading mx-auto"
            style={{
              fontSize: "var(--text-h1-lg)",
              letterSpacing: "-0.03em",
              color: "#F4F6F8",
              lineHeight: "var(--leading-heading)",
              maxWidth: "16ch",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {title.split(" ").map((word, i) => (
              <span
                key={i}
                className={emphasis.some((e) => word.includes(e)) ? "gradient-text" : undefined}
              >
                {word}{" "}
              </span>
            ))}
          </motion.h2>

          <motion.p
            className="mt-6 font-body"
            style={{ fontSize: "var(--text-lead)", color: "#9AA1AB" }}
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
            <Link
              href={`/${locale}/contact`}
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium transition-all duration-300"
              style={{ background: "var(--color-accent)", color: "#0A0A0B", scale: "1" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 0 36px var(--color-accent-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.scale = "1";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.scale = "0.97";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.scale = "1";
              }}
            >
              {cta}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
                <path d="M1 8h12m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            <Link
              href={`/${locale}/projekty`}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium transition-all duration-300"
              style={{ color: "#9AA1AB", border: "1px solid rgba(255,255,255,0.14)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
                e.currentTarget.style.color = "#F4F6F8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                e.currentTarget.style.color = "#9AA1AB";
              }}
            >
              {altCta}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
