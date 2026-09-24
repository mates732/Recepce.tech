import { NextRequest } from 'next/server';
import { getVapiConfig, isVapiDemoSlug } from '@/lib/vapi/server';

/**
 * Test konzole admina — vrátí veřejný klíč a ID asistenta pro browser SDK.
 * Soukromý API klíč se nikdy neposílá do prohlížeče.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isVapiDemoSlug(id)) {
    return Response.json(
      { mode: 'unconfigured', error: 'Asistent nemá Vapi napojení.' },
      { status: 200 }
    );
  }

  const config = getVapiConfig(id);

  if (!config.browserPublicKey || !config.assistantId) {
    return Response.json({
      mode: 'simulated',
      error: 'Vapi není pro tohoto asistenta nakonfigurováno (chybí veřejný klíč nebo assistant ID).',
    });
  }

  return Response.json({
    mode: 'vapi',
    publicKey: config.browserPublicKey,
    assistantId: config.assistantId,
  });
}
