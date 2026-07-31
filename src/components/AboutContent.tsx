"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/types";

interface Props {
  locale: Locale;
}

const principles = [
  { cs: "Kvalita nad kvantitou.", en: "Quality over quantity." },
  { cs: "Na každém detailu záleží.", en: "Every detail matters." },
  { cs: "Stavím na dlouhou trať.", en: "Build for the long term." },
  { cs: "Jednoduché porazí složité.", en: "Simple beats complicated." },
  { cs: "Technologie má řešit problémy.", en: "Technology should solve problems." },
];

const products = [
  {
    title: "Recepce.tech",
    descCs: "Místo, kde se všechny mé produkty, služby a projekty setkávají.",
    descEn: "The place where all my products, services and projects come together.",
    href: "/",
  },
  {
    title: "AI Voice Assistant",
    descCs: "Přirozené telefonní hovory. Rezervace schůzek. Kvalifikace leadů. 24/7 telefonní recepční.",
    descEn: "Natural phone conversations. Appointment booking. Lead qualification. 24/7 phone receptionist.",
    href: "/projekty/ai-sistent/voice-assistant",
  },
  {
    title: "AI Chat Assistant",
    descCs: "Webový chatbot. Zákaznická podpora. Znalostní báze. Zachytávání leadů.",
    descEn: "Website chatbot. Customer support. Knowledge base. Lead capture.",
    href: "/projekty/ai-sistent/chat-assistant",
  },
  {
    title: "Cortex",
    descCs: "AI prodejní systém. Vyhledá firmy. Vyhodnotí příležitosti. Osloví automaticky.",
    descEn: "AI sales system. Finds leads. Evaluates opportunities. Reaches out automatically.",
    href: "/cortex",
  },
  {
    title: "Premium Websites",
    descCs: "Weby, které si lidé pamatují. Prémiové prezentace navržené od nuly.",
    descEn: "Websites people remember. Premium presentations designed from scratch.",
    href: "/webs",
  },
  {
    title: "Automation",
    descCs: "Automatizace firemních procesů. Workflow. Integrace. Úspora času.",
    descEn: "Business process automation. Workflows. Integrations. Time savings.",
    href: "#",
  },
];

export default function AboutContent({ locale }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden" style={{ background: "#F7F8FA" }}>
      <StatementSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} />
      <WorksSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} />
      <PersonalSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} />
      <PrinciplesSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} />
      <ProductMapSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} />
    </div>
  );
}

/* ─── Section 1: Statement ─── */

