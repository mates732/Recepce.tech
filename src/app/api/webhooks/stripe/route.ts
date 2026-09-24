import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { env } from '@/lib/env';
import { prisma } from '@/lib/db/prisma';
import { stripe, verifyStripeWebhookSignature } from '@/lib/stripe/client';
import { AuditAction, WebhookEventStatus, BillingEventStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') ?? '';
  const body = await request.text();

  let event;
  try {
    event = verifyStripeWebhookSignature(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error('[Stripe Webhook] Invalid signature:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const existingEvent = await prisma.webhookEvent.findUnique({
    where: { provider_externalEventId: { provider: 'stripe', externalEventId: event.id } },
  });

  if (existingEvent) {
    if (existingEvent.status === WebhookEventStatus.PROCESSED) {
      return NextResponse.json({ received: true, duplicate: true });
    }
    await prisma.webhookEvent.update({
      where: { id: existingEvent.id },
      data: { status: WebhookEventStatus.PROCESSING },
    });
  } else {
    await prisma.webhookEvent.create({
      data: {
        provider: 'stripe',
        externalEventId: event.id,
        eventType: event.type,
        payloadHash: Buffer.from(body).toString('base64').slice(0, 64),
        status: WebhookEventStatus.PROCESSING,
      },
    });
  }

  try {
    await processStripeEvent(event);

    await prisma.webhookEvent.update({
      where: { provider_externalEventId: { provider: 'stripe', externalEventId: event.id } },
      data: { status: WebhookEventStatus.PROCESSED, processedAt: new Date() },
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook] Processing error:', error);
    await prisma.webhookEvent.update({
      where: { provider_externalEventId: { provider: 'stripe', externalEventId: event.id } },
      data: { status: WebhookEventStatus.FAILED, error: String(error) },
    });
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}

async function processStripeEvent(event: any) {
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionChange(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
    case 'invoice.finalized':
      await handleInvoiceFinalized(event.data.object);
      break;
    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
  }

  await prisma.auditLog.create({
    data: {
      actor: 'stripe-webhook',
      action: AuditAction.STRIPE_WEBHOOK_PROCESSED,
      entity: 'StripeEvent',
      entityId: event.id,
      metadata: { eventType: event.type },
    },
  });
}

async function handleSubscriptionChange(subscription: any) {
  const clientId = subscription.metadata?.clientId;
  if (!clientId) return;

  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) return;

  const billing = await prisma.clientBilling.findUnique({ where: { clientId } });
  if (!billing) return;

  const status = mapStripeSubscriptionStatus(subscription.status);
  const periodStart = new Date(subscription.current_period_start * 1000);
  const periodEnd = new Date(subscription.current_period_end * 1000);

  await prisma.clientBilling.update({
    where: { clientId },
    data: {
      stripeSubscriptionId: subscription.id,
      stripeSubscriptionItemId: subscription.items.data[0]?.id,
      billingPeriodStart: periodStart,
      billingPeriodEnd: periodEnd,
    },
  });

  await prisma.client.update({
    where: { id: clientId },
    data: { status: status === 'ACTIVE' ? 'ACTIVE' : 'PAUSED' },
  });

  await prisma.auditLog.create({
    data: {
      actor: 'stripe-webhook',
      action: AuditAction.STRIPE_WEBHOOK_PROCESSED,
      entity: 'Subscription',
      entityId: subscription.id,
      clientId,
      metadata: {
        status: subscription.status,
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString(),
      },
    },
  });
}

async function handleSubscriptionDeleted(subscription: any) {
  const clientId = subscription.metadata?.clientId;
  if (!clientId) return;

  await prisma.clientBilling.update({
    where: { clientId },
    data: {
      stripeSubscriptionId: null,
      stripeSubscriptionItemId: null,
    },
  });

  await prisma.client.update({
    where: { id: clientId },
    data: { status: 'CANCELLED' },
  });

  await prisma.auditLog.create({
    data: {
      actor: 'stripe-webhook',
      action: AuditAction.STRIPE_WEBHOOK_PROCESSED,
      entity: 'Subscription',
      entityId: subscription.id,
      clientId,
      metadata: { status: 'canceled' },
    },
  });
}

async function handlePaymentSucceeded(invoice: any) {
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const clientId = subscription.metadata?.clientId;
  if (!clientId) return;

  await prisma.billingEvent.upsert({
    where: {
      clientId_periodId_type_stripeEventId: {
        clientId,
        periodId: '',
        type: 'SUBSCRIPTION_BASE',
        stripeEventId: invoice.id,
      },
    },
    create: {
      clientId,
      type: 'SUBSCRIPTION_BASE',
      amount: invoice.amount_paid,
      stripeEventId: invoice.id,
      status: BillingEventStatus.BILLED,
      metadata: { invoiceNumber: invoice.number },
    },
    update: {
      status: BillingEventStatus.BILLED,
    },
  });
}

async function handlePaymentFailed(invoice: any) {
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const clientId = subscription.metadata?.clientId;
  if (!clientId) return;

  await prisma.client.update({
    where: { id: clientId },
    data: { status: 'PAUSED' },
  });

  await prisma.auditLog.create({
    data: {
      actor: 'stripe-webhook',
      action: AuditAction.BILLING_ERROR,
      entity: 'Invoice',
      entityId: invoice.id,
      clientId,
      metadata: { reason: 'payment_failed', attemptCount: invoice.attempt_count },
    },
  });
}

async function handleInvoiceFinalized(invoice: any) {
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const clientId = subscription.metadata?.clientId;
  if (!clientId) return;
}

function mapStripeSubscriptionStatus(status: string): 'ACTIVE' | 'PAUSED' | 'CANCELLED' {
  switch (status) {
    case 'active':
    case 'trialing':
      return 'ACTIVE';
    case 'past_due':
    case 'unpaid':
    case 'incomplete':
    case 'incomplete_expired':
      return 'PAUSED';
    case 'canceled':
      return 'CANCELLED';
    case 'paused':
      return 'PAUSED';
    default:
      return 'PAUSED';
  }
}