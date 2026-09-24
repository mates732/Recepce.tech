import { SignJWT, jwtVerify } from 'jose';
import { env } from '@/lib/env';

const SECRET = new TextEncoder().encode(env.ADMIN_SESSION_SECRET);

export interface AdminSession {
  authenticated: boolean;
  loginTime: number;
}

export async function createAdminSession(): Promise<string> {
  return new SignJWT({ authenticated: true, loginTime: Date.now() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET);
}

export async function verifyAdminSession(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

export function validateAdminPassword(password: string): boolean {
  return password === env.ADMIN_PASSWORD;
}

export const ADMIN_COOKIE_NAME = 'admin_session';
export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24,
  path: '/',
};