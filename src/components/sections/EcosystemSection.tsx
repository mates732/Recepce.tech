"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParallax } from "@/lib/scroll";
import type { Locale } from "@/lib/types";
import { getPage } from "@/content/repository";

interface EcosystemSectionProps {
  locale: Locale;
}

export default function EcosystemSection({ locale }: EcosystemSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const page = getPage("home");
  const data = page?.data.ecosystem;
  const cards = data?.cards ?? [];
  const title = data?.title[locale] ?? "Projekty";
  const subtitle = data?.subtitle[locale] ?? "";

  const y = useParallax(sectionRef, 60, -60);

  return (
    <section
      id="ekosystem"
      ref={sectionRef}
      className="relative"
      style={{
        padding: "clamp(48px, 8vw, 100px) clamp(24px, 5vw, 80px)",
      }}
    >
      <motion.div style={{ y, maxWidth: "1200px" }} className="relative z-10 mx-auto">
        <div
          aria-hidden="true"
          className="hidden sm:absolute sm:left-0 sm:inset-y-0 sm:flex sm:items-center sm:justify-center font-heading select-none pointer-events-none"
          style={{
            width: "clamp(40px, 3vw, 60px)",
            fontSize: "var(--text-small)",
            letterSpacing: "0.35em",
            color: "rgba(255,255,255,0.06)",
            fontWeight: 500,
            writingMode: "vertical-rl",
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>

        <div className="space-y-6 sm:space-y-8 sm:ml-16">
          <div
            className="p-8 sm:p-12 rounded-2xl"
            style={{ background: "#121316", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <h2
              className="font-heading"
              style={{
                fontSize: "var(--text-h1-md)",
                letterSpacing: "-0.03em",
                color: "#F4F6F8",
              }}
            >
              {title}
            </h2>
            <p
              className="font-body mt-2 mb-6 sm:mb-8"
              style={{
                fontSize: "var(--text-lead)",
                color: "#9AA1AB",
                maxWidth: "40ch",
              }}
            >
              {subtitle}
            </p>
            <div className="space-y-6 sm:space-y-8">
            {cards.map((card, i) => (
              <EcosystemCard
                key={card.title[locale]}
                title={card.title[locale]}
                desc={card.desc[locale]}
                href={card.href}
                index={i}
                locale={locale}
              />
            ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function EcosystemCard({
  title,
  desc,
  href,
  index,
  locale,
}: {
  title: string;
  desc: string;
  href: string;
  index: number;
  locale: Locale;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <Link href={`/${locale}${href}`} className="block no-underline">
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="group"
      >
        <div className="flex items-start gap-6 sm:gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2.5">
              <h3
                className="font-heading mb-1"
                style={{
                  fontSize: "var(--text-h3)",
                  letterSpacing: "-0.02em",
                  color: "#F4F6F8",
                }}
              >
                {title}
              </h3>
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                style={{ color: "#F4F6F8" }}
                aria-hidden="true"
              >
                <path d="M1 8h12m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p
              className="font-body text-sm leading-relaxed"
              style={{ color: "#9AA1AB" }}
            >
              {desc}
            </p>
          </div>
        </div>
        <div className="mt-3 sm:mt-4 ml-[48px] sm:ml-[56px] h-px bg-[rgba(255,255,255,0.06)] transition-colors duration-300 group-hover:bg-[rgba(255,255,255,0.16)]" />
      </motion.div>
    </Link>
  );
}
