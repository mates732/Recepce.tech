import { NextResponse, type NextRequest } from "next/server";
import { LOCALES } from "@/lib/types";
import { isAdminEnabled, SESSION_COOKIE, verifySessionToken } from "@/lib/admin";

const defaultLocale = "cs";

function getLocale(request: NextRequest): string {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && LOCALES.includes(segments[0] as (typeof LOCALES)[number])) {
    return segments[0];
  }
  const cookie = request.cookies.get("rt-lang")?.value;
  if (cookie && LOCALES.includes(cookie as (typeof LOCALES)[number])) {
    return cookie;
  }
  const acceptLang = request.headers.get("accept-language") || "";
  if (acceptLang.startsWith("cs") || acceptLang.startsWith("sk")) {
    return "cs";
  }
  return defaultLocale;
}

async function isAdminRequest(request: NextRequest, pathname: string): Promise<NextResponse | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!isAdminEnabled()) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname === "/admin/login") {
    if (await verifySessionToken(token)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    const response = NextResponse.next();
    response.headers.set("x-admin-route", "login");
    return response;
  }

  if (!(await verifySessionToken(token))) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const response = NextResponse.next();
  response.headers.set("x-admin-route", "shell");
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return isAdminRequest(request, pathname);
  }

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0 && LOCALES.includes(segments[0] as (typeof LOCALES)[number])) {
    const response = NextResponse.next();
    response.headers.set("x-locale", segments[0]);
    return response;
  }

  const locale = getLocale(request);
  const newUrl = new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url);
  newUrl.search = request.nextUrl.search;
  const response = NextResponse.redirect(newUrl);
  response.headers.set("x-locale", locale);
  response.cookies.set("rt-lang", locale, {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico|.*\\..*).*)"],
};
