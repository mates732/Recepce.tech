import { NextResponse } from "next/server";
import { getConfigBySlug } from "@/config/vapi";
import { rateLimit, clientIp } from "@/lib/rateLimit";

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW = 60_000;

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const ip = clientIp(_request);
  if (!rateLimit(`vapi:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }

  const { slug } = await params;

  if (!slug || !SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ error: "invalid slug" }, { status: 400 });
  }

  if (slug.length > 64) {
    return NextResponse.json({ error: "slug too long" }, { status: 400 });
  }

  const config = getConfigBySlug(slug);

  if (!config) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json(config, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
