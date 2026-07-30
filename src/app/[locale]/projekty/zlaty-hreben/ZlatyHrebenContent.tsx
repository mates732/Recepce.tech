"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/types";
import { useEmbeddedScrollHandoff } from "@/hooks/useEmbeddedScrollHandoff";

interface Props {
  locale: Locale;
}

export default function ZlatyHrebenContent({ locale }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative" style={{ background: "#F7F8FA" }}>
      <HeroSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} />
      <EmbeddedPreviewSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} />
      <TimelineSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} />
      <CompletedSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} />
      <ReflectionSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} />
      <FinalSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} />
    </div>
  );
}

/* ─── Hero ─── */

function HeroSection({ locale }: { locale: Locale; shouldReduceMotion: boolean }) {
  return (
    <section className="relative" style={{ padding: "clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px) clamp(48px, 4vw, 64px)" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-mono font-semibold tracking-widest uppercase mb-4" style={{ color: "#9CA3AF" }}>
            {locale === "cs" ? "Klientský projekt" : "Client Project"}
          </p>
          <h1 className="font-heading font-bold leading-tight" style={{ fontSize: "clamp(36px, 5vw, 60px)", letterSpacing: "-0.04em", color: "#111111" }}>
            Zlatý Hřeben
          </h1>
          <p className="font-body mt-4 leading-relaxed" style={{ fontSize: "clamp(14px, 1.1vw, 16px)", color: "#5F6368", maxWidth: "45ch" }}>
            {locale === "cs"
              ? "Moderní webová prezentace navržená pro prémiové pánské holičství. Projekt nedosáhl produkce, ale designový směr je možné demonstrovat na tomto reprezentativním mockupu."
              : "A modern website concept designed for a premium barbershop. The project never reached production, but the design direction is demonstrated through this representative mockup."}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Embedded Browser Preview ─── */

function EmbeddedPreviewSection({ locale, shouldReduceMotion }: { locale: Locale; shouldReduceMotion: boolean }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEmbeddedScrollHandoff(iframeRef);

  return (
    <section className="relative" style={{ padding: "0 clamp(24px, 5vw, 80px) clamp(60px, 8vw, 100px)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl overflow-hidden"
          style={{ background: "#FFFFFF", border: "1px solid rgba(17,17,17,0.06)" }}
        >
          <div className="flex items-center gap-1.5 px-4 py-3" style={{ background: "#F0F0F0", borderBottom: "1px solid rgba(17,17,17,0.06)" }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f56" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#27c93f" }} />
            <span className="ml-3 px-3 py-1 rounded text-[10px] font-mono truncate" style={{ background: "#FFFFFF", color: "#9CA3AF", flex: 1 }}>
                  zlaty-hreben.vercel.app
            </span>
          </div>
          <iframe
            ref={iframeRef}
            src="https://zlaty-hreben.vercel.app/"
            className="w-full border-0"
            style={{ height: "clamp(400px, 60vh, 700px)" }}
            title="Design preview"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Timeline ─── */

function TimelineSection({ locale, shouldReduceMotion }: { locale: Locale; shouldReduceMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);

  const steps = [
    {
      title: locale === "cs" ? "Kontakt" : "Client Contacted Me",
      desc: locale === "cs"
        ? "Cílem bylo vytvořit moderní prémiovou webovou prezentaci pro pánské holičství se zaměřením na čistou typografii, online rezervace a silnou vizuální identitu."
        : "The goal was to create a premium barbershop website focused on clean typography, online booking and a strong visual identity.",
    },
    {
      title: locale === "cs" ? "Výzkum a plánování" : "Research & Planning",
      desc: locale === "cs"
        ? "Analýza konkurence, informační architektura, uživatelské scénáře a návrh kompletní vizuální identity."
        : "Competitor analysis, information architecture, user scenarios and complete visual identity design.",
    },
    {
      title: locale === "cs" ? "Design a vývoj" : "Design & Development",
      desc: locale === "cs"
        ? "Návrh responzivního rozhraní, implementace prémiového UI, optimalizace výkonu a vytvoření plně funkčního prototypu."
        : "Responsive interface design, premium UI implementation, performance optimization and a fully functional prototype.",
    },
    {
      title: locale === "cs" ? "Projekt pozastaven" : "Project Paused",
      desc: locale === "cs"
        ? "Projekt dosáhl pokročilé fáze návrhu i vývoje. Komunikace s klientem se však před dokončením zastavila, proto nebyl web nikdy nasazen. Design následně posloužil jako ukázková případová studie."
        : "The project reached an advanced design and development phase, but client communication stopped before completion. The website was never deployed. The design later served as a showcase case study.",
    },
  ];

  return (
    <section ref={sectionRef} className="relative" style={{ padding: "clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)" }}>
      <div className="max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs font-mono font-semibold tracking-widest uppercase mb-8"
          style={{ color: "#9CA3AF" }}
        >
          {locale === "cs" ? "Časová osa" : "Project Timeline"}
        </motion.p>

        <div className="relative">
          <div className="absolute left-[15px] top-0 bottom-0 w-px" style={{ background: "rgba(17,17,17,0.06)" }} />
          <div className="space-y-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-10"
              >
                <span
                  className="absolute left-[7px] top-0.5 w-[17px] h-[17px] rounded-full flex items-center justify-center text-[7px] font-mono font-bold"
                  style={{ background: i === steps.length - 1 ? "#111111" : "#FFFFFF", color: i === steps.length - 1 ? "#FFFFFF" : "#5F6368", border: i < steps.length - 1 ? "1px solid rgba(17,17,17,0.06)" : "none" }}
                >
                  {i + 1}
                </span>
                <h3 className="font-heading font-semibold mb-2" style={{ fontSize: "clamp(16px, 1.4vw, 20px)", letterSpacing: "-0.02em", color: "#111111" }}>{step.title}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#5F6368" }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── What Was Completed ─── */

function CompletedSection({ locale, shouldReduceMotion }: { locale: Locale; shouldReduceMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);

  const items = locale === "cs"
    ? ["Informační architektura", "Responzivní UI design", "Frontend implementace", "Prémiová vizuální identita", "Mobilní optimalizace", "Optimalizace výkonu"]
    : ["Information architecture", "Responsive UI design", "Frontend implementation", "Premium visual identity", "Mobile optimization", "Performance optimization"];

  return (
    <section ref={sectionRef} className="relative" style={{ padding: "clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)" }}>
      <div className="max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs font-mono font-semibold tracking-widest uppercase mb-6"
          style={{ color: "#9CA3AF" }}
        >
          {locale === "cs" ? "Dokončeno" : "What Was Completed"}
        </motion.p>

        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.04 * i, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <span className="text-[11px] flex-shrink-0" style={{ color: "#111111" }}>✓</span>
              <span className="font-body text-sm" style={{ color: "#5F6368" }}>{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Reflection ─── */

function ReflectionSection({ locale, shouldReduceMotion }: { locale: Locale; shouldReduceMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="relative" style={{ padding: "clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)" }}>
      <div className="max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs font-mono font-semibold tracking-widest uppercase mb-6"
          style={{ color: "#9CA3AF" }}
        >
          {locale === "cs" ? "Reflexe" : "Reflection"}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-body leading-relaxed" style={{ fontSize: "clamp(14px, 1.1vw, 16px)", color: "#5F6368" }}>
            {locale === "cs"
              ? "Původní projekt Zlatý Hřeben nebyl dokončen. Pro demonstraci navrženého vizuálního směru a uživatelského zážitku je na této stránce k dispozici reprezentativní online ukázka vytvořená podle stejného designového systému."
              : "The original Zlatý Hřeben project was never completed. To demonstrate the intended visual direction and user experience, this page includes a representative online preview built using the same design system."}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Final CTA ─── */

function FinalSection({ locale }: { locale: Locale; shouldReduceMotion: boolean }) {
  return (
    <section className="relative" style={{ padding: "clamp(100px, 14vw, 160px) clamp(24px, 5vw, 80px)" }}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading font-bold leading-tight"
          style={{ fontSize: "clamp(28px, 4.5vw, 52px)", letterSpacing: "-0.03em", color: "#111111" }}
        >
          {locale === "cs" ? "Máte zájem o\npodobný web?" : "Interested in building\nsomething similar?"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-body mt-4 max-w-md mx-auto leading-relaxed"
          style={{ fontSize: "clamp(14px, 1.1vw, 16px)", color: "#5F6368" }}
        >
          {locale === "cs"
            ? "Pojďme vytvořit něco, co skutečně vznikne."
            : "Let's create something that reaches production."}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium transition-all duration-300"
            style={{ color: "#FFFFFF", background: "#111111" }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            {locale === "cs" ? "Ozvat se" : "Get in touch"} &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
