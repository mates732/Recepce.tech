"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { getPage } from "@/content/repository";
import type { ZlatyHrebenPageData } from "@/content/types";
import { useEmbeddedScrollHandoff } from "@/hooks/useEmbeddedScrollHandoff";
import ProjectFacts from "@/components/ProjectFacts";

interface Props {
  locale: Locale;
}

export default function ZlatyHrebenContent({ locale }: Props) {
  const shouldReduceMotion = useReducedMotion();
  const data = getPage("zlaty-hreben")?.data;

  return (
    <div className="relative" style={{ background: "#0A0A0B" }}>
      <HeroSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} data={data} />
      <FactsSection locale={locale} data={data} />
      <EmbeddedPreviewSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} data={data} />
      <TimelineSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} data={data} />
      <CompletedSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} data={data} />
      <ReflectionSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} data={data} />
      <FinalSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} data={data} />
    </div>
  );
}

/* ─── Hero ─── */

function HeroSection({ locale, shouldReduceMotion, data }: { locale: Locale; shouldReduceMotion: boolean; data?: ZlatyHrebenPageData }) {
  return (
    <section className="relative" style={{ padding: "clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px) clamp(48px, 4vw, 64px)" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-mono font-semibold tracking-widest uppercase mb-4" style={{ color: "#6E7683" }}>
            {data?.badge[locale]}
          </p>
          <h1 className="font-heading font-medium leading-tight" style={{ fontSize: "var(--text-h1-md)", letterSpacing: "-0.04em", color: "#F4F6F8" }}>
            {data?.heroTitle}
          </h1>
          <p className="font-body mt-4 leading-relaxed" style={{ fontSize: "var(--text-body)", color: "#9AA1AB", maxWidth: "45ch" }}>
            {data?.heroDesc[locale]}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Project Facts ─── */

function FactsSection({ locale, data }: { locale: Locale; data?: ZlatyHrebenPageData }) {
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

/* ─── Embedded Browser Preview ─── */

function EmbeddedPreviewSection({ locale, shouldReduceMotion, data }: { locale: Locale; shouldReduceMotion: boolean; data?: ZlatyHrebenPageData }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEmbeddedScrollHandoff(iframeRef);
  const previewUrl = data?.previewUrl ?? "";
  const previewLabel = data?.previewLabel ?? "";

  return (
    <section className="relative" style={{ padding: "0 clamp(24px, 5vw, 80px) clamp(60px, 8vw, 100px)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl overflow-hidden"
          style={{ background: "#121316", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-1.5 px-4 py-3" style={{ background: "#1C1E23", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f56" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#27c93f" }} />
            <span className="ml-3 px-3 py-1 rounded text-label font-mono truncate" style={{ background: "#121316", color: "#6E7683", flex: 1 }}>
                  {previewLabel}
            </span>
          </div>
          <iframe
            ref={iframeRef}
            src={previewUrl}
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

function TimelineSection({ locale, shouldReduceMotion, data }: { locale: Locale; shouldReduceMotion: boolean; data?: ZlatyHrebenPageData }) {
  const sectionRef = useRef<HTMLElement>(null);

  const steps = (data?.timeline.steps ?? []).map((s) => ({
    title: s.title[locale],
    desc: s.desc[locale],
  }));

  return (
    <section ref={sectionRef} className="relative" style={{ padding: "clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)" }}>
      <div className="max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs font-mono font-semibold tracking-widest uppercase mb-8"
          style={{ color: "#6E7683" }}
        >
          {data?.timeline.label[locale]}
        </motion.p>

        <div className="relative">
          <div className="absolute left-[15px] top-0 bottom-0 w-px" style={{ background: "rgba(255,255,255,0.06)" }} />
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
                  style={{ background: i === steps.length - 1 ? "var(--color-accent)" : "#F4F6F8", color: i === steps.length - 1 ? "#0A0A0B" : "#6E7683", border: i < steps.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
                >
                  {i + 1}
                </span>
                <h3 className="font-heading font-medium mb-2" style={{ fontSize: "var(--text-h4)", letterSpacing: "-0.02em", color: "#F4F6F8" }}>{step.title}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#9AA1AB" }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── What Was Completed ─── */

function CompletedSection({ locale, shouldReduceMotion, data }: { locale: Locale; shouldReduceMotion: boolean; data?: ZlatyHrebenPageData }) {
  const sectionRef = useRef<HTMLElement>(null);

  const items = data?.completed.items[locale] ?? [];

  return (
    <section ref={sectionRef} className="relative" style={{ padding: "clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)" }}>
      <div className="max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs font-mono font-semibold tracking-widest uppercase mb-6"
          style={{ color: "#6E7683" }}
        >
          {data?.completed.label[locale]}
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
              <span className="text-label-lg flex-shrink-0" style={{ color: "#F4F6F8" }}>✓</span>
              <span className="font-body text-sm" style={{ color: "#9AA1AB" }}>{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Reflection ─── */

function ReflectionSection({ locale, shouldReduceMotion, data }: { locale: Locale; shouldReduceMotion: boolean; data?: ZlatyHrebenPageData }) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="relative" style={{ padding: "clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)" }}>
      <div className="max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs font-mono font-semibold tracking-widest uppercase mb-6"
          style={{ color: "#6E7683" }}
        >
          {data?.reflection.label[locale]}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-body leading-relaxed" style={{ fontSize: "var(--text-body)", color: "#9AA1AB" }}>
            {data?.reflection.text[locale]}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Final CTA ─── */

function FinalSection({ locale, shouldReduceMotion, data }: { locale: Locale; shouldReduceMotion: boolean; data?: ZlatyHrebenPageData }) {
  const title = (data?.final.title ?? []).map((line) => line[locale]);

  return (
    <section className="relative" style={{ padding: "clamp(100px, 14vw, 160px) clamp(24px, 5vw, 80px)" }}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading font-medium leading-tight"
          style={{ fontSize: "var(--text-h1-md)", letterSpacing: "-0.03em", color: "#F4F6F8" }}
        >
          {title.map((line, i) => (
            <span key={i}>
              {line}
              {i < title.length - 1 && <br />}
            </span>
          ))}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-body mt-4 max-w-md mx-auto leading-relaxed"
          style={{ fontSize: "var(--text-body)", color: "#9AA1AB" }}
        >
          {data?.final.subtitle[locale]}
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
            style={{ color: "#0A0A0B", background: "var(--color-accent)" }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            {data?.final.cta[locale]} &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
