import "server-only";
import { sendTelegramMessage, escapeMarkdown } from "./telegram";
import { appendLead } from "./leadsStore";

export interface LeadSubmission {
  source: string;
  name: string;
  company: string;
  email: string;
  website: string;
  companySize: string;
  challenge: string;
  companyProfile: { industry: string; size: string };
  opportunities: string[];
  topOpportunity: string;
  selectedOpportunity: string;
  auditCompletionTime: number;
  answers: Record<string, string[]>;
  createdAt: string;
}

export type LeadResult =
  | { ok: true }
  | { ok: false; status: 400 | 500; error: string };

function sanitize(input: string): string {
  return input.trim().replace(/<[^>]*>/g, "").replace(/[<>]/g, "");
}

function sanitizeList(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item): item is string => typeof item === "string")
    .map(sanitize)
    .filter(Boolean)
    .slice(0, 20);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Sanitizuje a validuje lead. Vrací vyčištěná data nebo chybu. */
export function normalizeLeadSubmission(
  input: Partial<LeadSubmission>
): { ok: true; data: LeadSubmission } | { ok: false; error: string } {
  const profileRaw = (input.companyProfile ?? {}) as Partial<LeadSubmission["companyProfile"]>;

  const data: LeadSubmission = {
    source: sanitize(input.source ?? ""),
    name: sanitize(input.name ?? ""),
    company: sanitize(input.company ?? ""),
    email: sanitize(input.email ?? ""),
    website: sanitize(input.website ?? ""),
    companySize: sanitize(input.companySize ?? ""),
    challenge: sanitize(input.challenge ?? ""),
    companyProfile: {
      industry: sanitize(profileRaw.industry ?? ""),
      size: sanitize(profileRaw.size ?? ""),
    },
    opportunities: sanitizeList(input.opportunities),
    topOpportunity: sanitize(input.topOpportunity ?? ""),
    selectedOpportunity: sanitize(input.selectedOpportunity ?? ""),
    auditCompletionTime:
      typeof input.auditCompletionTime === "number" && Number.isFinite(input.auditCompletionTime)
        ? Math.max(0, Math.round(input.auditCompletionTime))
        : 0,
    answers: (() => {
      const raw = input.answers ?? {};
      const out: Record<string, string[]> = {};
      for (const [key, value] of Object.entries(raw)) {
        const cleaned = sanitizeList(value);
        if (cleaned.length > 0) out[sanitize(key)] = cleaned;
      }
      return out;
    })(),
    createdAt: sanitize(input.createdAt ?? new Date().toISOString()),
  };

  if (!data.name || !data.company || !data.email) {
    return { ok: false, error: "Name, company, and email are required." };
  }

  if (!isValidEmail(data.email)) {
    return { ok: false, error: "Invalid email address." };
  }

  return { ok: true, data };
}

function formatLeadMessage(lead: LeadSubmission, now = new Date()): string {
  const e = escapeMarkdown;
  const lines = [
    `🚀 *NOVÝ LEAD — SYSTÉMOVÝ AUDIT — RECEPCE.TECH*`,
    ``,
    `👤 *Jméno:*`,
    e(lead.name),
    ``,
    `🏢 *Firma:*`,
    e(lead.company),
    ``,
    `📧 *Email:*`,
    e(lead.email),
    ``,
    `🌐 *Web:*`,
    e(lead.website) || "—",
    ``,
    `👥 *Velikost firmy:*`,
    e(lead.companySize) || "—",
    ``,
    `🎯 *Největší výzva:*`,
    e(lead.challenge) || "—",
  ];

  const profileBits = [
    lead.companyProfile?.industry && `Obor: ${e(lead.companyProfile.industry)}`,
    lead.companyProfile?.size && `Velikost: ${e(lead.companyProfile.size)}`,
  ].filter(Boolean);
  if (profileBits.length > 0) {
    lines.push(``, `📇 *Profil firmy:*`, ...profileBits);
  }

  if (lead.opportunities.length > 0) {
    lines.push(``, `💡 *Příležitosti:*`, ...lead.opportunities.map((o) => `• ${e(o)}`));
  }
  if (lead.topOpportunity) {
    lines.push(``, `🏆 *Top příležitost:*`, e(lead.topOpportunity));
  }
  if (lead.selectedOpportunity) {
    lines.push(``, `👉 *Vybrána možnost:*`, e(lead.selectedOpportunity));
  }
  if (lead.auditCompletionTime > 0) {
    lines.push(
      ``,
      `⏱ *Čas dokončení auditu:*`,
      `${(lead.auditCompletionTime / 1000).toFixed(0)} s`
    );
  }

  if (Object.keys(lead.answers).length > 0) {
    lines.push(``, `📋 *Odpovědi auditu:*`);
    for (const [qid, values] of Object.entries(lead.answers)) {
      lines.push(`• ${e(qid)}: ${values.map(e).join(", ")}`);
    }
  }

  lines.push(
    ``,
    `🕒 *Čas:*`,
    now.toLocaleString("cs-CZ", { timeZone: "Europe/Prague" }),
    ``,
    `📡 *Zdroj:*`,
    e(lead.source) || "ai_audit"
  );

  return lines.join("\n");
}

/** Doménová logika leadů z AI auditu: validace + uložení + Telegram. */
export async function submitLead(
  input: Partial<LeadSubmission>
): Promise<LeadResult> {
  const normalized = normalizeLeadSubmission(input);
  if (!normalized.ok) {
    return { ok: false, status: 400, error: normalized.error };
  }

  try {
    await appendLead(normalized.data);
  } catch (error) {
    console.error("Lead store error:", error);
    return { ok: false, status: 500, error: "Failed to store lead." };
  }

  try {
    await sendTelegramMessage(formatLeadMessage(normalized.data));
  } catch (error) {
    // Lead je bezpečně uložený — Telegram je notifikační kanál.
    // Chyba nesmí vést ke ztrátě příležitosti.
    console.error("Telegram notify error:", error);
  }

  return { ok: true };
}
