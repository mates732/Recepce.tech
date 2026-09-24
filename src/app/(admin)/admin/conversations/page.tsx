import { PageHeader } from '@/components/admin/ui';
import { OPS_ASSISTANTS, OPS_CONVERSATIONS, getClientById } from '@/data/ops';
import ConversationsInbox from './ConversationsInbox';

export const metadata = {
  title: 'Konverzace — Recepce.tech Admin',
};

export default function ConversationsPage() {
  const assistants = OPS_ASSISTANTS.map((a) => ({ id: a.id, name: a.name }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Konverzace"
        description="Inbox hovorů zachycených asistenty — transkripty, souhrny a výsledky"
      />

      <ConversationsInbox
        conversations={OPS_CONVERSATIONS}
        assistants={assistants}
        getClientName={(id) => getClientById(id)?.name ?? '—'}
      />
    </div>
  );
}
