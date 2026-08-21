import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { StoredLead, LeadStatus } from "@/lib/leadTypes";
import { LEAD_STATUSES, isLeadStatus } from "@/lib/leadTypes";

/**
 * Úložiště leadů z AI auditu — JSON soubor (git-ignored).
 * Rozhraní je připravené na výměnu za CRM / Supabase bez změny volajících.
 */

const LEADS_DIR = path.join(process.cwd(), "src", "content", "store");
const LEADS_FILE = path.join(LEADS_DIR, "leads.json");

export { LEAD_STATUSES, isLeadStatus };
export type { StoredLead, LeadStatus };

export async function readLeads(): Promise<StoredLead[]> {
  try {
    const raw = await fs.readFile(LEADS_FILE, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as StoredLead[]) : [];
  } catch {
    return [];
  }
}

export async function appendLead(
  lead: Omit<StoredLead, "id" | "status" | "updatedAt">
): Promise<StoredLead> {
  const leads = await readLeads();
  const stored: StoredLead = {
    ...lead,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    status: "New",
    updatedAt: lead.createdAt,
  };
  leads.push(stored);
  await fs.mkdir(LEADS_DIR, { recursive: true });
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2) + "\n", "utf8");
  return stored;
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<StoredLead | null> {
  const leads = await readLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index < 0) return null;
  leads[index] = { ...leads[index], status, updatedAt: new Date().toISOString() };
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2) + "\n", "utf8");
  return leads[index];
}
