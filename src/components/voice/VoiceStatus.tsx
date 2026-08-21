"use client";

import type { VoiceState } from "./useVoiceAssistant";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale, TranslationKey } from "@/lib/types";
import { t } from "@/lib/utils";

interface VoiceStatusProps {
  state: VoiceState;
  error: string | null;
  duration: number;
  locale: Locale;
}

const STATUS_CONFIG: Record<VoiceState, { key: TranslationKey | ""; color: string; breathing: boolean }> = {
  idle: { key: "voice.idle", color: "#6E7683", breathing: true },
  connecting: { key: "voice.connecting", color: "var(--color-accent)", breathing: false },
  listening: { key: "voice.listening", color: "#34D399", breathing: false },
  speaking: { key: "voice.speaking", color: "#34D399", breathing: false },
  error: { key: "", color: "var(--color-danger)", breathing: false },
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VoiceStatus({ state, error, duration, locale }: VoiceStatusProps) {
  const cfg = STATUS_CONFIG[state];
  const showDuration = (state === "listening" || state === "speaking") && duration > 0;
  const label = state === "error" && error ? error : cfg.key ? t(locale, cfg.key) : "";

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={state === "error" ? "error" : "normal"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-2"
        >
          <motion.span
            className="w-2 h-2 rounded-full"
            style={{ background: cfg.color }}
            animate={
              cfg.breathing
                ? { opacity: [0.3, 0.6, 0.3] }
                : state === "connecting"
                  ? { opacity: [0.4, 1, 0.4] }
                  : { opacity: 1 }
            }
            transition={
              cfg.breathing
                ? { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
                : state === "connecting"
                  ? { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
                  : undefined
            }
          />
          <span
            className="text-sm font-mono tracking-tight"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {label}
          </span>
        </motion.div>
      </AnimatePresence>

      {showDuration && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-label-lg font-mono tabular-nums"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          {formatDuration(duration)}
        </motion.span>
      )}
    </div>
  );
}
