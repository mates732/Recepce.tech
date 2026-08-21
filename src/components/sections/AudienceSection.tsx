"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useParallax } from "@/lib/scroll";
import { stagger, fadeUp } from "@/lib/motion";
import SectionHeader from "@/components/lab/SectionHeader";
import type { Locale } from "@/lib/types";
import { getPage } from "@/content/repository";

interface AudienceSectionProps {
  locale: Locale;
}

const CARD_COLORS = ["#FF4A2E", "#FF4A2E", "#FF4A2E", "#FF4A2E"];

export default function AudienceSection({ locale }: AudienceSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const data = getPage("home")?.data.audience;
  const title = data?.title[locale] ?? "";
  const subtitle = data?.subtitle[locale] ?? "";
  const cards = (data?.cards ?? []).map((c) => ({
    title: c.title[locale],
    items: c.items[locale],
  }));

  const y = useParallax(sectionRef, 30, -30);

  return (
    <section
      id="pro-koho"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ padding: "clamp(48px, 8vw, 110px) clamp(24px, 5vw, 80px)" }}
    >
      <motion.div style={{ y, maxWidth: "1200px" }} className="relative z-10 mx-auto">
        <SectionHeader eyebrow="/ 07" eyebrowColor="#FF4A2E" title={title} subtitle={subtitle} />

        <motion.div
          className="grid gap-5 sm:gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))" }}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              className="rounded-2xl p-6 sm:p-7 h-full"
              style={{
                background: "rgba(18,19,22,0.6)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p className="font-heading mb-4" style={{ fontSize: "var(--text-h4)", color: "#F4F6F8" }}>
                {card.title}
              </p>
              <ul className="flex flex-col gap-2">
                {card.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 font-body text-sm" style={{ color: "#9AA1AB" }}>
                    <span
                      aria-hidden="true"
                      className="mt-2 inline-block w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: CARD_COLORS[i % CARD_COLORS.length] }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
