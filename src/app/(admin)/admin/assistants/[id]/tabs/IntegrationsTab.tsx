import { Icon } from '@/components/shared/Icon';
import { Badge, EmptyState } from '@/components/admin/ui';
import { getIntegrationsForAssistant, type IntegrationKind } from '@/data/ops';
import {
  INTEGRATION_STATUS_LABELS,
  INTEGRATION_STATUS_TONES,
} from '@/lib/opsLabels';
import type { Assistant } from '@/data/ops';

const KIND_ICONS: Record<IntegrationKind, 'phone-call' | 'link' | 'database' | 'calendar' | 'mail'> = {
  vapi: 'phone-call',
  webhook: 'link',
  crm: 'database',
  calendar: 'calendar',
  email: 'mail',
};

export default function IntegrationsTab({ assistant }: { assistant: Assistant }) {
  const integrations = getIntegrationsForAssistant(assistant.id);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold text-ink">Integrace</h2>
        <p className="mt-0.5 text-sm text-muted">
          Napojení asistenta na externí služby. Klíče se spravují v Nastavení — v UI se
          nikdy nezobrazují hodnoty.
        </p>
      </div>

      {integrations.length === 0 ? (
        <EmptyState
          icon={<Icon name="link" className="h-10 w-10" />}
          title="Žádné integrace"
          description="Tento asistent zatím nemá nakonfigurované žádné napojení."
        />
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border">
          {integrations.map((integration) => (
            <li
              key={integration.id}
              className="flex flex-wrap items-center gap-4 px-5 py-4"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-surface-muted/50 text-ink">
                <Icon name={KIND_ICONS[integration.kind]} className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink">{integration.name}</p>
                <p className="mt-0.5 text-sm text-muted">{integration.detail}</p>
                {integration.configKeys.length > 0 && (
                  <p className="mt-1 font-mono text-[11px] text-faint">
                    {integration.configKeys.join(' · ')}
                  </p>
                )}
              </div>
              <Badge tone={INTEGRATION_STATUS_TONES[integration.status]}>
                {INTEGRATION_STATUS_LABELS[integration.status]}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
