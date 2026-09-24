import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_OPTIONS } from '@/lib/auth/admin';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, '', { ...ADMIN_COOKIE_OPTIONS, maxAge: 0 });
  return response;
}