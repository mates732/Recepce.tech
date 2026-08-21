"use client";

import { useState } from "react";
import Link from "next/link";
import type { StoredLead, LeadStatus } from "@/lib/leadTypes";
import { LEAD_STATUSES } from "@/lib/leadTypes";

const STATUS_COLORS: Record<LeadStatus, string> = {
  New: "#FF4A2E",
  Contacted: "#9AA1AB",
  Meeting: "#FBBF24",
  Won: "#34D399",
  Lost: "#F87171",
};

const AREA_RULES: Record<string, Record<string, string>> = {
  tasks: {
    messages: "communication",
    reservations: "reception",
    search: "leads",
    reporting: "workflows",
    admin: "workflows",
  },
  channels: {
    phone: "communication",
    email: "communication",
    chat: "communication",
  },
  processes: {
    customer: "communication",
    orders: "reception",
    data: "workflows",
    outreach: "leads",
    support: "communication",
  },
};

const SYSTEM_MAP: Record<string, { name: string; reason: { cs: string; en: string } }> = {
  communication: { name: "Communication System", reason: { cs: "Vysoký objem zákaznické komunikace", en: "High communication workload" } },
  leads: { name: "Cortex", reason: { cs: "Ruční vyhledávání firem", en: "Manual lead research" } },
  workflows: { name: "Automation Systems", reason: { cs: "Opakující se interní úkoly", en: "Repetitive internal tasks" } },
  reception: { name: "Reception System", reason: { cs: "Rezervace mimo pracovní dobu", en: "Bookings outside office hours" } },
};

