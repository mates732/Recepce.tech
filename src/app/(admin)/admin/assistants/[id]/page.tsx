import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/shared/Icon';
import { Badge, Button, Avatar } from '@/components/admin/ui';
import AssistantDetailTabs from './AssistantDetailTabs';
import { getAssistantById, getClientById, getKnowledgeForAssistant } from '@/data/ops';
import { formatPhoneCz } from '@/lib/format';
import {
  ASSISTANT_STATUS_LABELS,
  ASSISTANT_STATUS_TONES,
  VAPI_STATUS_LABELS,
  VAPI_STATUS_TONES,
} from '@/lib/opsLabels';

export const metadata = {
  title: 'Detail asistenta — Recepce.tech Admin',
};

export default async function AssistantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const assistant = getAssistantById(id);
  if (!assistant) notFound();

  const client = getClientById(assistant.clientId);
  const knowledge = getKnowledgeForAssistant(assistant.id);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/assistants"
          className="mb-2 inline-block text-sm text-muted transition-colors hover:text-ink"
        >
          ← Zpět na asistenty
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Avatar initials={client?.initials ?? '??'} className="h-11 w-11 text-sm" />
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink">
                  {assistant.name}
                </h1>
                <Badge tone={ASSISTANT_STATUS_TONES[assistant.status]}>
                  {ASSISTANT_STATUS_LABELS[assistant.status]}
                </Badge>
                <Badge tone={VAPI_STATUS_TONES[assistant.vapiStatus]}>
                  {VAPI_STATUS_LABELS[assistant.vapiStatus]}
                </Badge>
              </div>
              <p className="mt-1 text-muted">
                {client?.name}
                {assistant.phoneNumber ? ` · ${formatPhoneCz(assistant.phoneNumber)}` : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button href={`/admin/assistants/${assistant.id}/test`} variant="secondary">
              <Icon name="flask" className="h-4 w-4" />
              Test
            </Button>
            <Button variant="secondary">
              <Icon name="pencil" className="h-4 w-4" />
              Upravit
            </Button>
            {assistant.status === 'active' ? (
              <Button variant="ghost" className="text-red-600 hover:bg-red-50">
                Zakázat
              </Button>
            ) : (
              <Button variant="ghost">Aktivovat</Button>
            )}
          </div>
        </div>
      </div>

      <AssistantDetailTabs
        assistant={assistant}
        client={client}
        knowledge={knowledge}
      />
    </div>
  );
}
