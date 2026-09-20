// Lokální dev server pro testovací stránku Vapi asistenta.
// Spuštění: npm run dev  (nebo node server.mjs)
//
// Poskytuje:
//   GET /            -> index.html (a další statické soubory)
//   GET /config      -> publicKey + assistantId z .env (fallback režim)
//   GET /vapi-token  -> krátkodobý veřejný JWT podepsaný soukromým klíčem
//                       (bezpečný režim; klíč zůstává jen na serveru)
//
// Do prohlížeče se nikdy neposílají soukromé údaje – jen veřejný JWT
// omezený na konkrétního asistenta a povolené originy.

import fs from 'node:fs';
import http from 'node:http';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseIncomingEvents,
  appendEvents,
  readEvents,
  summarizeEvents,
  periodStartFromDays,
} from '../lib/track-lib.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT || 8000);

// ----------------------------------------------------------------------
// .env načtení (bez závislostí – stačí jednoduchý parser)
// ----------------------------------------------------------------------
function loadEnv(file) {
  const values = {};
  let text = '';
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    return values;
  }
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const eq = line.indexOf('=');
    const name = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (name) values[name] = value;
  }
  return values;
}

const env = { ...loadEnv(path.join(ROOT, '.env')), ...process.env };

// JSONL úložiště pro anonymní tracking eventy dema (demo.html).
const TRACK_STORE = path.join(ROOT, '.data', 'track-events.jsonl');

const PUBLIC_KEY = env.VAPI_PUBLIC_KEY || '';
const ASSISTANT_ID = env.ASSISTANT_ID || '';
const PRIVATE_KEY = env.VAPI_PRIVATE_KEY || '';
const ORG_ID = env.ORG_ID || '';
const ALLOWED_ORIGIN = env.ALLOWED_ORIGIN || `http://localhost:${PORT}`;

// ----------------------------------------------------------------------
// Base64url helper
// ----------------------------------------------------------------------
function b64url(input) {
  return Buffer.from(input).toString('base64url');
}

// ----------------------------------------------------------------------
// Veřejný Vapi JWT (HS256) – viz https://docs.vapi.ai/customization/jwt-authentication
// ----------------------------------------------------------------------
function createPublicVapiJwt() {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    orgId: ORG_ID,
    token: {
      tag: 'public',
      restrictions: {
        enabled: true,
        allowedOrigins: [ALLOWED_ORIGIN],
        allowedAssistantIds: [ASSISTANT_ID],
        allowTransientAssistant: false,
      },
    },
  };
  const now = Math.floor(Date.now() / 1000);
  payload.iat = now;
  payload.exp = now + 60 * 30; // platnost 30 minut

  const signingInput = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  const signature = crypto.createHmac('sha256', PRIVATE_KEY).update(signingInput).digest('base64url');
  return `${signingInput}.${signature}`;
}

// ----------------------------------------------------------------------
// HTTP odpovědi
// ----------------------------------------------------------------------
function sendJson(res, status, data) {
  const body = Buffer.from(JSON.stringify(data));
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': body.length,
  });
  res.end(body);
}

function sendText(res, status, text) {
  const body = Buffer.from(text);
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': body.length,
  });
  res.end(body);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendText(res, 404, 'Nenalezeno: ' + path.basename(filePath));
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'Content-Length': data.length,
    });
    res.end(data);
  });
}

// ----------------------------------------------------------------------
// Server
// ----------------------------------------------------------------------
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (pathname === '/config') {
    // Fallback režim – jen veřejné údaje.
    sendJson(res, 200, { publicKey: PUBLIC_KEY, assistantId: ASSISTANT_ID, secureMode: false });
    return;
  }

  if (pathname === '/vapi-token') {
    if (!PRIVATE_KEY || !ORG_ID) {
      sendJson(res, 503, { error: 'Secure mode není nakonfigurován – doplňte VAPI_PRIVATE_KEY a ORG_ID do .env.' });
      return;
    }
    try {
      const token = createPublicVapiJwt();
      sendJson(res, 200, { token, assistantId: ASSISTANT_ID, expiresIn: 1800, secureMode: true });
    } catch (error) {
      sendJson(res, 500, { error: 'Nepodařilo se vytvořit token: ' + (error && error.message ? error.message : error) });
    }
    return;
  }

  // --------------------------------------------------------------------
  // Tracking dema: POST /track (dávka eventů), GET /track?days=1 (souhrn
  // pro denní digest, který si později stáhne Telegram bot Recepce.tech).
  // --------------------------------------------------------------------
  if (pathname === '/track') {
    if (req.method === 'GET') {
      const sinceTs = periodStartFromDays(url.searchParams.get('days') || 1);
      const summary = summarizeEvents(readEvents(TRACK_STORE), sinceTs);
      sendJson(res, 200, summary);
      return;
    }
    if (req.method === 'POST') {
      let raw = '';
      req.on('data', (chunk) => {
        raw += chunk;
        if (raw.length > 64 * 1024) req.destroy(); // pojistka proti hloupě velkým tělům
      });
      req.on('end', () => {
        let body = null;
        try { body = JSON.parse(raw); } catch { body = null; }
        const events = parseIncomingEvents(body);
        try {
          appendEvents(TRACK_STORE, events);
        } catch (error) {
          console.error('[track] uložení selhalo:', error && error.message ? error.message : error);
        }
        res.writeHead(204);
        res.end();
      });
      return;
    }
    sendText(res, 405, 'Použijte GET nebo POST');
    return;
  }

  if (pathname === '/' || pathname === '/index.html') {
    sendFile(res, path.join(ROOT, 'index.html'));
    return;
  }

  // Ostatní soubory jen z kořenového adresáře projektu (bez traversalu).
  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(ROOT, safePath);
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) {
    sendText(res, 403, 'Zakázáno');
    return;
  }
  sendFile(res, filePath);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server běží na http://localhost:${PORT}/index.html`);
  console.log(`  /config     -> publicKey: ${PUBLIC_KEY ? 'nalezen' : 'CHYBÍ'}, assistantId: ${ASSISTANT_ID ? 'nalezen' : 'CHYBÍ'}`);
  console.log(`  /vapi-token -> secure mode: ${(PRIVATE_KEY && ORG_ID) ? 'AKTIVNÍ' : 'není nakonfigurován (VAPI_PRIVATE_KEY / ORG_ID)'}`);
  console.log('Ukončete tento proces pomocí Ctrl+C.');
});
