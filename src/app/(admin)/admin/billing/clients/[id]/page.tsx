import { prisma } from '@/lib/db/prisma';
import { formatCurrency, calculateUsage, getUsageStatus } from '@/lib/billing/calculations';
import ClientDetailTabs from './ClientDetailTabs';

export const metadata = {
  title: 'Detail klienta — Recepce.tech Admin',
};

async function getClientData(id: string) {
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      billing: true,
      vapiAssistant: true,
      calls: {
        orderBy: { startedAt: 'desc' },
        take: 50,
      },
      usagePeriods: {
        orderBy: { periodStart: 'desc' },
      },
      billingEvents: {
        orderBy: { createdAt: 'desc' },
      },
      auditLogs: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  });

  if (!client) return null;

  const now = new Date();
  let currentPeriod: { start: Date; end: Date } | null = null;

  if (client.billing?.billingPeriodStart && client.billing?.billingPeriodEnd) {
    currentPeriod = {
      start: new Date(client.billing.billingPeriodStart),
      end: new Date(client.billing.billingPeriodEnd),
    };
  } else {
    currentPeriod = {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
    };
  }

  const currentUsagePeriod = client.usagePeriods.find(
    (p) => new Date(p.periodStart).getTime() === currentPeriod.start.getTime()
  );

  const usedMinutes = currentUsagePeriod?.usedMinutes ?? 
    client.calls
      .filter((c) => new Date(c.startedAt) >= currentPeriod!.start && new Date(c.startedAt) <= currentPeriod!.end)
      .reduce((sum, c) => sum + c.billableMinutes, 0);

  const billing = client.billing;
  const monthlyPrice = billing?.monthlyPrice ?? 0;
  const includedMinutes = billing?.includedMinutes ?? 0;
  const overagePrice = billing?.overagePricePerMinute ?? 0;

  const usage = calculateUsage(includedMinutes, usedMinutes, monthlyPrice, overagePrice);

  const totalCalls = client.calls.length;
  const totalMinutes = client.calls.reduce((sum, c) => sum + c.billableMinutes, 0);
  const totalVapiCost = client.calls.reduce((sum, c) => sum + (c.vapiCost ?? 0), 0);

  return {
    client: {
      ...client,
      currentPeriod,
      currentUsage: usage,
      totalCalls,
      totalMinutes,
      totalVapiCost,
    },
    calls: client.calls,
    usagePeriods: client.usagePeriods,
    billingEvents: client.billingEvents,
    auditLogs: client.auditLogs,
  };
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getClientData(id);

  if (!data) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold text-ink">Klient nenalezen</h1>
        <p className="mt-2 text-muted">Klient s ID {id} neexistuje.</p>
      </div>
    );
  }

  return <ClientDetailTabs data={data} />;
}