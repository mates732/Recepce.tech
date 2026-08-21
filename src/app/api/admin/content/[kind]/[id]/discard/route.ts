import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin";
import { CONTENT_KINDS } from "@/content/repository";
import type { ContentKind } from "@/content/types";
import { discardDraft } from "@/services/contentStore";

export const dynamic = "force-dynamic";

const VALID_KINDS = CONTENT_KINDS.map((k) => k.kind);

export async function POST(
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

  const removed = await discardDraft(kind as ContentKind, id);
  if (!removed) {
    return NextResponse.json({ error: "no draft found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
