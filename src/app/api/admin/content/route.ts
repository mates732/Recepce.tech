import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin";
import { CONTENT_KINDS } from "@/content/repository";
import type { ContentKind } from "@/content/types";
import { listContentItems } from "@/services/contentStore";

export const dynamic = "force-dynamic";

const VALID_KINDS = CONTENT_KINDS.map((k) => k.kind);

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind");

  if (!kind || !(VALID_KINDS as string[]).includes(kind)) {
    return NextResponse.json({ error: "invalid kind" }, { status: 400 });
  }

  const items = await listContentItems(kind as ContentKind);
  return NextResponse.json({ items });
}
