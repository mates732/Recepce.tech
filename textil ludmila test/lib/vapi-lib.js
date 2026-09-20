// Sdílená logika pro serverless funkce (api/config, api/vapi-token).
// Soukromé klíče zůstávají tady – do prohlížeče odcházejí jen krátkodobé
// JWT tokeny omezené na konkrétního asistenta a povolené originy.

import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ----------------------------------------------------------------------
// .env (lokálně; na Vercelu šlape process.env z projektu)
// ----------------------------------------------------------------------
function loadEnvFile(file) {
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

const envFile = loadEnvFile(path.join(ROOT, '.env'));
export function env(name) {
  return process.env[name] || envFile[name] || '';
}

export function requireConfig() {
  return {
    publicKey: env('VAPI_PUBLIC_KEY'),
    assistantId: env('ASSISTANT_ID'),
    privateKey: env('VAPI_PRIVATE_KEY'),
    orgId: env('ORG_ID'),
  };
}

// ----------------------------------------------------------------------
// Veřejný Vapi JWT (HS256) – viz https://docs.vapi.ai/customization/jwt-authentication
// ----------------------------------------------------------------------
export function createPublicVapiJwt({ privateKey, orgId, assistantId, allowedOrigins, ttlSeconds }) {
  const b64url = (input) => Buffer.from(input).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    orgId,
    iat: now,
    exp: now + ttlSeconds,
    token: {
      tag: 'public',
      restrictions: {
        enabled: true,
        allowedOrigins,
        allowedAssistantIds: [assistantId],
        allowTransientAssistant: false,
      },
    },
  };
  const signingInput = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  const signature = crypto.createHmac('sha256', privateKey).update(signingInput).digest('base64url');
  return `${signingInput}.${signature}`;
}

// ----------------------------------------------------------------------
// Whitelist originů: lokální vývoj, *.vercel.app a volitelná vlastní
// doména přes ALLOWED_ORIGIN. Cizí originy token nedostanou.
// ----------------------------------------------------------------------
function isAllowedOrigin(origin, extra) {
  try {
    const u = new URL(origin);
    const h = u.hostname;
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    if (h === 'localhost' || h === '127.0.0.1' || h === '[::1]') return true;
    if (h === 'vercel.app' || h.endsWith('.vercel.app')) return true;
    if (extra && origin === extra) return true;
    return false;
  } catch {
    return false;
  }
}

export function resolveAllowedOrigins(originHeader, host, proto) {
  const extra = env('ALLOWED_ORIGIN');
  const candidates = [];
  if (originHeader) candidates.push(originHeader);
  if (host) candidates.push(`${proto}://${host}`);
  if (extra) candidates.push(extra);

  const allowed = candidates.filter((origin) => isAllowedOrigin(origin, extra));
  if (allowed.length) return [...new Set(allowed)];
  // Nic whitelisted (např. curl bez Origin) – použij produkční doménu,
  // pokud je známá, jinak localhost (token bez prohlížeče stejně nikdo nečte).
  const productionUrl = env('VERCEL_PROJECT_PRODUCTION_URL');
  if (productionUrl) {
    return [productionUrl.startsWith('http') ? productionUrl : `https://${productionUrl}`];
  }
  return ['http://localhost:8000'];
}

// ----------------------------------------------------------------------
// Jednoduchý rate limit (ochrana proti automatizovanému vytahování tokenů).
// Serverless instancí může být víc, takže je to jen prvotní brzda, ne pevná
// garance – proti vážnému zneužití chrání především krátká platnost a
// omezení tokenu na asistenta + origin.
// ----------------------------------------------------------------------
const TOKEN_BUCKET = new Map(); // ip -> { count, resetAt }
const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS = 30;

export function rateLimit(ip) {
  const now = Date.now();
  const bucket = TOKEN_BUCKET.get(ip);
  if (!bucket || bucket.resetAt < now) {
    TOKEN_BUCKET.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    if (TOKEN_BUCKET.size > 5000) {
      for (const [key, value] of TOKEN_BUCKET) {
        if (value.resetAt < now) TOKEN_BUCKET.delete(key);
      }
    }
    return true;
  }
  bucket.count += 1;
  return bucket.count <= MAX_REQUESTS;
}

export function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length) return forwarded.split(',')[0].trim();
  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : 'unknown';
}
