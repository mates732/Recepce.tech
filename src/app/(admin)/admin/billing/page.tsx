'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/shared/Icon';
import { Button } from '@/components/shared/Button';
import { formatCurrency, getUsageStatus } from '@/lib/billing/calculations';

interface Client {
  id: string;
  name: string;
  slug: string;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  monthlyPrice: number;
  includedMinutes: number;
  overagePricePerMinute: number;
  usedMinutes: number;
  usagePercentage: number;
  overageMinutes: number;
  overageAmount: number;
  estimatedTotal: number;
  stripeStatus: 'connected' | 'not_connected';
  vapiStatus: 'connected' | 'not_connected';
  createdAt: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/clients')
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12 text-muted">
        Načítání klientů…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink">Fakturace</h1>
          <p className="mt-1 text-muted">Klienti, Vapi asistenti a předplatná (Stripe)</p>
        </div>
        <Link href="/admin/billing/clients/new">
          <Button>
            <Icon name="user-check" className="h-4 w-4" />
            Nový klient
          </Button>
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface-muted p-12 text-center text-muted">
          <Icon name="user" className="h-12 w-12 mx-auto mb-4 text-muted" />
          <p className="text-lg">Žádní klienti</p>
          <p className="mt-2">Vytvořte svého prvního klienta.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Klient</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Status</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Plán</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Využití</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">%</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Nadlimit</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Odhad</th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Stripe</th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Vapi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clients.map((client) => {
                  const status = getUsageStatus(client.usagePercentage);
                  return (
                    <tr key={client.id} className="hover:bg-surface-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/admin/billing/clients/${client.id}`} className="font-medium text-ink hover:text-accent transition-colors">
                          {client.name}
                        </Link>
                        <p className="text-xs text-muted">{client.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          client.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                          client.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {client.status === 'ACTIVE' ? 'Aktivní' : client.status === 'PAUSED' ? 'Pozastaven' : 'Zrušen'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="font-medium text-ink tabular-nums">{formatCurrency(client.monthlyPrice)}/měs</p>
                        <p className="text-xs text-muted">{client.includedMinutes} min</p>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-ink">{client.usedMinutes} min</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          status === 'normal' ? 'bg-emerald-100 text-emerald-700' :
                          status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                          status === 'near_limit' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {client.usagePercentage}% — {status === 'normal' ? 'Normální' : status === 'warning' ? 'Varování' : status === 'near_limit' ? 'Blízko limitu' : 'Nadlimit'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="font-medium text-ink tabular-nums">{client.overageMinutes} min</p>
                        {client.overageMinutes > 0 && (
                          <p className="text-xs text-muted">{formatCurrency(client.overageAmount)}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-ink tabular-nums">
                        {formatCurrency(client.estimatedTotal)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          client.stripeStatus === 'connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-surface-muted text-muted'
                        }`}>
                          {client.stripeStatus === 'connected' ? 'Připojeno' : 'Ne'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          client.vapiStatus === 'connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-surface-muted text-muted'
                        }`}>
                          {client.vapiStatus === 'connected' ? 'Připojeno' : 'Ne'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}