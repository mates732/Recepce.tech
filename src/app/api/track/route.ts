import { NextRequest, NextResponse } from "next/server";
import { recordEvent } from "@/services/analytics";
import { rateLimit, clientIp, isSameOrigin } from "@/lib/rateLimit";

const RATE_LIMIT_MAX = 30;
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
    if (!rateLimit(`track:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)) {
      return NextResponse.json(
        { success: false, error: "Too many requests." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const event = typeof body.event === "string" ? body.event : "";
    const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
    const meta =
      body.meta && typeof body.meta === "object" ? body.meta : {};

    const recorded = await recordEvent(event, sessionId, meta);

    if (!recorded) {
      return NextResponse.json(
        { success: false, error: "Invalid event." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
