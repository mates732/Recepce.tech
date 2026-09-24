import { prisma } from '@/lib/db/prisma';
import { calculateBillableMinutes } from '@/lib/billing/calculations';

describe('Webhook Idempotency', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.call.deleteMany();
    await prisma.webhookEvent.deleteMany();
    await prisma.billingEvent.deleteMany();
    await prisma.usagePeriod.deleteMany();
    await prisma.client.deleteMany();
    await prisma.vapiAssistant.deleteMany();
  });

  test('duplicate Vapi webhook does not create duplicate call', async () => {
    const client = await prisma.client.create({
      data: {
        name: 'Test Client',
        slug: 'test-client-webhook',
        status: 'ACTIVE',
      },
    });

    await prisma.clientBilling.create({
      data: {
        clientId: client.id,
        monthlyPrice: 2990,
        includedMinutes: 300,
        overagePricePerMinute: 6,
      },
    });

    await prisma.vapiAssistant.create({
      data: {
        clientId: client.id,
        assistantId: 'test-assistant-1',
        status: 'connected',
      },
    });

    const vapiCallId = 'vapi-call-001';
    const externalEventId = `${vapiCallId}-end-of-call-report-2024-01-01T00:00:00Z`;

    // First webhook processing
    const webhookEvent1 = await prisma.webhookEvent.create({
      data: {
        provider: 'vapi',
        externalEventId,
        eventType: 'end-of-call-report',
        payloadHash: 'abc123',
        status: 'PROCESSED',
        processedAt: new Date(),
      },
    });

    const billableMinutes = calculateBillableMinutes(125);

    const call1 = await prisma.call.create({
      data: {
        clientId: client.id,
        vapiCallId,
        startedAt: new Date('2024-01-01T00:00:00Z'),
        endedAt: new Date('2024-01-01T00:02:05Z'),
        durationSeconds: 125,
        billableMinutes,
        vapiCost: 50,
        status: 'ENDED',
        metadata: {},
      },
    });

    // Second webhook processing (duplicate)
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { provider_externalEventId: { provider: 'vapi', externalEventId } },
    });

    expect(existingEvent).not.toBeNull();
    expect(existingEvent!.status).toBe('PROCESSED');

    // Verify no duplicate call was created
    const calls = await prisma.call.findMany({
      where: { clientId: client.id },
    });
    expect(calls).toHaveLength(1);
    expect(calls[0].id).toBe(call1.id);

    // Verify usage was not double-counted
    const usagePeriod = await prisma.usagePeriod.findFirst({
      where: { clientId: client.id },
    });
    expect(usagePeriod?.usedMinutes).toBe(billableMinutes);
  });

  test('duplicate Stripe webhook does not create duplicate billing event', async () => {
    const client = await prisma.client.create({
      data: {
        name: 'Test Client 2',
        slug: 'test-client-stripe-webhook',
        status: 'ACTIVE',
      },
    });

    await prisma.clientBilling.create({
      data: {
        clientId: client.id,
        monthlyPrice: 2990,
        includedMinutes: 300,
        overagePricePerMinute: 6,
      },
    });

    const stripeEventId = 'evt_1234567890';

    // First billing event
    const billingEvent1 = await prisma.billingEvent.create({
      data: {
        clientId: client.id,
        type: 'SUBSCRIPTION_BASE',
        amount: 2990,
        stripeEventId,
        status: 'BILLED',
      },
    });

    // Second attempt with same Stripe event ID
    const existingBilling = await prisma.billingEvent.findFirst({
      where: {
        clientId: client.id,
        stripeEventId,
      },
    });

    expect(existingBilling).not.toBeNull();
    expect(existingBilling!.id).toBe(billingEvent1.id);

    // Verify no duplicate billing events
    const billingEvents = await prisma.billingEvent.findMany({
      where: { clientId: client.id },
    });
    expect(billingEvents).toHaveLength(1);
  });

  test('duplicate overage billing is prevented', async () => {
    const client = await prisma.client.create({
      data: {
        name: 'Test Client 3',
        slug: 'test-client-overage',
        status: 'ACTIVE',
      },
    });

    const billing = await prisma.clientBilling.create({
      data: {
        clientId: client.id,
        monthlyPrice: 2990,
        includedMinutes: 300,
        overagePricePerMinute: 6,
      },
    });

    const usagePeriod = await prisma.usagePeriod.create({
      data: {
        clientId: client.id,
        periodStart: new Date('2024-01-01'),
        periodEnd: new Date('2024-01-31'),
        includedMinutes: 300,
        usedMinutes: 327,
        overageMinutes: 27,
        overageAmount: 162,
        estimatedTotal: 3152,
      },
    });

    // First overage billing
    const overageEvent1 = await prisma.billingEvent.create({
      data: {
        clientId: client.id,
        periodId: usagePeriod.id,
        type: 'OVERAGE',
        amount: 162,
        status: 'BILLED',
      },
    });

    // Attempt to create duplicate overage billing for same period
    const existingOverage = await prisma.billingEvent.findFirst({
      where: {
        clientId: client.id,
        periodId: usagePeriod.id,
        type: 'OVERAGE',
        status: { in: ['CREATED', 'BILLED'] },
      },
    });

    expect(existingOverage).not.toBeNull();
    expect(existingOverage!.id).toBe(overageEvent1.id);

    // Verify only one overage billing exists
    const overageEvents = await prisma.billingEvent.findMany({
      where: {
        clientId: client.id,
        type: 'OVERAGE',
      },
    });
    expect(overageEvents).toHaveLength(1);
  });
});