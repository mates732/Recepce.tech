"use client";

import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import Link from "next/link";

interface HomePageProps {
  locale: Locale;
}

const capabilities = [
  { label: "call routing", descCs: "AI analyzuje a směruje každý hovor na optimální handler v reálném čase", descEn: "AI analyzes and routes every call to the optimal handler in real time" },
  { label: "intent analysis", descCs: "Hluboké porozumění kontextu, záměru a sentimentu volajícího", descEn: "Deep understanding of caller context, intent, and sentiment" },
  { label: "calendar sync", descCs: "Automatické rezervace napříč všemi kalendáři", descEn: "Automatic bookings across all calendars" },
  { label: "sentiment scan", descCs: "Emocionální analýza hlasu pro detekci frustrace nebo spokojenosti", descEn: "Emotional voice analysis to detect frustration or satisfaction" },
  { label: "dynamic escalation", descCs: "Inteligentní předání živému operátorovi při komplexních dotazech", descEn: "Intelligent handoff to a live operator for complex queries" },
  { label: "multi-channel", descCs: "Telefon, SMS, WhatsApp a web chat v jedné inteligenci", descEn: "Phone, SMS, WhatsApp, and web chat in one intelligence" },
];

const ecosystemLinks = [
  { label: "Inteligence", href: "intelligence", accent: "#7C6BFF", labelEn: "Intelligence" },
  { label: "Concierge", href: "concierge", accent: "#00C2FF", labelEn: "Concierge" },
  { label: "Atmosféra", href: "atmosfera", accent: "#7C6BFF", labelEn: "Atmosphere" },
  { label: "Privátní", href: "private", accent: "#F3F4F6", labelEn: "Private" },
];