function StatementSection({ locale, shouldReduceMotion }: { locale: Locale; shouldReduceMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={sectionRef} className="relative flex flex-col items-center justify-center" style={{ minHeight: "100dvh", padding: "clamp(120px, 15vw, 180px) clamp(24px, 5vw, 80px)", background: "#F7F8FA" }}>
      <motion.div style={{ y, opacity }} className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-bold leading-none tracking-tight"
          style={{ fontSize: "clamp(56px, 12vw, 140px)", letterSpacing: "-0.04em", color: "#111111" }}
        >
          {locale === "cs" ? "Stavím." : "I build."}
        </motion.span>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-semibold mt-6"
          style={{ fontSize: "clamp(20px, 2.5vw, 36px)", letterSpacing: "-0.02em", color: "#5F6368" }}
        >
          {locale === "cs" ? "Ne jen software." : "Not just software."}
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ─── Section 2: What I Do ─── */

function WorksSection({ locale, shouldReduceMotion }: { locale: Locale; shouldReduceMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const y = useScrollProgress(sectionRef);

  const items = locale === "cs"
    ? [
        "Navrhuji prémiové weby.",
        "Vyvíjím AI asistenty.",
        "Automatizuji firemní procesy.",
        "Vytvářím interní systémy.",
      ]
    : [
        "I design premium websites.",
        "I build AI assistants.",
        "I automate business workflows.",
        "I create internal systems.",
      ];

  return (
    <section ref={sectionRef} className="relative" style={{ padding: "clamp(120px, 16vw, 200px) clamp(24px, 5vw, 80px)", background: "#FFFFFF" }}>
      <div className="max-w-5xl mx-auto">
        {items.map((text, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start gap-6 sm:gap-12 pb-12 sm:pb-16 last:pb-0"
          >
            <span className="font-heading font-bold leading-none tracking-tight flex-shrink-0" style={{ fontSize: "clamp(32px, 5vw, 64px)", color: "rgba(17,17,17,0.06)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="font-heading font-semibold leading-tight" style={{ fontSize: "clamp(24px, 3.5vw, 44px)", letterSpacing: "-0.03em", color: "#111111" }}>
                {text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Section 3: Personal ─── */

function PersonalSection({ locale, shouldReduceMotion }: { locale: Locale; shouldReduceMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const y = useScrollProgress(sectionRef);

  return (
    <section ref={sectionRef} className="relative" style={{ padding: "clamp(120px, 16vw, 200px) clamp(24px, 5vw, 80px)", background: "#F7F8FA" }}>
      <motion.div style={{ y: shouldReduceMotion ? 0 : y }} className="max-w-5xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-mono font-semibold tracking-widest uppercase"
          style={{ color: "#9CA3AF" }}
        >
          {locale === "cs" ? "Mimo práci" : "Outside of work"}
        </motion.span>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-heading font-bold leading-tight mt-8"
          style={{ fontSize: "clamp(28px, 4.5vw, 56px)", letterSpacing: "-0.03em", color: "#111111" }}
        >
          {locale === "cs" ? "Jsem obvykle ve fitku." : "I'm usually in the gym."}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-heading font-semibold mt-6 leading-relaxed"
          style={{ fontSize: "clamp(16px, 1.5vw, 22px)", color: "#5F6368", maxWidth: "40ch" }}
        >
          {locale === "cs"
            ? "Na YouTube sdílím svůj fitness progres, tréninky a disciplínu, kterou se snažím přenášet i do své práce."
            : "On YouTube I share my fitness progress, training, and the discipline I bring into my work."}
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ─── Section 4: Principles ─── */

function PrinciplesSection({ locale, shouldReduceMotion }: { locale: Locale; shouldReduceMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const y = useScrollProgress(sectionRef);

  return (
    <section ref={sectionRef} className="relative" style={{ padding: "clamp(100px, 14vw, 180px) clamp(24px, 5vw, 80px)", background: "#FFFFFF" }}>
      <motion.div style={{ y: shouldReduceMotion ? 0 : y }} className="max-w-5xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-mono font-semibold tracking-widest uppercase"
          style={{ color: "#9CA3AF" }}
        >
          {locale === "cs" ? "Principy" : "Principles"}
        </motion.span>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {principles.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: "#F7F8FA", border: "1px solid rgba(17,17,17,0.04)" }}
            >
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold mb-3" style={{ background: "#111111", color: "#FFFFFF" }}>
                {i + 1}
              </span>
              <p className="font-heading font-semibold text-sm" style={{ color: "#111111" }}>{locale === "cs" ? p.cs : p.en}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Section 5: Current Focus / Projects ─── */

function ProductMapSection({ locale, shouldReduceMotion }: { locale: Locale; shouldReduceMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const y = useScrollProgress(sectionRef);

  return (
    <section ref={sectionRef} className="relative" style={{ padding: "clamp(100px, 14vw, 180px) clamp(24px, 5vw, 80px)", background: "#FFFFFF" }}>
      <motion.div style={{ y: shouldReduceMotion ? 0 : y }} className="max-w-5xl mx-auto">
        {/* Brand card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link href={`/${locale}${products[0].href}`} className="block no-underline group">
            <div className="p-8 sm:p-10 rounded-2xl transition-all duration-300 group-hover:shadow-xl" style={{ background: "#111111" }}>
              <span className="text-xs font-mono font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
                {locale === "cs" ? "Značka" : "Brand"}
              </span>
              <h2 className="font-heading font-bold mt-3" style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.03em", color: "#FFFFFF" }}>
                {products[0].title}
              </h2>
              <p className="font-body text-sm mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                {locale === "cs" ? products[0].descCs : products[0].descEn}
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-medium mt-4 transition-all duration-300 group-hover:gap-3" style={{ color: "rgba(255,255,255,0.5)" }}>
                {locale === "cs" ? "Prozkoumat" : "Explore"} <span style={{ fontSize: 10 }}>→</span>
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center py-8"
        >
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8"
            style={{ background: "rgba(17,17,17,0.15)" }}
          />
        </motion.div>

        {/* Product cards */}
        <div className="space-y-4">
          {products.slice(1).map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
            >
              <Link href={`/${locale}${p.href}`} className="block no-underline group">
                <div className="p-6 sm:p-8 rounded-2xl transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-0.5" style={{ background: "#F7F8FA", border: "1px solid rgba(17,17,17,0.04)" }}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-heading font-semibold" style={{ fontSize: "clamp(16px, 1.5vw, 20px)", letterSpacing: "-0.02em", color: "#111111" }}>
                        {p.title}
                      </h3>
                      <p className="font-body text-sm mt-1.5 leading-relaxed" style={{ color: "#5F6368" }}>
                        {locale === "cs" ? p.descCs : p.descEn}
                      </p>
                    </div>
                    <span className="flex-shrink-0 transition-all duration-300 group-hover:translate-x-1" style={{ color: "#5F6368", fontSize: 16 }}>→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  return useTransform(scrollYProgress, [0, 1], [30, -30]);
}
