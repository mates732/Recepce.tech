import { NextRequest, NextResponse } from "next/server";
import { submitLead } from "@/services/lead";
import { rateLimit, clientIp, isSameOrigin } from "@/lib/rateLimit";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60_000;

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json(
        { success: false, error: "Forbidden." },
        { status: 403 }
      );
    }

    const ip = clientIp(request);
    if (!rateLimit(`lead:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    if (body._hp) {
      return NextResponse.json({ success: true });
    }

    const result = await submitLead({
      source: body.source ?? "ai_audit",
      name: body.name ?? "",
      company: body.company ?? "",
      email: body.email ?? "",
      website: body.website ?? "",
      companySize: body.companySize ?? "",
      challenge: body.challenge ?? "",
      companyProfile: body.companyProfile ?? {},
      opportunities: body.opportunities ?? [],
      topOpportunity: body.topOpportunity ?? "",
      selectedOpportunity: body.selectedOpportunity ?? "",
      auditCompletionTime: body.auditCompletionTime ?? 0,
      answers: body.answers ?? {},
      createdAt: body.createdAt ?? new Date().toISOString(),
    });

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead form error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
