"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/types";

interface Props {
  locale: Locale;
}

export default function ChatAssistantContent({ locale }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden" style={{ background: "#FFFFFF" }}>
      <HeroSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} />
      <ChannelsSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} />
      <ConversationSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} />
      <IntegrationsSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} />
      <FlowSection locale={locale} />
    </div>
  );
}

/* ─── Hero ─── */

function HeroSection({ locale, shouldReduceMotion }: { locale: Locale; shouldReduceMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={sectionRef} className="relative flex flex-col items-center justify-center overflow-hidden" style={{ minHeight: "100dvh", padding: "clamp(120px, 15vw, 200px) clamp(24px, 5vw, 80px)", background: "#FFFFFF" }}>
      <motion.div style={{ y, opacity }} className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        <Link
          href={`/${locale}/projekty/ai-sistent/voice-assistant`}
          className="group inline-flex flex-col items-start"
        >
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-mono font-semibold tracking-widest uppercase"
            style={{ color: "#9CA3AF" }}
          >
            {locale === "cs" ? "Chat Asistent" : "Chat Assistant"}
          </motion.span>
          <div className="h-[18px] overflow-hidden">
            <span
              className="block text-[10px] font-mono tracking-wider mt-0.5 flex items-center gap-1 transition-all duration-200 ease-out -translate-y-[6px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
              style={{ color: "#9CA3AF" }}
            >
              {locale === "cs" ? "Otevřít Voice Asistenta" : "Open Voice Assistant"}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-[2px]">↗</span>
            </span>
          </div>
        </Link>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-bold leading-tight mt-6"
          style={{ fontSize: "clamp(36px, 6vw, 72px)", letterSpacing: "-0.04em", color: "#111111" }}
        >
          {locale === "cs" ? "Komunikuje všude,\nkde vaši zákazníci píší." : "Communicates wherever\nyour customers write."}
        </motion.h1>
      </motion.div>
    </section>
  );
}

/* ─── Channels ─── */

function ChannelsSection({ locale }: { locale: Locale; shouldReduceMotion: boolean }) {
  const channels = "Website · WhatsApp · SMS · Messenger · Instagram · Telegram · Email";

  return (
    <section className="relative" style={{ padding: "0 clamp(24px, 5vw, 80px) clamp(60px, 8vw, 100px)" }}>
      <div className="max-w-3xl mx-auto">
        <p className="text-[10px] font-mono font-semibold tracking-[0.15em] uppercase mb-4" style={{ color: "#9CA3AF" }}>
          {locale === "cs" ? "Textové kanály" : "Text channels"}
        </p>
        <p className="font-body text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
          {channels}
        </p>
      </div>
    </section>
  );
}

/* ─── Real Conversation ─── */

