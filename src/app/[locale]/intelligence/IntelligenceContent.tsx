"use client";

import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";
import Link from "next/link";

interface Props {
  locale: Locale;
}

const layers = [
  {
    label: "natural language understanding",
    descCs: "Konverzační AI s hlubokým porozuměním kontextu, záměru a sentimentu volajícího.",
    descEn: "Conversational AI with deep understanding of caller context, intent, and sentiment.",
  },
  {
    label: "intent routing",
    descCs: "Automatická klasifikace a směrování hovorů na základě analýzy v reálném čase.",
    descEn: "Automatic classification and routing of calls based on real-time analysis.",
  },
  {
    label: "context persistence",
    descCs: "Historie zákazníka je dostupná v každém okamžiku napříč kanály i relacemi.",
    descEn: "Customer history available at every moment across channels and sessions.",
  },
  {
    label: "dynamic escalation",
    descCs: "Inteligentní rozpoznání limitů AI a plynulé předání živému operátorovi.",
    descEn: "Intelligent recognition of AI limits and smooth handoff to a live operator.",
  },
  {
    label: "sentiment analysis",
    descCs: "Detekce emocionálního stavu volajícího pro přizpůsobení tónu a chování AI.",
    descEn: "Detection of caller emotional state to adapt AI tone and behavior.",
  },
  {
    label: "real-time processing",
    descCs: "Každá interakce zpracována pod 200ms latencí pro přirozenou konverzaci.",
    descEn: "Every interaction processed under 200ms latency for natural conversation.",
  },
];

const stats = [
  { value: "<200ms", label: "latence" },
  { value: "99.9%", label: "uptime" },
  { value: "6+", label: "jazykových modelů" },
  { value: "24/7", label: "dostupnost" },
];

export default function IntelligenceContent({ locale }: Props) {
  const isCs = locale === "cs";

  return (
    <PageTransition>
      <section className="relative w-full pt-[clamp(140px,20vh,200px)] pb-24 px-[clamp(24px,5vw,64px)] min-h-screen">
        <div className="mx-auto relative z-10" style={{ maxWidth: "1100px" }}>
          <div className="max-w-[800px] mb-16">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8 transition-all duration-300"
              style={{
                background: "rgba(124,107,255,0.08)",
                border: "1px solid rgba(124,107,255,0.12)",
                color: "rgba(124,107,255,0.55)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(124,107,255,0.25)"; e.currentTarget.style.background = "rgba(124,107,255,0.12)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(124,107,255,0.12)"; e.currentTarget.style.background = "rgba(124,107,255,0.08)"; }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "#7C6BFF",
                  animation: "pulse-dot 2.8s ease-in-out infinite",
                  boxShadow: "0 0 0 3px rgba(124,107,255,0.12)",
                }}
              />
              <span className="font-body text-[10px] tracking-[0.08em]">{t(locale, "intelligence.badge")}</span>
            </div>

            <h1
              className="font-heading mb-6"
              style={{
                fontSize: "clamp(36px, 6vw, 80px)",
                lineHeight: 1.05,
                fontWeight: 500,
              }}
              dangerouslySetInnerHTML={{ __html: t(locale, "intelligence.title") }}
            />

            <p className="font-body text-[clamp(15px,1.2vw,17px)] leading-relaxed max-w-[56ch]" style={{ color: "#B7BCC7" }}>
              {t(locale, "intelligence.subtitle")}
            </p>
          </div>

          <div
            className="grid gap-6 mb-16"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div
                  className="font-heading text-[clamp(28px,3.5vw,44px)] font-medium leading-none mb-1 transition-all duration-300"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                  onMouseEnter={(e) => { e.currentTarget.style.textShadow = "0 0 20px rgba(124,107,255,0.12)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textShadow = "none"; }}
                >
                  {stat.value}
                </div>
                <div className="font-body text-[10px] tracking-[0.06em] transition-all duration-300" style={{ color: "rgba(124,107,255,0.45)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(124,107,255,0.65)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(124,107,255,0.45)"; }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <span
              className="font-body text-[10px] tracking-[0.2em] uppercase transition-all duration-300"
              style={{ color: "rgba(124,107,255,0.25)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(124,107,255,0.45)"; e.currentTarget.style.textShadow = "0 0 12px rgba(124,107,255,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(124,107,255,0.25)"; e.currentTarget.style.textShadow = "none"; }}
            >
              &mdash; intelligence layers
            </span>
          </div>

          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
          >
            {layers.map((item, i) => (
              <div key={i}>
                <div
                  className="font-body text-[11px] tracking-[0.08em] uppercase mb-2 transition-all duration-300"
                  style={{ color: "rgba(124,107,255,0.35)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(124,107,255,0.55)"; e.currentTarget.style.textShadow = "0 0 12px rgba(124,107,255,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(124,107,255,0.35)"; e.currentTarget.style.textShadow = "none"; }}
                >
                  {item.label}
                </div>
                <p className="font-body text-[13px] leading-relaxed" style={{ color: "#B7BCC7" }}>
                  {isCs ? item.descCs : item.descEn}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <Link
              href={`/${locale}/live-demo`}
              className="group inline-flex items-center gap-2.5 font-body"
              style={{ color: "rgba(124,107,255,0.55)", transition: "color 0.5s ease-out, text-shadow 0.5s ease-out" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "rgba(124,107,255,0.9)";
                e.currentTarget.style.textShadow = "0 0 24px rgba(124,107,255,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(124,107,255,0.55)";
                e.currentTarget.style.textShadow = "none";
              }}
            >
              <span className="font-body text-[13px] font-medium tracking-[-0.01em]">
                {isCs ? "Vyzkoušet v akci" : "See it live"}
              </span>
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                className="transition-transform duration-500 ease-out will-change-transform group-hover:translate-x-1"
              >
                <path d="M2 6h8M6 2l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
