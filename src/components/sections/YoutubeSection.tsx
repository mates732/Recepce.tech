"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParallax } from "@/lib/scroll";
import type { Locale } from "@/lib/types";
import { getPage } from "@/content/repository";

interface YoutubeSectionProps {
  locale: Locale;
}

export default function YoutubeSection({ locale }: YoutubeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const youtube = getPage("home")?.data.youtube;
  const title = youtube?.title[locale] ?? "YouTube";
  const subtitle = youtube?.subtitle[locale] ?? "";
  const cta = youtube?.cta[locale] ?? "";

  const y = useParallax(sectionRef, 40, -40);

  return (
    <section
      id="youtube"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        padding: "clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)",
      }}
    >
      <motion.div style={{ y, maxWidth: "1200px" }} className="relative z-10 mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p
              className="font-mono mb-4"
              style={{ fontSize: "var(--text-label-fluid)", letterSpacing: "0.22em", textTransform: "uppercase", color: "#6E7683" }}
            >
              / 11
            </p>
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
              color: "#9AA1AB",
              border: "1px solid rgba(255,255,255,0.14)",
              scale: "1",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
              e.currentTarget.style.color = "#F4F6F8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
              e.currentTarget.style.color = "#9AA1AB";
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
              <path d="M3 11L11 3m0 0H5m6 0v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
