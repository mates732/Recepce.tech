"use client";

import { motion } from "framer-motion";
import type { Locale } from "@/lib/types";
import { useVoiceAssistant } from "./useVoiceAssistant";
import VoiceButton from "./VoiceButton";
import VoiceStatus from "./VoiceStatus";

interface VoiceWidgetProps {
  assistantId: string;
  apiKey: string;
  locale: Locale;
}

function ListeningPulses() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            width: 72,
            height: 72,
            border: "1px solid rgba(34,197,94,0.15)",
          }}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: [1, 1.15], opacity: [0.6, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            delay: i * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

function SpeakingRings() {
  return (
    <>
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            width: 72,
            height: 72,
            border: "1px solid rgba(34,197,94,0.12)",
          }}
          animate={{
            scale: [1, 1.2],
            opacity: [0.5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            delay: i * 1,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

function ConnectingRing() {
  return (
    <motion.svg
      className="absolute"
      width={88}
      height={88}
      viewBox="0 0 88 88"
      fill="none"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
    >
      <circle cx="44" cy="44" r="40" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
      <path
        d="M44 4a40 40 0 0 1 40 40"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

export default function VoiceWidget({ assistantId, apiKey, locale }: VoiceWidgetProps) {
  const { state, error, duration, start, stop, retry } = useVoiceAssistant({
    assistantId,
    apiKey,
    locale,
  });

  const handleClick = () => {
    if (state === "idle" || state === "error") {
      if (state === "error") retry();
      else start();
    } else {
      stop();
    }
  };

  const isActive = state === "listening" || state === "speaking";

  return (
    <motion.div
      layout
      className="relative flex flex-col items-center gap-5 sm:gap-6 select-none"
      style={{
        padding: "clamp(24px, 3vw, 40px) clamp(20px, 3vw, 48px)",
        background: "#121316",
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      animate={
        isActive
          ? { boxShadow: "0 8px 32px rgba(34,197,94,0.06), 0 2px 8px rgba(255,255,255,0.03)" }
          : { boxShadow: "0 4px 24px rgba(255,255,255,0.04), 0 1px 4px rgba(255,255,255,0.02)" }
      }
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {state === "speaking" && (
        <motion.div
          className="absolute inset-0 rounded-[20px] pointer-events-none"
          style={{ border: "1px solid rgba(34,197,94,0.08)" }}
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        />
      )}

      <div className="relative flex items-center justify-center" style={{ width: 88, height: 88 }}>
        {state === "connecting" && <ConnectingRing />}
        {state === "listening" && <ListeningPulses />}
        {state === "speaking" && <SpeakingRings />}
        <VoiceButton state={state} onClick={handleClick} locale={locale} />
      </div>

      <VoiceStatus state={state} error={error} duration={duration} locale={locale} />
    </motion.div>
  );
}
