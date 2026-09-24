import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Avatar, Badge } from '@/components/admin/ui';
import TestConsole from './TestConsole';
import { getAssistantById, getClientById } from '@/data/ops';
import { formatPhoneCz } from '@/lib/format';
import { ASSISTANT_STATUS_LABELS, ASSISTANT_STATUS_TONES } from '@/lib/opsLabels';

export const metadata = {
  title: 'Test asistenta — Recepce.tech Admin',
};

export default async function AssistantTestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const assistant = getAssistantById(id);
  if (!assistant) notFound();

  const client = getClientById(assistant.clientId);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/admin/assistants/${assistant.id}`}
          className="mb-2 inline-block text-sm text-muted transition-colors hover:text-ink"
        >
          ← Zpět na detail asistenta
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <Avatar initials={client?.initials ?? '??'} className="h-10 w-10" />
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-ink">
            Test — {assistant.name}
          </h1>
          <Badge tone={ASSISTANT_STATUS_TONES[assistant.status]}>
            {ASSISTANT_STATUS_LABELS[assistant.status]}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted">
          {assistant.phoneNumber ? formatPhoneCz(assistant.phoneNumber) : 'bez čísla'} ·{' '}
          {client?.name}
        </p>
      </div>

      <TestConsole assistant={assistant} />
    </div>
  );
}
