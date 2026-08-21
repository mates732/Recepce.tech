"use client";

/**
 * Lead capture abstraction — jeden bod, kudy procházejí kvalifikované
 * poptávky. Dnes posílá na /api/lead, zítra může jít do CRM,
 * Supabase nebo e-mailové automatizace beze změny volajících.
 */

export interface AuditLead {
  source: "ai_audit";
  name: string;
  company: string;
  email: string;
  website?: string;
  companySize?: string;
  challenge?: string;
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
  | { ok: false; error: string };

export async function trackLead(lead: AuditLead): Promise<LeadResult> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      return { ok: false, error: data.error ?? "Request failed." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error." };
  }
}
