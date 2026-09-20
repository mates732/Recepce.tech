// Vercel serverless funkce: GET /api/config (rewrite z /config)
// Vrátí VEŘEJNÉ údaje: publicKey + assistantId (fallback režim).
// Soukromé klíče se tudy nikdy neprocházejí.

import { requireConfig } from '../lib/vapi-lib.js';

export default async function handler(req, res) {
  const { publicKey, assistantId } = requireConfig();

  res.status(200).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify({
    publicKey,
    assistantId,
    secureMode: false,
  }));
}
