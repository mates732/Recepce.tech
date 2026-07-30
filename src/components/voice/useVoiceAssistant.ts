"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Vapi from "@vapi-ai/web";

export type VoiceState = "idle" | "connecting" | "listening" | "speaking" | "error";

interface UseVoiceAssistantOptions {
  assistantId: string;
  apiKey: string;
}

export function useVoiceAssistant({ assistantId, apiKey }: UseVoiceAssistantOptions) {
  const [state, setState] = useState<VoiceState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const vapiRef = useRef<Vapi | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    setDuration(0);
    clearTimer();
    timerRef.current = setInterval(() => {
      setDuration(Math.floor((Date.now() - (startTimeRef.current ?? Date.now())) / 1000));
    }, 100);
  }, [clearTimer]);

  const cleanup = useCallback(() => {
    clearTimer();
    const v = vapiRef.current;
    vapiRef.current = null;
    startTimeRef.current = null;
    if (v) {
      v.removeAllListeners();
      try { v.stop(); } catch {}
    }
  }, [clearTimer]);

  const start = useCallback(async () => {
    if (!assistantId || !apiKey) {
      setError("Chybí konfigurace pro toto demo.");
      setState("error");
      return;
    }

    setState("connecting");
    setError(null);
    setDuration(0);

    try {
      const vapi = new Vapi(apiKey);
      vapiRef.current = vapi;

      vapi.on("call-start", () => {
        startTimer();
        setState("listening");
      });

      vapi.on("speech-start", () => {
        setState("speaking");
      });

      vapi.on("speech-end", () => {
        setState("listening");
      });

      vapi.on("call-end", () => {
        cleanup();
        setState("idle");
      });

      vapi.on("error", (e) => {
        cleanup();
        setError(e?.message || "Došlo k chybě spojení.");
        setState("error");
      });

      await vapi.start(assistantId);
    } catch (e) {
      cleanup();
      const message = e instanceof Error ? e.message : "Nepodařilo se připojit.";
      setError(message);
      setState("error");
    }
  }, [assistantId, apiKey, cleanup, startTimer]);

  const stop = useCallback(() => {
    cleanup();
    setState("idle");
    setError(null);
  }, [cleanup]);

  const retry = useCallback(() => {
    setError(null);
    start();
  }, [start]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return { state, error, duration, start, stop, retry };
}
