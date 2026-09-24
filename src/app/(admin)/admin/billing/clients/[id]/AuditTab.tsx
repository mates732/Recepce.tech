import Link from 'next/link';
import { Icon } from '@/components/shared/Icon';
import { AuditAction } from '@prisma/client';

interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  metadata: any;
  createdAt: Date;
}

interface AuditTabProps {
  auditLogs: AuditLogEntry[];
}

const ACTION_LABELS: Record<string, string> = {
  CLIENT_CREATED: 'Klient vytvořen',
  CLIENT_UPDATED: 'Klient upraven',
  CLIENT_DELETED: 'Klient smazán',
  VAPI_ASSISTANT_CONNECTED: 'Vapi asistent připojen',
  VAPI_WEBHOOK_PROCESSED: 'Vapi webhook zpracován',
  USAGE_RECALCULATED: 'Použití přepočítáno',
  STRIPE_CUSTOMER_CREATED: 'Stripe zákazník vytvořen',
  STRIPE_SUBSCRIPTION_CREATED: 'Stripe předplatné vytvořeno',
  STRIPE_WEBHOOK_PROCESSED: 'Stripe webhook zpracován',
  OVERAGE_CALCULATED: 'Nadlimit vypočten',
  OVERAGE_BILLED: 'Nadlimit fakturován',
  BILLING_RECONCILIATION_PERFORMED: 'Fakturace sladěna',
  BILLING_ERROR: 'Fakturační chyba',
  ALERT_CREATED: 'Upozornění vytvořeno',
};

export default function AuditTab({ auditLogs }: AuditTabProps) {
  if (auditLogs.length === 0) {
    return (
      <div className="text-center py-12 text-muted">
        <Icon name="bolt" className="h-10 w-10 mx-auto mb-3 text-muted" />
        <p>Žádné záznamy audit logu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Akce</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Subjekt</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Entita</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Čas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {auditLogs.map((entry) => (
                <tr key={entry.id} className="hover:bg-surface-muted/50">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-accent text-accent-bright">
                      {ACTION_LABELS[entry.action] ?? entry.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-ink font-mono">{entry.actor}</td>
                  <td className="px-4 py-3 text-sm text-muted">
                    {entry.entity} / {entry.entityId.slice(0, 12)}…
                  </td>
                  <td className="px-4 py-3 text-sm text-ink whitespace-nowrap">
                    {new Date(entry.createdAt).toLocaleString('cs-CZ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}