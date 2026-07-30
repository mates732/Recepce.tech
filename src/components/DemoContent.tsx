"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/types";
import type { VapiAssistantResponse } from "@/config/vapi";
import VoiceWidget from "@/components/voice/VoiceWidget";

interface Demo {
  id: string;
  name: string;
  nameCs?: string;
  channels: string[];
  capabilities: string[];
  description: string;
  descriptionCs?: string;
}

const demos: Demo[] = [
  { id: "kadernictvi", name: "Hair Salon", nameCs: "Kadeřnictví", channels: ["Phone"], capabilities: ["Přijímá hovory", "Rezervuje termíny", "Odpovídá na dotazy", "Přepojí zaměstnance"], description: "Incoming phone call handled by AI Receptionist.", descriptionCs: "Příchozí telefonní hovor zpracovaný AI recepční." },
  { id: "stomatologie", name: "Dental Clinic", nameCs: "Zubní klinika", channels: ["Phone", "Chat"], capabilities: ["Přijímá hovory", "Rezervuje termíny", "Kontroluje pojištění", "Přijímá pacienty"], description: "Patient calls to schedule a dental checkup.", descriptionCs: "Pacient volá za účelem rezervace prohlídky." },
  { id: "restaurant", name: "Restaurant", nameCs: "Restaurace", channels: ["Phone"], capabilities: ["Přijímá hovory", "Rezervuje stoly", "Dietní omezení", "Skupinové rezervace"], description: "Customer calls to book a table for dinner.", descriptionCs: "Zákazník volá za účelem rezervace stolu." },
  { id: "masaze", name: "Massage Studio", nameCs: "Masážní studio", channels: ["Phone"], capabilities: ["Přijímá hovory", "Rezervuje termíny", "Info o balíčcích", "Dárkové poukazy"], description: "Client calls to schedule a massage appointment.", descriptionCs: "Klient volá za účelem rezervace masáže." },
  { id: "fitness", name: "Fitness Center", nameCs: "Fitness centrum", channels: ["Chat"], capabilities: ["Info o členství", "Rozvrh lekcí", "Odpovídá na dotazy", "Získává leady"], description: "Website visitor asks about membership options.", descriptionCs: "Návštěvník webu se ptá na možnosti členství." },
  { id: "barbershop", name: "Barbershop", nameCs: "Barbershop", channels: ["Phone"], capabilities: ["Přijímá hovory", "Rezervuje termíny", "Nabídka služeb", "Walk-in check"], description: "Customer calls to book a haircut appointment.", descriptionCs: "Zákazník volá za účelem rezervace střihu." },
];

