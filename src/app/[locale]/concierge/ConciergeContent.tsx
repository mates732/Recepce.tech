"use client";

import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";
import Link from "next/link";

interface Props {
  locale: Locale;
}

const services = [
  {
    titleCs: "Personalizované vítání",
    titleEn: "Personalized Greeting",
    descCs: "Každý volající je rozpoznán a osloven jménem s relevantním kontextem historie.",
    descEn: "Every caller is recognized and addressed by name with relevant context history.",
  },
  {
    titleCs: "Inteligentní rezervace",
    titleEn: "Intelligent Booking",
    descCs: "Automatické vyhledání optimálního termínu napříč všemi kalendáři a zdroji.",
    descEn: "Automatic search for optimal appointment across all calendars and sources.",
  },
  {
    titleCs: "Proaktivní follow-up",
    titleEn: "Proactive Follow-up",
    descCs: "Automatické po-rezervační dotazníky, připomínky a personalizovaná komunikace.",
    descEn: "Automatic post-booking surveys, reminders, and personalized communication.",
  },
  {
    titleCs: "Multi-servis koordinace",
    titleEn: "Multi-service Coordination",
    descCs: "Komplexní rezervace zahrnující více služeb v jedné přirozené konverzaci.",
    descEn: "Complex bookings involving multiple services in a single natural conversation.",
  },
  {
    titleCs: "Waitlist management",
    titleEn: "Waitlist Management",
    descCs: "Inteligentní zaplňování volných míst při stornování s automatickou notifikací.",
    descEn: "Intelligent filling of available slots upon cancellation with auto-notification.",
  },
  {
    titleCs: "Platební brána",
    titleEn: "Payment Gateway",
    descCs: "Bezpečný výběr vratných záloh a plateb za služby přímo v konverzaci.",
    descEn: "Secure deposit collection and service payments directly within the conversation.",
  },
];

const processSteps = [
  { step: "01", labelCs: "Příchozí hovor", labelEn: "Inbound Call" },
  { step: "02", labelCs: "Identifikace", labelEn: "Identification" },
  { step: "03", labelCs: "Analýza záměru", labelEn: "Intent Analysis" },
  { step: "04", labelCs: "Rezervace / Akce", labelEn: "Booking / Action" },
  { step: "05", labelCs: "Potvrzení", labelEn: "Confirmation" },
  { step: "06", labelCs: "Follow-up", labelEn: "Follow-up" },
];

export default function ConciergeContent({ locale }: Props) {
  const isCs = locale === "cs";

  return (
    <PageTransition>
      <section className="relative w-full pt-[clamp(140px,20vh,200px)] pb-24 px-[clamp(24px,5vw,64px)] min-h-screen">
        <div className="mx-auto relative z-10" style={{ maxWidth: "1100px" }}>
          <div className="max-w-[800px] mb-16">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8 transition-all duration-300"
              style={{
                background: "rgba(0,194,255,0.08)",
                border: "1px solid rgba(0,194,255,0.12)",
                color: "rgba(0,194,255,0.55)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,194,255,0.25)"; e.currentTarget.style.background = "rgba(0,194,255,0.12)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,194,255,0.12)"; e.currentTarget.style.background = "rgba(0,194,255,0.08)"; }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "#00C2FF",
                  animation: "pulse-dot 2.8s ease-in-out infinite",
                  boxShadow: "0 0 0 3px rgba(0,194,255,0.12)",
                }}
              />
              <span className="font-body text-[10px] tracking-[0.08em]">{t(locale, "concierge.badge")}</span>
            </div>

            <h1
              className="font-heading mb-6"
              style={{
                fontSize: "clamp(36px, 6vw, 80px)",
                lineHeight: 1.05,
                fontWeight: 500,
              }}
              dangerouslySetInnerHTML={{ __html: t(locale, "concierge.title") }}
            />

            <p className="font-body text-[clamp(15px,1.2vw,17px)] leading-relaxed max-w-[56ch]" style={{ color: "#B7BCC7" }}>
              {t(locale, "concierge.subtitle")}
            </p>
          </div>

          <div className="mb-16">
            <span
              className="font-body text-[10px] tracking-[0.2em] uppercase mb-6 block transition-all duration-300"
              style={{ color: "rgba(0,194,255,0.25)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.45)"; e.currentTarget.style.textShadow = "0 0 12px rgba(0,194,255,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.25)"; e.currentTarget.style.textShadow = "none"; }}
            >
              &mdash; service flow
            </span>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
              {processSteps.map((item, i) => (
                <div key={i} className="text-center group">
                  <div
                    className="font-body text-[11px] transition-all duration-300"
                    style={{ color: "rgba(0,194,255,0.35)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.6)"; e.currentTarget.style.textShadow = "0 0 12px rgba(0,194,255,0.12)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.35)"; e.currentTarget.style.textShadow = "none"; }}
                  >
                    {item.step}
                  </div>
                  <div className="font-body text-[13px] font-medium mt-1 transition-all duration-300"
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#F3F4F6"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#F3F4F6"; }}
                  >
                    {isCs ? item.labelCs : item.labelEn}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <span
              className="font-body text-[10px] tracking-[0.2em] uppercase transition-all duration-300"
              style={{ color: "rgba(0,194,255,0.25)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.45)"; e.currentTarget.style.textShadow = "0 0 12px rgba(0,194,255,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.25)"; e.currentTarget.style.textShadow = "none"; }}
            >
              &mdash; capabilities
            </span>
          </div>

          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
          >
            {services.map((item, i) => (
              <div key={i}>
                <div
                  className="font-body text-[10px] tracking-[0.12em] mb-3 transition-all duration-300"
                  style={{ color: "rgba(0,194,255,0.25)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.5)"; e.currentTarget.style.textShadow = "0 0 12px rgba(0,194,255,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.25)"; e.currentTarget.style.textShadow = "none"; }}
                >
                  {(i + 1).toString().padStart(2, "0")}
                </div>
                <h3
                  className="font-heading text-[15px] font-medium mb-1.5 transition-all duration-300"
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.8)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#F3F4F6"; }}
                >
                  {isCs ? item.titleCs : item.titleEn}
                </h3>
                <p className="font-body text-[13px] leading-relaxed" style={{ color: "#B7BCC7" }}>
                  {isCs ? item.descCs : item.descEn}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <Link
              href={`/${locale}/contact`}
              className="group inline-flex items-center gap-2.5 font-body"
              style={{ color: "rgba(0,194,255,0.55)", transition: "color 0.5s ease-out, text-shadow 0.5s ease-out" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "rgba(0,194,255,0.9)";
                e.currentTarget.style.textShadow = "0 0 24px rgba(0,194,255,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(0,194,255,0.55)";
                e.currentTarget.style.textShadow = "none";
              }}
            >
              <span className="font-body text-[13px] font-medium tracking-[-0.01em]">
                {isCs ? "Rezervovat demo" : "Book a demo"}
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
