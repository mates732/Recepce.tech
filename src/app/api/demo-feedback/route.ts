import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * Post-call feedback z veřejných demo stránek (/demo, /Ludmila, …).
 * Nic citlivého — jen hodnocení 1–5, volitelný komentář a slug dema.
 */

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return Response.json({ error: 'Invalid body.' }, { status: 400 });
  }

  const { slug, assistantId, rating, comment } = body as {
    slug?: unknown;
    assistantId?: unknown;
    rating?: unknown;
    comment?: unknown;
  };

  if (typeof slug !== 'string' || slug.length === 0 || slug.length > 100) {
    return Response.json({ error: 'Missing or invalid demo slug.' }, { status: 400 });
  }

  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return Response.json({ error: 'Rating must be an integer 1–5.' }, { status: 400 });
  }

  if (comment !== undefined && (typeof comment !== 'string' || comment.length > 500)) {
    return Response.json({ error: 'Comment too long.' }, { status: 400 });
  }

  try {
    await prisma.demoFeedback.create({
      data: {
        slug,
        assistantId: typeof assistantId === 'string' && assistantId.length <= 100 ? assistantId : null,
        rating,
        comment: typeof comment === 'string' && comment.length > 0 ? comment : null,
      },
    });
  } catch (error) {
    console.error('[demo-feedback] save failed:', error);
    return Response.json({ error: 'Could not save feedback.' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
