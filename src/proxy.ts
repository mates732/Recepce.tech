import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Cesty v Next.js rozlišují velikost písmen: demo pro Textil Ludmila bydlí
 * na /Ludmila. Kdo napíše /ludmila, spadl by do placeholderu [slug] —
 * proto ho přesměrujeme na správnou podobu.
 *
 * Porovnáváme cestu přesně: matcher sám o sobě velikost písmen neřeší,
 * takže se /Ludmila nesmí přesměrovat samo na sebe.
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/ludmila') {
    const url = request.nextUrl.clone();
    url.pathname = '/Ludmila';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/ludmila',
};
