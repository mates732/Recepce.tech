"use client";

import { useCallback, useRef, useState } from "react";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import type { VapiAssistantResponse } from "@/config/vapi";

interface AssistantConfigState {
  config: VapiAssistantResponse | null;
  loading: boolean;
  error: string | null;
}

/**
 * Sjednocené načítání konfigurace asistenta z API.
 * Pokrývá: HTTP chyby, síťové selhání a nevalidní odpověď (chybějící klíče).
 */
export function useAssistantConfig(locale: Locale) {
  const [state, setState] = useState<AssistantConfigState>({
    config: null,
    loading: false,
    error: null,
  });
  const requestSeq = useRef(0);

  const load = useCallback(
    async (slug: string): Promise<VapiAssistantResponse | null> => {
      const seq = ++requestSeq.current;
      setState({ config: null, loading: true, error: null });
      try {
        const res = await fetch(`/api/vapi/config/${encodeURIComponent(slug)}`);
        if (seq !== requestSeq.current) return null;
        if (!res.ok) {
          setState({ config: null, loading: false, error: t(locale, "ui.demoUnavailable") });
          return null;
        }
        const data: VapiAssistantResponse = await res.json();
        if (seq !== requestSeq.current) return null;
        if (!data?.assistantId || !data?.apiKey) {
          setState({ config: null, loading: false, error: t(locale, "ui.demoUnavailable") });
          return null;
        }
        setState({ config: data, loading: false, error: null });
        return data;
      } catch {
        if (seq !== requestSeq.current) return null;
        setState({ config: null, loading: false, error: t(locale, "ui.demoConfigFailed") });
        return null;
      }
    },
    [locale]
  );

  return { ...state, load };
}
