import Link from 'next/link';
import { Icon } from '@/components/shared/Icon';
import { Badge, Button, PageHeader, Avatar, EmptyState } from '@/components/admin/ui';
import { OPS_ASSISTANTS, getClientById } from '@/data/ops';
import { formatRelativeCz, formatPhoneCz } from '@/lib/format';
import {
  ASSISTANT_STATUS_LABELS,
  ASSISTANT_STATUS_TONES,
  VAPI_STATUS_LABELS,
  VAPI_STATUS_TONES,
} from '@/lib/opsLabels';

export const metadata = {
  title: 'Asistenti — Recepce.tech Admin',
};

export default function AssistantsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Asistenti"
        description="Hlasoví asistenti napříč klienty — konfigurace, testování a stav napojení na Vapi"
        actions={
          <Button variant="secondary">
            <Icon name="plus" className="h-4 w-4" />
            Nový asistent
          </Button>
        }
      />

      {OPS_ASSISTANTS.length === 0 ? (
        <EmptyState
          icon={<Icon name="phone-call" className="h-10 w-10" />}
          title="Žádní asistenti"
          description="Vytvořte prvního hlasového asistenta pro vašeho klienta."
          action={<Button>Vytvořit asistenta</Button>}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {OPS_ASSISTANTS.map((assistant) => {
            const client = getClientById(assistant.clientId);
            return (
              <article
                key={assistant.id}
                className="flex flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:bg-surface-muted/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/admin/assistants/${assistant.id}`}
                        className="truncate text-lg font-semibold text-ink hover:text-accent"
                      >
                        {assistant.name}
                      </Link>
                      <Badge tone={ASSISTANT_STATUS_TONES[assistant.status]}>
                        {ASSISTANT_STATUS_LABELS[assistant.status]}
                      </Badge>
                    </div>
                    <p className="mt-1.5 flex items-center gap-2 text-sm text-muted">
                      <Avatar initials={client?.initials ?? '??'} className="h-5 w-5" />
                      {client?.name}
                    </p>
                  </div>
                  <Badge tone={VAPI_STATUS_TONES[assistant.vapiStatus]}>
                    {VAPI_STATUS_LABELS[assistant.vapiStatus]}
                  </Badge>
                </div>

                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
                  {assistant.description}
                </p>

                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Telefon
                    </dt>
                    <dd className="mt-0.5 font-mono text-[13px] text-ink">
                      {assistant.phoneNumber
                        ? formatPhoneCz(assistant.phoneNumber)
                        : '— nepřiřazeno —'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Poslední aktivita
                    </dt>
                    <dd className="mt-0.5 text-[13px] text-ink">
                      {assistant.lastActivityAt
                        ? formatRelativeCz(assistant.lastActivityAt)
                        : '— žádná —'}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  <Button href={`/admin/assistants/${assistant.id}`} variant="primary">
                    Otevřít
                  </Button>
                  <Button href={`/admin/assistants/${assistant.id}/test`} variant="secondary">
                    <Icon name="flask" className="h-4 w-4" />
                    Test
                  </Button>
                  <Button
                    href={`/admin/assistants/${assistant.id}?tab=prompt`}
                    variant="ghost"
                  >
                    <Icon name="pencil" className="h-4 w-4" />
                    Upravit
                  </Button>
                  {assistant.status === 'active' ? (
                    <Button variant="ghost" className="ml-auto text-red-600 hover:bg-red-50">
                      Zakázat
                    </Button>
                  ) : (
                    <Button variant="ghost" className="ml-auto">
                      Aktivovat
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
