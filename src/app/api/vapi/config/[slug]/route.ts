import { NextResponse } from "next/server";
import { DEMOS, getDemo, getAssistantConfig } from "@/config/vapi";
import { VAPI_ASSISTANTS } from "@/lib/vapiConfig";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const demo = getDemo(slug) ?? DEMOS.find((d) => d.slugs?.includes(slug));

  if (demo) {
    const config = getAssistantConfig(demo.industry);
    return NextResponse.json(config, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }

  const legacy = VAPI_ASSISTANTS[slug];
  if (legacy) {
    return NextResponse.json(legacy, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }

  return NextResponse.json({ error: "not found" }, { status: 404 });
}
