"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useParallax } from "@/lib/scroll";
import type { Locale } from "@/lib/types";
import { getPage } from "@/content/repository";
import type { PoniciPageData } from "@/content/types";
import { useEmbeddedScrollHandoff } from "@/hooks/useEmbeddedScrollHandoff";

/* Recepce.tech design identity — dark editorial + vermilion signal.
   Plochy jsou průsvitné, aby jimi prosvítala ambientní záře z pozadí. */
const BG = "rgba(10,10,11,0)";
const SURFACE = "rgba(18,19,22,0.84)";
const CARD = "rgba(23,24,29,0.84)";
const TEXT = "#F4F6F8";
const TEXT_2 = "#C7CDD6";
const MUTED = "#9AA1AB";
const DIM = "#6E7683";
const ACCENT = "var(--color-accent)";
const ACCENT_HEX = "#FF4A2E";
const BORDER = "rgba(255,255,255,0.08)";

const HEADING = "'Space Grotesk', 'Inter', sans-serif";

const EASE = [0.16, 1, 0.3, 1] as const;

interface Props {
  locale: Locale;
}

export default function PoniciContent({ locale }: Props) {
  const data = getPage("ponici")?.data;
  const t = (v: { cs: string; en: string }) => v[locale];

  const facts = (data?.facts ?? []).map((f) => ({
    label: t(f.label),
    value: t(f.value),
    href: f.href,
    external: f.external,
  }));

  return (
    <div className="relative" style={{ background: BG }}>
      <Hero locale={locale} data={data} t={t} facts={facts} />
      <Challenge locale={locale} data={data} t={t} />
      <Strategy locale={locale} data={data} t={t} />
      <DesignSystem locale={locale} data={data} t={t} />
      <UxFlow locale={locale} data={data} t={t} />
      <WebExperience locale={locale} data={data} t={t} />
      <Technology locale={locale} data={data} t={t} />
      <Result locale={locale} data={data} t={t} />
    </div>
  );
}

type T = (v: { cs: string; en: string }) => string;

/* ─────────────────────────── HERO ─────────────────────────── */

