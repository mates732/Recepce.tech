import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { env } from '@/lib/env';
import { prisma } from '@/lib/db/prisma';
import { verifyVapiWebhookSignature, parseVapiWebhookPayload, calculateCallBillableMinutes, getVapiCallCost } from '@/lib/vapi/client';
import { calculateBillableMinutes } from '@/lib/billing/calculations';
import { AuditAction, WebhookEventStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  const headersList = await headers();
  const signature = headersList.get('x-vapi-signature') ?? '';
  const body = await request.text();

  if (!verifyVapiWebhookSignature(body, signature, env.VAPI_SERVER_SECRET)) {
    console.error('[Vapi Webhook] Invalid signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const webhookPayload = parseVapiWebhookPayload(payload);
  if (!webhookPayload) {
    return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 });
  }

  const { message } = webhookPayload;
  const call = message.call;

  if (!call || !call.id) {
    return NextResponse.json({ error: 'Missing call data' }, { status: 400 });
  }

  const externalEventId = `${call.id}-${message.type}-${message.timestamp}`;

  const existingEvent = await prisma.webhookEvent.findUnique({
    where: { provider_externalEventId: { provider: 'vapi', externalEventId } },
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
        provider: 'vapi',
        externalEventId,
        eventType: message.type,
        payloadHash: Buffer.from(body).toString('base64').slice(0, 64),
        status: WebhookEventStatus.PROCESSING,
      },
    });
  }

  try {
    if (message.type === 'end-of-call-report' || message.type === 'call-ended') {
      await processEndOfCall(call, externalEventId, message.type);
    }

    await prisma.webhookEvent.update({
      where: { provider_externalEventId: { provider: 'vapi', externalEventId } },
      data: { status: WebhookEventStatus.PROCESSED, processedAt: new Date() },
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Vapi Webhook] Processing error:', error);
    await prisma.webhookEvent.update({
      where: { provider_externalEventId: { provider: 'vapi', externalEventId } },
      data: { status: WebhookEventStatus.FAILED, error: String(error) },
    });
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}

async function processEndOfCall(call: any, externalEventId: string, eventType: string) {
  const assistantId: string = call.assistantId;
  if (!assistantId) {
    throw new Error('Missing assistantId in call');
  }

  const vapiAssistant = await prisma.vapiAssistant.findUnique({
    where: { assistantId } as any,
    include: { client: { include: { billing: true } } },
  }) as any;

  if (!vapiAssistant || !vapiAssistant.client) {
    throw new Error(`No client found for assistant ${assistantId}`);
  }

  const client = vapiAssistant.client;
  const billing = client.billing;
  if (!billing) {
    throw new Error(`No billing config for client ${client.id}`);
  }

  const existingCall = await prisma.call.findUnique({
    where: { vapiCallId: call.id },
  });

  if (existingCall) {
    console.log(`[Vapi Webhook] Call ${call.id} already processed, skipping`);
    await prisma.webhookEvent.update({
      where: { provider_externalEventId: { provider: 'vapi', externalEventId } },
      data: { status: WebhookEventStatus.DUPLICATE },
    });
    return;
  }

  const billableMinutes = calculateCallBillableMinutes(call);
  const vapiCost = getVapiCallCost(call);

  const callRecord = await prisma.call.create({
    data: {
      clientId: client.id,
      vapiCallId: call.id,
      startedAt: new Date(call.startedAt),
      endedAt: call.endedAt ? new Date(call.endedAt) : null,
      durationSeconds: call.duration ? Math.floor(call.duration) : null,
      billableMinutes,
      vapiCost,
      status: mapCallStatus(call.status),
      metadata: {
        endedReason: call.endedReason,
        costBreakdown: call.costBreakdown,
        recordingUrl: call.recordingUrl,
        transcript: call.transcript ? 'available' : 'unavailable',
        customerNumber: call.customer?.number,
      },
    },
  });

  await updateUsagePeriod(client.id, billing, billableMinutes, vapiCost);
  await updateVapiAssistantLastWebhook(vapiAssistant.id);

  await prisma.auditLog.create({
    data: {
      actor: 'vapi-webhook',
      action: AuditAction.VAPI_WEBHOOK_PROCESSED,
      entity: 'Call',
      entityId: callRecord.id,
      clientId: client.id,
      metadata: {
        vapiCallId: call.id,
        billableMinutes,
        vapiCost,
        eventType,
      },
    },
  });

  console.log(`[Vapi Webhook] Processed call ${call.id} for client ${client.name}: ${billableMinutes} min, ${vapiCost} cost`);
}

function mapCallStatus(status: string): 'ENDED' | 'ONGOING' | 'FAILED' | 'MISSED' {
  switch (status?.toLowerCase()) {
    case 'ended':
    case 'completed':
      return 'ENDED';
    case 'ongoing':
    case 'in-progress':
      return 'ONGOING';
    case 'failed':
    case 'error':
      return 'FAILED';
    case 'missed':
    case 'no-answer':
      return 'MISSED';
    default:
      return 'ENDED';
  }
}

async function updateUsagePeriod(
  clientId: string,
  billing: any,
  billableMinutes: number,
  vapiCost: number
) {
  const now = new Date();
  let periodStart: Date;
  let periodEnd: Date;

  if (billing.billingPeriodStart && billing.billingPeriodEnd) {
    periodStart = new Date(billing.billingPeriodStart);
    periodEnd = new Date(billing.billingPeriodEnd);
    if (now < periodStart || now > periodEnd) {
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }
  } else {
    periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  }

  const usagePeriod = await prisma.usagePeriod.upsert({
    where: {
      clientId_periodStart: {
        clientId,
        periodStart,
      },
    },
    create: {
      clientId,
      periodStart,
      periodEnd,
      includedMinutes: billing.includedMinutes,
      usedMinutes: billableMinutes,
      overageMinutes: Math.max(0, billableMinutes - billing.includedMinutes),
      overageAmount: Math.max(0, billableMinutes - billing.includedMinutes) * billing.overagePricePerMinute,
      estimatedTotal: billing.monthlyPrice + Math.max(0, billableMinutes - billing.includedMinutes) * billing.overagePricePerMinute,
    },
    update: {
      usedMinutes: { increment: billableMinutes },
      overageMinutes: { increment: Math.max(0, billableMinutes - billing.includedMinutes) },
      overageAmount: { increment: Math.max(0, billableMinutes - billing.includedMinutes) * billing.overagePricePerMinute },
      estimatedTotal: { increment: Math.max(0, billableMinutes - billing.includedMinutes) * billing.overagePricePerMinute },
    },
  });

  await checkAndCreateAlerts(clientId, usagePeriod, billing);

  await prisma.auditLog.create({
    data: {
      actor: 'system',
      action: AuditAction.USAGE_RECALCULATED,
      entity: 'UsagePeriod',
      entityId: usagePeriod.id,
      clientId,
      metadata: {
        periodStart: periodStart.toISOString(),
        usedMinutes: usagePeriod.usedMinutes + billableMinutes,
        overageMinutes: usagePeriod.overageMinutes + Math.max(0, billableMinutes - billing.includedMinutes),
      },
    },
  });
}

async function checkAndCreateAlerts(
  clientId: string,
  usagePeriod: any,
  billing: any
) {
  const usagePercentage = billing.includedMinutes > 0
    ? Math.round((usagePeriod.usedMinutes / billing.includedMinutes) * 100)
    : 0;

  const thresholds = [80, 90, 100, 110];
  const currentThreshold = thresholds.find(t => usagePercentage >= t);

  if (!currentThreshold) return;

  const existingAlert = await prisma.auditLog.findFirst({
    where: {
      clientId,
      action: AuditAction.ALERT_CREATED,
      entity: 'UsageAlert',
      metadata: {
        path: ['threshold'],
        equals: currentThreshold,
      },
      createdAt: {
        gte: usagePeriod.periodStart,
        lte: usagePeriod.periodEnd,
      },
    },
  });

  if (existingAlert) return;

  await prisma.auditLog.create({
    data: {
      actor: 'system',
      action: AuditAction.ALERT_CREATED,
      entity: 'UsageAlert',
      entityId: `${clientId}-${usagePeriod.id}-${currentThreshold}`,
      clientId,
      metadata: {
        threshold: currentThreshold,
        usagePercentage,
        usedMinutes: usagePeriod.usedMinutes,
        includedMinutes: billing.includedMinutes,
        overageMinutes: usagePeriod.overageMinutes,
        overageAmount: usagePeriod.overageAmount,
      },
    },
  });
}

async function updateVapiAssistantLastWebhook(vapiAssistantId: string) {
  await prisma.vapiAssistant.update({
    where: { id: vapiAssistantId },
    data: { lastWebhookAt: new Date() },
  });
}