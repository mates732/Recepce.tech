"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { PROFESSIONS } from "../professionsData";
import Link from "next/link";
import Vapi from "@vapi-ai/web";
import type { VapiAssistantConfig } from "@/lib/vapiConfig";

interface Props {
  locale: Locale;
  slug: string;
}

type DemoState = "idle" | "connecting" | "connected";

export default function ProfessionDetailContent({ locale, slug }: Props) {
  const prof = PROFESSIONS.find((p) => p.id === slug);
  const isCs = locale === "cs";
  const [demoState, setDemoState] = useState<DemoState>("idle");
  const [showHint, setShowHint] = useState(false);
  const hintTimer = useRef<number>(0);

  useEffect(() => {
    hintTimer.current = window.setTimeout(() => setShowHint(true), 4000);
    return () => window.clearTimeout(hintTimer.current);
  }, []);

  const vapiRef = useRef<Vapi | null>(null);
  const fallbackTimer = useRef<number>(0);

  const cleanupVapi = useCallback(() => {
    const v = vapiRef.current;
    vapiRef.current = null;
    clearTimeout(fallbackTimer.current);
    try { v?.stop(); } catch {}
  }, []);

  const handleMicClick = useCallback(async () => {
    if (demoState === "connected") {
      cleanupVapi();
      setDemoState("idle");
      return;
    }
    if (demoState !== "idle") return;

    setDemoState("connecting");

    let config: VapiAssistantConfig | undefined;
    try {
      const res = await fetch(`/api/vapi/config/${slug}`);
      if (res.ok) config = await res.json();
    } catch {}

      if (config?.apiKey && config?.assistantId) {
      try {
        const vapi = new Vapi(config.apiKey);
        vapiRef.current = vapi;

        vapi.on("call-end", () => {
          cleanupVapi();
          setDemoState("idle");
        });

        vapi.on("error", () => {
          cleanupVapi();
          setDemoState("idle");
        });

        vapi.start(config.assistantId).catch(() => {
          cleanupVapi();
          setDemoState("idle");
        });
      } catch {
        cleanupVapi();
        setDemoState("idle");
      }

      fallbackTimer.current = window.setTimeout(() => {
        if (vapiRef.current) setDemoState("connected");
      }, 3000);
    } else {
      fallbackTimer.current = window.setTimeout(() => setDemoState("connected"), 2000);
    }
  }, [demoState, slug, cleanupVapi]);

  useEffect(() => {
    return () => cleanupVapi();
  }, [cleanupVapi]);

  if (!prof) {
    return (
      <section className="relative w-full min-h-screen flex items-center justify-center px-[clamp(24px,5vw,64px)]">
        <div className="text-center" style={{ maxWidth: "800px" }}>
          <div className="font-mono text-[11px] tracking-[0.12em] uppercase mb-4" style={{ color: "rgba(126,132,146,0.45)" }}>
            404
          </div>
          <h1 className="font-heading mb-6" style={{ fontSize: "clamp(28px,4vw,48px)", lineHeight: 1.05, fontWeight: 500 }}>
            {t(locale, "profese.notFound")}
          </h1>
          <Link
            href={`/${locale}/profese`}
            className="group inline-flex items-center gap-2 text-[13px] font-medium tracking-[-0.01em] no-underline transition-all duration-500"
            style={{ color: "rgba(0,194,255,0.5)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.85)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(0,194,255,0.5)"; }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M8 2L4 6l4 4" />
            </svg>
            <span>{t(locale, "profese.backToOverview")}</span>
          </Link>
        </div>
      </section>
    );
  }

  const d = isCs ? prof.cs : prof.en;
  const isConnected = demoState === "connected";

  return (
    <>
      <section className="relative w-full min-h-screen flex flex-col" style={{ padding: "clamp(100px,14vh,160px) clamp(24px,5vw,64px)" }}>
        <div className="mx-auto w-full flex-1 flex flex-col" style={{ maxWidth: "1100px" }}>
          {/* Back link */}
          <Link
            href={`/${locale}/profese`}
            className="group inline-flex items-center gap-1.5 font-body text-[11px] tracking-[0.08em] mb-8 transition-all duration-300 self-start"
            style={{ color: "rgba(126,132,146,0.65)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#B7BCC7"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(126,132,146,0.65)"; }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M8 2L4 6l4 4" />
            </svg>
            <span>{t(locale, "profese.backToSelection")}</span>
          </Link>

          <div className="flex-1 flex flex-col justify-center">
            {/* Status ribbon — ambient system status */}
            <div
              className="relative flex items-center justify-between w-full rounded-full mb-4 overflow-hidden transition-all duration-400 select-none"
              style={{
                padding: "3px 12px 3px 10px",
                background: "rgba(2,3,8,0.45)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.03)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.055)";
                e.currentTarget.style.background = "rgba(2,3,8,0.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.03)";
                e.currentTarget.style.background = "rgba(2,3,8,0.45)";
              }}
            >
              {/* Ambient light sweep */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.012) 50%, transparent 100%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 8s ease-in-out infinite",
                }}
              />

              {/* Left: dot + status */}
              <div className="flex items-center gap-2 relative z-[1]">
                <span
                  className="w-[5px] h-[5px] rounded-full"
                  style={{
                    background: prof.colors.accent,
                    animation: "pulse-dot 3.5s ease-in-out infinite",
                    boxShadow: `0 0 5px ${prof.colors.accent}20`,
                  }}
                />
                <span className="font-mono text-[8px] tracking-[0.16em]" style={{ color: "rgba(183,188,199,0.4)" }}>
                  {t(locale, "profese.liveDemoBadge")}
                </span>
              </div>

              {/* Right: profession + ambient label */}
              <div className="flex items-center gap-2 relative z-[1]">
                <span className="font-mono text-[8px] tracking-[0.06em]" style={{ color: "rgba(126,132,146,0.45)" }}>
                  {d.name}
                </span>
                <span
                  className="font-mono text-[7px] tracking-[0.06em]"
                  style={{ color: "rgba(126,132,146,0.2)", animation: "ambient-glow 4s ease-in-out infinite" }}
                >
                  &middot; {isCs ? "aktivní" : "active"}
                </span>
              </div>
            </div>

            {/* Headline */}
            <h1
              className="font-heading mb-4"
              style={{
                fontSize: "clamp(36px, 6vw, 80px)",
                lineHeight: 1.05,
                fontWeight: 500,
              }}
            >
              {d.name}
            </h1>

            {/* Description */}
            <p className="font-body text-[clamp(15px,1.2vw,17px)] leading-relaxed max-w-[56ch] mb-6" style={{ color: "#B7BCC7" }}>
              {d.desc}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-10">
              {d.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] tracking-[0.04em] px-3 py-1.5 rounded-full border transition-all duration-300"
                  style={{
                    color: prof.colors.accent,
                    opacity: 0.35,
                    borderColor: `${prof.colors.accent}10`,
                    background: `${prof.colors.accent}05`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.7";
                    e.currentTarget.style.borderColor = `${prof.colors.accent}30`;
                    e.currentTarget.style.background = `${prof.colors.accent}0e`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "0.35";
                    e.currentTarget.style.borderColor = `${prof.colors.accent}10`;
                    e.currentTarget.style.background = `${prof.colors.accent}05`;
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Features */}
            <div className="mb-5">
              <span className="font-body text-[10px] tracking-[0.2em] uppercase" style={{ color: prof.colors.accent, opacity: 0.4 }}>
                &mdash; {t(locale, "profese.keyFeatures")}
              </span>
            </div>

            <div
              className="grid gap-3 mb-8"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
            >
              {d.features.map((f) => (
                <div
                  key={f.label}
                  className="p-4 rounded-lg transition-all duration-300"
                  style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${prof.colors.accent}15`;
                    e.currentTarget.style.background = `${prof.colors.accent}04`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.015)";
                  }}
                >
                  <div className="font-body text-[11px] tracking-[0.08em] uppercase mb-2" style={{ color: prof.colors.accent, opacity: 0.25 }}>
                    {f.label}
                  </div>
                  <p className="font-body text-[13px] leading-relaxed" style={{ color: "rgba(183,188,199,0.7)" }}>
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div>
              <Link
                href={`/${locale}/contact`}
                className="group inline-flex items-center gap-2.5 font-body transition-all duration-500"
                style={{ color: prof.colors.accent, opacity: 0.4 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.7";
                  e.currentTarget.style.textShadow = `0 0 24px ${prof.colors.accent}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.4";
                  e.currentTarget.style.textShadow = "none";
                }}
              >
                <span className="text-[13px] font-medium tracking-[-0.01em]">
                  {t(locale, "profese.getDemo")}
                </span>
                <svg
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  className="transition-transform duration-500 ease-out group-hover:translate-x-1"
                >
                  <path d="M2 6h8M6 2l4 4-4 4" />
                </svg>
              </Link>
            </div>

            {/* Demo button — inline, not fixed */}
            <div className="flex flex-col items-center gap-4 mt-14 mb-8">
              <div className="flex items-center gap-3">
                <div
                  className="font-mono text-[9px] tracking-[0.15em] uppercase transition-all duration-500"
                  style={{
                    opacity: demoState === "connected" ? 0.8 : 0.5,
                    color: demoState === "connected" ? "rgba(239,68,68,0.7)" : "rgba(126,132,146,0.8)",
                  }}
                >
                  {demoState === "connecting" ? t(locale, "profese.connecting") : demoState === "connected" ? (isCs ? "Ukončit" : "End call") : t(locale, "profese.tryDemo")}
                </div>

                <button
                  onClick={() => setShowHint((v) => !v)}
                  className="flex items-center justify-center w-5 h-5 rounded-full transition-all duration-300"
                  style={{
                    background: showHint ? `${prof.colors.accent}08` : "transparent",
                    color: showHint ? prof.colors.accent : "rgba(126,132,146,0.35)",
                    opacity: showHint ? 0.7 : 0.4,
                  }}
                  onMouseEnter={(e) => { if (!showHint) { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.color = "#7E8492"; } }}
                  onMouseLeave={(e) => { if (!showHint) { e.currentTarget.style.opacity = "0.4"; e.currentTarget.style.color = "rgba(126,132,146,0.35)"; } }}
                  aria-label="Info"
                >
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="8" cy="8" r="6" />
                    <path d="M8 7.5v3" />
                    <circle cx="8" cy="5.5" r="0.5" fill="currentColor" stroke="none" />
                  </svg>
                </button>
              </div>

              <button
                onClick={handleMicClick}
                disabled={demoState === "connecting"}
                className="group relative flex items-center justify-center transition-all duration-500"
                style={{
                  width: demoState === "connected" ? "48px" : "52px",
                  height: demoState === "connected" ? "48px" : "52px",
                  borderRadius: "50%",
                  background: demoState === "connected"
                    ? "rgba(239,68,68,0.08)"
                    : demoState === "connecting"
                      ? `${prof.colors.accent}12`
                      : `${prof.colors.accent}08`,
                  border: `1px solid ${
                    demoState === "connected" ? "rgba(239,68,68,0.15)" : `${prof.colors.accent}15`
                  }`,
                  cursor: demoState === "connecting" ? "default" : "pointer",
                }}
              >
                {demoState === "connecting" && (
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: `1px solid ${prof.colors.accent}10`,
                      animation: "pulse-ring 2.5s ease-in-out infinite",
                    }}
                  />
                )}
                {demoState === "connected" ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(239,68,68,0.7)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: 0.7 }}
                  >
                    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67 19.49 19.49 0 0 1-2.67-3.34A19.79 19.79 0 0 1 2.16 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
                    <line x1="23" y1="1" x2="1" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={prof.colors.accent}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: demoState === "connecting" ? 0.65 : 0.45 }}
                  >
                    <rect x="9" y="2" width="6" height="11" rx="3" />
                    <path d="M5 10a7 7 0 0 0 14 0" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                  </svg>
                )}
              </button>

              {/* Hint tooltip below the button */}
              <div
                className="transition-all duration-500"
                style={{
                  opacity: showHint ? 1 : 0,
                  transform: showHint ? "translateY(0)" : "translateY(-4px)",
                  maxWidth: "260px",
                }}
              >
                <div
                  className="rounded-lg px-3.5 py-2.5 text-[11px] font-body leading-relaxed"
                  style={{
                    background: "rgba(14,16,20,0.9)",
                    border: `1px solid ${prof.colors.accent}10`,
                    color: "rgba(183,188,199,0.7)",
                  }}
                >
                  {isConnected ? (
                    <span>{isCs ? "Kliknutím ukončíte hovor" : "Click to end the call"}</span>
                  ) : (
                    <span>{t(locale, "profese.tapToTalk")}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
