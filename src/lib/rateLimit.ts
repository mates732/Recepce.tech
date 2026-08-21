import "server-only";

interface RateLimitEntry {
  count: number;
  reset: number;
}

const limits = new Map<string, RateLimitEntry>();

/**
 * Sdílený in-memory rate limiter pro API routes.
 * Vrací true, pokud je požadavek povolen, false při překročení limitu.
 */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = limits.get(key);

  if (entry) {
    if (now > entry.reset) {
      limits.set(key, { count: 1, reset: now + windowMs });
      return true;
    }
    if (entry.count >= max) return false;
    entry.count++;
    return true;
  }

  limits.set(key, { count: 1, reset: now + windowMs });
  return true;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Ověření původu požadavku. Chybí-li Origin (curl, server-to-server),
 * požadavek prochází; je-li Origin přítomen, musí odpovídat hostiteli
 * požadavku (same-origin), jinak je odmítnut.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("host") ?? "";
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
