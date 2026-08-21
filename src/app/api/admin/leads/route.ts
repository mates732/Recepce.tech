import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin";
import { readLeads } from "@/services/leadsStore";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const leads = await readLeads();
  leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ leads });
}
