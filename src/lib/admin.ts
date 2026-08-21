import "server-only";

const SESSION_COOKIE = "admin_session";

export function isAdminEnabled(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/** Konstantní čas porovnání hesla (bez length-side-channelu). */
export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected || !password) return false;
  if (expected.length !== password.length) return false;

  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ password.charCodeAt(i);
  }
  return diff === 0;
}

async function sessionToken(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD ?? "";
  const data = new TextEncoder().encode(`admin-session:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token || !isAdminEnabled()) return false;
  const expected = await sessionToken();
  if (expected.length !== token.length) return false;

  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return diff === 0;
}

export async function createSessionToken(): Promise<string> {
  return sessionToken();
}

export { SESSION_COOKIE };
