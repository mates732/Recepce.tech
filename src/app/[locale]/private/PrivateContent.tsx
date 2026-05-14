"use client";

import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";
import Link from "next/link";

interface Props {
  locale: Locale;
}

const features = [
  {
    label: "dedicated instance",
    descCs: "Izolovaná AI instance pouze pro váš byznys. Žádné sdílení zdrojů, maximální výkon a bezpečnost.",
    descEn: "Isolated AI instance for your business only. No resource sharing, maximum performance and security.",
  },
  {
    label: "custom training",
    descCs: "AI natrénovaná na vašich datech, vašem hlasu a vašich procesech. Plně personalizovaná.",
    descEn: "AI trained on your data, your voice, and your processes. Fully personalized.",
  },
  {
    label: "white label",
    descCs: "Vlastní branding, doména a telefonní číslo. Vše pod vaší značkou.",
    descEn: "Your own branding, domain, and phone number. Everything under your brand.",
  },
  {
    label: "enterprise SLA",
    descCs: "99.99% uptime, dedikovaný support tým, individuální onboarding a prioritní řešení incidentů.",
    descEn: "99.99% uptime, dedicated support team, individual onboarding, and priority incident resolution.",
  },
  {
    label: "data sovereignty",
    descCs: "Všechna data uložena na serverech v EU. Možnost nasazení na privátní infrastruktuře klienta.",
    descEn: "All data stored on EU servers. Option to deploy on client's private infrastructure.",
  },
  {
    label: "custom integrations",
    descCs: "API přístup pro vlastní integrace, custom webhooky a propojení s interními systémy.",
    descEn: "API access for custom integrations, custom webhooks, and connection with internal systems.",
  },
];

const specs = [
  { feature: "uptime", value: "99.99%" },
  { feature: "latency", value: "<50ms" },
  { feature: "encryption", value: "AES-256" },
  { feature: "audit log", value: "90 days" },
  { feature: "support", value: "24/7" },
  { feature: "deployment", value: "EU only" },
];

export default function PrivateContent({ locale }: Props) {
  const isCs = locale === "cs";

  return (
    <PageTransition>
      <section className="relative w-full pt-[clamp(140px,20vh,200px)] pb-24 px-[clamp(24px,5vw,64px)] min-h-screen">
        <div className="mx-auto relative z-10" style={{ maxWidth: "1100px" }}>
          <div className="max-w-[800px] mb-16">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8 transition-all duration-300"
              style={{
                background: "rgba(126,132,146,0.1)",
                border: "1px solid rgba(126,132,146,0.18)",
                color: "rgba(183,188,199,0.6)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(183,188,199,0.25)"; e.currentTarget.style.background = "rgba(126,132,146,0.16)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(126,132,146,0.18)"; e.currentTarget.style.background = "rgba(126,132,146,0.1)"; }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "#F3F4F6",
                  animation: "pulse-dot 2.8s ease-in-out infinite",
                  boxShadow: "0 0 0 3px rgba(126,132,146,0.18)",
                }}
              />
              <span className="font-body text-[10px] tracking-[0.08em]">{t(locale, "private.badge")}</span>
            </div>

            <h1
              className="font-heading mb-6"
              style={{
                fontSize: "clamp(36px, 6vw, 80px)",
                lineHeight: 1.05,
                fontWeight: 500,
              }}
              dangerouslySetInnerHTML={{ __html: t(locale, "private.title") }}
            />

            <p className="font-body text-[clamp(15px,1.2vw,17px)] leading-relaxed max-w-[56ch]" style={{ color: "#B7BCC7" }}>
              {t(locale, "private.subtitle")}
            </p>
          </div>

          <div
            className="grid gap-6 mb-16"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            }}
          >
            {specs.map((spec, i) => (
              <div key={i} className="text-center group">
                <div
                  className="font-body text-[13px] font-medium mb-1 transition-all duration-300"
                  style={{ color: "rgba(126,132,146,0.8)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(183,188,199,0.8)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(126,132,146,0.8)"; }}
                >
                  {spec.feature}
                </div>
                <div
                  className="font-heading text-[clamp(16px,1.8vw,22px)] font-medium transition-all duration-300"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                  onMouseEnter={(e) => { e.currentTarget.style.textShadow = "0 0 20px rgba(183,188,199,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textShadow = "none"; }}
                >
                  {spec.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <span
              className="font-body text-[10px] tracking-[0.2em] uppercase transition-all duration-300"
              style={{ color: "rgba(126,132,146,0.35)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(183,188,199,0.45)"; e.currentTarget.style.textShadow = "0 0 12px rgba(183,188,199,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(126,132,146,0.35)"; e.currentTarget.style.textShadow = "none"; }}
            >
              &mdash; enterprise features
            </span>
          </div>

          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
          >
            {features.map((item, i) => (
              <div key={i}>
                <div
                  className="font-body text-[11px] tracking-[0.08em] uppercase mb-2 transition-all duration-300"
                  style={{ color: "rgba(126,132,146,0.55)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(183,188,199,0.65)"; e.currentTarget.style.textShadow = "0 0 12px rgba(183,188,199,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(126,132,146,0.55)"; e.currentTarget.style.textShadow = "none"; }}
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
              href={`/${locale}/contact`}
              className="group inline-flex items-center gap-2.5 font-body"
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
              <span className="font-body text-[13px] font-medium tracking-[-0.01em]">
                {isCs ? "Poptat enterprise" : "Inquire enterprise"}
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