function Hero({
  locale,
  data,
  t,
  facts,
}: {
  locale: Locale;
  data?: PoniciPageData;
  t: T;
  facts: { label: string; value: string; href?: string; external?: boolean }[];
}) {
  const shouldReduce = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const y = useParallax(ref, 60, -60);
  const wordmark = data?.heroTitle[0][locale] ?? "";
  const headline = data?.heroTitle[1][locale] ?? "";
  const desc = t(data?.heroDesc ?? { cs: "", en: "" });
  const cta = t(data?.cta ?? { cs: "", en: "" });
  const ctaHref = data?.ctaHref ?? "#";

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: BG, color: TEXT }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(255,74,46,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 45% at 82% 85%, rgba(255,74,46,0.05) 0%, transparent 60%)",
        }}
      />

      <motion.div
        style={{ y: shouldReduce ? 0 : y }}
        className="relative z-10 mx-auto flex flex-col items-center text-center"
      >
        {/* badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center gap-3 font-mono"
          style={{
            fontSize: "var(--text-label-fluid)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#6E7683",
          }}
        >
          <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: ACCENT_HEX, animation: "pulse-dot 2.4s ease-in-out infinite" }} />
          {t(data?.badge ?? { cs: "", en: "" })} · {locale === "cs" ? "Praha" : "Prague"}
        </motion.div>

        {/* wordmark */}
        <motion.h1
          initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="font-heading leading-none"
          style={{
            fontFamily: HEADING,
            fontWeight: 500,
            fontSize: "clamp(44px, 9vw, 110px)",
            letterSpacing: "-0.03em",
            marginTop: "clamp(28px, 5vh, 48px)",
            color: TEXT,
          }}
        >
          {wordmark}
        </motion.h1>

        {/* headline */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28, ease: EASE }}
          className="font-heading"
          style={{
            fontFamily: HEADING,
            fontWeight: 400,
            fontSize: "clamp(20px, 3vw, 34px)",
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
            color: "rgba(244,246,248,0.9)",
            maxWidth: "26ch",
            marginTop: "clamp(16px, 3vh, 26px)",
          }}
        >
          {headline}
        </motion.p>

        {/* subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42, ease: EASE }}
          className="font-body"
          style={{
            fontSize: "var(--text-lead)",
            color: "#9AA1AB",
            maxWidth: "46ch",
            marginTop: "clamp(14px, 2.5vh, 22px)",
          }}
        >
          {desc}
        </motion.p>

        {/* CTA */}
        <motion.a
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-medium transition-all duration-300"
          style={{ background: ACCENT, color: "#0A0A0B", marginTop: "clamp(28px, 5vh, 44px)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 0 40px rgba(255,74,46,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {cta}
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
            ↗
          </span>
        </motion.a>

        {/* facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          className="w-full"
          style={{ maxWidth: 880, marginTop: "clamp(36px, 7vh, 64px)" }}
        >
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl"
            style={{ background: BORDER }}
          >
            {facts.map((f) => (
              <div key={f.label} style={{ background: SURFACE, padding: "18px 20px", height: "100%" }}>
                <p
                  className="font-mono"
                  style={{
                    fontSize: "var(--text-label-sm)",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "#6E7683",
                    marginBottom: 6,
                  }}
                >
                  {f.label}
                </p>
                {f.href ? (
                  <a
                    href={f.href}
                    target={f.external ? "_blank" : undefined}
                    rel={f.external ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-1.5 transition-opacity duration-200 hover:opacity-60"
                    style={{ color: TEXT, fontSize: "var(--text-small)", fontWeight: 500 }}
                  >
                    {f.value}
                    {f.external && <span aria-hidden="true" style={{ fontSize: 10 }}>↗</span>}
                  </a>
                ) : (
                  <p style={{ color: TEXT, fontSize: "var(--text-small)", fontWeight: 500 }}>{f.value}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* real website screenshot — slow zoom */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 1.05 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.6, ease: EASE }}
        className="relative z-10 mx-auto"
        style={{ maxWidth: 1100, padding: "clamp(36px, 6vh, 56px) clamp(16px, 4vw, 48px) 0" }}
      >
        <motion.div
          animate={shouldReduce ? {} : { scale: [1, 1.02, 1] }}
          transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
          className="relative overflow-hidden rounded-2xl"
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
            aspectRatio: "9 / 10",
          }}
        >
          <Image
            src="/images/ponici/ponici-home.png"
            alt="Ponici.cz — domovská stránka"
            fill
            className="object-cover"
            style={{ objectPosition: "top center" }}
            sizes="(max-width: 1100px) 100vw, 1100px"
            priority
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────── SECTION SHELL ─────────────────────────── */

function SectionShell({
  label,
  title,
  children,
  tone,
  align = "left",
}: {
  label: string;
  title: string;
  children: React.ReactNode;
  tone: "light" | "dark";
  align?: "left" | "center";
}) {
  const isDark = tone === "dark";
  const bg = isDark ? BG : SURFACE;
  const labelColor = isDark ? "rgba(255,255,255,0.5)" : DIM;
  const maxW = align === "center" ? "max-w-3xl mx-auto text-center" : "";

  return (
    <section
      className="relative"
      style={{ background: bg, padding: "clamp(72px, 12vw, 150px) clamp(24px, 5vw, 80px)" }}
    >
      <div className={`${maxW} mx-auto`} style={{ maxWidth: align === "center" ? 760 : 1080 }}>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-mono"
          style={{
            fontSize: "var(--text-label-fluid)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: labelColor,
          }}
        >
          {label}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
          className="font-heading"
          style={{
            fontFamily: HEADING,
            fontWeight: 500,
            fontSize: "clamp(30px, 4.6vw, 54px)",
            letterSpacing: "-0.03em",
            lineHeight: 1.12,
            color: TEXT,
            marginTop: "clamp(16px, 3vh, 26px)",
          }}
        >
          {title}
        </motion.h2>

        <div className="mt-10 sm:mt-12">{children}</div>
      </div>
    </section>
  );
}

/* ─────────────────────────── CHALLENGE ─────────────────────────── */

