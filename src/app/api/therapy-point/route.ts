const REQUEST_TIMEOUT_MS = 15_000;

function getReply(payload: unknown): string | null {
  if (typeof payload === 'string') return payload.trim() || null;
  if (!payload || typeof payload !== 'object') return null;

  const record = payload as Record<string, unknown>;
  for (const key of ['reply', 'answer', 'message', 'text']) {
    if (typeof record[key] === 'string' && record[key].trim()) return record[key].trim();
  }
  return record.data && typeof record.data === 'object' ? getReply(record.data) : null;
}

export async function POST(request: Request) {
  const apiUrl = process.env.THERAPY_POINT_API_URL;
  const apiKey = process.env.THERAPY_POINT_API_KEY;

  if (!apiUrl) {
    return Response.json({ error: 'Therapy Point API není nakonfigurované.' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Neplatné tělo požadavku.' }, { status: 400 });
  }

  const message =
    typeof body === 'object' && body !== null && 'message' in body && typeof body.message === 'string'
      ? body.message.trim()
      : '';
  if (!message || message.length > 2_000) {
    return Response.json({ error: 'Zpráva musí obsahovat 1 až 2 000 znaků.' }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({ message }),
      signal: controller.signal,
      cache: 'no-store',
    });
    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) return Response.json({ error: 'Therapy Point API vrátilo chybu.' }, { status: 502 });

    const reply = getReply(payload);
    if (!reply) return Response.json({ error: 'Therapy Point API vrátilo neplatná data.' }, { status: 502 });
    return Response.json({ reply });
  } catch {
    return Response.json({ error: 'Therapy Point API není momentálně dostupné.' }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}