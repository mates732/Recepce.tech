import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { ContentKind } from "@/content/types";

/**
 * Audit změn — záznam o tom, kdo, co a kdy změnil.
 *
 * Budoucí admin workflow volá recordAuditEvent() při každé obsahové akci.
 * Storage je JSONL soubor (git-trackovaný); rozhraní je připravené na
 * pozdější výměnu za databázi bez změny volajících.
 */

export const AUDIT_ACTIONS = [
  "create",
  "update",
  "publish",
  "unpublish",
  "archive",
  "restore",
  "delete",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export interface AuditEvent {
  id: string;
  timestamp: string; // ISO
  actor: string; // kdo — "admin", budoucí uživatelské identity
  action: AuditAction; // co
  entityKind: ContentKind; // relevantní entita
  entityId: string;
  summary: string; // lidsky čitelný popis změny (cs)
  details?: Record<string, unknown>; // např. changedFields, before/after
}

const AUDIT_DIR = path.join(process.cwd(), "src", "content", "audit");
const AUDIT_FILE = path.join(AUDIT_DIR, "audit.jsonl");

function isValidKind(kind: unknown): kind is ContentKind {
  return kind === "project" || kind === "profession" || kind === "page" || kind === "site";
}

export async function recordAuditEvent(
  input: Omit<AuditEvent, "id" | "timestamp">
): Promise<AuditEvent> {
  if (!isValidKind(input.entityKind)) {
    throw new Error(`Invalid entityKind: ${String(input.entityKind)}`);
  }
  if (!AUDIT_ACTIONS.includes(input.action)) {
    throw new Error(`Invalid action: ${String(input.action)}`);
  }
  if (!input.entityId || !input.summary || !input.actor) {
    throw new Error("entityId, summary and actor are required");
  }

  const event: AuditEvent = {
    ...input,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
  };

  await fs.mkdir(AUDIT_DIR, { recursive: true });
  await fs.appendFile(AUDIT_FILE, JSON.stringify(event) + "\n", "utf8");
  return event;
}

export async function listAuditEvents(
  options: {
    entityKind?: ContentKind;
    entityId?: string;
    actor?: string;
    limit?: number;
  } = {}
): Promise<AuditEvent[]> {
  let content: string;
  try {
    content = await fs.readFile(AUDIT_FILE, "utf8");
  } catch {
    return [];
  }

  const events = content
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      try {
        return JSON.parse(line) as AuditEvent;
      } catch {
        return null;
      }
    })
    .filter((event): event is AuditEvent => event !== null);

  const filtered = events.filter(
    (event) =>
      (!options.entityKind || event.entityKind === options.entityKind) &&
      (!options.entityId || event.entityId === options.entityId) &&
      (!options.actor || event.actor === options.actor)
  );

  return filtered
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, options.limit ?? 50);
}
