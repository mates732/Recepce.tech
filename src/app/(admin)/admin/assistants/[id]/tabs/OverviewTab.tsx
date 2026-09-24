import { Badge, Avatar } from '@/components/admin/ui';
import type { Assistant, ClientOps } from '@/data/ops';
import { formatPhoneCz, formatShortDateTimeCz } from '@/lib/format';
import {
  ASSISTANT_STATUS_LABELS,
  ASSISTANT_STATUS_TONES,
  VAPI_STATUS_LABELS,
  VAPI_STATUS_TONES,
} from '@/lib/opsLabels';

export default function OverviewTab({
  assistant,
  client,
}: {
  assistant: Assistant;
  client?: ClientOps;
}) {
  const rows: Array<{ label: string; value: React.ReactNode }> = [
    {
      label: 'Název',
      value: assistant.name,
    },
    {
      label: 'Klient',
      value: (
        <span className="inline-flex items-center gap-2">
          <Avatar initials={client?.initials ?? '??'} className="h-5 w-5" />
          {client ? (
            <a
              href={`/admin/clients/${client.id}`}
              className="text-ink underline-offset-2 hover:underline"
            >
              {client.name}
            </a>
          ) : (
            '—'
          )}
        </span>
      ),
    },
    {
      label: 'Popis',
      value: <span className="text-muted">{assistant.description}</span>,
    },
    {
      label: 'Status',
      value: (
        <Badge tone={ASSISTANT_STATUS_TONES[assistant.status]}>
          {ASSISTANT_STATUS_LABELS[assistant.status]}
        </Badge>
      ),
    },
    {
      label: 'Telefonní číslo',
      value: assistant.phoneNumber ? (
        <span className="font-mono">{formatPhoneCz(assistant.phoneNumber)}</span>
      ) : (
        <span className="text-muted">— nepřiřazeno —</span>
      ),
    },
    {
      label: 'Vapi assistant ID',
      value: assistant.vapiAssistantId ? (
        <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[13px]">
          {assistant.vapiAssistantId}
        </code>
      ) : (
        <span className="text-muted">— nepřipojeno —</span>
      ),
    },
    {
      label: 'Vapi stav',
      value: (
        <Badge tone={VAPI_STATUS_TONES[assistant.vapiStatus]}>
          {VAPI_STATUS_LABELS[assistant.vapiStatus]}
        </Badge>
      ),
    },
    {
      label: 'Vytvořeno',
      value: formatShortDateTimeCz(assistant.createdAt),
    },
    {
      label: 'Poslední aktivita',
      value: assistant.lastActivityAt
        ? formatShortDateTimeCz(assistant.lastActivityAt)
        : '— žádná —',
    },
  ];

  return (
    <div className="max-w-3xl">
      <dl className="divide-y divide-border rounded-xl border border-border">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[200px_1fr] sm:gap-4">
            <dt className="text-sm font-medium text-muted">{row.label}</dt>
            <dd className="text-sm text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
