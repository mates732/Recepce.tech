import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminSession, ADMIN_COOKIE_NAME } from '@/lib/auth/admin';

/**
 * Next.js 16 sjednocuje middleware a proxy do jediného souboru `proxy.ts`.
 * Tady běží:
 *   1. auth guard pro /admin (JWT session cookie),
 *   2. auth guard pro /api/admin/* (mimo login/logout) — 401 JSON místo redirectu,
 *   3. přesměrování /ludmila → /Ludmila (cesty rozlišují velikost písmen).
 */

const ADMIN_ROUTES = ['/admin'];

/** Admin API, která musí zůstat veřejná (přihlášení a odhlášení). */
const PUBLIC_ADMIN_API = ['/api/admin/login', '/api/admin/logout'];

async function getSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return token ? verifyAdminSession(token) : null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1) Admin API — bez platné session vracíme 401 (žádný redirect, jde o fetch).
  const isAdminApi =
    pathname.startsWith('/api/admin') &&
    !PUBLIC_ADMIN_API.some((route) => pathname.startsWith(route));

  if (isAdminApi) {
    const session = await getSession(request);

    if (!session?.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.next();
  }

  // 2) Ochrana adminu — bez platné session cookie rovnou na login.
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  if (isAdminRoute) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = token ? await verifyAdminSession(token) : null;

    if (!session?.authenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      if (token) {
        // Neplatný token — rovnou ho smaž, ať nepřežije v prohlížeči.
        response.cookies.set(ADMIN_COOKIE_NAME, '', { maxAge: 0, path: '/' });
      }
      return response;
    }
  }

  // 3) /ludmila → /Ludmila. Porovnáváme cestu přesně: matcher sám o sobě
  //    velikost písmen neřeší, takže se /Ludmila nesmí přesměrovat samo na sebe.
  if (pathname === '/ludmila') {
    const url = request.nextUrl.clone();
    url.pathname = '/Ludmila';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/ludmila', '/api/admin/:path*'],
};