export default function DemoContent({ locale }: { locale: Locale }) {
  const [selected, setSelected] = useState<Demo>(demos[0]);
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<VapiAssistantResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
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
  const label = (d: Demo) => (isCs && d.nameCs ? d.nameCs : d.name);
  const desc = (d: Demo) => (isCs && d.descriptionCs ? d.descriptionCs : d.description);

  const loadConfig = useCallback(async (id: string) => {
    setConfig(null);
    setConfigError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/vapi/config/${id}`);
      if (!res.ok) {
        setConfigError(isCs ? "Toto demo není dostupné." : "Demo not available.");
        return;
      }
      const data: VapiAssistantResponse = await res.json();
      setConfig(data);
    } catch {
      setConfigError(isCs ? "Nepodařilo se načíst konfiguraci." : "Failed to load config.");
    } finally {
      setLoading(false);
    }
  }, [isCs]);

  const handleSelect = (demo: Demo) => {
    setSelected(demo);
    setOpen(false);
    loadConfig(demo.id);
  };

  useEffect(() => {
    loadConfig(demos[0].id);
  }, [loadConfig]);

  return (
    <div className="relative" style={{ background: "#FFFFFF", minHeight: "100dvh" }}>
      {/* ─── Hero ─── */}
      <section className="pt-20 sm:pt-36 pb-8 sm:pb-16" style={{ paddingLeft: "clamp(20px, 5vw, 80px)", paddingRight: "clamp(20px, 5vw, 80px)" }}>
        <div className="max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] sm:text-xs font-mono font-semibold tracking-widest uppercase"
            style={{ color: "#9CA3AF" }}
          >
            {isCs ? "Živá Dema" : "Live Demos"}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-bold leading-tight mt-3 sm:mt-4"
            style={{ fontSize: "clamp(28px, 5vw, 64px)", letterSpacing: "-0.03em", color: "#111111" }}
          >
            {isCs ? "Vyberte si demo." : "Choose a demo."}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-body mt-2 sm:mt-4"
            style={{ fontSize: "clamp(14px, 1.2vw, 18px)", color: "#5F6368" }}
          >
            {isCs
              ? "Vyzkoušejte si reálné konverzace s AI v různých odvětvích."
              : "Experience real AI conversations in different industries."}
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
              className="flex items-center justify-between w-full text-left transition-all duration-200"
              style={{
                padding: "12px 16px",
                background: "#FFFFFF",
                border: "1px solid rgba(17,17,17,0.08)",
                borderRadius: 12,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(17,17,17,0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(17,17,17,0.08)"; }}
            >
              <span className="font-heading" style={{ fontSize: "clamp(15px, 1.3vw, 17px)", letterSpacing: "-0.01em", color: "#111111" }}>
                {label(selected)}
              </span>
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                style={{ color: "rgba(17,17,17,0.2)", fontSize: 12 }}
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
                    background: "#FFFFFF",
                    border: "1px solid rgba(17,17,17,0.08)",
                    borderRadius: 12,
                    boxShadow: "0 8px 32px rgba(17,17,17,0.08), 0 2px 8px rgba(17,17,17,0.04)",
                  }}
                >
                  {demos.map((demo) => {
                    const isSelected = demo.id === selected.id;
                    return (
                      <button
                        key={demo.id}
                        onClick={() => handleSelect(demo)}
                        className="flex items-center justify-between w-full text-left transition-all duration-150"
                        style={{
                          padding: "10px 16px",
                          background: isSelected ? "rgba(17,17,17,0.04)" : "transparent",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(17,17,17,0.04)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = isSelected ? "rgba(17,17,17,0.04)" : "transparent"; }}
                      >
                        <span
                          className="font-heading transition-colors duration-150"
                          style={{
                            fontSize: "clamp(14px, 1.2vw, 16px)",
                            letterSpacing: "-0.01em",
                            color: isSelected ? "#111111" : "rgba(17,17,17,0.5)",
                          }}
                        >
                          {label(demo)}
                        </span>
                        <span style={{ fontSize: 13, color: isSelected ? "rgba(17,17,17,0.2)" : "transparent" }}>{"→"}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info + Voice Widget */}
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 sm:mt-8 flex flex-col items-center text-center"
          >
            <p className="text-[9px] sm:text-[10px] font-mono font-semibold tracking-widest uppercase mb-2 sm:mb-3" style={{ color: "#9CA3AF" }}>
              AI Assistant
            </p>
            <p className="font-body text-sm leading-relaxed mb-4 sm:mb-5" style={{ color: "#5F6368" }}>
              {desc(selected)}
            </p>

            {/* Capabilities — grid on desktop, compact on mobile */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:gap-y-2.5 mb-4 sm:mb-6 text-left w-full max-w-sm">
              {selected.capabilities.map((cap) => (
                <div key={cap} className="flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2B2B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="font-body text-[13px] sm:text-sm" style={{ fontWeight: 500, color: "#2B2B2B", lineHeight: 1.5 }}>{cap}</span>
                </div>
              ))}
            </div>

            <p className="text-[9px] sm:text-[10px] font-mono font-semibold tracking-widest uppercase mb-1 sm:mb-1.5" style={{ color: "#9CA3AF" }}>
              {isCs ? "Podporované kanály" : "Supported"}
            </p>
            <p className="font-body text-sm mb-5 sm:mb-6" style={{ color: "#5F6368" }}>
              {selected.channels.join(" • ")}
            </p>

            {/* Voice widget */}
            <div className="w-full max-w-sm">
              {loading && (
                <div className="flex flex-col items-center gap-3" style={{ padding: "24px 24px", background: "#FFFFFF", borderRadius: 18, border: "1px solid rgba(17,17,17,0.06)" }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(17,17,17,0.1)" strokeWidth="2" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="rgba(17,17,17,0.35)" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                  <span className="text-xs font-mono" style={{ color: "rgba(17,17,17,0.35)" }}>
                    {isCs ? "Načítám…" : "Loading…"}
                  </span>
                </div>
              )}
              {configError && !loading && (
                <div style={{ padding: "24px 24px", background: "#FFFFFF", borderRadius: 18, border: "1px solid rgba(239,68,68,0.12)" }}>
                  <p className="text-xs font-mono" style={{ color: "#EF4444" }}>{configError}</p>
                </div>
              )}
              {config && !loading && (
                <VoiceWidget assistantId={config.assistantId} apiKey={config.apiKey} />
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
