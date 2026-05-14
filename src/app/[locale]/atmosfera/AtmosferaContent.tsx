"use client";

import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";

interface Props {
  locale: Locale;
}

const experiences = [
  {
    labelCs: "Tichý vstup",
    labelEn: "Quiet Entry",
    descCs: "První kontakt bez bariér. AI vítá hosta přirozeně, bez čekání a bez tlačítek.",
    descEn: "First contact without barriers. AI welcomes the guest naturally, no waiting, no buttons.",
  },
  {
    labelCs: "Bezešvá konverzace",
    labelEn: "Seamless Conversation",
    descCs: "Dialog, který plyne přirozeně. AI rozumí kontextu, pauzám a nuancím lidské řeči.",
    descEn: "Dialogue that flows naturally. AI understands context, pauses, and nuances of human speech.",
  },
  {
    labelCs: "Neviditelná orchestrace",
    labelEn: "Invisible Orchestration",
    descCs: "Všechny systémy pracují na pozadí. Host vnímá jen plynulý, inteligentní servis.",
    descEn: "All systems work in the background. The guest only perceives smooth, intelligent service.",
  },
  {
    labelCs: "Emocionální inteligence",
    labelEn: "Emotional Intelligence",
    descCs: "AI detekuje náladu a přizpůsobuje tón, tempo a styl komunikace.",
    descEn: "AI detects mood and adapts its tone, pace, and communication style accordingly.",
  },
  {
    labelCs: "Tiché uzavření",
    labelEn: "Quiet Closure",
    descCs: "Každá interakce končí elegantně. Potvrzení, poděkování a rozloučení bez hluku.",
    descEn: "Every interaction ends elegantly. Confirmation, thanks, and farewell without noise.",
  },
  {
    labelCs: "Paměť vztahu",
    labelEn: "Relationship Memory",
    descCs: "AI si pamatuje každou interakci a buduje dlouhodobý vztah s každým hostem.",
    descEn: "AI remembers every interaction and builds a long-term relationship with each guest.",
  },
];

export default function AtmosferaContent({ locale }: Props) {
  const isCs = locale === "cs";

  return (
    <PageTransition>
      <section className="relative w-full pt-[clamp(140px,20vh,200px)] pb-24 px-[clamp(24px,5vw,64px)] min-h-screen">
        <div className="mx-auto relative z-10" style={{ maxWidth: "1100px" }}>
          <div className="max-w-[800px] mb-16">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8 transition-all duration-300"
              style={{
                background: "rgba(124,107,255,0.06)",
                border: "1px solid rgba(124,107,255,0.1)",
                color: "rgba(124,107,255,0.45)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(124,107,255,0.25)"; e.currentTarget.style.background = "rgba(124,107,255,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(124,107,255,0.1)"; e.currentTarget.style.background = "rgba(124,107,255,0.06)"; }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "#7C6BFF",
                  animation: "pulse-dot 3.2s ease-in-out infinite",
                  boxShadow: "0 0 0 3px rgba(124,107,255,0.1)",
                }}
              />
              <span className="font-body text-[10px] tracking-[0.08em]">{t(locale, "atmosfera.badge")}</span>
            </div>

            <h1
              className="font-heading mb-6"
              style={{
                fontSize: "clamp(36px, 6vw, 80px)",
                lineHeight: 1.05,
                fontWeight: 500,
              }}
              dangerouslySetInnerHTML={{ __html: t(locale, "atmosfera.title") }}
            />

            <p className="font-body text-[clamp(15px,1.2vw,17px)] leading-relaxed max-w-[56ch]" style={{ color: "#B7BCC7" }}>
              {t(locale, "atmosfera.subtitle")}
            </p>
          </div>

          <div className="mb-6">
            <span
              className="font-body text-[10px] tracking-[0.2em] uppercase transition-all duration-300"
              style={{ color: "rgba(124,107,255,0.2)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(124,107,255,0.4)"; e.currentTarget.style.textShadow = "0 0 12px rgba(124,107,255,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(124,107,255,0.2)"; e.currentTarget.style.textShadow = "none"; }}
            >
              &mdash; experience layers
            </span>
          </div>

          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
          >
            {experiences.map((item, i) => (
              <div key={i}>
                <div
                  className="font-body text-[11px] tracking-[0.08em] uppercase mb-3 transition-all duration-300"
                  style={{ color: "rgba(124,107,255,0.3)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(124,107,255,0.5)"; e.currentTarget.style.textShadow = "0 0 12px rgba(124,107,255,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(124,107,255,0.3)"; e.currentTarget.style.textShadow = "none"; }}
                >
                  {isCs ? item.labelCs : item.labelEn}
                </div>
                <p className="font-body text-[14px] leading-relaxed" style={{ color: "#B7BCC7" }}>
                  {isCs ? item.descCs : item.descEn}
                </p>
              </div>
            ))}
          </div>

          <div
            className="mt-16"
            style={{ maxWidth: "700px" }}
          >
            <span className="font-body text-[10px] tracking-[0.2em] uppercase block mb-4" style={{ color: "rgba(126,132,146,0.35)" }}>
              &mdash; philosophy
            </span>
            <p className="font-body text-[15px] leading-relaxed" style={{ color: "#B7BCC7" }}>
              {isCs
                ? "Nejlepší technologie je ta, kterou necítíte. Atmosféra recepce.tech je navržena tak, aby každá interakce působila lehce, přirozeně a bez tření."
                : "The best technology is the one you don't feel. The recepce.tech atmosphere is designed so every interaction feels light, natural, and frictionless."}
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
