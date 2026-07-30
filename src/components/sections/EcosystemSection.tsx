"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/types";

interface EcosystemSectionProps {
  locale: Locale;
}

type Card = {
  title: string;
  desc: string;
  href: string;
};

const cards: Record<Locale, Card[]> = {
  cs: [
    {
      title: "Cortex",
      desc: "AI prodejní systém. Vyhledá firmy. Vyhodnotí příležitosti. Osloví automaticky.",
      href: "/cortex",
    },
    {
      title: "AI Asistenti",
      desc: "Inteligentní chatboti a voice AI pro firmy. 24/7 zákaznická podpora a recepční.",
      href: "/ai.assistent",
    },
    {
      title: "Weby",
      desc: "Prémiové webové prezentace, které vypadají jako produktový launch, ne jako šablona.",
      href: "/webs",
    },
    {
      title: "YouTube",
      desc: "My fitness diary. Training, Vibe, Fun.",
      href: "/youtube",
    },
  ],
  en: [
    {
      title: "Cortex",
      desc: "AI sales system. Finds leads. Evaluates opportunities. Reaches out automatically.",
      href: "/cortex",
    },
    {
      title: "AI Assistants",
      desc: "Intelligent chatbots and voice AI for businesses. 24/7 customer support and reception.",
      href: "/ai.assistent",
    },
    {
      title: "Websites",
      desc: "Premium web presentations that feel like product launches. Not templates.",
      href: "/webs",
    },
    {
      title: "YouTube",
      desc: "My fitness diary. Training, Vibe, Fun.",
      href: "/youtube",
    },
  ],
};

export default function EcosystemSection({ locale }: EcosystemSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const data = cards[locale];
  const title = locale === "cs" ? "Projekty" : "Projects";
  const subtitle = locale === "cs"
    ? "Vše, co stavím. Na jednom místě."
    : "Everything I build. In one place.";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      id="ekosystem"
      ref={sectionRef}
      className="relative"
      style={{
        padding: "clamp(48px, 8vw, 100px) clamp(24px, 5vw, 80px)",
      }}
    >
      <motion.div style={{ y: shouldReduceMotion ? 0 : y, maxWidth: "1200px" }} className="relative z-10 mx-auto">
        <h2
          className="sm:absolute sm:left-0 sm:inset-y-0 sm:flex sm:items-center sm:justify-center hidden font-heading select-none pointer-events-none"
          style={{
            width: "clamp(40px, 3vw, 60px)",
            fontSize: "clamp(12px, 0.9vw, 16px)",
            letterSpacing: "0.35em",
            color: "rgba(17,17,17,0.06)",
            fontWeight: 500,
            writingMode: "vertical-rl",
            textTransform: "uppercase",
          }}
        >
          {title}
        </h2>

        <div className="space-y-6 sm:space-y-8 sm:ml-16">
          <div
            className="p-8 sm:p-12 rounded-2xl"
            style={{ background: "#FFFFFF", border: "1px solid rgba(17,17,17,0.06)" }}
          >
            <h3
              className="font-heading"
              style={{
                fontSize: "clamp(28px, 5vw, 48px)",
                letterSpacing: "-0.03em",
                color: "#111111",
              }}
            >
              {title}
            </h3>
            <p
              className="font-body mt-2 mb-6 sm:mb-8"
              style={{
                fontSize: "clamp(14px, 1.2vw, 18px)",
                color: "#5F6368",
                maxWidth: "40ch",
              }}
            >
              {subtitle}
            </p>
            <div className="space-y-6 sm:space-y-8">
            {data.map((card, i) => (
              <EcosystemCard
                key={card.title}
                card={card}
                index={i}
                locale={locale}
                shouldReduceMotion={!!shouldReduceMotion}
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
  card,
  index,
  locale,
  shouldReduceMotion,
}: {
  card: Card;
  index: number;
  locale: Locale;
  shouldReduceMotion: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <Link href={`/${locale}${card.href}`} className="block no-underline">
      <motion.div
        ref={cardRef}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="group"
      >
        <div className="flex items-start gap-6 sm:gap-8">
          <div>
            <h3
              className="font-heading mb-1"
              style={{
                fontSize: "clamp(18px, 1.8vw, 24px)",
                letterSpacing: "-0.02em",
                color: "#111111",
              }}
            >
              {card.title}
            </h3>
            <p
              className="font-body text-sm leading-relaxed"
              style={{ color: "#5F6368" }}
            >
              {card.desc}
            </p>
          </div>
        </div>
        <div className="mt-3 sm:mt-4 ml-[48px] sm:ml-[56px] h-px" style={{ background: "rgba(17,17,17,0.06)" }} />
      </motion.div>
    </Link>
  );
}