function ConversationSection({ locale, shouldReduceMotion }: { locale: Locale; shouldReduceMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="relative" style={{ padding: "clamp(80px, 12vw, 140px) clamp(24px, 5vw, 80px)" }}>
      <div className="max-w-2xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs font-mono font-semibold tracking-widest uppercase mb-10"
          style={{ color: "#9CA3AF" }}
        >
          {locale === "cs" ? "Skutečná konverzace" : "Real conversation"}
        </motion.p>

        {/* Website Chat */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[10px] font-mono font-semibold tracking-widest uppercase mb-3" style={{ color: "#9CA3AF" }}>Website Chat</p>
          <div className="space-y-3">
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl" style={{ background: "#F0F0F0", maxWidth: "75%" }}>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#111111" }}>
                  {locale === "cs" ? "Máte zítra volný termín?" : "Do you have availability tomorrow?"}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="px-4 py-3 rounded-2xl" style={{ background: "#111111", maxWidth: "75%" }}>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#FFFFFF" }}>
                  {locale === "cs" ? "Ano. 15:00 nebo 16:30." : "Yes. 15:00 or 16:30."}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="h-px my-8 sm:my-10 origin-left"
          style={{ background: "rgba(17,17,17,0.06)" }}
        />

        {/* WhatsApp */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[10px] font-mono font-semibold tracking-widest uppercase mb-3" style={{ color: "#9CA3AF" }}>WhatsApp</p>
          <div className="space-y-3">
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl" style={{ background: "#F0F0F0", maxWidth: "75%" }}>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#111111" }}>
                  {locale === "cs" ? "Kolik to stojí?" : "What is the price?"}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="px-4 py-3 rounded-2xl" style={{ background: "#111111", maxWidth: "75%" }}>
                <p className="font-body text-sm leading-relaxed whitespace-pre-line" style={{ color: "#FFFFFF" }}>
                  {locale === "cs" ? "Cena začíná na…\nChcete poslat nabídku?" : "It starts at…\nWould you like a quotation?"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.65, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="h-px my-8 sm:my-10 origin-left"
          style={{ background: "rgba(17,17,17,0.06)" }}
        />

        {/* Phone */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[10px] font-mono font-semibold tracking-widest uppercase mb-3" style={{ color: "#9CA3AF" }}>
            {locale === "cs" ? "Telefon" : "Phone"}
          </p>
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl" style={{ background: "#F0F0F0", maxWidth: "85%" }}>
              <p className="font-body text-sm leading-relaxed" style={{ color: "#111111" }}>
                {locale === "cs"
                  ? "Vítejte zpět, pane Nováku. Našel jsem vaši konverzaci z webu i WhatsAppu. Můžeme navázat."
                  : "Welcome back. I found your conversation from the website and WhatsApp. We can continue where we left off."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Integrations ─── */

function IntegrationsSection({ locale }: { locale: Locale; shouldReduceMotion: boolean }) {
  return (
    <section className="relative" style={{ padding: "clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px) clamp(100px, 14vw, 160px)" }}>
      <div className="max-w-3xl mx-auto">
        <p className="text-[10px] font-mono font-semibold tracking-[0.15em] uppercase mb-4" style={{ color: "#9CA3AF" }}>
          {locale === "cs" ? "Propojeno s" : "Connected to"}
        </p>
        <p className="font-heading font-semibold text-sm" style={{ color: "#5F6368" }}>
          Calendar / CRM / Email
        </p>
      </div>
    </section>
  );
}

/* ─── One Conversation. Every Channel. ─── */

interface FlowMsg {
  text: string;
  channel: string;
}

const flowMessages: FlowMsg[] = [
  { text: "Dobr\u00fd den, cht\u011bl bych se zeptat na otev\u00edrac\u00ed dobu.", channel: "Web" },
  { text: "Hi, do you have any availability this week?", channel: "Web" },
  { text: "M\u016f\u017eu si rezervovat st\u016fl na z\u00edtra?", channel: "WhatsApp" },
  { text: "Pos\u00edl\u00e1m objedn\u00e1vku \u010d. 2847 \u2014 pros\u00edm o potvrzen\u00ed.", channel: "SMS" },
  { text: "Jakou m\u00e1te aktu\u00e1ln\u00ed cenu za servis?", channel: "Messenger" },
  { text: "Cht\u011bl bych zru\u0161it rezervaci na p\u00e1tek.", channel: "WhatsApp" },
  { text: "D\u011bkuji za rychl\u00e9 vy\u0159\u00edzen\u00ed!", channel: "Web" },
  { text: "M\u00e1te volno v \u00fater\u00fd odpoledne?", channel: "SMS" },
  { text: "Potvrzuji sch\u016fzku na st\u0159edu 14:00.", channel: "Messenger" },
  { text: "Can I change my booking to Saturday?", channel: "Web" },
];

function FlowSection({ locale }: { locale: Locale }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [msgVisible, setMsgVisible] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

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
    if (!hasStarted) return;
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
  }, [hasStarted, currentIndex]);

  const msg = flowMessages[currentIndex];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        minHeight: "100vh",
        padding: "clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)",
        background: "#F7F8FA",
      }}
    >
      <div className="w-full max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs font-mono font-semibold tracking-widest uppercase mb-10 sm:mb-12"
          style={{ color: "rgba(17,17,17,0.15)" }}
        >
          {locale === "cs" ? "Jedna konverzace." : "One conversation."}
        </motion.p>

        <p
          className="font-heading leading-tight"
          style={{
            fontSize: "clamp(28px, 4vw, 52px)",
            letterSpacing: "-0.03em",
            color: "#111111",
          }}
        >
          {locale === "cs" ? "Ka\u017ed\u00fd kan\u00e1l." : "Every channel."}
        </p>

        <p
          className="font-body mt-4 mb-16 sm:mb-20"
          style={{
            fontSize: "clamp(13px, 1vw, 15px)",
            color: "#9CA3AF",
            maxWidth: "36ch",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {locale === "cs"
            ? "A\u0165 u\u017e p\u00ed\u0161e z webu, WhatsAppu nebo SMS \u2014 AI odpov\u00edd\u00e1 v\u0161ude stejn\u011b."
            : "Whether they write from the web, WhatsApp or SMS \u2014 the AI answers everywhere the same."}
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
              <span className="font-mono text-[9px] font-semibold tracking-widest uppercase mb-3" style={{ color: "rgba(17,17,17,0.2)" }}>
                {msg.channel}
              </span>
              <p className="font-heading leading-tight text-center" style={{
                fontSize: "clamp(18px, 2vw, 28px)",
                letterSpacing: "-0.02em",
                color: "#111111",
                maxWidth: "clamp(280px, 50vw, 480px)",
                fontWeight: 450,
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
          {["Web", "WhatsApp", "SMS", "Messenger"].map((ch) => {
            const isActive = hasStarted && msg?.channel === ch;
            return (
              <div key={ch} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full transition-all duration-700"
                  style={{
                    background: isActive ? "#111111" : "rgba(17,17,17,0.06)",
                    scale: isActive ? 1.4 : 1,
                  }}
                />
                <span
                  className="font-mono text-[9px] tracking-widest uppercase transition-all duration-700"
                  style={{
                    color: isActive ? "rgba(17,17,17,0.5)" : "rgba(17,17,17,0.08)",
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