export default function HomePage({ locale }: HomePageProps) {
  const isCs = locale === "cs";

  return (
    <>
      {/* ===== CINEMATIC HERO ===== */}
      <section className="relative flex flex-col items-center text-center min-h-screen w-full pt-[clamp(120px,18vh,180px)] pb-16 px-[clamp(24px,5vw,64px)] overflow-hidden">
        <div
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-12 transition-all duration-300"
          style={{
            background: "rgba(13,13,18,0.4)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "rgba(183,188,199,0.7)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,194,255,0.15)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "#00C2FF",
              animation: "pulse-dot 2.8s ease-in-out infinite",
              boxShadow: "0 0 0 3px rgba(0,194,255,0.15)",
            }}
          />
          <span className="font-body text-[10px] tracking-[0.08em]">{t(locale, "home.badge")}</span>
        </div>

        <h1
          className="mx-auto mb-6 font-heading"
          style={{
            fontSize: "clamp(48px, 9vw, 120px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            fontWeight: 500,
            maxWidth: "10ch",
          }}
        >
          <span
            className="block"
            style={{ animation: "fade-in-up 0.9s 0.1s both" }}
          >
            {t(locale, "home.title")}
          </span>
          <span
            className="block mt-2"
            style={{
              animation: "fade-in-up 0.9s 0.25s both",
              background: "linear-gradient(135deg, #F3F4F6, #7E8492)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t(locale, "home.titleLine1")}
          </span>
        </h1>

        <p
          className="mx-auto mb-14 font-body text-[clamp(15px,1.2vw,18px)] leading-relaxed max-w-[52ch]"
          style={{ color: "#B7BCC7" }}
        >
          {t(locale, "home.subtitle")}
        </p>

        <Link
          href={`/${locale}/live-demo`}
          className="group inline-flex items-center gap-3 font-body"
          style={{ color: "rgba(183,188,199,0.6)", transition: "color 0.5s ease-out, text-shadow 0.5s ease-out" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#F3F4F6";
            e.currentTarget.style.textShadow = "0 0 24px rgba(126,132,146,0.14)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(183,188,199,0.6)";
            e.currentTarget.style.textShadow = "none";
          }}
        >
          <span className="font-body text-[14px] font-medium tracking-[-0.01em]">
            {t(locale, "home.cta")}
          </span>
          <svg
            width="14" height="14" viewBox="0 0 14 14" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
            className="transition-transform duration-500 ease-out will-change-transform group-hover:translate-x-1"
          >
            <path d="M3 7h8M7 3l4 4-4 4" />
          </svg>
        </Link>

      </section>

      {/* ===== SECTION 1: INVISIBLE INTELLIGENCE ===== */}
      <section className="relative w-full px-[clamp(24px,5vw,64px)] py-[clamp(100px,14vw,160px)] overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(0,194,255,0.02) 30%, transparent 70%)",
          }}
        />
        <div className="mx-auto relative z-10" style={{ maxWidth: "1100px" }}>
          <div className="max-w-[720px]">
            <span
              className="font-body text-[10px] tracking-[0.2em] uppercase transition-all duration-300"
              style={{ color: "rgba(0,194,255,0.25)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.45)"; e.currentTarget.style.textShadow = "0 0 12px rgba(0,194,255,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.25)"; e.currentTarget.style.textShadow = "none"; }}
            >
              &mdash; 01
            </span>
            <h2
              className="mt-4 mb-6 font-heading"
              style={{
                fontSize: "clamp(32px, 5vw, 64px)",
                lineHeight: 1.1,
                fontWeight: 500,
              }}
            >
              {t(locale, "home.section1Title")}
            </h2>
            <p className="font-body text-[clamp(15px,1.2vw,17px)] leading-relaxed max-w-[56ch]" style={{ color: "#B7BCC7" }}>
              {t(locale, "home.section1Desc")}
            </p>
          </div>

          <div
            className="mt-16 grid gap-x-6 gap-y-8"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            }}
          >
            {capabilities.map((item, i) => (
              <div key={i}>
                <div
                  className="font-body text-[11px] tracking-[0.08em] uppercase mb-2 transition-all duration-300"
                  style={{ color: "rgba(0,194,255,0.35)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.55)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.35)"; }}
                >
                  {item.label}
                </div>
                <p className="font-body text-[13px] leading-relaxed" style={{ color: "#B7BCC7" }}>
                  {isCs ? item.descCs : item.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: ECOSYSTEM ===== */}
      <section className="relative w-full px-[clamp(24px,5vw,64px)] py-[clamp(100px,14vw,160px)] overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(124,107,255,0.02) 30%, transparent 70%)",
          }}
        />
        <div className="mx-auto relative z-10" style={{ maxWidth: "1100px" }}>
          <div className="max-w-[720px] mb-16">
            <span
              className="font-body text-[10px] tracking-[0.2em] uppercase transition-all duration-300"
              style={{ color: "rgba(124,107,255,0.25)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(124,107,255,0.45)"; e.currentTarget.style.textShadow = "0 0 12px rgba(124,107,255,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(124,107,255,0.25)"; e.currentTarget.style.textShadow = "none"; }}
            >
              &mdash; 02
            </span>
            <h2
              className="mt-4 mb-6 font-heading"
              style={{
                fontSize: "clamp(32px, 5vw, 64px)",
                lineHeight: 1.1,
                fontWeight: 500,
              }}
            >
              {t(locale, "home.section2Title")}
            </h2>
            <p className="font-body text-[clamp(15px,1.2vw,17px)] leading-relaxed max-w-[56ch]" style={{ color: "#B7BCC7" }}>
              {t(locale, "home.section2Desc")}
            </p>
          </div>

          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
            {ecosystemLinks.map((item, i) => (
              <Link
                key={i}
                href={`/${locale}/${item.href}`}
                className="group block"
                onMouseEnter={(e) => {}}
                onMouseLeave={(e) => {}}
              >
                <span
                  className="block font-heading text-[clamp(24px,3vw,40px)] font-medium"
                  style={{ color: "#F3F4F6", transition: "color 0.5s ease-out, text-shadow 0.5s ease-out" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = item.accent;
                    e.currentTarget.style.textShadow = `0 0 40px ${item.accent}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#F3F4F6";
                    e.currentTarget.style.textShadow = "none";
                  }}
                >
                  {isCs ? item.label : item.labelEn}
                </span>
                <div
                  className="mt-3 inline-flex items-center gap-2 font-body text-[12px] transition-all duration-300"
                  style={{ color: "rgba(126,132,146,0.45)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(183,188,199,0.6)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(126,132,146,0.45)"; }}
                >
                  <span>{isCs ? "Prozkoumat" : "Explore"}</span>
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                    className="transition-transform duration-500 ease-out will-change-transform group-hover:translate-x-1"
                  >
                    <path d="M2 6h8M6 2l4 4-4 4" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: TRUST ===== */}
      <section className="relative w-full px-[clamp(24px,5vw,64px)] py-[clamp(100px,14vw,160px)] overflow-hidden text-center">
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(0,194,255,0.02) 30%, transparent 70%)",
          }}
        />
        <div className="mx-auto relative z-10" style={{ maxWidth: "700px" }}>
          <span
            className="font-body text-[10px] tracking-[0.2em] uppercase transition-all duration-300"
            style={{ color: "rgba(0,194,255,0.25)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.45)"; e.currentTarget.style.textShadow = "0 0 12px rgba(0,194,255,0.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.25)"; e.currentTarget.style.textShadow = "none"; }}
          >
            &mdash; 03
          </span>
            <h2
              className="mt-4 mb-6 font-heading"
              style={{
                fontSize: "clamp(28px, 4.5vw, 48px)",
                lineHeight: 1.1,
                fontWeight: 500,
              }}
            >
              {t(locale, "home.section3Title")}
            </h2>
          <p className="font-body text-[clamp(15px,1.2vw,17px)] leading-relaxed max-w-[48ch] mx-auto mb-12" style={{ color: "#B7BCC7" }}>
            {t(locale, "home.section3Desc")}
          </p>

          <Link
            href={`/${locale}/contact`}
            className="group inline-flex items-center gap-3 font-body"
            style={{ color: "rgba(183,188,199,0.6)", transition: "color 0.5s ease-out, text-shadow 0.5s ease-out" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#F3F4F6";
              e.currentTarget.style.textShadow = "0 0 24px rgba(126,132,146,0.14)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(183,188,199,0.6)";
              e.currentTarget.style.textShadow = "none";
            }}
          >
            <span className="font-body text-[14px] font-medium tracking-[-0.01em]">
              {isCs ? "Rezervovat demo" : "Book a demo"}
            </span>
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
              className="transition-transform duration-500 ease-out will-change-transform group-hover:translate-x-1"
            >
              <path d="M3 7h8M7 3l4 4-4 4" />
            </svg>
          </Link>

          <div className="mt-4 font-body text-[11px] tracking-[0.02em]" style={{ color: "rgba(126,132,146,0.55)" }}>
            {isCs ? "Žádná kreditní karta · Zrušení kdykoliv" : "No credit card · Cancel anytime"}
          </div>
        </div>
      </section>
    </>
  );
}
