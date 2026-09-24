'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/billing/calculations';
import { Icon } from '@/components/shared/Icon';
import { Button } from '@/components/shared/Button';

interface Call {
  id: string;
  vapiCallId: string;
  startedAt: Date;
  endedAt: Date | null;
  durationSeconds: number | null;
  billableMinutes: number;
  vapiCost: number | null;
  status: string;
  metadata: any;
}

interface CallsTabProps {
  calls: Call[];
}

const STATUS_LABELS: Record<string, string> = {
  ENDED: 'Ukončen',
  ONGOING: 'Probíhá',
  FAILED: 'Selhal',
  MISSED: 'Nevzato',
};

const STATUS_CLASSES: Record<string, string> = {
  ENDED: 'bg-emerald-100 text-emerald-700',
  ONGOING: 'bg-blue-100 text-blue-700',
  FAILED: 'bg-red-100 text-red-700',
  MISSED: 'bg-gray-100 text-gray-700',
};

export default function CallsTab({ calls: initialCalls }: CallsTabProps) {
  const [calls, setCalls] = useState(initialCalls);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCalls(initialCalls);
  }, [initialCalls]);

  async function loadMore() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/clients/${calls[calls.length - 1]?.id}/calls?offset=${calls.length}`);
      if (res.ok) {
        const more = await res.json();
        setCalls((prev) => [...prev, ...more]);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  if (calls.length === 0) {
    return (
      <div className="text-center py-12 text-muted">
        <Icon name="phone-call" className="h-10 w-10 mx-auto mb-3 text-muted" />
        <p>Žádné hovory.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Datum</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Vapi Call ID</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Trvání</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Minuty</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Vapi cena</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Status</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Transkript</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Nahrávka</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {calls.map((call) => {
                const metadata = call.metadata ?? {};
                const hasTranscript = metadata.transcript !== 'unavailable';
                const hasRecording = metadata.recordingUrl;

                return (
                  <tr key={call.id} className="hover:bg-surface-muted/50">
                    <td className="px-4 py-3 text-sm text-ink whitespace-nowrap">
                      {new Date(call.startedAt).toLocaleString('cs-CZ')}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">{call.vapiCallId.slice(0, 12)}…</td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink">
                      {call.durationSeconds ? `${call.durationSeconds}s` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink">{call.billableMinutes}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink">
                      {call.vapiCost !== null ? formatCurrency(call.vapiCost) : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_CLASSES[call.status] ?? 'bg-gray-100 text-gray-700'}`}>
                        {STATUS_LABELS[call.status] ?? call.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {hasTranscript ? (
                        <span className="text-emerald-600 text-sm">
                          <Icon name="check-circle" className="h-4 w-4 inline" />
                        </span>
                      ) : (
                        <span className="text-muted text-sm">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {hasRecording ? (
                        <a
                          href={metadata.recordingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent-hover text-sm underline underline-offset-2"
                        >
                          Zobrazit
                        </a>
                      ) : (
                        <span className="text-muted text-sm">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {calls.length >= 50 && (
        <div className="text-center">
          <Button onClick={loadMore} disabled={loading} variant="secondary">
            {loading ? 'Načítání…' : 'Načíst více'}
          </Button>
        </div>
      )}
    </div>
  );
}