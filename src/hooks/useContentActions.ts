"use client";

import { useState } from "react";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import type { ContentItem, ContentKind } from "@/content/types";

export type ActionStatus = "idle" | "saving" | "publishing";

/**
 * Sdílené mutační akce obsahu: uložení draftu, publikace, zahození.
 * Vše přes auth-gated API; draft nikdy nemění produkci.
 */
export function useContentActions(kind: ContentKind, id: string, locale: Locale) {
  const [status, setStatus] = useState<ActionStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const saveDraft = async (item: ContentItem): Promise<boolean> => {
    setStatus("saving");
    setServerErrors([]);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/content/${kind}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setServerErrors(Array.isArray(data?.details) ? data.details : [data?.error ?? "error"]);
        setStatus("idle");
        return false;
      }
      setMessage(t(locale, "admin.saved"));
      setStatus("idle");
      return true;
    } catch {
      setServerErrors([t(locale, "ui.demoConfigFailed")]);
      setStatus("idle");
      return false;
    }
  };

  const publish = async (): Promise<boolean> => {
    setStatus("publishing");
    setServerErrors([]);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/content/${kind}/${id}/publish`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setServerErrors([data?.error ?? "error"]);
        setStatus("idle");
        return false;
      }
      setMessage(t(locale, "admin.publishedNow"));
      setStatus("idle");
      return true;
    } catch {
      setServerErrors([t(locale, "ui.demoConfigFailed")]);
      setStatus("idle");
      return false;
    }
  };

  const discard = async (): Promise<boolean> => {
    setStatus("saving");
    setServerErrors([]);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/content/${kind}/${id}/discard`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setServerErrors([data?.error ?? "error"]);
        setStatus("idle");
        return false;
      }
      setMessage(t(locale, "admin.discarded"));
      setStatus("idle");
      return true;
    } catch {
      setServerErrors([t(locale, "ui.demoConfigFailed")]);
      setStatus("idle");
      return false;
    }
  };

  const clearMessages = () => {
    setMessage(null);
    setServerErrors([]);
  };

  return { status, message, serverErrors, saveDraft, publish, discard, clearMessages };
}
