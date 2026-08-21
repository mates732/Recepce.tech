/** Sdílené typy leadů — bez server-only direktivy, klientské i serverové použití. */

export const LEAD_STATUSES = ["New", "Contacted", "Meeting", "Won", "Lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface StoredLead {
  id: string;
  status: LeadStatus;
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
  updatedAt: string;
}

export function isLeadStatus(value: string): value is LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(value);
}
