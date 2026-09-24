import {
  getVapiConfig,
  isVapiConfigured,
  isVapiDemoSlug,
} from '@/lib/vapi/server';

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const slug =
    typeof body === 'object' && body !== null && 'slug' in body
      ? body.slug
      : undefined;

  if (!isVapiDemoSlug(slug)) {
    return Response.json({ error: 'Unknown demo.' }, { status: 400 });
  }

  if (!isVapiConfigured(slug)) {
    return Response.json(
      { error: 'This demo is not configured yet.' },
      { status: 503 },
    );
  }

  const { assistantId, browserPublicKey } = getVapiConfig(slug);

  if (!browserPublicKey || !assistantId) {
    return Response.json(
      { error: 'This demo is missing its browser configuration.' },
      { status: 503 },
    );
  }

  // Vapi's browser SDK needs the public key and assistant ID. The private
  // API key (VAPI_API_KEY) is server-only and is never included in this response.
  return Response.json({ ready: true, publicKey: browserPublicKey, assistantId });
}
