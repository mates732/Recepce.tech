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

interface Props {
  locale: "cs" | "en";
  leads: StoredLead[];
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

export default function LeadsManager({ locale, leads: initialLeads }: Props) {
  const isCs = locale === "cs";
  const [leads, setLeads] = useState<StoredLead[]>(initialLeads);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const updateStatus = async (id: string, status: LeadStatus) => {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        setError(isCs ? "Nepodařilo se změnit status." : "Failed to update status.");
        return;
      }
      const data = (await res.json()) as { lead: StoredLead };
      setLeads((prev) => prev.map((l) => (l.id === id ? data.lead : l)));
    } catch {
      setError(isCs ? "Nepodařilo se změnit status." : "Failed to update status.");
    } finally {
      setBusyId(null);
    }
  };

  if (leads.length === 0) {
    return (
      <div
        className="rounded-2xl p-10 text-center"
        style={{ border: "1px dashed rgba(255,255,255,0.15)" }}
      >
        <p className="font-body text-sm" style={{ color: "#9AA1AB" }}>
          {isCs
            ? "Zatím žádné leady. Když někdo dokončí audit a pošle formulář, objeví se tady."
            : "No leads yet. When someone completes the audit and submits the form, they will appear here."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <p className="font-body text-sm mb-4" style={{ color: "#F87171" }}>
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="rounded-xl p-5"
            style={{ background: "#121316", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <Link
                href={`/admin/leads/${lead.id}`}
                className="block no-underline"
              >
                <p className="font-heading text-base" style={{ color: "#F4F6F8" }}>
                  {lead.company}
                </p>
                <p className="font-body text-sm mt-0.5" style={{ color: "#9AA1AB" }}>
                  {lead.name} · {lead.email}
                </p>
                <p className="font-mono text-label mt-1.5" style={{ color: "#6E7683", letterSpacing: "0.1em" }}>
                  {formatDate(lead.createdAt)} · {lead.source === "ai_audit" ? "Systems Audit" : lead.source}
                </p>
              </Link>

              <div className="flex flex-col items-end gap-2">
                <span
                  className="rounded-full px-2.5 py-1 font-mono text-label-sm font-semibold uppercase tracking-[0.12em]"
                  style={{
                    color: STATUS_COLORS[lead.status],
                    background: `${STATUS_COLORS[lead.status]}1A`,
                    border: `1px solid ${STATUS_COLORS[lead.status]}40`,
                  }}
                >
                  {lead.status}
                </span>
                <select
                  value={lead.status}
                  disabled={busyId === lead.id}
                  onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                  className="font-mono text-label-sm bg-transparent outline-none transition-opacity duration-200 cursor-pointer"
                  style={{ color: "#9AA1AB", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "6px 10px", opacity: busyId === lead.id ? 0.5 : 1 }}
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s} style={{ background: "#17181D", color: "#F4F6F8" }}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {lead.opportunities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {lead.opportunities.map((o) => (
                  <span
                    key={o}
                    className="rounded-full px-2.5 py-1 font-mono text-label-sm"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#C7CDD6" }}
                  >
                    {o}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
