import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin";
import { listMedia, saveUpload, deleteMedia, setMediaAlt } from "@/services/media";

export const dynamic = "force-dynamic";

async function authorize(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function GET(request: NextRequest) {
  if (!(await authorize(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const items = await listMedia();
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  if (!(await authorize(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing file" }, { status: 400 });
  }

  try {
    const item = await saveUpload(file);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "upload failed" },
      { status: 422 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await authorize(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get("path");

  if (!filePath || !filePath.startsWith("/images/uploads/")) {
    return NextResponse.json({ error: "invalid path" }, { status: 400 });
  }

  const result = await deleteMedia(filePath);
  if (!result.ok) {
    if (result.reason === "not found") {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "file is in use", references: result.references },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: NextRequest) {
  if (!(await authorize(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const { path: filePath, alt } = body as { path?: unknown; alt?: unknown };
  if (typeof filePath !== "string" || !filePath.startsWith("/images/uploads/")) {
    return NextResponse.json({ error: "invalid path" }, { status: 400 });
  }
  if (typeof alt !== "string" || alt.length > 500) {
    return NextResponse.json({ error: "invalid alt" }, { status: 400 });
  }

  await setMediaAlt(filePath, alt);
  return NextResponse.json({ ok: true });
}
