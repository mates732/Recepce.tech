"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useTransform, useReducedMotion } from "framer-motion";
import { useElementScrollProgress, OFFSET_TOP_OUT } from "@/lib/scroll";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { getPage } from "@/content/repository";
import type { ChatPageData } from "@/content/types";
import ProjectFacts from "@/components/ProjectFacts";

interface Props {
  locale: Locale;
}

export default function ChatContent({ locale }: Props) {
  const shouldReduceMotion = useReducedMotion();
  const data = getPage("chat")?.data;

  return (
    <div className="relative overflow-hidden" style={{ background: "#121316" }}>
      <HeroSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} data={data} />
      <FactsSection locale={locale} data={data} />
      <ChannelsSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} data={data} />
      <ConversationSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} data={data} />
      <IntegrationsSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} data={data} />
      <FlowSection locale={locale} data={data} />
    </div>
  );
}

/* ─── Project Facts ─── */

function FactsSection({ locale, data }: { locale: Locale; data?: ChatPageData }) {
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

function HeroSection({ locale, shouldReduceMotion, data }: { locale: Locale; shouldReduceMotion: boolean; data?: ChatPageData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useElementScrollProgress(sectionRef, OFFSET_TOP_OUT);
  const y = useTransform(progress, [0, 1], [0, 80]);
  const opacity = useTransform(progress, [0, 0.7], [1, 0]);

  const heroTitle = (data?.heroTitle ?? []).map((line) => line[locale]);
  const crossLink = data?.crossLink;

  return (
    <section ref={sectionRef} className="relative flex flex-col items-center justify-center overflow-hidden" style={{ minHeight: "100dvh", padding: "clamp(120px, 15vw, 200px) clamp(24px, 5vw, 80px)", background: "#121316" }}>
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
          style={{ fontSize: "var(--text-hero-md)", letterSpacing: "-0.04em", color: "#F4F6F8" }}
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
          {data?.cta && (
            <Link
              href={`/${locale}/demo`}
              className="inline-flex items-center justify-center px-8 py-3 rounded-full text-sm font-medium transition-all duration-300"
              style={{ color: "#0A0A0B", background: "var(--color-accent)" }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              {data.cta[locale]}
            </Link>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Channels ─── */

function ChannelsSection({ locale, shouldReduceMotion, data }: { locale: Locale; shouldReduceMotion: boolean; data?: ChatPageData }) {
  const channels = data?.channels[locale] ?? "";

  return (
    <section className="relative" style={{ padding: "0 clamp(24px, 5vw, 80px) clamp(60px, 8vw, 100px)" }}>
      <div className="max-w-3xl mx-auto">
        <p className="text-label font-mono font-semibold tracking-[0.15em] uppercase mb-4" style={{ color: "#6E7683" }}>
          {data?.channelsLabel[locale]}
        </p>
        <p className="font-body text-sm leading-relaxed" style={{ color: "#6E7683" }}>
          {channels}
        </p>
      </div>
    </section>
  );
}

/* ─── Real Conversation ─── */

function ConversationSection({ locale, shouldReduceMotion, data }: { locale: Locale; shouldReduceMotion: boolean; data?: ChatPageData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const sections = data?.conversation.sections ?? [];

  return (
    <section ref={sectionRef} className="relative" style={{ padding: "clamp(80px, 12vw, 140px) clamp(24px, 5vw, 80px)" }}>
      <div className="max-w-2xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs font-mono font-semibold tracking-widest uppercase mb-10"
          style={{ color: "#6E7683" }}
        >
          {data?.conversation.label[locale]}
        </motion.p>

        {sections.map((section, sIndex) => (
          <div key={sIndex}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-label font-mono font-semibold tracking-widest uppercase mb-3" style={{ color: "#6E7683" }}>
                {section.label[locale]}
              </p>
              <div className="space-y-3">
                {section.messages.map((msg, i) => {
                  const isAi = msg.from === "ai";
                  const text = msg.text[locale];
                  return (
                    <div key={i} className={`flex ${isAi ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`px-4 py-3 rounded-2xl ${text.includes("\n") ? "whitespace-pre-line" : ""}`}
                        style={{
                          background: isAi ? "#26282E" : "#1C1E23",
                          maxWidth: msg.wide ? "85%" : "75%",
                        }}
                      >
                        <p className="font-body text-sm leading-relaxed" style={{ color: "#F4F6F8" }}>
                          {text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {sIndex < sections.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-px my-8 sm:my-10 origin-left"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Integrations ─── */

function IntegrationsSection({ locale, shouldReduceMotion, data }: { locale: Locale; shouldReduceMotion: boolean; data?: ChatPageData }) {
  return (
    <section className="relative" style={{ padding: "clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px) clamp(100px, 14vw, 160px)" }}>
      <div className="max-w-3xl mx-auto">
        <p className="text-label font-mono font-semibold tracking-[0.15em] uppercase mb-4" style={{ color: "#6E7683" }}>
          {data?.integrations.label[locale]}
        </p>
        <p className="font-heading font-medium text-sm" style={{ color: "#9AA1AB" }}>
          {data?.integrations.value}
        </p>
      </div>
    </section>
  );
}

/* ─── One Conversation. Every Channel. ─── */

function FlowSection({ locale, data }: { locale: Locale; data?: ChatPageData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [msgVisible, setMsgVisible] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const flowMessages = data?.flow.messages ?? [];
  const flowChannels = Array.from(new Set(flowMessages.map((m) => m.channel)));

  useEffect(() => {
    if (!sectionRef.current || hasStarted) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted || flowMessages.length === 0) return;
    const hold = 2500 + Math.random() * 1200;
    const fade = 1200;
    const t1 = setTimeout(() => {
      setMsgVisible(false);
      const t2 = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % flowMessages.length);
        setMsgVisible(true);
      }, fade);
      return () => clearTimeout(t2);
    }, hold);
    return () => clearTimeout(t1);
  }, [hasStarted, currentIndex, flowMessages.length]);

  const msg = flowMessages[currentIndex];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        minHeight: "100vh",
        padding: "clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)",
        background: "#0A0A0B",
      }}
    >
      <div className="w-full max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs font-mono font-semibold tracking-widest uppercase mb-10 sm:mb-12"
          style={{ color: "rgba(255,255,255,0.15)" }}
        >
          {data?.flow.label[locale]}
        </motion.p>

        <p
          className="font-heading leading-tight"
          style={{
            fontSize: "var(--text-h1-md)",
            letterSpacing: "-0.03em",
            color: "#F4F6F8",
          }}
        >
          {data?.flow.heading[locale]}
        </p>

        <p
          className="font-body mt-4 mb-16 sm:mb-20"
          style={{
            fontSize: "var(--text-small)",
            color: "#6E7683",
            maxWidth: "36ch",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {data?.flow.sub[locale]}
        </p>

        <div className="relative" style={{ height: "clamp(200px, 25vh, 280px)" }}>
          {hasStarted && msg && (
            <motion.div
              key={currentIndex + (msgVisible ? "-v" : "-h")}
              initial={{ opacity: 0, y: 20 }}
              animate={msgVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <span className="font-mono text-label-sm font-semibold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.2)" }}>
                {msg.channel}
              </span>
              <p className="font-heading leading-tight text-center" style={{
                fontSize: "var(--text-h3)",
                letterSpacing: "-0.02em",
                color: "#F4F6F8",
                maxWidth: "clamp(280px, 50vw, 480px)",
                fontWeight: 500,
              }}>
                {"\u201e" + msg.text + "\u201c"}
              </p>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-6 sm:gap-8 mt-12 sm:mt-16"
        >
          {flowChannels.map((ch) => {
            const isActive = hasStarted && msg?.channel === ch;
            return (
              <div key={ch} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full transition-all duration-700"
                  style={{
                    background: isActive ? "#F4F6F8" : "rgba(255,255,255,0.06)",
                    scale: isActive ? 1.4 : 1,
                  }}
                />
                <span
                  className="font-mono text-label-sm tracking-widest uppercase transition-all duration-700"
                  style={{
                    color: isActive ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.08)",
                  }}
                >
                  {ch}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
