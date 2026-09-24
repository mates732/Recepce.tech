'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/shared/Icon';
import { Button } from '@/components/shared/Button';
import { formatCurrency, calculateUsage, getUsageStatus } from '@/lib/billing/calculations';
import OverviewTab from './OverviewTab';
import VapiTab from './VapiTab';
import UsageTab from './UsageTab';
import CallsTab from './CallsTab';
import BillingTab from './BillingTab';
import AuditTab from './AuditTab';

const TABS = [
  { id: 'overview', label: 'Přehled', icon: 'building' },
  { id: 'vapi', label: 'Vapi', icon: 'phone-call' },
  { id: 'usage', label: 'Použití', icon: 'trending-up' },
  { id: 'calls', label: 'Hovory', icon: 'smartphone' },
  { id: 'billing', label: 'Fakturace', icon: 'lock' },
  { id: 'audit', label: 'Audit log', icon: 'bolt' },
] as const;

interface ClientDetailTabsProps {
  data: {
    client: {
      id: string;
      name: string;
      slug: string;
      contactName: string | null;
      contactEmail: string | null;
      status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
      createdAt: Date;
      updatedAt: Date;
      billing: {
        id: string;
        currency: string;
        monthlyPrice: number;
        includedMinutes: number;
        overagePricePerMinute: number;
        stripeCustomerId: string | null;
        stripeSubscriptionId: string | null;
        stripeSubscriptionItemId: string | null;
        billingPeriodStart: Date | null;
        billingPeriodEnd: Date | null;
      } | null;
      vapiAssistant: {
        id: string;
        assistantId: string;
        phoneNumberId: string | null;
        status: string;
        lastWebhookAt: Date | null;
      } | null;
      currentPeriod: { start: Date; end: Date } | null;
      currentUsage: ReturnType<typeof calculateUsage>;
      totalCalls: number;
      totalMinutes: number;
      totalVapiCost: number;
    };
    calls: Array<{
      id: string;
      vapiCallId: string;
      startedAt: Date;
      endedAt: Date | null;
      durationSeconds: number | null;
      billableMinutes: number;
      vapiCost: number | null;
      status: string;
      metadata: any;
    }>;
    usagePeriods: Array<{
      id: string;
      periodStart: Date;
      periodEnd: Date;
      includedMinutes: number;
      usedMinutes: number;
      overageMinutes: number;
      overageAmount: number;
      estimatedTotal: number;
    }>;
    billingEvents: Array<{
      id: string;
      type: string;
      amount: number;
      stripeEventId: string | null;
      status: string;
      metadata: any;
      createdAt: Date;
    }>;
    auditLogs: Array<{
      id: string;
      actor: string;
      action: string;
      entity: string;
      entityId: string;
      metadata: any;
      createdAt: Date;
    }>;
  };
}

export default function ClientDetailTabs({ data }: ClientDetailTabsProps) {
  const { client, calls, usagePeriods, billingEvents, auditLogs } = data;
  const [activeTab, setActiveTab] = useState<typeof TABS[number]['id']>('overview');

  const STATUS_LABELS: Record<string, string> = {
    ACTIVE: 'Aktivní',
    PAUSED: 'Pozastaven',
    CANCELLED: 'Zrušen',
  };

  const STATUS_CLASSES: Record<string, string> = {
    ACTIVE: 'bg-emerald-100 text-emerald-700',
    PAUSED: 'bg-yellow-100 text-yellow-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link href="/admin/billing/clients" className="text-sm text-muted hover:text-ink transition-colors mb-2 inline-block">
            ← Zpět na klienty
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink">{client.name}</h1>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${STATUS_CLASSES[client.status]}`}>
              {STATUS_LABELS[client.status]}
            </span>
          </div>
          <p className="mt-1 text-muted">{client.slug}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/billing/clients/${client.id}/edit`}>
            <Button variant="secondary" size="md">
              <Icon name="pencil" className="h-4 w-4" />
              Upravit
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <nav className="border-b border-border overflow-x-auto" aria-label="Záhlaví záložek">
          <ul className="flex min-w-max gap-1 px-4" role="tablist">
            {TABS.map((tab) => (
              <li key={tab.id} role="presentation">
                <button
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-t-lg px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-surface text-ink border-b-2 border-accent -mb-px'
                      : 'text-muted hover:text-ink hover:bg-surface-muted'
                  }`}
                >
                  <Icon name={tab.icon} className="h-4 w-4" />
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6" role="tabpanel">
          {activeTab === 'overview' && (
            <OverviewTab client={client} />
          )}
          {activeTab === 'vapi' && (
            <VapiTab client={client} />
          )}
          {activeTab === 'usage' && (
            <UsageTab client={client} usagePeriods={usagePeriods} />
          )}
          {activeTab === 'calls' && (
            <CallsTab calls={calls} />
          )}
          {activeTab === 'billing' && (
            <BillingTab client={client} billingEvents={billingEvents} />
          )}
          {activeTab === 'audit' && (
            <AuditTab auditLogs={auditLogs} />
          )}
        </div>
      </div>
    </div>
  );
}