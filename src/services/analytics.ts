import "server-only";
import { promises as fs } from "fs";
import path from "path";

/**
 * Úložiště konverzních eventů — JSONL soubor, git-ignored.
 * Rozhraní je připravené na výměnu za databázi bez změny volajících.
 */

const ANALYTICS_DIR = path.join(process.cwd(), "src", "content", "store");
const ANALYTICS_FILE = path.join(ANALYTICS_DIR, "analytics.jsonl");

export interface AnalyticsEvent {
  id: string;
  event: string;
  sessionId: string;
  timestamp: string; // ISO
  meta: Record<string, string | number>;
}

const ALLOWED_EVENTS = new Set([
  "ai_audit_started",
  "ai_audit_completed",
  "ai_audit_report_viewed",
  "lead_form_opened",
  "lead_submitted",
]);

function sanitize(value: unknown, max = 200): string {
  if (typeof value !== "string") return "";
  return value.replace(/[<>]/g, "").slice(0, max);
}

export async function recordEvent(
  event: string,
  sessionId: string,
  meta: Record<string, unknown>
): Promise<boolean> {
  if (!ALLOWED_EVENTS.has(event)) return false;
  if (!sessionId) return false;

  const record: AnalyticsEvent = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    event,
    sessionId: sanitize(sessionId, 100),
    timestamp: new Date().toISOString(),
    meta: Object.fromEntries(
      Object.entries(meta)
        .filter(([, v]) => typeof v === "string" || typeof v === "number")
        .map(([k, v]) => [sanitize(k, 60), typeof v === "string" ? sanitize(v) : v])
    ) as Record<string, string | number>,
  };

  try {
    await fs.mkdir(ANALYTICS_DIR, { recursive: true });
    await fs.appendFile(ANALYTICS_FILE, JSON.stringify(record) + "\n", "utf8");
    return true;
  } catch {
    return false;
  }
}

/** Přečte všechny eventy (pro admin funnel přehled). */
export async function readEvents(): Promise<AnalyticsEvent[]> {
  try {
    const raw = await fs.readFile(ANALYTICS_FILE, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as AnalyticsEvent;
        } catch {
          return null;
        }
      })
      .filter((e): e is AnalyticsEvent => e !== null);
  } catch {
    return [];
  }
}
