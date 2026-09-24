import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.client.findUnique({ where: { slug: 'textil-ludmila' } });
  if (existing) {
    console.log('Textil Ludmila already exists, skipping');
    return;
  }

  const client = await prisma.client.create({
    data: {
      name: 'Textil Ludmila',
      slug: 'textil-ludmila',
      contactName: 'Ludmila',
      contactEmail: null,
      status: 'ACTIVE',
    },
  });

  await prisma.clientBilling.create({
    data: {
      clientId: client.id,
      currency: 'CZK',
      monthlyPrice: 2990,
      includedMinutes: 300,
      overagePricePerMinute: 6,
    },
  });

  await prisma.vapiAssistant.create({
    data: {
      clientId: client.id,
      assistantId: process.env.VAPI_ASSISTANT_ID_LUDMILA ?? '',
      phoneNumberId: null,
      status: 'connected',
    },
  });

  console.log('Textil Ludmila created:', client.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });