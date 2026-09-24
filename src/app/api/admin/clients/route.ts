import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { env } from '@/lib/env';
import { calculateUsage } from '@/lib/billing/calculations';
import { createStripeCustomer, createStripeSubscription } from '@/lib/stripe/client';
import { AuditAction } from '@prisma/client';

export async function GET() {
  const clients = await prisma.client.findMany({
    where: { status: { in: ['ACTIVE', 'PAUSED', 'CANCELLED'] } },
    include: {
      billing: true,
      vapiAssistant: true,
      calls: {
        where: {
          startedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const currentPeriods = await prisma.usagePeriod.findMany({
    where: {
      periodStart: { gte: monthStart, lte: monthEnd },
    },
  });

  const result = clients.map((client) => {
    const billing = client.billing;
    const currentPeriod = currentPeriods.find(
      (p) => new Date(p.periodStart).getTime() === monthStart.getTime() && p.clientId === client.id
    );

    const usedMinutes = currentPeriod?.usedMinutes ??
      client.calls.reduce((sum, c) => sum + c.billableMinutes, 0);

    const usage = billing
      ? calculateUsage(
          billing.includedMinutes,
          usedMinutes,
          billing.monthlyPrice,
          billing.overagePricePerMinute
        )
      : {
          includedMinutes: 0,
          usedMinutes,
          overageMinutes: 0,
          overageAmount: 0,
          estimatedTotal: 0,
          usagePercentage: 0,
          minutesRemaining: 0,
        };

    return {
      id: client.id,
      name: client.name,
      slug: client.slug,
      status: client.status,
      monthlyPrice: billing?.monthlyPrice ?? 0,
      includedMinutes: billing?.includedMinutes ?? 0,
      overagePricePerMinute: billing?.overagePricePerMinute ?? 0,
      usedMinutes: usage.usedMinutes,
      usagePercentage: usage.usagePercentage,
      overageMinutes: usage.overageMinutes,
      overageAmount: usage.overageAmount,
      estimatedTotal: usage.estimatedTotal,
      stripeStatus: billing?.stripeSubscriptionId ? 'connected' : 'not_connected',
      vapiStatus: client.vapiAssistant ? 'connected' : 'not_connected',
      createdAt: client.createdAt.toISOString(),
    };
  });

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  let body: {
    name: string;
    slug: string;
    contactName?: string;
    contactEmail?: string;
    monthlyPrice: number;
    includedMinutes: number;
    overagePricePerMinute: number;
    vapiAssistantId: string;
    phoneNumberId?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const {
    name,
    slug,
    contactName,
    contactEmail,
    monthlyPrice,
    includedMinutes,
    overagePricePerMinute,
    vapiAssistantId,
    phoneNumberId,
  } = body;

  if (!name || !slug || !vapiAssistantId || !monthlyPrice || !includedMinutes) {
    return NextResponse.json({ error: 'Chybí povinné pole' }, { status: 400 });
  }

  const existingClient = await prisma.client.findUnique({ where: { slug } });
  if (existingClient) {
    return NextResponse.json({ error: 'Klient se stejným slug již existuje' }, { status: 409 });
  }

  const result = await prisma.$transaction(async (tx) => {
    const client = await tx.client.create({
      data: {
        name,
        slug,
        contactName: contactName ?? null,
        contactEmail: contactEmail ?? null,
        status: 'ACTIVE',
      },
    });

    let stripeCustomerId: string | null = null;
    let stripeSubscriptionId: string | null = null;
    let stripeMessage = '';

    if (env.STRIPE_SECRET_KEY) {
      const customer = await tx.clientBilling.create({
        data: {
          clientId: client.id,
          monthlyPrice,
          includedMinutes,
          overagePricePerMinute,
        },
      });

      try {
        const customerObj = await createStripeCustomer(
          contactEmail ?? '',
          name,
          { clientId: client.id, slug: client.slug }
        );
        stripeCustomerId = customerObj.id;

        const priceId = process.env.STRIPE_PRICE_ID ?? '';
        if (priceId) {
          const subscription = await createStripeSubscription(
            customerObj.id,
            priceId,
            { clientId: client.id, slug: client.slug }
          );
          stripeSubscriptionId = subscription.id;

          await tx.clientBilling.update({
            where: { id: customer.id },
            data: {
              stripeCustomerId,
              stripeSubscriptionId,
              billingPeriodStart: new Date((subscription as any).current_period_start * 1000),
              billingPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            },
          });

          stripeMessage = `Stripe zákazník (${customerObj.id}) a předplatné (${subscription.id}) vytvořeno.`;
        }
      } catch (stripeError) {
        console.error('[Client Creation] Stripe error:', stripeError);
        stripeMessage = `Stripe vytvoření selhalo: ${stripeError}`;
      }
    }

    await tx.vapiAssistant.create({
      data: {
        clientId: client.id,
        assistantId: vapiAssistantId,
        phoneNumberId: phoneNumberId ?? null,
        status: 'connected',
      },
    });

    await tx.auditLog.create({
      data: {
        actor: 'admin',
        action: AuditAction.CLIENT_CREATED,
        entity: 'Client',
        entityId: client.id,
        clientId: client.id,
        metadata: {
          name,
          slug,
          vapiAssistantId,
          stripeCustomerId,
          stripeSubscriptionId,
        },
      },
    });

    return {
      client,
      stripeCustomerId,
      stripeSubscriptionId,
      stripeMessage,
    };
  });

  return NextResponse.json(result, { status: 201 });
}