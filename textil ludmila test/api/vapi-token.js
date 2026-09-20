// Vercel serverless funkce: GET /api/vapi-token (rewrite z /vapi-token)
// Vyda krátkodobý veřejný Vapi JWT (HS256, 30 min) omezený na:
//   - konkrétního asistenta (ASSISTANT_ID)
//   - povolené originy (localhost, *.vercel.app, volitelně ALLOWED_ORIGIN)
// Soukromý klíč (VAPI_PRIVATE_KEY) zůstává na serveru.

import {
  requireConfig,
  createPublicVapiJwt,
  resolveAllowedOrigins,
  rateLimit,
  clientIp,
} from '../lib/vapi-lib.js';

const TOKEN_TTL_SECONDS = 30 * 60;

export default async function handler(req, res) {
  const { publicKey, assistantId, privateKey, orgId } = requireConfig();

  // Fallback režim: bez privátního klíče dáme strukturální odpověď,
  // na kterou stránka zareaguje přepnutím na public key.
  if (!privateKey || !orgId) {
    res.status(503).setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify({
      error: 'Secure mode není nakonfigurován – doplňte VAPI_PRIVATE_KEY a ORG_ID do proměnných projektu na Vercelu.',
    }));
    return;
  }

  if (!assistantId) {
    res.status(500).setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Chybí ASSISTANT_ID v proměnných projektu.' }));
    return;
  }

  // Rate limit – jen hrubá brzda proti automatizovanému vytahování tokenů.
  if (!rateLimit(clientIp(req))) {
    res.status(429).setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Retry-After', '120');
    res.end(JSON.stringify({ error: 'Příliš mnoho požadavků – zkuste to za chvíli.' }));
    return;
  }

  const allowedOrigins = resolveAllowedOrigins(
    req.headers.origin || '',
    req.headers.host || '',
    String(req.headers['x-forwarded-proto'] || 'https'),
  );

  try {
    const token = createPublicVapiJwt({
      privateKey,
      orgId,
      assistantId,
      allowedOrigins,
      ttlSeconds: TOKEN_TTL_SECONDS,
    });

    res.status(200).setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify({
      token,
      assistantId,
      expiresIn: TOKEN_TTL_SECONDS,
      secureMode: true,
      // Jen diagnostika – žádné tajné údaje.
      allowedOrigins,
      fallbackPublicKey: publicKey || null,
    }));
  } catch (error) {
    res.status(500).setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({
      error: 'Nepodařilo se vytvořit token: ' + (error && error.message ? error.message : error),
    }));
  }
}
