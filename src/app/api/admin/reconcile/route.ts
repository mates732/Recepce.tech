import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { env } from '@/lib/env';
import { calculateUsage, calculateBillableMinutes } from '@/lib/billing/calculations';
import { AuditAction } from '@prisma/client';

export async function POST(request: NextRequest) {
  let body: { clientId?: string; mode?: 'daily' | 'manual' | 'period-end' } | undefined;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const { clientId, mode = 'manual' } = body ?? {};

  const clients = clientId
    ? await prisma.client.findUnique({ where: { id: clientId } })
    : null;

  const clientList = clients
    ? [clients]
    : await prisma.client.findMany({
        where: { status: { in: ['ACTIVE', 'PAUSED'] } },
        include: { billing: true, vapiAssistant: true },
      });

  let results = [];

  for (const client of clientList) {
    const result = await reconcileClient(client, mode);
    results.push(result);
  }

  await prisma.auditLog.create({
    data: {
      actor: 'admin',
      action: AuditAction.BILLING_RECONCILIATION_PERFORMED,
      entity: 'Reconciliation',
      entityId: clientId ?? 'all',
      metadata: {
        mode,
        clientCount: results.length,
        results,
      },
    },
  });

  return NextResponse.json({
    reconciled: true,
    mode,
    clientCount: results.length,
    results,
  });
}

async function reconcileClient(client: any, mode: string) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const billing = client.billing;
  if (!billing) {
    return { clientId: client.id, error: 'No billing config' };
  }

  const calls = await prisma.call.findMany({
    where: {
      clientId: client.id,
      startedAt: { gte: monthStart, lte: monthEnd },
    },
  });

  const usedMinutes = calls.reduce((sum, c) => sum + c.billableMinutes, 0);
  const vapiCost = calls.reduce((sum, c) => sum + (c.vapiCost ?? 0), 0);

  const usage = calculateUsage(
    billing.includedMinutes,
    usedMinutes,
    billing.monthlyPrice,
    billing.overagePricePerMinute
  );

  const existingPeriod = await prisma.usagePeriod.findFirst({
    where: {
      clientId: client.id,
      periodStart: { gte: monthStart, lte: monthEnd },
    },
  });

  if (existingPeriod) {
    await prisma.usagePeriod.update({
      where: { id: existingPeriod.id },
      data: {
        usedMinutes: usage.usedMinutes,
        overageMinutes: usage.overageMinutes,
        overageAmount: usage.overageAmount,
        estimatedTotal: usage.estimatedTotal,
        updatedAt: now,
      },
    });
  } else {
    await prisma.usagePeriod.create({
      data: {
        clientId: client.id,
        periodStart: monthStart,
        periodEnd: monthEnd,
        includedMinutes: billing.includedMinutes,
        usedMinutes: usage.usedMinutes,
        overageMinutes: usage.overageMinutes,
        overageAmount: usage.overageAmount,
        estimatedTotal: usage.estimatedTotal,
      },
    });
  }

  const hasOverageBilled = await prisma.billingEvent.findFirst({
    where: {
      clientId: client.id,
      type: 'OVERAGE',
      status: { in: ['CREATED', 'BILLED'] },
      periodId: existingPeriod?.id,
    },
  });

  if (usage.overageAmount > 0 && !hasOverageBilled && billing.stripeSubscriptionId) {
    try {
      if (env.STRIPE_SECRET_KEY) {
        const { stripe } = await import('@/lib/stripe/client');
        await stripe.subscriptionItems.create({
          subscription: billing.stripeSubscriptionId,
          price: process.env.STRIPE_OVERAGE_PRICE_ID ?? '',
          quantity: usage.overageMinutes,
        });

        await prisma.billingEvent.create({
          data: {
            clientId: client.id,
            periodId: existingPeriod?.id,
            type: 'OVERAGE',
            amount: usage.overageAmount,
            status: 'CREATED',
          },
        });

        await prisma.auditLog.create({
          data: {
            actor: 'system',
            action: AuditAction.OVERAGE_BILLED,
            entity: 'Overage',
            entityId: client.id,
            clientId: client.id,
            metadata: {
              overageMinutes: usage.overageMinutes,
              overageAmount: usage.overageAmount,
            },
          },
        });
      }
    } catch (error) {
      console.error('[Reconciliation] Overage billing error:', error);
      await prisma.auditLog.create({
        data: {
          actor: 'system',
          action: AuditAction.BILLING_ERROR,
          entity: 'Overage',
          entityId: client.id,
          clientId: client.id,
          metadata: { error: String(error) },
        },
      });
    }
  }

  return {
    clientId: client.id,
    usedMinutes,
    overageMinutes: usage.overageMinutes,
    overageAmount: usage.overageAmount,
    estimatedTotal: usage.estimatedTotal,
    vapiCost,
  };
}