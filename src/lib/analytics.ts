"use client";

/**
 * Konverzní analytika — lehký event tracking bez externího nástroje.
 * Eventy se posílají na /api/track a ukládají se serverově.
 */

export type AuditEventName =
  | "ai_audit_started"
  | "ai_audit_completed"
  | "ai_audit_report_viewed"
  | "lead_form_opened"
  | "lead_submitted";

let sessionId: string | null = null;

export function getSessionId(): string {
  if (sessionId) return sessionId;
  try {
    sessionId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  } catch {
    sessionId = `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
  return sessionId;
}

export async function trackEvent(
  event: AuditEventName,
  meta?: Record<string, string | number | undefined>
): Promise<void> {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        sessionId: getSessionId(),
        meta: meta ?? {},
      }),
    });
  } catch {
    // Analytics nikdy nesmí rozbít uživatelský flow.
  }
}
