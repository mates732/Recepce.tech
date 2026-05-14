import { NextResponse } from "next/server";
import { VAPI_ASSISTANTS } from "@/lib/vapiConfig";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const config = VAPI_ASSISTANTS[slug];
  if (!config) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(config, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
