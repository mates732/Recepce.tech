"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useParallax } from "@/lib/scroll";
import { stagger, fadeUp, cardLightHandler } from "@/lib/motion";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { getPage } from "@/content/repository";

interface Props {
  locale: Locale;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const SYSTEMS = [
  {
    id: "telefonni",
    title: { cs: "Telefonní asistent", en: "Phone Assistant" },
    subtitle: { cs: "Hlasová komunikace pro firmy.", en: "Voice communication for businesses." },
    description: {
      cs: "Moderní telefonní řešení, které přijímá hovory, rezervuje schůzky a odpovídá na dotazy zákazníků — kdykoliv.",
      en: "A modern phone solution that handles calls, books meetings and answers customer questions — anytime.",
    },
    badge: "24/7",
    href: "/projekty/asistenti/telefonni-asistent",
    tags: { cs: ["Hovory", "Rezervace", "Recepce"], en: ["Calls", "Bookings", "Reception"] },
  },
  {
    id: "chat",
    title: { cs: "Chat asistent", en: "Chat Assistant" },
    subtitle: { cs: "Digitální komunikace přímo na webu.", en: "Digital communication right on your website." },
    description: {
      cs: "Jednotná komunikační vrstva pro web, WhatsApp a SMS. Zákazníci vždy najdou správnou cestu.",
      en: "A unified communication layer for web, WhatsApp and SMS. Customers always find the right path.",
    },
    badge: "Demo",
    href: "/projekty/asistenti/chat-asistent",
    tags: { cs: ["Web", "WhatsApp", "SMS"], en: ["Web", "WhatsApp", "SMS"] },
  },
];

const PROCESS_STEPS = [
  {
    icon: "→",
    title: { cs: "Kontakt", en: "Contact" },
    desc: { cs: "Zákazník přichází přes telefon, web nebo zprávu.", en: "Customer reaches out via phone, web or message." },
  },
  {
    icon: "↔",
    title: { cs: "Komunikace", en: "Communication" },
    desc: { cs: "Systém přijímá požadavek a okamžitě reaguje.", en: "The system receives the request and responds instantly." },
  },
  {
    icon: "✓",
    title: { cs: "Řešení", en: "Resolution" },
    desc: { cs: "Požadavek je vyřízen nebo předán správné osobě.", en: "The request is resolved or handed to the right person." },
  },
];

export default function CommunicationContent({ locale }: Props) {
  const page = getPage("communication");
  const sectionRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);

  const y = useParallax(sectionRef, 40, -40);
  const infoInView = useInView(infoRef, { once: true, margin: "-80px" });
  const cardsInView = useInView(cardsRef, { once: true, margin: "-80px" });
  const processInView = useInView(processRef, { once: true, margin: "-80px" });

  const badge = page?.data.badge?.[locale] ?? (locale === "cs" ? "Komunikační systémy" : "Communication Systems");

