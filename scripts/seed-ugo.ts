import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.client.findUnique({ where: { slug: 'ugo-salaterie' } });
  if (existing) {
    console.log('UGO Salaterie already exists, skipping');
    return;
  }

  const client = await prisma.client.create({
    data: {
      name: 'UGO Salaterie',
      slug: 'ugo-salaterie',
      contactName: 'Provozovatel Stromovka',
      contactEmail: 'stromovka@ugosalaterie.cz',
      status: 'ACTIVE',
    },
  });

  await prisma.vapiAssistant.create({
    data: {
      clientId: client.id,
      // Bez reálného ID ve Vapi nic nespustíme — žádné vymýšlení dat.
      assistantId: process.env.VAPI_ASSISTANT_ID_UGO_STROMOVKA ?? '',
      phoneNumberId: null,
      status: 'connected',
    },
  });

  console.log('UGO Salaterie created:', client.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .then(() => prisma.$disconnect());
