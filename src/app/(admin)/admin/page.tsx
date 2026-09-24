import Link from 'next/link';
import { Icon } from '@/components/shared/Icon';
import { Badge, PageHeader, SectionCard, StatCard, Avatar } from '@/components/admin/ui';
import { getOpsStats, OPS_ASSISTANTS, getClientById, OPS_CONVERSATIONS } from '@/data/ops';
import { formatDuration, formatRelativeCz } from '@/lib/format';
import {
  CONVERSATION_STATUS_LABELS,
  CONVERSATION_TONES,
  outcomeLabel,
  outcomeTone,
} from '@/lib/opsLabels';

export const metadata = {
  title: 'Přehled — Recepce.tech Admin',
  description: 'Provozní přehled asistentů, hovorů a konverzací',
};

export default function AdminOverviewPage() {
  const stats = getOpsStats();

  const recent = [...OPS_CONVERSATIONS]
    .sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    )
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Přehled"
        description="Stav asistentů, hovorů a konverzací napříč klienty"
      />

      {/* KPI dlaždice */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Aktivní asistenti"
          value={String(stats.activeAssistants)}
          icon={<Icon name="phone-call" className="h-4 w-4" />}
          href="/admin/assistants"
        />
        <StatCard
          label="Hovory celkem"
          value={new Intl.NumberFormat('cs-CZ').format(stats.totalCalls)}
          hint="posledních 30 dní"
          icon={<Icon name="phone" className="h-4 w-4" />}
          href="/admin/analytics"
        />
        <StatCard
          label="Minuty"
          value={new Intl.NumberFormat('cs-CZ').format(stats.minutesUsed)}
          hint="posledních 30 dní"
          icon={<Icon name="clock" className="h-4 w-4" />}
          href="/admin/analytics"
        />
        <StatCard
          label="Průměrný hovor"
          value={formatDuration(stats.avgCallDurationSec)}
          icon={<Icon name="clock" className="h-4 w-4" />}
          href="/admin/analytics"
        />
        <StatCard
          label="Hovory dnes"
          value={String(stats.callsToday)}
          hint={CALLS_TODAY_DATE_HINT}
          icon={<Icon name="trending-up" className="h-4 w-4" />}
        />
        <StatCard
          label="Nevyřešené konverzace"
          value={String(stats.unresolvedConversations)}
          hint="k dořešení"
          icon={<Icon name="alert-circle" className="h-4 w-4" />}
          href="/admin/conversations?status=unresolved"
        />
      </div>

      {/* Nedávné konverzace */}
      <SectionCard
        title="Nedávné konverzace"
        description="Poslední hovory zachycené asistenty"
        action={
          <Link
            href="/admin/conversations"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-hover"
          >
            Všechny konverzace
            <Icon name="chevron-right" className="h-4 w-4" />
          </Link>
        }
        contentClassName=""
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-muted/60">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Asistent
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Klient
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Volající
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Čas
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Délka
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Výsledek
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recent.map((conv) => {
                const assistant = OPS_ASSISTANTS.find((a) => a.id === conv.assistantId);
                const client = getClientById(conv.clientId);
                return (
                  <tr key={conv.id} className="transition-colors hover:bg-surface-muted/40">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/conversations/${conv.id}`}
                        className="font-medium text-ink hover:text-accent"
                      >
                        {assistant?.name ?? '—'}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-2 text-sm text-ink">
                        <Avatar initials={client?.initials ?? '??'} className="h-6 w-6" />
                        <span className="hidden sm:inline">{client?.name}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-muted">
                      {conv.callerNumber}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-sm text-muted">
                      {formatRelativeCz(conv.startedAt)}
                    </td>
                    <td className="px-4 py-3.5 text-right tabular-nums text-sm text-ink">
                      {formatDuration(conv.durationSec)}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge tone={outcomeTone(conv.outcome)}>
                        {outcomeLabel(conv.outcome)}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge tone={CONVERSATION_TONES[conv.status]}>
                        {CONVERSATION_STATUS_LABELS[conv.status]}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

const CALLS_TODAY_DATE_HINT = 'za dnešní den';
