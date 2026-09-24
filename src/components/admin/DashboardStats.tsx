import { formatCurrency } from '@/lib/billing/calculations';

interface DashboardStatsProps {
  stats: {
    totalClients: number;
    activeClients: number;
    pausedClients: number;
    cancelledClients: number;
    mrr: number;
    totalUsageMinutes: number;
    totalIncludedMinutes: number;
    totalOverageMinutes: number;
    totalOverageAmount: number;
    totalEstimatedRevenue: number;
    totalVapiCost: number;
    grossMargin: number;
    clientsNearLimit: number;
    clientsOverLimit: number;
  };
}

const STAT_CARDS: Array<{
  key: 'activeClients' | 'mrr' | 'totalUsageMinutes' | 'totalEstimatedRevenue' | 'totalVapiCost' | 'grossMargin' | 'clientsNearLimit' | 'clientsOverLimit';
  label: string;
  color: 'emerald' | 'blue' | 'purple' | 'indigo' | 'orange' | 'red';
  format?: 'currency' | 'number';
}> = [
  { key: 'activeClients', label: 'Aktivních klientů', color: 'emerald' },
  { key: 'mrr', label: 'MRR', color: 'blue', format: 'currency' },
  { key: 'totalUsageMinutes', label: 'Minut tohoto měsíce', color: 'purple', format: 'number' },
  { key: 'totalEstimatedRevenue', label: 'Odhadovaný výnos', color: 'indigo', format: 'currency' },
  { key: 'totalVapiCost', label: 'Vapi náklady', color: 'orange', format: 'currency' },
  { key: 'grossMargin', label: 'Hrubý marža', color: 'emerald', format: 'currency' },
  { key: 'clientsNearLimit', label: 'Blízko limitu (≥90%)', color: 'orange' },
  { key: 'clientsOverLimit', label: 'Nad limitem (≥100%)', color: 'red' },
];

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
      {STAT_CARDS.map((card) => {
        const value = stats[card.key as keyof typeof stats] as number;
        let formattedValue: string;

        if (card.format === 'currency') {
          formattedValue = formatCurrency(value);
        } else if (card.format === 'number') {
          formattedValue = new Intl.NumberFormat('cs-CZ').format(value);
        } else {
          formattedValue = String(value);
        }

        const colorClasses = {
          emerald: 'border-emerald-300 bg-emerald-50',
          blue: 'border-blue-300 bg-blue-50',
          purple: 'border-purple-300 bg-purple-50',
          indigo: 'border-indigo-300 bg-indigo-50',
          orange: 'border-orange-300 bg-orange-50',
          red: 'border-red-300 bg-red-50',
        }[card.color];

        return (
          <div
            key={card.key}
            className={`rounded-xl border ${colorClasses} p-5`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-ink tabular-nums">
              {formattedValue}
            </p>
          </div>
        );
      })}
    </div>
  );
}