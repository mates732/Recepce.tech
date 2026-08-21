"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { getPage } from "@/content/repository";
import type { DemoItemContent } from "@/content/types";
import { useAssistantConfig } from "@/hooks/useAssistantConfig";
import StateNotice from "@/components/StateNotice";

const VoiceWidget = dynamic(() => import("@/components/voice/VoiceWidget"), { ssr: false });

export default function DemoContent({ locale }: { locale: Locale }) {
  const page = getPage("demo");
  const demos = page?.data.demos ?? [];
  const [selected, setSelected] = useState<DemoItemContent | null>(demos[0] ?? null);
  const [open, setOpen] = useState(false);
  const { config, loading, error, load } = useAssistantConfig(locale);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const isCs = locale === "cs";
  const label = (d: DemoItemContent) => (isCs && d.nameCs ? d.nameCs : d.name);
  const desc = (d: DemoItemContent) => (isCs && d.descriptionCs ? d.descriptionCs : d.description);

  const handleSelect = (demo: DemoItemContent) => {
    setSelected(demo);
    setOpen(false);
    load(demo.id);
  };

  useEffect(() => {
    if (demos.length > 0) load(demos[0].id);
  }, [load, demos.length]);

  if (demos.length === 0) {
    return (
      <div className="relative" style={{ background: "#121316", minHeight: "100dvh" }}>
        <section
          className="flex flex-col items-center justify-center"
          style={{ minHeight: "100dvh", padding: "clamp(24px, 5vw, 80px)" }}
        >
          <div className="w-full max-w-xl">
            <StateNotice
              variant="empty"
              title={page?.data.badge[locale]}
              message={t(locale, "ui.emptyDemos")}
            />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="relative" style={{ background: "#121316", minHeight: "100dvh" }}>
      {/* ─── Hero ─── */}
      <section className="pt-20 sm:pt-36 pb-8 sm:pb-16" style={{ paddingLeft: "clamp(20px, 5vw, 80px)", paddingRight: "clamp(20px, 5vw, 80px)" }}>
        <div className="max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-label sm:text-xs font-mono font-semibold tracking-widest uppercase"
            style={{ color: "#6E7683" }}
          >
            {page?.data.badge[locale]}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-medium leading-tight mt-3 sm:mt-4"
            style={{ fontSize: "var(--text-h1)", letterSpacing: "-0.03em", color: "#F4F6F8" }}
          >
            {page?.data.title[locale]}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-body mt-2 sm:mt-4"
            style={{ fontSize: "var(--text-lead)", color: "#9AA1AB" }}
          >
            {page?.data.subtitle[locale]}
          </motion.p>
        </div>
      </section>

      {/* ─── Selector + Widget ─── */}
      <section style={{ paddingLeft: "clamp(20px, 5vw, 80px)", paddingRight: "clamp(20px, 5vw, 80px)", paddingBottom: "clamp(80px, 14vw, 160px)" }}>
        <div className="max-w-xl mx-auto">
          {/* Dropdown */}
          <div ref={dropdownRef} className="relative">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="flex items-center justify-between w-full text-left transition-all duration-200"
              style={{
                padding: "12px 16px",
                background: "#121316",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              <span className="font-heading" style={{ fontSize: "var(--text-body)", letterSpacing: "-0.01em", color: "#F4F6F8" }}>
                {label(selected!)}
              </span>
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}
              >
                {"▼"}
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 6 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="absolute left-0 right-0 z-20 mt-1.5 overflow-hidden"
                  style={{
                    background: "#121316",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    boxShadow: "0 8px 32px rgba(255,255,255,0.08), 0 2px 8px rgba(255,255,255,0.04)",
                  }}
                >
                  {demos.map((demo) => {
                    const isSelected = demo.id === selected?.id;
                    return (
                      <button
                        key={demo.id}
                        onClick={() => handleSelect(demo)}
                        className="flex items-center justify-between w-full text-left transition-all duration-150"
                        style={{
                          padding: "10px 16px",
                          background: isSelected ? "rgba(255,255,255,0.04)" : "transparent",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = isSelected ? "rgba(255,255,255,0.04)" : "transparent"; }}
                      >
                        <span
                          className="font-heading transition-colors duration-150"
                          style={{
                            fontSize: "var(--text-body)",
                            letterSpacing: "-0.01em",
                            color: isSelected ? "#F4F6F8" : "rgba(255,255,255,0.5)",
                          }}
                        >
                          {label(demo)}
                        </span>
                        <span style={{ fontSize: 13, color: isSelected ? "rgba(255,255,255,0.2)" : "transparent" }}>{"→"}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info + Voice Widget */}
          <motion.div
            key={selected?.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 sm:mt-8 flex flex-col items-center text-center"
          >
            <p className="text-label-sm sm:text-label font-mono font-semibold tracking-widest uppercase mb-2 sm:mb-3" style={{ color: "#6E7683" }}>
              {t(locale, "demo.assistantLabel")}
            </p>
            <p className="font-body text-sm leading-relaxed mb-4 sm:mb-5" style={{ color: "#9AA1AB" }}>
              {desc(selected!)}
            </p>

            {/* Capabilities — grid on desktop, compact on mobile */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:gap-y-2.5 mb-4 sm:mb-6 text-left w-full max-w-sm">
              {(selected?.capabilities ?? []).map((cap) => (
                <div key={cap} className="flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C7CDD6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="font-body text-[13px] sm:text-sm" style={{ fontWeight: 500, color: "#C7CDD6", lineHeight: "var(--leading-body)" }}>{cap}</span>
                </div>
              ))}
            </div>

            <p className="text-label-sm sm:text-label font-mono font-semibold tracking-widest uppercase mb-1 sm:mb-1.5" style={{ color: "#6E7683" }}>
              {t(locale, "demo.supported")}
            </p>
            <p className="font-body text-sm mb-5 sm:mb-6" style={{ color: "#9AA1AB" }}>
              {selected?.channels.join(" • ") ?? ""}
            </p>

            {/* Voice widget */}
            <div className="w-full max-w-sm">
              {loading && (
                <div className="flex flex-col items-center gap-3" style={{ padding: "24px 24px", background: "#121316", borderRadius: 18, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                  <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {t(locale, "ui.loading")}
                  </span>
                </div>
              )}
              {error && !loading && (
                <StateNotice
                  variant="error"
                  message={error}
                  actionLabel={t(locale, "ui.retry")}
                  onAction={() => selected && load(selected.id)}
                />
              )}
              {config && !loading && (
                <VoiceWidget assistantId={config.assistantId} apiKey={config.apiKey} locale={locale} />
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
