import { formatCurrency } from '@/lib/billing/calculations';
import { Icon } from '@/components/shared/Icon';
import { Button } from '@/components/shared/Button';
import Link from 'next/link';

interface OverviewTabProps {
  client: {
    id: string;
    name: string;
    slug: string;
    contactName: string | null;
    contactEmail: string | null;
    status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
    createdAt: Date;
    updatedAt: Date;
    billing: {
      id: string;
      currency: string;
      monthlyPrice: number;
      includedMinutes: number;
      overagePricePerMinute: number;
      stripeCustomerId: string | null;
      stripeSubscriptionId: string | null;
      billingPeriodStart: Date | null;
      billingPeriodEnd: Date | null;
    } | null;
    vapiAssistant: {
      id: string;
      assistantId: string;
      phoneNumberId: string | null;
      status: string;
      lastWebhookAt: Date | null;
    } | null;
    currentPeriod: { start: Date; end: Date } | null;
    currentUsage: {
      includedMinutes: number;
      usedMinutes: number;
      overageMinutes: number;
      overageAmount: number;
      estimatedTotal: number;
      usagePercentage: number;
      minutesRemaining: number;
    };
    totalCalls: number;
    totalMinutes: number;
    totalVapiCost: number;
  };
}

export default function OverviewTab({ client }: OverviewTabProps) {
  const billing = client.billing;
  const usage = client.currentUsage;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface-muted p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Status</p>
          <p className="mt-2 text-lg font-semibold text-ink capitalize">{client.status}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-muted p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Kontakt</p>
          <p className="mt-2 text-lg font-medium text-ink">{client.contactName ?? '—'}</p>
          <p className="text-sm text-muted">{client.contactEmail ?? '—'}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-muted p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Vytvořeno</p>
          <p className="mt-2 text-lg font-medium text-ink">
            {new Date(client.createdAt).toLocaleDateString('cs-CZ')}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <h3 className="text-lg font-semibold text-ink mb-4">Aktuální fakturační období</h3>
        {client.currentPeriod ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Zahrnuto</p>
                <p className="mt-1 text-2xl font-semibold text-ink tabular-nums">{usage.includedMinutes} min</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Využito</p>
                <p className="mt-1 text-2xl font-semibold text-ink tabular-nums">{usage.usedMinutes} min</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Zbývá</p>
                <p className="mt-1 text-2xl font-semibold text-ink tabular-nums">{usage.minutesRemaining} min</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Využití</p>
                <p className="mt-1 text-2xl font-semibold text-ink tabular-nums">{usage.usagePercentage}%</p>
              </div>
            </div>

            {usage.overageMinutes > 0 && (
              <div className="mt-4 rounded-lg bg-orange-50 border border-orange-200 p-4">
                <p className="text-sm font-medium text-orange-700">
                  Nadlimit: {usage.overageMinutes} min ({formatCurrency(usage.overageAmount)})
                </p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Odhadovaný celkový účet</p>
                <p className="mt-1 text-3xl font-semibold text-ink tabular-nums">{formatCurrency(usage.estimatedTotal)}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Období</p>
                <p className="mt-1 text-sm text-ink">
                  {client.currentPeriod.start.toLocaleDateString('cs-CZ')} — {client.currentPeriod.end.toLocaleDateString('cs-CZ')}
                </p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-muted">Aktuální fakturační období není nastaveno.</p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="phone-call" className="h-5 w-5 text-accent" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Celkové hovory</p>
          </div>
          <p className="text-2xl font-semibold text-ink tabular-nums">{client.totalCalls}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="clock" className="h-5 w-5 text-accent" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Celkem minut</p>
          </div>
          <p className="text-2xl font-semibold text-ink tabular-nums">{client.totalMinutes}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="zap" className="h-5 w-5 text-accent" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Vapi náklady</p>
          </div>
          <p className="text-2xl font-semibold text-ink tabular-nums">{formatCurrency(client.totalVapiCost)}</p>
        </div>
      </div>

      {billing && (
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="text-lg font-semibold text-ink mb-4">Platba</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Měsíční plán</p>
              <p className="mt-1 font-medium text-ink">{formatCurrency(billing.monthlyPrice)}/měs</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Nadlimit</p>
              <p className="mt-1 font-medium text-ink">{formatCurrency(billing.overagePricePerMinute)}/min</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Stripe zákazník</p>
              <p className="mt-1 font-mono text-xs text-ink">{billing.stripeCustomerId ?? '—'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Stripe předplatné</p>
              <p className="mt-1 font-mono text-xs text-ink">{billing.stripeSubscriptionId ?? '—'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}