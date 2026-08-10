"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParallax } from "@/lib/scroll";
import type { Locale } from "@/lib/types";

interface YoutubeSectionProps {
  locale: Locale;
}

export default function YoutubeSection({ locale }: YoutubeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const title = "YouTube";
  const subtitle = locale === "cs"
    ? "Technologie, vývoj a reálné projekty. Bez zbytečné teorie."
    : "Tech, development and real projects. No unnecessary theory.";
  const cta = locale === "cs" ? "Sledovat na YouTube" : "Follow on YouTube";

  const y = useParallax(sectionRef, 40, -40);

  return (
    <section
      id="youtube"
      ref={sectionRef}
      className="relative"
      style={{
        padding: "clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)",
      }}
    >
      <motion.div style={{ y, maxWidth: "1200px" }} className="relative z-10 mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
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
                maxWidth: "40ch",
              }}
            >
              {subtitle}
            </p>
          </div>
          <Link
            href={`/${locale}/youtube`}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap self-start sm:self-auto"
            style={{
              color: "#FFFFFF",
              background: "#111111",
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
              <path d="M3 11L11 3m0 0H5m6 0v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
