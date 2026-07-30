"use client";

import type { VoiceState } from "./useVoiceAssistant";
import { motion } from "framer-motion";

interface VoiceButtonProps {
  state: VoiceState;
  onClick: () => void;
  disabled?: boolean;
}

function MicIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function MicActiveIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

export default function VoiceButton({ state, onClick, disabled }: VoiceButtonProps) {
  const isIdle = state === "idle";
  const isLoading = state === "connecting";
  const isActive = state === "listening" || state === "speaking";

  const size = isIdle ? 72 : 64;
  const bg = isIdle ? "rgba(17,17,17,0.03)" : isActive ? "rgba(34,197,94,0.08)" : "rgba(17,17,17,0.05)";
  const border = isIdle ? "rgba(17,17,17,0.08)" : isActive ? "rgba(34,197,94,0.2)" : "rgba(17,17,17,0.08)";
  const color = isIdle ? "rgba(17,17,17,0.5)" : isActive ? "#22C55E" : "rgba(17,17,17,0.5)";

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isLoading}
      style={{ width: size, height: size, background: bg, border: `1px solid ${border}`, color }}
      className="relative flex items-center justify-center rounded-full cursor-pointer select-none outline-none"
      animate={
        isIdle
          ? { scale: [1, 1.03, 1] }
          : { scale: 1 }
      }
      transition={
        isIdle
          ? { repeat: Infinity, duration: 3, ease: "easeInOut" }
          : { duration: 0 }
      }
      whileHover={isIdle ? { scale: 1.05, boxShadow: "0 8px 24px rgba(17,17,17,0.08)" } : undefined}
      whileTap={isIdle ? { scale: 0.97, transition: { duration: 0.12 } } : undefined}
      aria-label={
        isIdle ? "Zahájit hovor" : isActive ? "Ukončit hovor" : isLoading ? "Připojování" : "Zkusit znovu"
      }
    >
      {isLoading ? (
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="absolute"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity={0.12} />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={0.5} />
        </motion.svg>
      ) : isActive ? (
        <MicActiveIcon />
      ) : (
        <MicIcon />
      )}
    </motion.button>
  );
}