interface Props {
  locale: "cs" | "en";
  lead: StoredLead;
  labels: Record<string, { label: string; options: Record<string, string> }>;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("cs-CZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function LeadDetail({ locale, lead: initialLead, labels }: Props) {
  const isCs = locale === "cs";
  const [lead, setLead] = useState<StoredLead>(initialLead);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const updateStatus = async (status: LeadStatus) => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        setError(isCs ? "Nepodařilo se změnit status." : "Failed to update status.");
        return;
      }
      const data = (await res.json()) as { lead: StoredLead };
      setLead(data.lead);
    } catch {
      setError(isCs ? "Nepodařilo se změnit status." : "Failed to update status.");
    } finally {
      setBusy(false);
    }
  };

  const detectedAreas = new Set<string>();
  for (const [qid, optionIds] of Object.entries(lead.answers)) {
    const rules = AREA_RULES[qid];
    if (!rules) continue;
    for (const optId of optionIds) {
      const area = rules[optId];
      if (area) detectedAreas.add(area);
    }
  }

  const recommended = Array.from(detectedAreas).map((area) => SYSTEM_MAP[area]).filter(Boolean);

  return (
    <div>
      {error && (
        <p className="font-body text-sm mb-4" style={{ color: "#F87171" }}>
          {error}
        </p>
      )}

      {/* Status workflow */}
      <div
        className="rounded-xl p-5 mb-6"
        style={{ background: "#121316", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p className="font-mono text-label font-semibold tracking-[0.15em] uppercase mb-4" style={{ color: "#6E7683" }}>
          {isCs ? "Workflow" : "Workflow"}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {LEAD_STATUSES.map((status, i) => {
            const current = lead.status === status;
            const passed = LEAD_STATUSES.indexOf(lead.status) > i;
            const color = STATUS_COLORS[status];
            return (
              <div key={status} className="flex items-center gap-2">
                <button
                  onClick={() => updateStatus(status)}
                  disabled={busy}
                  className="font-mono text-label-sm font-semibold uppercase tracking-[0.12em] rounded-full px-3 py-1.5 transition-all duration-200 cursor-pointer"
                  style={{
                    color: current ? "#0A0A0B" : color,
                    background: current ? color : `${color}1A`,
                    border: `1px solid ${current ? color : `${color}40`}`,
                    opacity: busy ? 0.5 : 1,
                  }}
                >
                  {status}
                </button>
                {i < LEAD_STATUSES.length - 1 && (
                  <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.2)" }}>→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Company info */}
      <Section title={isCs ? "Firma" : "Company"}>
        <InfoRow label={isCs ? "Jméno" : "Name"} value={lead.name} />
        <InfoRow label="E-mail" value={lead.email} />
        <InfoRow label={isCs ? "Firma" : "Company"} value={lead.company} />
        {lead.website && <InfoRow label={isCs ? "Web" : "Website"} value={lead.website} />}
        {lead.companySize && <InfoRow label={isCs ? "Velikost firmy" : "Company size"} value={lead.companySize} />}
        {(lead.companyProfile?.industry || lead.companyProfile?.size) && (
          <InfoRow
            label={isCs ? "Profil firmy" : "Company profile"}
            value={[lead.companyProfile.industry, lead.companyProfile.size].filter(Boolean).join(" · ")}
          />
        )}
        {lead.challenge && <InfoRow label={isCs ? "Největší výzva" : "Biggest challenge"} value={lead.challenge} />}
        <InfoRow label={isCs ? "Vytvořeno" : "Created"} value={formatDate(lead.createdAt)} />
        <InfoRow
          label={isCs ? "Top příležitost" : "Top opportunity"}
          value={lead.topOpportunity || "—"}
        />
        {lead.selectedOpportunity && (
          <InfoRow label={isCs ? "Vybrána možnost" : "Selected opportunity"} value={lead.selectedOpportunity} />
        )}
        {lead.auditCompletionTime > 0 && (
          <InfoRow
            label={isCs ? "Čas auditu" : "Audit time"}
            value={`${(lead.auditCompletionTime / 1000).toFixed(0)} s`}
          />
        )}
      </Section>

      {/* Audit answers */}
      <Section title={isCs ? "Odpovědi auditu" : "Audit answers"}>
        {Object.keys(lead.answers).length === 0 ? (
          <p className="font-body text-sm" style={{ color: "#6E7683" }}>
            —
          </p>
        ) : (
          Object.entries(lead.answers).map(([qid, optionIds]) => {
            const q = labels[qid];
            const optionLabels = optionIds
              .map((oid) => q?.options[oid])
              .filter(Boolean);
            return (
              <InfoRow
                key={qid}
                label={q?.label ?? qid}
                value={optionLabels.join(", ") || optionIds.join(", ")}
              />
            );
          })
        )}
      </Section>

      {/* Opportunities */}
      <Section title={isCs ? "Příležitosti" : "Opportunities"}>
        {lead.opportunities.length === 0 ? (
          <p className="font-body text-sm" style={{ color: "#6E7683" }}>—</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {lead.opportunities.map((o) => (
              <span
                key={o}
                className="rounded-full px-3 py-1.5 font-mono text-label-sm"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#C7CDD6" }}
              >
                {o}
              </span>
            ))}
          </div>
        )}
      </Section>

      {/* Recommended systems */}
      <Section title={isCs ? "Doporučené systémy" : "Recommended systems"}>
        {recommended.length === 0 ? (
          <p className="font-body text-sm" style={{ color: "#6E7683" }}>—</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {recommended.map((system) => (
              <div
                key={system.name}
                className="rounded-xl px-4 py-3"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <p className="font-heading text-sm" style={{ color: "#F4F6F8" }}>
                  {system.name}
                </p>
                <p className="font-body text-xs mt-0.5" style={{ color: "#9AA1AB" }}>
                  {system.reason[locale]}
                </p>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Link
        href="/admin/leads"
        className="font-body text-sm inline-block mt-6 transition-colors duration-200 no-underline"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        ← {isCs ? "Zpět na leady" : "Back to leads"}
      </Link>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-5 mb-6"
      style={{ background: "#121316", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <p className="font-mono text-label font-semibold tracking-[0.15em] uppercase mb-4" style={{ color: "#6E7683" }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 border-t first:border-t-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <span className="font-mono text-label-sm tracking-[0.12em] uppercase" style={{ color: "#6E7683" }}>
        {label}
      </span>
      <span className="font-body text-sm" style={{ color: "#C7CDD6" }}>
        {value}
      </span>
    </div>
  );
}
