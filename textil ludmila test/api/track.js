// Vercel serverless funkce: POST /api/track (rewrite z /track)
// Ukládá anonymní tracking eventy dema do JSONL souboru.
// Struktura eventů je schválená (viz lib/track-lib.js) – snadno se agreguje
// pro denní souhrn (Telegram bot Recepce.tech si stáhne GET /track?days=1).
//
// Pozn.: na Vercelu je filesystem funkcí read-only (kromě /tmp), takže se
// eventy přiřazují do /tmp. Pro trvalé ukládání lze později podstrčit
// externí úložiště bez změny na straně stránky.

import {
  parseIncomingEvents,
  appendEvents,
  readEvents,
  summarizeEvents,
  periodStartFromDays,
} from '../lib/track-lib.js';

import os from 'node:os';
import path from 'node:path';

const STORE_PATH = path.join(os.tmpdir(), 'track-events.jsonl');

export default async function handler(req, res) {
  // GET /track?days=1 -> agregovaný souhrn pro denní digest.
  if (req.method === 'GET') {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const sinceTs = periodStartFromDays(url.searchParams.get('days') || 1);
    const summary = summarizeEvents(readEvents(STORE_PATH), sinceTs);
    res.status(200).setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(summary));
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).setHeader('Allow', 'GET, POST');
    res.end();
    return;
  }

  // POST /track – dávka eventů z prohlížeče.
  let body = null;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    body = null;
  }

  const events = parseIncomingEvents(body);
  let stored = 0;
  if (events.length) {
    try {
      stored = appendEvents(STORE_PATH, events);
    } catch (error) {
      // Tracking nesmí nikdy rozbít stránku – jen zalogujeme.
      console.error('[track] uložení selhalo:', error && error.message ? error.message : error);
    }
  }

  res.status(204).end();
}
