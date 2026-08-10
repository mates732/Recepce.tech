"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useTransform, useReducedMotion } from "framer-motion";
import { useParallax, useElementScrollProgress, OFFSET_TOP_OUT } from "@/lib/scroll";
import type { Locale } from "@/lib/types";

interface Props {
  locale: Locale;
}

export default function VoiceAssistantContent({ locale }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden" style={{ background: "#FFFFFF" }}>
      <HeroSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} />
      <CapabilitiesSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} />
      <LanguagesSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} />
      <IntelligenceSection locale={locale} shouldReduceMotion={!!shouldReduceMotion} />
    </div>
  );
}

/* ─── Hero ─── */

function HeroSection({ locale, shouldReduceMotion }: { locale: Locale; shouldReduceMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useElementScrollProgress(sectionRef, OFFSET_TOP_OUT);
  const y = useTransform(progress, [0, 1], [0, 80]);
  const opacity = useTransform(progress, [0, 0.7], [1, 0]);

  return (
    <section ref={sectionRef} className="relative flex flex-col items-center justify-center overflow-hidden" style={{ minHeight: "100dvh", padding: "clamp(120px, 15vw, 200px) clamp(24px, 5vw, 80px)", background: "#FFFFFF" }}>
      <motion.div style={{ y: shouldReduceMotion ? 0 : y, opacity: shouldReduceMotion ? 1 : opacity }} className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        <Link
          href={`/${locale}/projekty/ai-sistent/chat-assistant`}
          className="group inline-flex flex-col items-start"
        >
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-mono font-semibold tracking-widest uppercase"
            style={{ color: "#9CA3AF" }}
          >
            {locale === "cs" ? "Voice Asistent" : "Voice Assistant"}
          </motion.span>
          <div className="h-[18px] overflow-hidden">
            <span
              className="block text-[10px] font-mono tracking-wider mt-0.5 flex items-center gap-1 transition-all duration-200 ease-out -translate-y-[6px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
              style={{ color: "#9CA3AF" }}
            >
              {locale === "cs" ? "Otevřít Chat Asistenta" : "Open Chat Assistant"}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-[2px]">↗</span>
            </span>
          </div>
        </Link>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-bold leading-tight mt-6"
          style={{ fontSize: "clamp(42px, 7vw, 88px)", letterSpacing: "-0.04em", color: "#111111" }}
        >
          {locale === "cs" ? (
            <>Voice Assistant<br />který skutečně<br />rozumí lidem.</>
          ) : (
            <>Voice Assistant<br />that actually<br />understands people.</>
          )}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-body mt-8 max-w-lg leading-relaxed"
          style={{ fontSize: "clamp(15px, 1.2vw, 18px)", color: "#5F6368" }}
        >
          {locale === "cs"
            ? "Telefonní hovor není jen hovor. Je to první dojem zákazníka. Tady na něj nikdo nečeká ve frontě."
            : "A phone call isn't just a call. It's a customer's first impression. No one waits in line here."}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center mt-12"
        >
          <Link
            href={`/${locale}/demo`}
            className="inline-flex items-center justify-center px-8 py-3 rounded-full text-sm font-medium transition-all duration-300"
            style={{ color: "#FFFFFF", background: "#111111" }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            {locale === "cs" ? "Poslechnout si demo" : "Hear it in action"}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Capabilities ─── */

function CapabilitiesSection({ locale }: { locale: Locale; shouldReduceMotion: boolean }) {
  const items = [
    "30+ LANGUAGES", "RESERVATIONS", "AVAILABLE 24/7",
    "NATURAL CONVERSATIONS", "CRM INTEGRATION", "HUMAN HANDOFF",
  ];

  return (
    <section className="relative" style={{ padding: "clamp(28px, 3vw, 40px) clamp(24px, 5vw, 80px)", background: "#FFFFFF" }}>
      <div className="max-w-6xl mx-auto">
        <div className="h-px w-full" style={{ background: "#ECECEC" }} />
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
                fontSize: "clamp(11px, 0.9vw, 13px)",
                fontWeight: 500,
                color: "#9CA3AF",
                letterSpacing: "0.22em",
                transition: "opacity 220ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.8"; }}
            >
              {item}
              {i < items.length - 1 && (
                <span className="inline-block mx-4 sm:mx-5 md:mx-6 lg:mx-7" style={{ color: "#D4D4D4" }}>\u2014</span>
              )}
            </motion.span>
          ))}
        </div>
        <div className="h-px w-full" style={{ background: "#ECECEC" }} />
      </div>
    </section>
  );
}

