'use client';

import Link from 'next/link';
import { Icon } from '@/components/shared/Icon';
import { Badge, Button, PageHeader, SectionCard } from '@/components/admin/ui';

export default function SettingsPage() {
  const integrations: Array<{
    name: string;
    detail: string;
    status: 'connected' | 'not_configured' | 'error';
    envKeys: string[];
  }> = [
    {
      name: 'Vapi — hlasové hovory',
      detail: 'Vytváření asistentů, telefonní čísla, webhooky end-of-call',
      status: 'connected',
      envKeys: ['VAPI_API_KEY', 'VAPI_SERVER_SECRET'],
    },
    {
      name: 'Stripe — fakturace',
      detail: 'Předplatná, nadlimitní minuty, fakturační události',
      status: 'connected',
      envKeys: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'STRIPE_PRICE_ID'],
    },
    {
      name: 'Databáze — PostgreSQL',
      detail: 'Klienti, hovory, usage periody, audit log',
      status: 'connected',
      envKeys: ['DATABASE_URL'],
    },
    {
      name: 'Webhook — Vapi end-of-call',
      detail: 'POST /api/webhooks/vapi · ověření HMAC podpisu',
      status: 'connected',
      envKeys: ['VAPI_SERVER_SECRET'],
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Nastavení"
        description="Konfigurace platformy, integrací a přístupu"
      />

      <SectionCard
        title="Integrace platformy"
        description="Stav napojení externích služeb — klíče se spravují přes environment variables"
        contentClassName=""
      >
        <ul className="divide-y divide-border">
          {integrations.map((integration) => (
            <li key={integration.name} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-surface-muted/50 text-ink">
                <Icon name="link" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink">{integration.name}</p>
                <p className="mt-0.5 text-sm text-muted">{integration.detail}</p>
                <p className="mt-1 font-mono text-[11px] text-faint">
                  {integration.envKeys.join(' · ')}
                </p>
              </div>
              <Badge
                tone={
                  integration.status === 'connected'
                    ? 'positive'
                    : integration.status === 'error'
                      ? 'negative'
                      : 'neutral'
                }
              >
                {integration.status === 'connected'
                  ? 'Připojeno'
                  : integration.status === 'error'
                    ? 'Chyba'
                    : 'Nenastaveno'}
              </Badge>
            </li>
          ))}
        </ul>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Fakturace" description="Starší administrační rozhraní pro billing">
          <p className="text-sm leading-relaxed text-muted">
            Kompletní správa klientů, předplatných, použití a audit logů je ve{' '}
            <strong>fakturační sekci</strong> — včetně zakládání klientů se Stripe předplatným
            a synchronizace hovorů z Vapi.
          </p>
          <div className="mt-4">
            <Button href="/admin/billing" variant="secondary">
              <Icon name="briefcase" className="h-4 w-4" />
              Otevřít fakturaci
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Účet" description="Přihlášený administrátor">
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted">Role</dt>
              <dd className="font-medium text-ink">Administrátor</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">Session</dt>
              <dd className="font-medium text-ink">24 hodin (JWT cookie)</dd>
            </div>
          </dl>
          <div className="mt-5 border-t border-border pt-5">
            <form action="/api/admin/logout" method="POST">
              <Button type="submit" variant="ghost" className="text-red-600 hover:bg-red-50">
                <Icon name="log-out" className="h-4 w-4" />
                Odhlásit se
              </Button>
            </form>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="O aplikaci" description="Recepce.tech admin">
        <p className="text-sm leading-relaxed text-muted">
          Interní provozní panel platformy Recepce.tech — správa klientů, hlasových asistentů,
          znalostních bází a konverzací. Verze demo dat: UGO Salaterie – Stromovka (září 2025).
        </p>
      </SectionCard>
    </div>
  );
}
