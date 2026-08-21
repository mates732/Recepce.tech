"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { list } from "@/content/repository";
import { useAssistantConfig } from "@/hooks/useAssistantConfig";
import StateNotice from "@/components/StateNotice";

const VoiceWidget = dynamic(() => import("@/components/voice/VoiceWidget"), { ssr: false });

interface Props {
  locale: Locale;
}

export default function ProfeseContent({ locale }: Props) {
  const professions = list("profession");
  const [selected, setSelected] = useState<string | null>(null);
  const { config, loading, error, load } = useAssistantConfig(locale);

  const isCs = locale === "cs";

  const handleSelect = useCallback(
    (id: string) => {
      if (id === selected) return;
      setSelected(id);
      load(id);
    },
    [selected, load]
  );

  const prof = selected ? professions.find((p) => p.id === selected) : null;
  const d = prof ? (isCs ? prof.cs : prof.en) : null;

  return (
    <div className="relative min-h-screen" style={{ background: "#0A0A0B" }}>
      {/* ─── Ambient orbs ─── */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div
          className="absolute top-[8%] left-[12%] w-[700px] h-[700px] rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(160,160,160,0.06) 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute top-[35%] right-[8%] w-[550px] h-[550px] rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(96,96,96,0.04) 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* ─── Hero ─── */}
      <section className="relative z-10 flex flex-col items-center text-center" style={{ padding: "clamp(80px,12vh,120px) clamp(24px,5vw,48px) 0" }}>
        <div className="font-mono text-label tracking-[0.15em] uppercase mb-4 select-none" style={{ color: "rgba(255,255,255,0.25)" }}>
          {t(locale, "profese.industries")}
        </div>
        <h1
          className="font-heading leading-tight mb-4"
          style={{ fontSize: "var(--text-h1-md)", fontWeight: 500, letterSpacing: "-0.04em", color: "#F4F6F8" }}
        >
          {t(locale, "profese.intro")}
        </h1>
      </section>

      {/* ─── Industry selector ─── */}
      <section className="relative z-10" style={{ padding: "clamp(40px, 6vh, 64px) clamp(24px, 5vw, 48px)" }}>
        <div className="mx-auto" style={{ maxWidth: 900 }}>
          {professions.length === 0 ? (
            <StateNotice
              variant="empty"
              title={t(locale, "profese.industries")}
              message={t(locale, "ui.emptyProfessions")}
            />
          ) : (
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
            {professions.map((p) => {
              const isSelected = selected === p.id;
              const name = isCs ? p.cs.name : p.en.name;
              return (
                <motion.button
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative text-left rounded-xl cursor-pointer transition-all duration-300"
                  style={{
                    padding: "16px 20px",
                    background: isSelected ? `${p.colors.accent}14` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isSelected ? `${p.colors.accent}80` : "rgba(255,255,255,0.08)"}`,
                    boxShadow: isSelected ? "0 4px 16px rgba(0,0,0,0.35)" : "none",
                    outline: "none",
                  }}
                  aria-pressed={isSelected}
                  aria-label={`${t(locale, "ui.select")} ${name}`}
                >
                  <span
                    className="font-heading text-sm font-medium block leading-tight mb-1"
                    style={{ color: isSelected ? "#F4F6F8" : "#C7CDD6", letterSpacing: "-0.01em" }}
                  >
                    {name}
                  </span>
                  <span
                    className="font-mono text-label-sm tracking-[0.08em]"
                    style={{ color: p.colors.accent, opacity: isSelected ? 1 : 0.6 }}
                  >
                    {p.cs.tags[0]}
                  </span>
                </motion.button>
              );
            })}
          </div>
          )}
        </div>
      </section>

      {/* ─── Voice widget area ─── */}
      {professions.length > 0 && (
      <section className="relative z-10 flex flex-col items-center" style={{ padding: "0 clamp(24px, 5vw, 48px) clamp(80px, 12vh, 120px)" }}>
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-3"
              style={{ padding: "32px 40px", background: "#121316", borderRadius: 20, border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </motion.div>
              <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
                {t(locale, "ui.loading")}
              </span>
            </motion.div>
          )}

          {error && !loading && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md"
            >
              <StateNotice
                variant="error"
                message={error}
                actionLabel={t(locale, "ui.retry")}
                onAction={() => selected && load(selected)}
              />
            </motion.div>
          )}

          {config && !loading && (
            <motion.div
              key="widget"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              {d && (
                <p
                  className="font-body text-center leading-relaxed mb-6"
                  style={{ fontSize: "var(--text-body)", color: "#9AA1AB", maxWidth: "42ch" }}
                >
                  {d.desc}
                </p>
              )}
              <VoiceWidget assistantId={config.assistantId} apiKey={config.apiKey} locale={locale} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      )}
    </div>
  );
}
