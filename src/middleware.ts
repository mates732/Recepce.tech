import { NextResponse, type NextRequest } from "next/server";

const locales = ["cs", "en"];
const defaultLocale = "cs";

function getLocale(request: NextRequest): string {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && locales.includes(segments[0])) {
    return segments[0];
  }
  const cookie = request.cookies.get("rt-lang")?.value;
  if (cookie && locales.includes(cookie)) {
    return cookie;
  }
  const acceptLang = request.headers.get("accept-language") || "";
  if (acceptLang.startsWith("cs") || acceptLang.startsWith("sk")) {
    return "cs";
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0 && locales.includes(segments[0])) {
    return NextResponse.next();
  }

  const locale = getLocale(request);
  const newUrl = new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url);
  newUrl.search = request.nextUrl.search;
  const response = NextResponse.redirect(newUrl);
  response.cookies.set("rt-lang", locale, { maxAge: 60 * 60 * 24 * 365 });
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico|.*\\..*).*)"],
};