/* ─── Languages ─── */

function LanguagesSection({ locale }: { locale: Locale; shouldReduceMotion: boolean }) {
  const langs = locale === "cs"
    ? ["\u010ce\u0161tina", "ANGLI\u010cTINA", "N\u011aM\u010cINA", "SLOVEN\u0160TINA", "FRANCOUZ\u0160TINA", "\u0160PAN\u011aL\u0160TINA", "ITAL\u0160TINA", "POL\u0160TINA"]
    : ["CZECH", "ENGLISH", "GERMAN", "SLOVAK", "FRENCH", "SPANISH", "ITALIAN", "POLISH"];

  return (
    <section className="relative" style={{ padding: "0 clamp(24px, 5vw, 80px) clamp(28px, 3vw, 40px)", background: "#F7F8FA" }}>
      <div className="max-w-6xl mx-auto">
        <div className="h-px w-full" style={{ background: "#ECECEC" }} />
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
                fontSize: "clamp(11px, 0.9vw, 13px)",
                fontWeight: 500,
                color: "#9CA3AF",
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

function IntelligenceSection({ locale, shouldReduceMotion }: { locale: Locale; shouldReduceMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const y = useParallax(sectionRef, 30, -30);

  const phrases = locale === "cs"
    ? ["Dobrý den...", "ehm...", "potřeboval bych...", "objednat se na zítřek...", "nebo vlastně na pátek..."]
    : ["Hello...", "um...", "I needed...", "to book for tomorrow...", "or actually Friday..."];

  const steps = [
    { icon: "→", label: locale === "cs" ? "Záměr rozpoznán" : "Intent detected", detail: locale === "cs" ? "Rezervace" : "Appointment booking", conf: [42, 68, 91] },
    { icon: "✓", label: locale === "cs" ? "Zákazník identifikován" : "Customer identified", detail: locale === "cs" ? "Stávající zákazník" : "Existing customer" },
    { icon: "✓", label: locale === "cs" ? "Datum rozpoznáno" : "Date recognized", detail: locale === "cs" ? "Pátek" : "Friday" },
    { icon: "✓", label: locale === "cs" ? "Služba detekována" : "Service detected", detail: locale === "cs" ? "Střih" : "Haircut" },
    { icon: "✓", label: locale === "cs" ? "Dostupnost" : "Availability", detail: locale === "cs" ? "15:30 volný termín" : "15:30 available" },
    { icon: "●", label: locale === "cs" ? "Hotovo" : "Result", detail: locale === "cs" ? "Rezervace připravena" : "Appointment prepared" },
  ];

  return (
    <section ref={sectionRef} className="relative" style={{ padding: "clamp(100px, 14vw, 180px) clamp(24px, 5vw, 80px)", background: "#FFFFFF" }}>
      <motion.div style={{ y }} className="max-w-6xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-mono font-semibold tracking-widest uppercase"
          style={{ color: "#9CA3AF" }}
        >
          {locale === "cs" ? "Interpretace hovoru" : "Call interpretation"}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-heading font-bold leading-tight mt-4"
          style={{ fontSize: "clamp(36px, 6vw, 80px)", letterSpacing: "-0.03em", color: "#111111" }}
        >
          {locale === "cs" ? (
            <>Co AI skutečně<br />slyší.</>
          ) : (
            <>What the AI<br />actually hears.</>
          )}
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 mt-12">
          {/* Left: imperfect speech */}
          <div className="flex flex-col justify-center min-h-[240px]">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-[10px] font-mono font-semibold tracking-widest uppercase mb-6"
              style={{ color: "#9CA3AF" }}
            >
              {locale === "cs" ? "Volající" : "Caller"}
            </motion.span>
            <div className="space-y-1 text-left">
              {phrases.map((phrase, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.25, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="block font-heading font-semibold leading-tight"
                  style={{ fontSize: "clamp(20px, 2.2vw, 32px)", letterSpacing: "-0.02em", color: i % 2 === 1 ? "#9CA3AF" : "#111111" }}
                >
                  {phrase}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Right: AI interpretation */}
          <div className="flex flex-col justify-center min-h-[240px]">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-[10px] font-mono font-semibold tracking-widest uppercase mb-6"
              style={{ color: "#9CA3AF" }}
            >
              {locale === "cs" ? "AI rozumí" : "AI understands"}
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
                  <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: "#111111" }}>{step.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-body text-sm font-medium" style={{ color: "#111111" }}>{step.label}</span>
                    <p className="font-body text-xs mt-0.5" style={{ color: "#5F6368" }}>{step.detail}</p>
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

