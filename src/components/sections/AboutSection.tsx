"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParallax } from "@/lib/scroll";
import type { Locale } from "@/lib/types";
import { getPage } from "@/content/repository";

interface AboutSectionProps {
  locale: Locale;
}

const BAR_COLORS = ["#FF4A2E", "#FF6B3D", "#FF4A2E"];

export default function AboutSection({ locale }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const about = getPage("home")?.data.about;

  const name = about?.name ?? "";
  const handle = about?.handle ?? "";
  const heading = about?.heading[locale] ?? "";

  const blocks = (about?.blocks ?? []).map((b) => ({
    title: b.title[locale],
    text: b.text[locale],
  }));

  const y = useParallax(sectionRef, 40, -40);

  return (
    <section
      id="o-mne"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ padding: "clamp(48px, 8vw, 110px) clamp(24px, 5vw, 80px)" }}
    >
      <motion.div style={{ y, maxWidth: "1200px" }} className="relative z-10 mx-auto">
        {/* Header */}
        <div className="mb-10 sm:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold"
              style={{
                background: "linear-gradient(135deg, #26282E, #3A3D44)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              M
            </div>
            <div>
              <h3
                className="font-heading"
                style={{ fontSize: "var(--text-h3)", color: "#F4F6F8" }}
              >
                {name}
              </h3>
              <p className="text-xs font-mono" style={{ color: "#6E7683" }}>
                <Link
                  href={`/${locale}`}
                  className="link-line transition-opacity duration-300 hover:opacity-70"
                >
                  {handle}
                </Link>
              </p>
            </div>
          </div>

          <h2
            className="font-heading leading-tight"
            style={{
              fontSize: "var(--text-h1)",
              color: "#F4F6F8",
              letterSpacing: "-0.03em",
              maxWidth: "16ch",
            }}
          >
            {heading}
          </h2>
        </div>

        {/* Grid */}
        <div
          className="grid gap-6 sm:gap-8"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
          }}
        >
          {blocks.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="p-6 sm:p-8 rounded-2xl h-full"
                style={{
                  background: "#121316",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  className="w-8 h-0.5 rounded-full mb-5"
                  style={{ background: BAR_COLORS[i % BAR_COLORS.length] }}
                />
                <h4
                  className="font-heading mb-3"
                  style={{ fontSize: "var(--text-h3)", color: "#F4F6F8" }}
                >
                  {item.title}
                </h4>
                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: "#9AA1AB" }}
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
