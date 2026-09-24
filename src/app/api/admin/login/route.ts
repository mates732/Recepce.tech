import { NextRequest, NextResponse } from 'next/server';
import { validateAdminPassword, createAdminSession, ADMIN_COOKIE_NAME, ADMIN_COOKIE_OPTIONS } from '@/lib/auth/admin';

export async function POST(request: NextRequest) {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { password } = body;

  if (!password || !validateAdminPassword(password)) {
    return NextResponse.json({ error: 'Neplatné heslo' }, { status: 401 });
  }

  const token = await createAdminSession();

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, token, ADMIN_COOKIE_OPTIONS);

  return response;
}