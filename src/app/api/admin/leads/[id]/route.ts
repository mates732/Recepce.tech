import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin";
import { isLeadStatus, updateLeadStatus } from "@/services/leadsStore";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const status = typeof body.status === "string" ? body.status : "";

  if (!isLeadStatus(status)) {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  const lead = await updateLeadStatus(id, status);
  if (!lead) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json({ lead });
}
