import { prisma } from '@/lib/db/prisma';
import { formatCurrency, calculateUsage } from '@/lib/billing/calculations';
import { Icon } from '@/components/shared/Icon';

interface UsageTabProps {
  client: {
    id: string;
    name: string;
    billing: {
      monthlyPrice: number;
      includedMinutes: number;
      overagePricePerMinute: number;
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
  };
  usagePeriods: Array<{
    id: string;
    periodStart: Date;
    periodEnd: Date;
    includedMinutes: number;
    usedMinutes: number;
    overageMinutes: number;
    overageAmount: number;
    estimatedTotal: number;
  }>;
}

export default function UsageTab({ client, usagePeriods }: UsageTabProps) {
  const billing = client.billing;
  const currentUsage = client.currentUsage;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-surface p-6">
        <h3 className="text-lg font-semibold text-ink mb-4">Aktuální období</h3>
        {client.currentPeriod && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-lg bg-surface-muted p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Zahrnuto</p>
                <p className="mt-1 text-xl font-semibold text-ink tabular-nums">{currentUsage.includedMinutes} min</p>
              </div>
              <div className="rounded-lg bg-surface-muted p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Využito</p>
                <p className="mt-1 text-xl font-semibold text-ink tabular-nums">{currentUsage.usedMinutes} min</p>
              </div>
              <div className="rounded-lg bg-surface-muted p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Nadlimit</p>
                <p className="mt-1 text-xl font-semibold text-ink tabular-nums">{currentUsage.overageMinutes} min</p>
              </div>
              <div className="rounded-lg bg-surface-muted p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Využití</p>
                <p className="mt-1 text-xl font-semibold text-ink tabular-nums">{currentUsage.usagePercentage}%</p>
              </div>
              <div className="rounded-lg bg-surface-muted p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Zbývá</p>
                <p className="mt-1 text-xl font-semibold text-ink tabular-nums">{currentUsage.minutesRemaining} min</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Odhadovaný účet</p>
                <p className="mt-1 text-2xl font-semibold text-ink tabular-nums">{formatCurrency(currentUsage.estimatedTotal)}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Nadlimit náklady</p>
                <p className="mt-1 text-lg font-medium text-ink">{formatCurrency(currentUsage.overageAmount)}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {billing && (
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="text-lg font-semibold text-ink mb-2">Plánované limity</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Měsíční cena</p>
              <p className="mt-1 font-medium text-ink">{formatCurrency(billing.monthlyPrice)}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Zahrnuto minut</p>
              <p className="mt-1 font-medium text-ink">{billing.includedMinutes}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Cena nadlimit</p>
              <p className="mt-1 font-medium text-ink">{formatCurrency(billing.overagePricePerMinute)}/min</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-ink mb-4">Historie období</h3>
        {usagePeriods.length === 0 ? (
          <p className="text-muted">Žádná historie období.</p>
        ) : (
          <div className="rounded-xl border border-border bg-surface overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" role="table">
                <thead>
                  <tr className="border-b border-border bg-surface-muted">
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Období</th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Využito</th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Nadlimit</th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Náklad nadlimit</th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Odhad celkem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {usagePeriods.map((period) => (
                    <tr key={period.id} className="hover:bg-surface-muted/50">
                      <td className="px-4 py-3 text-sm text-ink">
                        {new Date(period.periodStart).toLocaleDateString('cs-CZ')} — {new Date(period.periodEnd).toLocaleDateString('cs-CZ')}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-ink">{period.usedMinutes} min</td>
                      <td className="px-4 py-3 text-right tabular-nums text-ink">{period.overageMinutes} min</td>
                      <td className="px-4 py-3 text-right tabular-nums text-ink">{formatCurrency(period.overageAmount)}</td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums text-ink">{formatCurrency(period.estimatedTotal)}</td>
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