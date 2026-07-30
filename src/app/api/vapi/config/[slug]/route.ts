import { NextResponse } from "next/server";
import { DEMOS, getDemo, getAssistantConfig } from "@/config/vapi";

const SLUG_PATTERN = /^[a-z0-9-]+$/;

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug || !SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ error: "invalid slug" }, { status: 400 });
  }

  if (slug.length > 64) {
    return NextResponse.json({ error: "slug too long" }, { status: 400 });
  }

  const demo = getDemo(slug) ?? DEMOS.find((d) => d.slugs?.includes(slug));

  if (!demo) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const config = getAssistantConfig(demo.industry);
  return NextResponse.json(config, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
