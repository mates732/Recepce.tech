import { Icon } from '@/components/shared/Icon';
import { Button, PageHeader } from '@/components/admin/ui';
import { OPS_CLIENTS, OPS_KNOWLEDGE, getClientById } from '@/data/ops';
import KnowledgeBrowser from './KnowledgeBrowser';

export const metadata = {
  title: 'Znalosti — Recepce.tech Admin',
};

export default function KnowledgePage() {
  const clients = OPS_CLIENTS.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Znalosti"
        description="Znalostní báze pro všechny asistenty — FAQ, firemní údaje, produkty, provozní doba, lokality, pravidla"
        actions={
          <Button variant="secondary">
            <Icon name="plus" className="h-4 w-4" />
            Nový záznam
          </Button>
        }
      />

      <KnowledgeBrowser
        entries={OPS_KNOWLEDGE}
        clients={clients}
        getClientName={(id) => getClientById(id)?.name ?? '—'}
      />
    </div>
  );
}
