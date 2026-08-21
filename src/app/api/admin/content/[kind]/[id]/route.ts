import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin";
import { CONTENT_KINDS, list } from "@/content/repository";
import type { ContentItem, ContentKind } from "@/content/types";
import { getItemState, saveDraft, recordDraftAudit } from "@/services/contentStore";
import { validateContentItem } from "@/services/contentValidation";

export const dynamic = "force-dynamic";

const VALID_KINDS = CONTENT_KINDS.map((k) => k.kind);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ kind: string; id: string }> }
) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { kind, id } = await params;
  if (!(VALID_KINDS as string[]).includes(kind)) {
    return NextResponse.json({ error: "invalid kind" }, { status: 400 });
  }

  const kindKey = kind as ContentKind;
  const base = list(kindKey).find((item) => item.id === id) ?? null;
  const state = await getItemState(kindKey, id);

  return NextResponse.json({
    item: state.draft ?? state.published ?? base,
    baseExists: Boolean(base),
    hasDraft: Boolean(state.draft),
    hasPublishedOverride: Boolean(state.published),
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ kind: string; id: string }> }
) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { kind, id } = await params;
  if (!(VALID_KINDS as string[]).includes(kind)) {
    return NextResponse.json({ error: "invalid kind" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const item = body as ContentItem;
  if (!item || typeof item !== "object" || item.kind !== kind || item.id !== id) {
    return NextResponse.json({ error: "item kind/id mismatch" }, { status: 400 });
  }

  const errors = validateContentItem(item);
  if (errors.length > 0) {
    return NextResponse.json({ error: "validation failed", details: errors }, { status: 422 });
  }

  await saveDraft(item);
  await recordDraftAudit(kind, id, `Draft uložen: ${itemLabel(item)}`);

  return NextResponse.json({ ok: true });
}

function itemLabel(item: ContentItem): string {
  const maybe = (item as { name?: Record<string, string>; title?: Record<string, string> }).name;
  const title = (item as { title?: Record<string, string> }).title;
  const localized = maybe ?? title;
  return localized?.cs ?? item.id;
}
