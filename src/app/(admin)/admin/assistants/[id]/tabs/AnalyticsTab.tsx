import { BarChart } from '@/components/admin/charts';
import { Badge } from '@/components/admin/ui';
import { CALLS_DAILY, getConversationsForAssistant } from '@/data/ops';
import { formatDuration, formatShortDateTimeCz } from '@/lib/format';
import { outcomeLabel, outcomeTone } from '@/lib/opsLabels';
import type { Assistant } from '@/data/ops';

export default function AnalyticsTab({ assistant }: { assistant: Assistant }) {
  const conversations = getConversationsForAssistant(assistant.id);
  const withDuration = conversations.filter((c) => c.durationSec > 0);
  const avg =
    withDuration.length > 0
      ? withDuration.reduce((s, c) => s + c.durationSec, 0) / withDuration.length
      : 0;
  const resolved = conversations.filter((c) => c.status === 'resolved').length;
  const handoff = conversations.filter((c) => c.outcome === 'human_handoff').length;
  const total = conversations.length || 1;

  const daily = CALLS_DAILY.slice(-14).map((d) => ({
    label: new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric' }).format(
      new Date(d.date)
    ),
    value: d.calls,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Zachycené konverzace
          </p>
          <p className="mt-2 text-2xl font-semibold text-ink tabular-nums">
            {conversations.length}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Průměrná délka
          </p>
          <p className="mt-2 text-2xl font-semibold text-ink tabular-nums">
            {formatDuration(Math.round(avg))}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Vyřešeno bez člověka
          </p>
          <p className="mt-2 text-2xl font-semibold text-ink tabular-nums">
            {Math.round((resolved / total) * 100)} %
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-4 font-semibold text-ink">Hovory — posledních 14 dní</h3>
        <BarChart data={daily} unit="hovorů" ariaLabel="Hovory za posledních 14 dní" />
      </div>

      <div className="rounded-xl border border-border">
        <div className="border-b border-border px-5 py-4">
          <h3 className="font-semibold text-ink">Poslední výsledky hovorů</h3>
        </div>
        <ul className="divide-y divide-border">
          {conversations.slice(0, 5).map((conv) => (
            <li key={conv.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
              <span className="w-40 shrink-0 text-sm text-muted">
                {formatShortDateTimeCz(conv.startedAt)}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-ink">{conv.summary}</span>
              <span className="text-sm tabular-nums text-muted">
                {formatDuration(conv.durationSec)}
              </span>
              <Badge tone={outcomeTone(conv.outcome)}>{outcomeLabel(conv.outcome)}</Badge>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-muted">
        Míra předání člověku: {Math.round((handoff / total) * 100)} % — {handoff} z{' '}
        {conversations.length} konverzací.
      </p>
    </div>
  );
}
