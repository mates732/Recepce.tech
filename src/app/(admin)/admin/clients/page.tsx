import Link from 'next/link';
import { Icon } from '@/components/shared/Icon';
import { Avatar, Badge, Button, EmptyState, PageHeader } from '@/components/admin/ui';
import { OPS_CLIENTS, OPS_ASSISTANTS, getUsageForClient } from '@/data/ops';
import { formatShortDateTimeCz } from '@/lib/format';
import { ASSISTANT_STATUS_LABELS, ASSISTANT_STATUS_TONES } from '@/lib/opsLabels';

export const metadata = {
  title: 'Klienti — Recepce.tech Admin',
};

export default function OpsClientsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Klienti"
        description="Firmy, pro které provozujeme hlasové asistenty"
        actions={
          <Button variant="secondary">
            <Icon name="plus" className="h-4 w-4" />
            Nový klient
          </Button>
        }
      />

      {OPS_CLIENTS.length === 0 ? (
        <EmptyState
          icon={<Icon name="building" className="h-10 w-10" />}
          title="Žádní klienti"
          description="Přidejte prvního klienta a vytvořte mu asistenta."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-muted/60">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Klient
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Obor
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Kontakt
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Asistenti
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Minuty (měsíc)
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {OPS_CLIENTS.map((client) => {
                  const assistants = OPS_ASSISTANTS.filter((a) => a.clientId === client.id);
                  const usage = getUsageForClient(client.id)[0];
                  const active = assistants.filter((a) => a.status === 'active').length;

                  return (
                    <tr key={client.id} className="transition-colors hover:bg-surface-muted/40">
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/clients/${client.id}`}
                          className="flex items-center gap-3"
                        >
                          <Avatar initials={client.initials} className="h-9 w-9" />
                          <span>
                            <span className="block font-medium text-ink hover:text-accent">
                              {client.name}
                            </span>
                            <span className="block text-xs text-muted">{client.slug}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted">{client.industry}</td>
                      <td className="px-4 py-4 text-sm">
                        <p className="text-ink">{client.contactName ?? '—'}</p>
                        <p className="text-xs text-muted">{client.contactEmail ?? ''}</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 text-sm text-ink tabular-nums">
                          <Icon name="phone-call" className="h-4 w-4 text-muted" />
                          {active}/{assistants.length}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right tabular-nums text-sm text-ink">
                        {usage ? `${usage.minutes} / ${usage.includedMinutes}` : '—'}
                      </td>
                      <td className="px-5 py-4">
                        {assistants.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {assistants.slice(0, 2).map((a) => (
                              <Badge key={a.id} tone={ASSISTANT_STATUS_TONES[a.status]}>
                                {ASSISTANT_STATUS_LABELS[a.status]}
                              </Badge>
                            ))}
                            {assistants.length > 2 && (
                              <Badge tone="outline">+{assistants.length - 2}</Badge>
                            )}
                          </div>
                        ) : (
                          <Badge tone="outline">bez asistenta</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-muted">
        Zobrazeno {OPS_CLIENTS.length} klientů · data aktualizována{' '}
        {formatShortDateTimeCz(new Date())}
      </p>
    </div>
  );
}
