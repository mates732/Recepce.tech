"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useTransform, useReducedMotion } from "framer-motion";
import { useParallax, useElementScrollProgress, OFFSET_TOP_OUT } from "@/lib/scroll";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { getPage } from "@/content/repository";
import type { VoicePageData } from "@/content/types";
import ProjectFacts from "@/components/ProjectFacts";

interface Props {
  locale: Locale;
}

export default function VoiceContent({ locale }: Props) {
  const shouldReduceMotion = useReducedMotion();
  const data = getPage("voice")?.data;

  return (
    <div className="relative">
      <HeroSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} data={data} />
      <FactsSection locale={locale} data={data} />
      <CapabilitiesSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} data={data} />
      <LanguagesSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} data={data} />
      <IntelligenceSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} data={data} />
    </div>
  );
}

/* ─── Project Facts ─── */

function FactsSection({ locale, data }: { locale: Locale; data?: VoicePageData }) {
  const facts = (data?.facts ?? []).map((f) => ({
    label: f.label[locale],
    value: f.value[locale],
    href: f.href,
    external: f.external,
  }));

  return (
    <section className="relative" style={{ padding: "0 clamp(24px, 5vw, 80px) clamp(60px, 8vw, 100px)" }}>
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/${locale}/projekty`}
          className="inline-flex items-center gap-1.5 font-mono text-label font-semibold uppercase tracking-[0.15em] mb-6 transition-opacity duration-200 hover:opacity-60"
          style={{ color: "#6E7683" }}
        >
          <span aria-hidden="true">&larr;</span>
          {t(locale, "ui.allProjects")}
        </Link>
        <ProjectFacts locale={locale} facts={facts} />
      </div>
    </section>
  );
}

/* ─── Hero ─── */

function HeroSection({ locale, shouldReduceMotion, data }: { locale: Locale; shouldReduceMotion: boolean; data?: VoicePageData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useElementScrollProgress(sectionRef, OFFSET_TOP_OUT);
  const y = useTransform(progress, [0, 1], [0, 80]);
  const opacity = useTransform(progress, [0, 0.7], [1, 0]);

  const heroTitle = (data?.heroTitle ?? []).map((line) => line[locale]);
  const crossLink = data?.crossLink;
  const cta = data?.cta;

  return (
    <section ref={sectionRef} className="relative flex flex-col items-center justify-center" style={{ minHeight: "100dvh", padding: "clamp(120px, 15vw, 200px) clamp(24px, 5vw, 80px)" }}>
      <motion.div style={{ y: shouldReduceMotion ? 0 : y, opacity: shouldReduceMotion ? 1 : opacity }} className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        {crossLink && (
          <Link
            href={`/${locale}${crossLink.href}`}
            className="group inline-flex flex-col items-start"
          >
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs font-mono font-semibold tracking-widest uppercase"
              style={{ color: "#6E7683" }}
            >
              {data?.badge[locale]}
            </motion.span>
            <div className="h-[18px] overflow-hidden">
              <span
                className="block text-label font-mono tracking-wider mt-0.5 flex items-center gap-1 transition-all duration-200 ease-out -translate-y-[6px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                style={{ color: "#6E7683" }}
              >
                {crossLink.label[locale]}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-[2px]">↗</span>
              </span>
            </div>
          </Link>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-medium leading-tight mt-6"
          style={{ fontSize: "var(--text-hero)", letterSpacing: "-0.04em", color: "#F4F6F8" }}
        >
          {heroTitle.map((line, i) => (
            <span key={i}>
              {line}
              {i < heroTitle.length - 1 && <br />}
            </span>
          ))}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-body mt-8 max-w-lg leading-relaxed"
          style={{ fontSize: "var(--text-lead)", color: "#9AA1AB" }}
        >
          {data?.heroDesc[locale]}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center mt-12"
        >
          {cta && (
            <Link
              href={`/${locale}/demo`}
              className="inline-flex items-center justify-center px-8 py-3 rounded-full text-sm font-medium transition-all duration-300"
              style={{ color: "#0A0A0B", background: "var(--color-accent)" }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              {cta[locale]}
            </Link>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Capabilities ─── */

function CapabilitiesSection({ locale, shouldReduceMotion, data }: { locale: Locale; shouldReduceMotion: boolean; data?: VoicePageData }) {
  const items = data?.capabilities ?? [];

  return (
    <section className="relative" style={{ padding: "clamp(28px, 3vw, 40px) clamp(24px, 5vw, 80px)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="h-px w-full" style={{ background: "#1B1D22" }} />
        <div className="flex items-center justify-center flex-nowrap overflow-hidden" style={{ padding: "clamp(20px, 2.5vw, 32px) 0" }}>
          {items.map((item, i) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 0.8, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="font-mono tracking-widest uppercase flex-shrink-0"
              style={{
                fontSize: "var(--text-label-fluid)",
                fontWeight: 500,
                color: "#6E7683",
                letterSpacing: "0.22em",
                transition: "opacity 220ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.8"; }}
            >
              {item}
              {i < items.length - 1 && (
                <span className="inline-block mx-4 sm:mx-5 md:mx-6 lg:mx-7" style={{ color: "#D4D4D4" }}>—</span>
              )}
            </motion.span>
          ))}
        </div>
        <div className="h-px w-full" style={{ background: "#1B1D22" }} />
      </div>
    </section>
  );
}

/* ─── Languages ─── */

function LanguagesSection({ locale, shouldReduceMotion, data }: { locale: Locale; shouldReduceMotion: boolean; data?: VoicePageData }) {
  const langs = data?.languages[locale] ?? [];

  return (
    <section className="relative" style={{ padding: "0 clamp(24px, 5vw, 80px) clamp(28px, 3vw, 40px)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="h-px w-full" style={{ background: "#1B1D22" }} />
        <div className="flex items-center justify-center flex-nowrap overflow-hidden" style={{ padding: "clamp(20px, 2.5vw, 32px) 0" }}>
          {langs.map((lang, i) => (
            <motion.span
              key={lang}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 0.8, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="font-mono tracking-widest uppercase flex-shrink-0"
              style={{
                fontSize: "var(--text-label-fluid)",
                fontWeight: 500,
                color: "#6E7683",
                letterSpacing: "0.22em",
                transition: "opacity 220ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.8"; }}
            >
              {lang}
              {i < langs.length - 1 && (
                <span className="inline-block mx-4 sm:mx-5 md:mx-6 lg:mx-7" style={{ color: "#D4D4D4" }}>—</span>
              )}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Intelligence ─── */

function IntelligenceSection({ locale, shouldReduceMotion, data }: { locale: Locale; shouldReduceMotion: boolean; data?: VoicePageData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const y = useParallax(sectionRef, 30, -30);

  const intelligence = data?.intelligence;
  const phrases = (intelligence?.phrases ?? []).map((p) => p[locale]);
  const heading = (intelligence?.heading ?? []).map((line) => line[locale]);
  const steps = (intelligence?.steps ?? []).map((s) => ({
    icon: s.icon,
    label: s.label[locale],
    detail: s.detail[locale],
  }));

  return (
    <section ref={sectionRef} className="relative" style={{ padding: "clamp(100px, 14vw, 180px) clamp(24px, 5vw, 80px)" }}>
      <motion.div style={{ y }} className="max-w-6xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-mono font-semibold tracking-widest uppercase"
          style={{ color: "#6E7683" }}
        >
          {intelligence?.label[locale]}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-heading font-medium leading-tight mt-4"
          style={{ fontSize: "var(--text-h1-lg)", letterSpacing: "-0.03em", color: "#F4F6F8" }}
        >
          {heading.map((line, i) => (
            <span key={i}>
              {line}
              {i < heading.length - 1 && <br />}
            </span>
          ))}
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 mt-12">
          {/* Left: imperfect speech */}
          <div className="flex flex-col justify-center min-h-[240px]">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-label font-mono font-semibold tracking-widest uppercase mb-6"
              style={{ color: "#6E7683" }}
            >
              {intelligence?.callerLabel[locale]}
            </motion.span>
            <div className="space-y-1 text-left">
              {phrases.map((phrase, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.25, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="block font-heading font-medium leading-tight"
                  style={{ fontSize: "var(--text-h3)", letterSpacing: "-0.02em", color: i % 2 === 1 ? "#6E7683" : "#F4F6F8" }}
                >
                  {phrase}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Right: System interpretation */}
          <div className="flex flex-col justify-center min-h-[240px]">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-label font-mono font-semibold tracking-widest uppercase mb-6"
              style={{ color: "#6E7683" }}
            >
              {intelligence?.aiLabel[locale]}
            </motion.span>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.2, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-3"
                >
                  <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: "#F4F6F8" }}>{step.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-body text-sm font-medium" style={{ color: "#F4F6F8" }}>{step.label}</span>
                    <p className="font-body text-xs mt-0.5" style={{ color: "#9AA1AB" }}>{step.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
