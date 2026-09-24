import { prisma } from '@/lib/db/prisma';
import { Icon } from '@/components/shared/Icon';
import { Button } from '@/components/shared/Button';
import { formatCurrency } from '@/lib/billing/calculations';
import { useState } from 'react';

interface VapiTabProps {
  client: {
    id: string;
    name: string;
    vapiAssistant: {
      id: string;
      assistantId: string;
      phoneNumberId: string | null;
      status: string;
      lastWebhookAt: Date | null;
    } | null;
    billing: {
      monthlyPrice: number;
      includedMinutes: number;
      overagePricePerMinute: number;
    } | null;
  };
}

export default function VapiTab({ client }: VapiTabProps) {
  const [syncing, setSyncing] = useState(false);
  const assistant = client.vapiAssistant;

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await fetch(`/api/admin/clients/${client.id}/sync-vapi`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Synchronizace selhala');
      } else {
        window.location.reload();
      }
    } catch {
      alert('Chyba připojení k serveru');
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="space-y-6">
      {!assistant ? (
        <div className="rounded-xl border border-border bg-surface-muted p-8 text-center">
          <Icon name="phone-call" className="h-12 w-12 mx-auto text-muted mb-4" />
          <h3 className="text-lg font-semibold text-ink">Vapi asistent není připojen</h3>
          <p className="mt-2 text-muted">Připojte Vapi asistenta k tomuto klientovi.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="text-lg font-semibold text-ink mb-4">Asistent</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Asistent ID</p>
                  <p className="mt-1 font-mono text-sm text-ink">{assistant.assistantId}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Telefonní číslo</p>
                  <p className="mt-1 font-mono text-sm text-ink">{assistant.phoneNumberId ?? '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Stav</p>
                  <p className="mt-1 capitalize text-sm text-ink">{assistant.status}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Poslední webhook</p>
                  <p className="mt-1 text-sm text-ink">
                    {assistant.lastWebhookAt
                      ? new Date(assistant.lastWebhookAt).toLocaleString('cs-CZ')
                      : 'Žádný'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="text-lg font-semibold text-ink mb-4">Plán</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Měsíční cena</p>
                  <p className="mt-1 font-medium text-ink">{formatCurrency(client.billing?.monthlyPrice ?? 0)}/měs</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Zahrnuto minut</p>
                  <p className="mt-1 font-medium text-ink">{client.billing?.includedMinutes ?? 0} min</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Nadlimit</p>
                  <p className="mt-1 font-medium text-ink">{formatCurrency(client.billing?.overagePricePerMinute ?? 0)}/min</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSync} disabled={syncing}>
              <Icon name="zap" className="h-4 w-4" />
              {syncing ? 'Synchronizace…' : 'Syncnout z Vapi'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}