function Challenge({ locale, data, t }: { locale: Locale; data?: PoniciPageData; t: T }) {
  const s = data?.sections.challenge;
  const points = (s?.points[locale] ?? []) as string[];

  return (
    <SectionShell label={t(s?.label ?? { cs: "", en: "" })} title={t(s?.title ?? { cs: "", en: "" })} tone="light">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-body"
          style={{ fontSize: "var(--text-lead)", lineHeight: 1.7, color: TEXT_2, maxWidth: "46ch" }}
        >
          {t(s?.text ?? { cs: "", en: "" })}
        </motion.p>

        <ul className="flex flex-col gap-4">
          {points.map((point, i) => (
            <motion.li
              key={point}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className="flex items-start gap-3.5"
              style={{ padding: "16px 18px", background: CARD, border: BORDER, borderRadius: 14 }}
            >
              <span
                aria-hidden="true"
                className="mt-2 inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: ACCENT_HEX }}
              />
              <span className="font-body" style={{ fontSize: "var(--text-body)", color: TEXT_2 }}>{point}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}

/* ─────────────────────────── STRATEGY ─────────────────────────── */

function Strategy({ locale, data, t }: { locale: Locale; data?: PoniciPageData; t: T }) {
  const s = data?.sections.strategy;
  const pillars = (s?.pillars ?? []).map((p) => ({
    title: t(p.title),
    desc: t(p.desc),
  }));
  const questions = (s?.questions?.[locale] ?? []) as string[];

  return (
    <section className="relative" style={{ background: CARD, padding: "clamp(72px, 12vw, 150px) clamp(24px, 5vw, 80px)" }}>
      <div className="mx-auto" style={{ maxWidth: 1080 }}>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-mono"
          style={{ fontSize: "var(--text-label-fluid)", letterSpacing: "0.22em", textTransform: "uppercase", color: DIM }}
        >
          {t(s?.label ?? { cs: "", en: "" })}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
          className="font-heading"
          style={{
            fontFamily: HEADING,
            fontWeight: 500,
            fontSize: "clamp(30px, 4.6vw, 54px)",
            letterSpacing: "-0.03em",
            lineHeight: 1.12,
            color: TEXT,
            marginTop: "clamp(16px, 3vh, 26px)",
            maxWidth: "22ch",
          }}
        >
          {t(s?.title ?? { cs: "", en: "" })}
        </motion.h2>

        <motion.blockquote
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-8"
          style={{
            fontFamily: HEADING,
            fontWeight: 400,
            fontSize: "clamp(22px, 3vw, 32px)",
            lineHeight: 1.35,
            letterSpacing: "-0.02em",
            color: TEXT,
            borderLeft: `2px solid ${ACCENT_HEX}`,
            paddingLeft: 20,
            maxWidth: "30ch",
          }}
        >
          {t(s?.text ?? { cs: "", en: "" })}
        </motion.blockquote>

        {/* questions the web answers */}
        {questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {questions.map((q, i) => (
              <span
                key={q}
                className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 font-body"
                style={{ background: SURFACE, border: BORDER, color: TEXT_2 }}
              >
                <span className="font-mono" style={{ fontSize: "var(--text-label)", color: ACCENT_HEX }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {q}
              </span>
            ))}
          </motion.div>
        )}

        <div
          className="grid gap-5 mt-12"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))" }}
        >
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              className="rounded-2xl p-6"
              style={{ background: SURFACE, border: BORDER }}
            >
              <span
                className="font-mono"
                style={{ fontSize: "var(--text-label)", letterSpacing: "0.2em", color: ACCENT_HEX }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className="font-heading mt-3"
                style={{ fontFamily: HEADING, fontWeight: 500, fontSize: "var(--text-h4)", color: TEXT }}
              >
                {p.title}
              </h3>
              <p className="font-body mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* services */}
        <div className="mt-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="font-mono"
            style={{ fontSize: "var(--text-label)", letterSpacing: "0.2em", textTransform: "uppercase", color: DIM }}
          >
            {locale === "cs" ? "Co škola nabízí" : "What the school offers"}
          </motion.span>
          <div className="flex flex-wrap gap-2.5 mt-4">
            {((s?.services?.[locale] ?? []) as string[]).map((service, i) => (
              <motion.span
                key={service}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                className="rounded-full px-4 py-2 font-body text-sm"
                style={{ background: SURFACE, border: "1px solid rgba(255,255,255,0.12)", color: TEXT_2 }}
              >
                {service}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── DESIGN SYSTEM ─────────────────────────── */

function DesignSystem({ locale, data, t }: { locale: Locale; data?: PoniciPageData; t: T }) {
  const s = data?.sections.design;
  const colors = (s?.colors ?? []).map((c) => ({ name: t(c.name), value: c.value }));
  const typefaces = (s?.typefaces ?? []).map((f) => ({ name: t(f.name), note: t(f.note) }));

  return (
    <SectionShell label={t(s?.label ?? { cs: "", en: "" })} title={t(s?.title ?? { cs: "", en: "" })} tone="light">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-body"
            style={{ fontSize: "var(--text-lead)", lineHeight: 1.7, color: TEXT_2 }}
          >
            {t(s?.text ?? { cs: "", en: "" })}
          </motion.p>

          <motion.blockquote
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="mt-8"
            style={{
              fontFamily: HEADING,
              fontWeight: 400,
              fontSize: "clamp(22px, 3vw, 32px)",
              color: TEXT,
              borderLeft: `2px solid ${ACCENT_HEX}`,
              paddingLeft: 20,
            }}
          >
            {t(s?.principle ?? { cs: "", en: "" })}
          </motion.blockquote>
        </div>

        <div className="flex flex-col gap-7">
          <div>
            <span className="font-mono" style={{ fontSize: "var(--text-label)", letterSpacing: "0.2em", textTransform: "uppercase", color: DIM }}>
              {locale === "cs" ? "Barvy" : "Colors"}
            </span>
            <div className="grid grid-cols-4 gap-3 mt-4">
              {colors.map((c) => (
                <div key={c.name}>
                  <div
                    className="rounded-xl w-full"
                    style={{
                      aspectRatio: "1",
                      background: c.value,
                      border: BORDER,
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                  />
                  <p className="font-heading text-xs mt-2" style={{ color: TEXT }}>{c.name}</p>
                  <p className="font-mono text-label-sm mt-0.5" style={{ color: DIM }}>{c.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="font-mono" style={{ fontSize: "var(--text-label)", letterSpacing: "0.2em", textTransform: "uppercase", color: DIM }}>
              {locale === "cs" ? "Typografie" : "Typography"}
            </span>
            <div className="flex flex-col gap-3 mt-4">
              {typefaces.map((f) => (
                <div
                  key={f.name}
                  className="flex items-baseline justify-between gap-4 rounded-xl px-5 py-4"
                  style={{ background: CARD, border: BORDER }}
                >
                  <span
                    className="font-heading"
                    style={{ fontFamily: HEADING, fontSize: "var(--text-h3)", color: TEXT }}
                  >
                    {f.name}
                  </span>
                  <span className="font-mono text-label-sm" style={{ color: DIM }}>{f.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

/* ─────────────────────────── UX / FLOW ─────────────────────────── */

function UxFlow({ locale, data, t }: { locale: Locale; data?: PoniciPageData; t: T }) {
  const s = data?.sections.ux;
  const answers = (s?.answers ?? []).map((a) => ({ title: t(a.title), desc: t(a.desc) }));
  const flow = (s?.flow?.[locale] ?? []) as string[];
  const personas = s?.personas ?? [];

  return (
    <SectionShell label={t(s?.label ?? { cs: "", en: "" })} title={t(s?.title ?? { cs: "", en: "" })} tone="dark" align="center">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="font-heading mx-auto"
        style={{
          fontFamily: HEADING,
          fontWeight: 400,
          fontSize: "clamp(24px, 3.4vw, 40px)",
          lineHeight: 1.3,
          letterSpacing: "-0.02em",
          color: TEXT,
          maxWidth: "24ch",
        }}
      >
        {t(s?.question ?? { cs: "", en: "" })}
      </motion.p>

      {/* user journey flow */}
      {flow.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 mt-10"
        >
          {flow.map((step, i) => (
            <span key={step} className="flex items-center gap-x-2">
              <span
                className="rounded-full px-4 py-2 font-mono"
                style={{
                  fontSize: "var(--text-label-fluid)",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: i === 0 || i === flow.length - 1 ? "#0A0A0B" : "rgba(255,255,255,0.72)",
                  background:
                    i === 0
                      ? ACCENT_HEX
                      : i === flow.length - 1
                      ? "#F4F6F8"
                      : "rgba(255,255,255,0.06)",
                  border: `1px solid ${
                    i === 0 ? "transparent" : i === flow.length - 1 ? "transparent" : "rgba(255,255,255,0.14)"
                  }`,
                }}
              >
                {step}
              </span>
              {i < flow.length - 1 && (
                <span aria-hidden="true" style={{ color: ACCENT_HEX, fontSize: 13 }}>
                  →
                </span>
              )}
            </span>
          ))}
        </motion.div>
      )}

      <div
        className="grid gap-5 mt-12"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))" }}
      >
        {answers.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="rounded-2xl p-6 text-left"
            style={{ background: "rgba(255,255,255,0.04)", border: BORDER }}
          >
            <span className="font-mono" style={{ fontSize: "var(--text-label)", letterSpacing: "0.2em", color: ACCENT_HEX }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-heading mt-3" style={{ fontFamily: HEADING, fontWeight: 500, fontSize: "var(--text-h4)", color: TEXT }}>
              {a.title}
            </h3>
            <p className="font-body mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>
              {a.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* personas */}
      {personas.length > 0 && (
        <div className="mt-14 text-left">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="font-mono"
            style={{ fontSize: "var(--text-label)", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}
          >
            {locale === "cs" ? "Pro koho web stavíme" : "Who we design for"}
          </motion.span>

          <div
            className="grid gap-5 mt-6"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))" }}
          >
            {personas.map((persona, i) => (
              <motion.div
                key={t(persona.title)}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
                className="rounded-2xl p-6"
                style={{ background: "rgba(255,255,255,0.04)", border: BORDER }}
              >
                <h3 className="font-heading" style={{ fontFamily: HEADING, fontWeight: 500, fontSize: "var(--text-h4)", color: TEXT }}>
                  {t(persona.title)}
                </h3>
                <p className="font-body mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>
                  {t(persona.desc)}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {persona.needs[locale].map((need) => (
                    <span
                      key={need}
                      className="rounded-full px-3 py-1 font-mono text-label-sm tracking-[0.08em]"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", color: TEXT_2 }}
                    >
                      {need}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </SectionShell>
  );
}

/* ─────────────────────────── PONICI.CZ V PRAXI ─────────────────────────── */

function WebExperience({ locale, data, t }: { locale: Locale; data?: PoniciPageData; t: T }) {
  const s = data?.sections.web;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEmbeddedScrollHandoff(iframeRef);

  // stejné ukotvení jako u Zlatého Hřebenu: živý web se čte z obsahu (previewUrl).
  // ponici.cz posílá X-Frame-Options: DENY, proto jde iframe přes vlastní proxy
  // (routa /api/ponici-preview), která vrací skutečný web bez restrikce framingu.
  const previewUrl = data?.previewUrl ?? "https://www.ponici.cz";
  const previewLabel = data?.previewLabel ?? "ponici.cz";
  const previewSrc = (() => {
    try {
      const u = new URL(previewUrl);
      const path = u.pathname && u.pathname !== "/" ? u.pathname : "";
      return path ? `/api/ponici-preview?path=${encodeURIComponent(path)}` : "/api/ponici-preview";
    } catch {
      return "/api/ponici-preview";
    }
  })();

  return (
    <section className="relative overflow-hidden" style={{ background: SURFACE }}>
      <div className="mx-auto" style={{ maxWidth: 1080, padding: "clamp(72px, 12vw, 150px) clamp(24px, 5vw, 80px)" }}>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-mono"
          style={{ fontSize: "var(--text-label-fluid)", letterSpacing: "0.22em", textTransform: "uppercase", color: DIM }}
        >
          {t(s?.label ?? { cs: "", en: "" })}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
          className="font-heading"
          style={{
            fontFamily: HEADING,
            fontWeight: 500,
            fontSize: "clamp(30px, 4.6vw, 54px)",
            letterSpacing: "-0.03em",
            lineHeight: 1.12,
            color: TEXT,
            marginTop: "clamp(16px, 3vh, 26px)",
            maxWidth: "20ch",
          }}
        >
          {t(s?.title ?? { cs: "", en: "" })}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-body mt-6"
          style={{ fontSize: "var(--text-lead)", lineHeight: 1.7, color: MUTED, maxWidth: "52ch" }}
        >
          {t(s?.text ?? { cs: "", en: "" })}
        </motion.p>

        {/* live preview — the real website */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: EASE }}
          className="mt-14"
        >
          <div className="flex items-baseline justify-between mb-4">
            <span className="font-heading" style={{ fontFamily: HEADING, fontSize: "var(--text-h4)", color: TEXT }}>
              {locale === "cs" ? "Skutečný web" : "The real website"}
            </span>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono transition-opacity duration-200 hover:opacity-60"
              style={{ fontSize: "var(--text-label)", letterSpacing: "0.16em", textTransform: "uppercase", color: ACCENT_HEX }}
            >
              {previewLabel} <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "#121316", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 30px 90px rgba(0,0,0,0.5)" }}
          >
            {/* browser chrome */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#1B1D22", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#E5674E" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#E3B341" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#63A15C" }} />
              </span>
              <span
                className="flex-1 mx-auto max-w-[320px] rounded-full px-3 py-1 text-center font-mono text-label-sm truncate"
                style={{ background: "rgba(255,255,255,0.06)", color: "#9AA1AB" }}
              >
                {previewLabel}
              </span>
              <span style={{ width: 46 }} aria-hidden="true" />
            </div>

            <iframe
              ref={iframeRef}
              src={previewSrc}
              sandbox="allow-scripts"
              className="w-full border-0"
              style={{ height: "clamp(400px, 60vh, 700px)" }}
              title={`${previewLabel} — živý web`}
              loading="lazy"
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="font-body mt-5 text-sm leading-relaxed"
            style={{ color: MUTED, maxWidth: "60ch" }}
          >
            {locale === "cs"
              ? `Živý náhled skutečného webu — pokračujte ve scrollování a projděte si celou cestu od úvodní obrazovky po přihlášku. Otevřít web v novém okně: ${previewLabel}.`
              : `A live preview of the real website — keep scrolling to walk the whole journey from the first screen to enrolment. Open the site in a new window: ${previewLabel}.`}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────── TECHNOLOGY ─────────────────────────── */

function Technology({ locale, data, t }: { locale: Locale; data?: PoniciPageData; t: T }) {
  const s = data?.sections.tech;
  const items = (s?.items[locale] ?? []) as string[];

  return (
    <SectionShell label={t(s?.label ?? { cs: "", en: "" })} title={t(s?.title ?? { cs: "", en: "" })} tone="light">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-start">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-body"
          style={{ fontSize: "var(--text-lead)", lineHeight: 1.7, color: TEXT_2 }}
        >
          {t(s?.text ?? { cs: "", en: "" })}
        </motion.p>

        <div className="flex flex-wrap gap-2.5">
          {items.map((item, i) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
              className="rounded-full px-4 py-2 font-mono text-label-fluid tracking-[0.08em]"
              style={{ background: CARD, border: BORDER, color: TEXT_2 }}
            >
              {item}
            </motion.span>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

/* ─────────────────────────── RESULT ─────────────────────────── */

function Result({ locale, data, t }: { locale: Locale; data?: PoniciPageData; t: T }) {
  const s = data?.sections.result;
  const title = (s?.title ?? []).map((line) => t(line));
  const cta = t(s?.cta ?? { cs: "", en: "" });

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: BG, color: TEXT, padding: "clamp(88px, 14vw, 180px) clamp(24px, 5vw, 80px)" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,74,46,0.08) 0%, transparent 60%)",
        }}
      />
      <div className="relative z-10 mx-auto text-center" style={{ maxWidth: 820 }}>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-mono"
          style={{ fontSize: "var(--text-label-fluid)", letterSpacing: "0.22em", textTransform: "uppercase", color: DIM }}
        >
          {t(s?.label ?? { cs: "", en: "" })}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
          className="font-heading"
          style={{
            fontFamily: HEADING,
            fontWeight: 500,
            fontSize: "clamp(32px, 5vw, 62px)",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: TEXT,
            marginTop: "clamp(18px, 3vh, 30px)",
          }}
        >
          {title.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
          className="font-body mx-auto mt-6"
          style={{ fontSize: "var(--text-lead)", lineHeight: 1.7, color: MUTED, maxWidth: "56ch" }}
        >
          {t(s?.text ?? { cs: "", en: "" })}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.28, ease: EASE }}
          className="font-heading mx-auto mt-10"
          style={{
            fontFamily: HEADING,
            fontWeight: 400,
            fontSize: "clamp(20px, 2.6vw, 30px)",
            lineHeight: 1.4,
            letterSpacing: "-0.02em",
            color: "rgba(244,246,248,0.85)",
            maxWidth: "34ch",
          }}
        >
          {t(s?.conclusion ?? { cs: "", en: "" })}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          className="mt-12"
        >
          <Link
            href={`/${locale}/contact`}
            className="group inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-medium transition-all duration-300"
            style={{ background: TEXT, color: "#0A0A0B" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {cta}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
