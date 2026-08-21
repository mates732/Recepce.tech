import { NextResponse } from "next/server";

const ORIGIN = "https://www.ponici.cz";
const TTL = 60_000;

let cache: { html: string; at: number } | null = null;

/**
 * Server-side proxy pro live preview PONICI.CZ.
 *
 * ponici.cz posílá `X-Frame-Options: DENY`, takže ho nelze vložit do iframe
 * přímo. Tento route stáhne HTML serverově, přepíše relativní asset URL na
 * absolutní ponici.cz a vrátí dokument bez restrikce framingu — iframe tak
 * může zobrazit skutečný web (stejný princip jako embedded preview u Zlatého
 * Hřebenu). SSR obsah je v HTML, takže preview funguje i bez plné hydratace.
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get("path") ?? "/";
  const target = `${ORIGIN}${path}`;

  if (cache && path === "/" && Date.now() - cache.at < TTL) {
    return proxyResponse(cache.html);
  }

  try {
    const res = await fetch(target, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        accept: "text/html,application/xhtml+xml",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return new Response("Preview unavailable", { status: 502 });
    }

    let html = await res.text();

    // asset URL → absolute ponici.cz
    html = html.replace(
      /(["'])\/(assets|images|_next|favicon[^"']*)/g,
      `$1${ORIGIN}/$2`
    );
    // internal nav links → keep inside the proxied preview
    html = html.replace(
      /(<a[^>]*href=")\/([^"#?]*)"?/g,
      `$1/api/ponici-preview?path=/$2"`
    );
    // normalize the path to "/" before the SPA boots, so hydration renders
    // the homepage instead of a client-side 404 for the proxy path
    html = html.replace(
      "<head>",
      `<head><script>try{if(location.pathname!=="/")history.replaceState(null,"","/")}catch(e){}</script>`
    );

    if (path === "/") {
      cache = { html, at: Date.now() };
    }

    return proxyResponse(html);
  } catch {
    return new Response("Preview unavailable", { status: 502 });
  }
}

function proxyResponse(html: string) {
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=60",
    },
  });
}
