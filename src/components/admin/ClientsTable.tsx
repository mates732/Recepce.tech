import Link from 'next/link';
import { formatCurrency, getUsageStatus } from '@/lib/billing/calculations';

interface ClientRow {
  id: string;
  name: string;
  slug: string;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  monthlyPrice: number;
  includedMinutes: number;
  overagePricePerMinute: number;
  usedMinutes: number;
  usagePercentage: number;
  usageStatus: ReturnType<typeof getUsageStatus>;
  overageMinutes: number;
  overageAmount: number;
  estimatedTotal: number;
  stripeStatus: 'connected' | 'not_connected';
  vapiStatus: 'connected' | 'not_connected';
  vapiAssistantId?: string | null;
  lastCall: { startedAt: Date; billableMinutes: number; vapiCost: number | null } | null;
}

interface ClientsTableProps {
  clients: ClientRow[];
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Aktivní',
  PAUSED: 'Pozastaven',
  CANCELLED: 'Zrušen',
};

const STATUS_CLASSES: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  PAUSED: 'bg-yellow-100 text-yellow-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const USAGE_STATUS_LABELS: Record<string, string> = {
  normal: 'Normální',
  warning: 'Varování',
  near_limit: 'Blízko limitu',
  overage: 'Nadlimit',
};

const USAGE_STATUS_CLASSES: Record<string, string> = {
  normal: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-yellow-100 text-yellow-700',
  near_limit: 'bg-orange-100 text-orange-700',
  overage: 'bg-red-100 text-red-700',
};

export default function ClientsTable({ clients }: ClientsTableProps) {
  if (clients.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface-muted p-12 text-center text-muted">
        Žádní klienti k zobrazení.
      </div>
    );
  }

  return (
    <section aria-labelledby="clients-heading" className="space-y-4">
      <h2 id="clients-heading" className="text-xl font-semibold text-ink">Klienti</h2>
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Klient</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Měsíční plán</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Využití</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Zahrnuto</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">%</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Nadlimit</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Odhad. celkem</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Stripe</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Vapi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-surface-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="font-medium text-ink hover:text-accent transition-colors"
                    >
                      {client.name}
                    </Link>
                    <p className="text-xs text-muted">{client.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_CLASSES[client.status]}`}>
                      {STATUS_LABELS[client.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink tabular-nums">{formatCurrency(client.monthlyPrice)}/měs</p>
                    <p className="text-xs text-muted">{client.includedMinutes} min zahrnuto</p>
                    <p className="text-xs text-muted">Nadlimit: {formatCurrency(client.overagePricePerMinute)}/min</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="font-medium text-ink tabular-nums">{client.usedMinutes} min</p>
                    {client.lastCall && (
                      <p className="text-xs text-muted">
                        Poslední: {new Date(client.lastCall.startedAt).toLocaleDateString('cs-CZ')}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink">
                    {client.includedMinutes} min
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${USAGE_STATUS_CLASSES[client.usageStatus]}`}>
                      {client.usagePercentage}%
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
                      client.stripeStatus === 'connected'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-surface-muted text-muted'
                    }`}>
                      {client.stripeStatus === 'connected' ? 'Připojeno' : 'Ne'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      client.vapiStatus === 'connected'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-surface-muted text-muted'
                    }`}>
                      {client.vapiStatus === 'connected' ? 'Připojeno' : 'Ne'}
                    </span>
                    {client.vapiAssistantId && (
                      <p className="mt-1 text-[10px] text-muted font-mono">{client.vapiAssistantId.slice(0, 8)}…</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}