import { AreaChart, BarChart, DonutChart } from '@/components/admin/charts';
import { Badge, PageHeader, SectionCard, StatCard } from '@/components/admin/ui';
import { CALLS_DAILY, OUTCOME_BREAKDOWN, OPS_CONVERSATIONS } from '@/data/ops';
import { formatDuration, formatShortDateTimeCz } from '@/lib/format';
import { outcomeLabel, outcomeTone } from '@/lib/opsLabels';

export const metadata = {
  title: 'Analytika — Recepce.tech Admin',
};

const OUTCOME_COLORS: Record<string, string> = {
  question_answered: 'var(--color-accent)',
  reservation_created: 'var(--color-accent-hover)',
  reservation_changed: 'var(--color-panel-edge)',
  info_only: 'var(--color-muted)',
  human_handoff: 'var(--color-border)',
  no_response: 'var(--color-surface-muted)',
  failed: 'var(--color-faint)',
};

export default function AnalyticsPage() {
  const fmtDay = new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric' });

  const callsSeries = CALLS_DAILY.map((d) => ({
    label: fmtDay.format(new Date(d.date)),
    value: d.calls,
  }));

  const minutesSeries = CALLS_DAILY.map((d) => ({
    label: fmtDay.format(new Date(d.date)),
    value: d.minutes,
  }));

  const totalCalls = CALLS_DAILY.reduce((s, d) => s + d.calls, 0);
  const totalMinutes = CALLS_DAILY.reduce((s, d) => s + d.minutes, 0);

  const withDuration = OPS_CONVERSATIONS.filter((c) => c.durationSec > 0);
  const avgDuration =
    withDuration.length > 0
      ? withDuration.reduce((s, c) => s + c.durationSec, 0) / withDuration.length
      : 0;

  const resolved = OPS_CONVERSATIONS.filter((c) => c.status === 'resolved').length;
  const judged = OPS_CONVERSATIONS.filter((c) => c.status !== 'missed').length || 1;

  const recent = [...OPS_CONVERSATIONS]
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytika"
        description="Objem hovorů, délky, míra vyřešení a výsledky — posledních 30 dní"
      />

      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Hovory"
          value={new Intl.NumberFormat('cs-CZ').format(totalCalls)}
          hint="30 dní"
        />
        <StatCard
          label="Minuty"
          value={new Intl.NumberFormat('cs-CZ').format(totalMinutes)}
          hint="30 dní"
        />
        <StatCard label="Průměrná délka" value={formatDuration(Math.round(avgDuration))} />
        <StatCard
          label="Vyřešeno AI"
          value={`${Math.round((resolved / judged) * 100)} %`}
          hint="bez předání člověku"
        />
      </div>

      {/* Grafy */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Hovory v čase" description="Počet hovorů za den">
          <BarChart data={callsSeries} unit="hovorů" ariaLabel="Hovory v čase" />
        </SectionCard>

        <SectionCard title="Minuty v čase" description="Vyúčtované minuty za den">
          <AreaChart data={minutesSeries} unit="min" ariaLabel="Minuty v čase" />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Výsledky hovorů"
          description="Rozpad dle výsledku za 30 dní"
        >
          <DonutChart
            segments={OUTCOME_BREAKDOWN.map((o) => ({
              label: outcomeLabel(o.outcome),
              value: o.count,
              colorVar: OUTCOME_COLORS[o.outcome] ?? 'var(--color-muted)',
            }))}
            centerValue={String(totalCalls)}
            centerLabel="hovorů"
            ariaLabel="Rozpad výsledků hovorů"
          />
          <p className="mt-4 text-xs text-muted">
            Míra předání člověku:{' '}
            {Math.round(
              ((OUTCOME_BREAKDOWN.find((o) => o.outcome === 'human_handoff')?.count ?? 0) /
                (totalCalls || 1)) *
                100
            )}{' '}
            % · zmeškáno: {OUTCOME_BREAKDOWN.find((o) => o.outcome === 'no_response')?.count ?? 0}
          </p>
        </SectionCard>

        <SectionCard
          title="Poslední výsledky"
          description="Nejnovější ukončené konverzace"
          contentClassName=""
        >
          <ul className="divide-y divide-border">
            {recent.map((conv) => (
              <li key={conv.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <span className="w-36 shrink-0 text-sm text-muted">
                  {formatShortDateTimeCz(conv.startedAt)}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-ink">
                  {conv.detectedIntent}
                </span>
                <span className="shrink-0 text-sm tabular-nums text-muted">
                  {formatDuration(conv.durationSec)}
                </span>
                <Badge tone={outcomeTone(conv.outcome)}>{outcomeLabel(conv.outcome)}</Badge>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
