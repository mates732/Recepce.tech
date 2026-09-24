import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { listVapiCalls, calculateCallBillableMinutes, getVapiCallCost } from '@/lib/vapi/client';
import { AuditAction } from '@prisma/client';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: { vapiAssistant: true, billing: true },
  });

  if (!client) {
    return NextResponse.json({ error: 'Klient nenalezen' }, { status: 404 });
  }

  if (!client.vapiAssistant) {
    return NextResponse.json({ error: 'Vapi asistent nenalezen' }, { status: 404 });
  }

  try {
    const calls = await listVapiCalls({
      assistantId: client.vapiAssistant.assistantId,
      limit: 100,
    });

    let newCalls = 0;
    let totalMinutes = 0;
    let totalCost = 0;

    for (const vapiCall of calls) {
      const existing = await prisma.call.findUnique({
        where: { vapiCallId: vapiCall.id },
      });

      if (existing) continue;

      const billableMinutes = calculateCallBillableMinutes(vapiCall);
      const vapiCost = getVapiCallCost(vapiCall);

      await prisma.call.create({
        data: {
          clientId: client.id,
          vapiCallId: vapiCall.id,
          startedAt: new Date(vapiCall.startedAt),
          endedAt: vapiCall.endedAt ? new Date(vapiCall.endedAt) : null,
          durationSeconds: vapiCall.duration ? Math.floor(vapiCall.duration) : null,
          billableMinutes,
          vapiCost,
          status: 'ENDED',
          metadata: {
            endedReason: vapiCall.endedReason,
            customerNumber: vapiCall.customer?.number,
          },
        },
      });

      newCalls++;
      totalMinutes += billableMinutes;
      totalCost += vapiCost;
    }

    await prisma.vapiAssistant.update({
      where: { id: client.vapiAssistant.id },
      data: { lastWebhookAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        actor: 'admin',
        action: AuditAction.VAPI_WEBHOOK_PROCESSED,
        entity: 'Sync',
        entityId: client.id,
        clientId: client.id,
        metadata: {
          newCalls,
          totalMinutes,
          totalCost,
        },
      },
    });

    return NextResponse.json({
      synced: true,
      newCalls,
      totalMinutes,
      totalCost,
    });
  } catch (error) {
    console.error('[Sync Vapi] Error:', error);
    return NextResponse.json({ error: 'Synchronizace selhala' }, { status: 500 });
  }
}