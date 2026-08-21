import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin";
import { listAuditEvents } from "@/services/audit";
import type { ContentKind } from "@/content/types";

const VALID_KINDS: ContentKind[] = ["project", "profession", "page", "site"];

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const entityKind = searchParams.get("entityKind");
  const entityId = searchParams.get("entityId");
  const actor = searchParams.get("actor");
  const limitRaw = searchParams.get("limit");

  const limit = limitRaw ? Math.min(parseInt(limitRaw, 10) || 50, 200) : 50;

  const events = await listAuditEvents({
    entityKind: entityKind && (VALID_KINDS as string[]).includes(entityKind)
      ? (entityKind as ContentKind)
      : undefined,
    entityId: entityId || undefined,
    actor: actor || undefined,
    limit,
  });

  return NextResponse.json({ events });
}
