import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/shared/Icon';
import { Avatar, Badge, Button, SectionCard, StatCard } from '@/components/admin/ui';
import {
  getClientById,
  getAssistantsForClient,
  getKnowledgeForClient,
  getUsageForClient,
  getConversationsForAssistant,
} from '@/data/ops';
import { formatShortDateTimeCz, formatRelativeCz } from '@/lib/format';
import {
  ASSISTANT_STATUS_LABELS,
  ASSISTANT_STATUS_TONES,
  VAPI_STATUS_LABELS,
  VAPI_STATUS_TONES,
  KNOWLEDGE_CATEGORY_LABELS,
} from '@/lib/opsLabels';

export const metadata = {
  title: 'Detail klienta — Recepce.tech Admin',
};

export default async function OpsClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = getClientById(id);
  if (!client) notFound();

  const assistants = getAssistantsForClient(client.id);
  const knowledge = getKnowledgeForClient(client.id);
  const usage = getUsageForClient(client.id);
  const currentUsage = usage[0];

  const totalCalls = assistants.reduce(
    (sum, a) => sum + getConversationsForAssistant(a.id).length,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/clients"
          className="mb-2 inline-block text-sm text-muted transition-colors hover:text-ink"
        >
          ← Zpět na klienty
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar initials={client.initials} className="h-12 w-12 text-base" />
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink">
                {client.name}
              </h1>
              <p className="mt-0.5 text-muted">{client.industry}</p>
            </div>
          </div>
          <Button variant="secondary">
            <Icon name="pencil" className="h-4 w-4" />
            Upravit klienta
          </Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Asistenti" value={`${assistants.filter((a) => a.status === 'active').length}/${assistants.length}`} hint="aktivní / celkem" />
        <StatCard label="Hovory (30 dní)" value={String(totalCalls)} />
        <StatCard
          label="Minuty tento měsíc"
          value={currentUsage ? String(currentUsage.minutes) : '0'}
          hint={currentUsage ? `z ${currentUsage.includedMinutes} v ceně` : undefined}
        />
        <StatCard label="Znalostní záznamy" value={String(knowledge.length)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Firemní údaje */}
        <SectionCard title="Firemní údaje" className="lg:col-span-1">
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Web</dt>
              <dd className="mt-1">
                {client.website ? (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-ink underline underline-offset-2 hover:text-accent"
                  >
                    {client.website.replace(/^https?:\/\//, '')}
                    <Icon name="external-link" className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Adresa</dt>
              <dd className="mt-1 text-ink">{client.address ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Kontakt</dt>
              <dd className="mt-1 text-ink">
                {client.contactName ?? '—'}
                {client.contactEmail && (
                  <>
                    <br />
                    <a href={`mailto:${client.contactEmail}`} className="hover:text-accent">
                      {client.contactEmail}
                    </a>
                  </>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Firemní údaje
              </dt>
              <dd className="mt-1 text-ink">{client.companyId ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Klient od
              </dt>
              <dd className="mt-1 text-ink">{formatShortDateTimeCz(client.createdAt)}</dd>
            </div>
          </dl>
        </SectionCard>

        <div className="space-y-6 lg:col-span-2">
          {/* Asistenti */}
          <SectionCard
            title="Asistenti"
            description="Hlasoví asistenti provozovaní pro tohoto klienta"
            action={
              <Link
                href="/admin/assistants"
                className="text-sm font-medium text-accent hover:text-accent-hover"
              >
                Spravovat
              </Link>
            }
            contentClassName=""
          >
            {assistants.length === 0 ? (
              <p className="px-5 py-6 text-center text-sm text-muted">
                Žádní asistenti — klient zatím čeká na nasazení.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {assistants.map((assistant) => (
                  <li key={assistant.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/assistants/${assistant.id}`}
                        className="font-medium text-ink hover:text-accent"
                      >
                        {assistant.name}
                      </Link>
                      <p className="mt-0.5 truncate text-xs text-muted">
                        {assistant.phoneNumber ?? 'bez čísla'} ·{' '}
                        {assistant.lastActivityAt
                          ? `aktivita ${formatRelativeCz(assistant.lastActivityAt)}`
                          : 'bez aktivity'}
                      </p>
                    </div>
                    <Badge tone={VAPI_STATUS_TONES[assistant.vapiStatus]}>
                      {VAPI_STATUS_LABELS[assistant.vapiStatus]}
                    </Badge>
                    <Badge tone={ASSISTANT_STATUS_TONES[assistant.status]}>
                      {ASSISTANT_STATUS_LABELS[assistant.status]}
                    </Badge>
                    <Button href={`/admin/assistants/${assistant.id}/test`} variant="ghost">
                      <Icon name="flask" className="h-4 w-4" />
                      Test
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          {/* Znalosti */}
          <SectionCard
            title="Znalostní báze"
            description={`${knowledge.length} záznamů napojených na asistenty klienta`}
            action={
              <Link
                href={`/admin/knowledge?client=${client.id}`}
                className="text-sm font-medium text-accent hover:text-accent-hover"
              >
                Otevřít
              </Link>
            }
            contentClassName=""
          >
            {knowledge.length === 0 ? (
              <p className="px-5 py-6 text-center text-sm text-muted">
                Žádné záznamy znalostí.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {knowledge.slice(0, 5).map((entry) => (
                  <li key={entry.id} className="flex items-center gap-3 px-5 py-3">
                    <Badge tone="outline">{KNOWLEDGE_CATEGORY_LABELS[entry.category]}</Badge>
                    <span className="min-w-0 flex-1 truncate text-sm text-ink">
                      {entry.question ?? entry.title}
                    </span>
                    <span className="shrink-0 text-xs text-muted">
                      {formatRelativeCz(entry.updatedAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          {/* Používání */}
          <SectionCard title="Používání" description="Měsíční přehled hovorů a minut">
            {usage.length === 0 ? (
              <p className="text-sm text-muted">Zatím bez dat o používání.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                    <th className="pb-2">Období</th>
                    <th className="pb-2 text-right">Hovory</th>
                    <th className="pb-2 text-right">Minuty</th>
                    <th className="pb-2 text-right">V ceně</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {usage.map((u) => (
                    <tr key={u.id}>
                      <td className="py-2.5 text-ink">
                        {new Intl.DateTimeFormat('cs-CZ', { month: 'long', year: 'numeric' }).format(
                          new Date(u.periodStart)
                        )}
                      </td>
                      <td className="py-2.5 text-right tabular-nums text-ink">{u.calls}</td>
                      <td className="py-2.5 text-right tabular-nums text-ink">{u.minutes}</td>
                      <td className="py-2.5 text-right tabular-nums text-muted">
                        {u.includedMinutes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </SectionCard>
        </div>
      </div>

      {/* Poznámky */}
      {client.notes && (
        <SectionCard title="Poznámky">
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink">{client.notes}</p>
        </SectionCard>
      )}
    </div>
  );
}
