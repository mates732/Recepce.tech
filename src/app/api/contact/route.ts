import { NextRequest, NextResponse } from "next/server";
import { submitContactMessage } from "@/services/contact";
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
    if (!rateLimit(`contact:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    if (body._hp) {
      return NextResponse.json({ success: true });
    }

    const result = await submitContactMessage({
      name: body.name ?? "",
      email: body.email ?? "",
      phone: body.phone ?? "",
      message: body.message ?? "",
    });

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