  return (
    <div className="relative">
      {/* ─── Hero ─── */}
      <section
        ref={sectionRef}
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ minHeight: "100dvh", padding: "clamp(100px, 15vh, 140px) clamp(24px, 5vw, 80px)" }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 50% 40% at 50% 40%, rgba(255,74,46,0.06) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <motion.div
          style={{ y }}
          className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="font-mono text-label tracking-[0.18em] uppercase mb-6 sm:mb-8"
            style={{ color: "#6E7683" }}
          >
            {badge}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            className="font-heading mb-5 sm:mb-6"
            style={{
              fontSize: "clamp(44px, 8vw, 88px)",
              fontWeight: 500,
              lineHeight: "var(--leading-heading)",
              letterSpacing: "-0.035em",
              color: "#F4F6F8",
            }}
          >
            {locale === "cs" ? "Asistenti" : "Assistants"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            className="font-body mb-8 sm:mb-10"
            style={{
              fontSize: "clamp(18px, 2.2vw, 24px)",
              lineHeight: 1.5,
              color: "rgba(244,246,248,0.5)",
              maxWidth: "28ch",
            }}
          >
            {locale === "cs"
              ? "Komunikační systémy, které pracují za vás."
              : "Communication systems that work for you."}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
            className="font-body"
            style={{
              fontSize: "clamp(15px, 1.4vw, 18px)",
              lineHeight: 1.65,
              color: "#9AA1AB",
              maxWidth: "42ch",
            }}
          >
            {locale === "cs"
              ? "Firmy komunikují přes různé kanály — telefon, web, zprávy. Každý kanál vyžaduje specializovaný systém, který reaguje okamžitě a přirozeně."
              : "Businesses communicate through different channels — phone, web, messaging. Each channel needs a specialized system that responds instantly and naturally."}
          </motion.p>
        </motion.div>
      </section>

      {/* ─── Info section ─── */}
      <section
        ref={infoRef}
        className="relative"
        style={{ padding: "clamp(48px, 8vw, 100px) clamp(24px, 5vw, 80px)" }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={infoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            className="grid sm:grid-cols-2 gap-10 sm:gap-16"
          >
            <div>
              <h2
                className="font-heading mb-4"
                style={{
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 500,
                  lineHeight: "var(--leading-heading)",
                  letterSpacing: "-0.025em",
                  color: "#F4F6F8",
                }}
              >
                {locale === "cs" ? "Komunikace jako infrastruktura" : "Communication as infrastructure"}
              </h2>
              <p
                className="font-body"
                style={{
                  fontSize: "clamp(15px, 1.3vw, 17px)",
                  lineHeight: 1.65,
                  color: "#9AA1AB",
                }}
              >
                {locale === "cs"
                  ? "Každá firma komunikuje jinak. Telefon, web, WhatsApp, e-mail — každý kanál má svá pravidla. Moderní firmy potřebují systém, který tyto kanály sjednotí a zajistí konzistentní odezvu."
                  : "Every business communicates differently. Phone, web, WhatsApp, email — each channel has its own rules. Modern businesses need a system that unifies these channels and ensures consistent response."}
              </p>
            </div>
            <div>
              <h2
                className="font-heading mb-4"
                style={{
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 500,
                  lineHeight: "var(--leading-heading)",
                  letterSpacing: "-0.025em",
                  color: "#F4F6F8",
                }}
              >
                {locale === "cs" ? "Specializované systémy" : "Specialized systems"}
              </h2>
              <p
                className="font-body"
                style={{
                  fontSize: "clamp(15px, 1.3vw, 17px)",
                  lineHeight: 1.65,
                  color: "#9AA1AB",
                }}
              >
                {locale === "cs"
                  ? "Hlasová komunikace vyžaduje jiný přístup než textový chat. Telefonní systém řeší přirozené hovory, rezervace a prioritizaci. Chatový systém zvládá více kanálů současně."
                  : "Voice communication requires a different approach than text chat. A phone system handles natural conversations, bookings and prioritization. A chat system manages multiple channels simultaneously."}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Navigation cards ─── */}
      <section
        ref={cardsRef}
        className="relative"
        style={{ padding: "clamp(48px, 8vw, 100px) clamp(24px, 5vw, 80px)" }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={cardsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-center mb-12 sm:mb-16"
          >
            <span
              className="font-mono text-label tracking-[0.15em] uppercase mb-4 block"
              style={{ color: "#FF4A2E" }}
            >
              / 01
            </span>
            <h2
              className="font-heading"
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 500,
                lineHeight: "var(--leading-heading)",
                letterSpacing: "-0.03em",
                color: "#F4F6F8",
              }}
            >
              {locale === "cs" ? "Naše systémy" : "Our systems"}
            </h2>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 gap-5 sm:gap-6"
            variants={stagger}
            initial="hidden"
            animate={cardsInView ? "visible" : "hidden"}
          >
            {SYSTEMS.map((system) => (
              <motion.div key={system.id} variants={fadeUp} className="h-full">
                <Link href={`/${locale}${system.href}`} className="block no-underline h-full">
                  <div
                    className="group relative h-full rounded-2xl overflow-hidden transition-all duration-500 card-light flex flex-col"
                    style={{
                      background: "linear-gradient(135deg, rgba(18,19,22,0.95) 0%, rgba(10,10,11,0.98) 100%)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      padding: "clamp(28px, 3vw, 40px)",
                    }}
                    onMouseMove={cardLightHandler}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-accent-border)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,74,46,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.transform = "translateY(0px)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-6">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full font-mono"
                        style={{
                          fontSize: "11px",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#FF4A2E",
                          background: "rgba(255,74,46,0.08)",
                          border: "1px solid rgba(255,74,46,0.15)",
                        }}
                      >
                        {system.badge}
                      </span>
                      <span
                        className="transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                        style={{ fontSize: 22, color: "rgba(255,255,255,0.15)", opacity: 0.5 }}
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="font-heading mb-2"
                      style={{
                        fontSize: "clamp(28px, 3.5vw, 40px)",
                        fontWeight: 500,
                        lineHeight: "var(--leading-heading)",
                        letterSpacing: "-0.025em",
                        color: "#F4F6F8",
                      }}
                    >
                      {system.title[locale]}
                    </h3>

                    {/* Subtitle */}
                    <p
                      className="font-body mb-4"
                      style={{
                        fontSize: "clamp(16px, 1.5vw, 19px)",
                        lineHeight: 1.5,
                        color: "rgba(244,246,248,0.5)",
                      }}
                    >
                      {system.subtitle[locale]}
                    </p>

                    {/* Description */}
                    <p
                      className="font-body mb-6"
                      style={{
                        fontSize: "clamp(14px, 1.2vw, 16px)",
                        lineHeight: 1.65,
                        color: "#9AA1AB",
                      }}
                    >
                      {system.description[locale]}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {system.tags[locale].map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg font-mono"
                          style={{
                            fontSize: "11px",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "#6E7683",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      style={{
                        background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,74,46,0.04) 0%, transparent 70%)",
                      }}
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Process section ─── */}
      <section
        ref={processRef}
        className="relative"
        style={{ padding: "clamp(48px, 8vw, 100px) clamp(24px, 5vw, 80px)" }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-center mb-12 sm:mb-16"
          >
            <span
              className="font-mono text-label tracking-[0.15em] uppercase mb-4 block"
              style={{ color: "#FF4A2E" }}
            >
              / 02
            </span>
            <h2
              className="font-heading"
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 500,
                lineHeight: "var(--leading-heading)",
                letterSpacing: "-0.03em",
                color: "#F4F6F8",
              }}
            >
              {locale === "cs" ? "Jak to funguje" : "How it works"}
            </h2>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-3 gap-8 sm:gap-12"
            variants={stagger}
            initial="hidden"
            animate={processInView ? "visible" : "hidden"}
          >
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.title.cs}
                variants={fadeUp}
                className="text-center"
              >
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5"
                  style={{
                    background: "rgba(255,74,46,0.06)",
                    border: "1px solid rgba(255,74,46,0.12)",
                  }}
                >
                  <span
                    className="font-heading"
                    style={{ fontSize: 22, color: "#FF4A2E" }}
                  >
                    {step.icon}
                  </span>
                </div>

                <span
                  className="font-mono block mb-2"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#6E7683",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3
                  className="font-heading mb-3"
                  style={{
                    fontSize: "clamp(20px, 2.2vw, 26px)",
                    fontWeight: 500,
                    lineHeight: "var(--leading-heading)",
                    letterSpacing: "-0.02em",
                    color: "#F4F6F8",
                  }}
                >
                  {step.title[locale]}
                </h3>

                <p
                  className="font-body"
                  style={{
                    fontSize: "clamp(14px, 1.2vw, 16px)",
                    lineHeight: 1.6,
                    color: "#9AA1AB",
                  }}
                >
                  {step.desc[locale]}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section
        className="relative"
        style={{ padding: "clamp(60px, 10vw, 120px) clamp(24px, 5vw, 80px)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 50% 50% at 50% 100%, rgba(255,74,46,0.04) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <h2
            className="font-heading mb-5"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 500,
              lineHeight: "var(--leading-heading)",
              letterSpacing: "-0.03em",
              color: "#F4F6F8",
            }}
          >
            {locale === "cs" ? "Postavte si svůj komunikační systém." : "Build your communication system."}
          </h2>
          <p
            className="font-body mb-8 sm:mb-10"
            style={{
              fontSize: "clamp(16px, 1.5vw, 19px)",
              lineHeight: 1.55,
              color: "rgba(244,246,248,0.45)",
            }}
          >
            {locale === "cs"
              ? "Popište nám, jak komunikujete se zákazníky. Navrhneme řešení, které dává smysl."
              : "Tell us how you communicate with customers. We'll design a solution that makes sense."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/kontakt`}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-body transition-all duration-300 hover:scale-[1.02]"
              style={{
                fontSize: "var(--text-body)",
                fontWeight: 500,
                color: "#F4F6F8",
                background: "rgba(255,74,46,0.9)",
                boxShadow: "0 4px 20px rgba(255,74,46,0.2)",
              }}
            >
              {locale === "cs" ? "Začít konzultaci" : "Start a consultation"}
            </Link>
            <Link
              href={`/${locale}/projekty`}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-body transition-all duration-300 hover:opacity-60"
              style={{
                fontSize: "var(--text-body)",
                fontWeight: 400,
                color: "rgba(244,246,248,0.4)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {locale === "cs" ? "Prozkoumat projekty" : "Explore projects"}
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
