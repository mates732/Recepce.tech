import Link from 'next/link';
import { formatCurrency } from '@/lib/billing/calculations';
import { Icon } from '@/components/shared/Icon';
import { Button } from '@/components/shared/Button';

interface BillingEvent {
  id: string;
  type: string;
  amount: number;
  stripeEventId: string | null;
  status: string;
  metadata: any;
  createdAt: Date;
}

interface BillingTabProps {
  client: {
    id: string;
    name: string;
    billing: {
      id: string;
      currency: string;
      monthlyPrice: number;
      includedMinutes: number;
      overagePricePerMinute: number;
      stripeCustomerId: string | null;
      stripeSubscriptionId: string | null;
      stripeSubscriptionItemId: string | null;
      billingPeriodStart: Date | null;
      billingPeriodEnd: Date | null;
    } | null;
    currentUsage: {
      overageAmount: number;
      estimatedTotal: number;
    };
  };
  billingEvents: BillingEvent[];
}

const TYPE_LABELS: Record<string, string> = {
  SUBSCRIPTION_BASE: 'Předplatné (základní)',
  OVERAGE: 'Nadlimit',
  SETUP_FEE: 'Jednorázový poplatek',
  ADJUSTMENT: 'Úprava',
  REFUND: 'Vrácení',
};

const EVENT_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Čeká',
  CREATED: 'Vytvořeno',
  BILLED: 'Fakturováno',
  FAILED: 'Selhalo',
  VOIDED: 'Zrušeno',
};

export default function BillingTab({ client, billingEvents }: BillingTabProps) {
  const billing = client.billing;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="text-lg font-semibold text-ink mb-4">Stripe</h3>
          <div className="space-y-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Zákazník</p>
              <p className="mt-1 font-mono text-sm text-ink">{billing?.stripeCustomerId ?? '—'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Předplatné</p>
              <p className="mt-1 font-mono text-sm text-ink">{billing?.stripeSubscriptionId ?? '—'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Období</p>
              <p className="mt-1 text-sm text-ink">
                {billing?.billingPeriodStart && billing?.billingPeriodEnd
                  ? `${new Date(billing.billingPeriodStart).toLocaleDateString('cs-CZ')} — ${new Date(billing.billingPeriodEnd).toLocaleDateString('cs-CZ')}`
                  : '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="text-lg font-semibold text-ink mb-4">Souhrn</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted">Základní předplatné</span>
              <span className="font-medium text-ink">{formatCurrency(client.billing?.monthlyPrice ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Nadlimit</span>
              <span className="font-medium text-ink">{formatCurrency(client.currentUsage.overageAmount)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-border">
              <span className="font-semibold text-ink">Odhad celkem</span>
              <span className="font-semibold text-ink tabular-nums text-lg">{formatCurrency(client.currentUsage.estimatedTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {billing?.stripeCustomerId && (
        <div className="flex gap-3">
          <Button
            href={`https://dashboard.stripe.com/customers/${billing.stripeCustomerId}`}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
          >
            <Icon name="lock" className="h-4 w-4" />
            Otevřít ve Stripe
          </Button>
          {billing.stripeSubscriptionId && (
            <Button
              href={`https://dashboard.stripe.com/subscriptions/${billing.stripeSubscriptionId}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
            >
              <Icon name="lock" className="h-4 w-4" />
              Předplatné ve Stripe
            </Button>
          )}
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-ink mb-4">Historie fakturace</h3>
        {billingEvents.length === 0 ? (
          <p className="text-muted">Žádné fakturační události.</p>
        ) : (
          <div className="rounded-xl border border-border bg-surface overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" role="table">
                <thead>
                  <tr className="border-b border-border bg-surface-muted">
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Typ</th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Částka</th>
                    <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Stav</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Stripe Event</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Datum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {billingEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-surface-muted/50">
                      <td className="px-4 py-3 text-sm text-ink">{TYPE_LABELS[event.type] ?? event.type}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-ink">{formatCurrency(event.amount)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-surface-muted text-muted">
                          {EVENT_STATUS_LABELS[event.status] ?? event.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted">{event.stripeEventId ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-ink whitespace-nowrap">
                        {new Date(event.createdAt).toLocaleString('cs-CZ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}