// Sdílená logika pro interní tracking dema (api/track.js + dev/server.mjs).
//
// Zásady:
//  - Žádné osobní údaje. Jen anonymní session ID (UUID generované v prohlížeči),
//    název eventu, čas a pár neidentifikujících vlastností (id sekce, hodnota feedbacku…).
//  - Eventy se ukládají jako JSON řádky (JSONL) – snadno se agregují pro
//    denní souhrn (Telegram bot si může vytáhnout GET /track?days=1).
//  - Struktura je schválená názvy eventu, aby se tam nedostal nepořádek.

import fs from 'node:fs';
import path from 'node:path';

// Eventy, které stránka smí posílat. Cokoliv jiného se odmítne.
export const ALLOWED_EVENTS = new Set([
  'page_open',
  'session_start',
  'page_duration',
  'section_view',
  'assistant_open',
  'assistant_interaction',
  'video_play',
  'video_progress',
  'video_complete',
  'feedback',
]);

const MAX_EVENTS_PER_REQUEST = 20;
const MAX_PROPS_LENGTH = 512;

// ---------------------------------------------------------------------
// Parsování a validace příchozích eventů
// ---------------------------------------------------------------------
export function parseIncomingEvents(body) {
  if (!body || typeof body !== 'object') return [];
  const incoming = Array.isArray(body.events) ? body.events : [body];
  const now = Date.now();
  const parsed = [];

  for (const raw of incoming.slice(0, MAX_EVENTS_PER_REQUEST)) {
    if (!raw || typeof raw !== 'object') continue;
    const name = String(raw.name || '').trim();
    if (!ALLOWED_EVENTS.has(name)) continue;

    const event = {
      name,
      ts: normalizeTs(raw.ts, now),
      sid: sanitizeSid(raw.sid),
      page: sanitizeShort(raw.page) || null,
      props: sanitizeProps(raw.props),
    };
    parsed.push(event);
  }
  return parsed;
}

function normalizeTs(value, now) {
  const ts = Number(value);
  if (!Number.isFinite(ts) || ts <= 0) return now;
  // Čas z prohlížeče – pokud by byl hloupě v budoucnosti, utneme na "teď".
  return Math.min(Math.round(ts), now);
}

function sanitizeSid(value) {
  // Jen bezpečné znaky – UUID nebo krátký řetězec, maximálně 64 znaků.
  const sid = String(value || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
  return sid || 'anonymous';
}

function sanitizeShort(value) {
  const text = String(value || '').trim();
  return text ? text.slice(0, 120) : '';
}

function sanitizeProps(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const clean = {};
  for (const [key, val] of Object.entries(value)) {
    const safeKey = String(key).replace(/[^a-zA-Z0-9_]/g, '').slice(0, 40);
    if (!safeKey) continue;
    let safeVal;
    if (typeof val === 'number' && Number.isFinite(val)) {
      safeVal = val;
    } else if (typeof val === 'boolean') {
      safeVal = val;
    } else if (typeof val === 'string') {
      safeVal = val.slice(0, MAX_PROPS_LENGTH);
    } else {
      continue;
    }
    clean[safeKey] = safeVal;
  }
  return clean;
}

// ---------------------------------------------------------------------
// Ukládání (JSONL – jeden event na řádek)
// ---------------------------------------------------------------------
export function appendEvents(storePath, events) {
  if (!events.length) return 0;
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  const lines = events.map((event) => JSON.stringify(event)).join('\n') + '\n';
  fs.appendFileSync(storePath, lines, 'utf8');
  return events.length;
}

export function readEvents(storePath) {
  let text = '';
  try {
    text = fs.readFileSync(storePath, 'utf8');
  } catch {
    return [];
  }
  const events = [];
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && ALLOWED_EVENTS.has(parsed.name)) events.push(parsed);
    } catch {
      // Poškozený řádek ignorujeme.
    }
  }
  return events;
}

// ---------------------------------------------------------------------
// Agregace – přesně to, co denní Telegram souhrn potřebuje
// ---------------------------------------------------------------------
export function summarizeEvents(events, sinceTs) {
  const filtered = sinceTs ? events.filter((e) => e.ts >= sinceTs) : events;

  const sessions = new Set();
  const sectionViews = {};
  let pageOpens = 0;
  let durationSum = 0;
  let durationCount = 0;
  let assistantOpens = 0;
  let assistantInteractions = 0;
  let videoPlays = 0;
  let videoWatchSeconds = 0;
  let feedbackUp = 0;
  let feedbackNeutral = 0;
  let feedbackDown = 0;

  for (const event of filtered) {
    if (event.sid) sessions.add(event.sid);
    const props = event.props || {};

    switch (event.name) {
      case 'page_open':
        pageOpens += 1;
        break;
      case 'page_duration':
        if (typeof props.seconds === 'number' && props.seconds >= 0) {
          durationSum += props.seconds;
          durationCount += 1;
        }
        break;
      case 'section_view': {
        const section = typeof props.section === 'string' && props.section ? props.section : 'unknown';
        sectionViews[section] = (sectionViews[section] || 0) + 1;
        break;
      }
      case 'assistant_open':
        assistantOpens += 1;
        break;
      case 'assistant_interaction':
        assistantInteractions += 1;
        break;
      case 'video_play':
        videoPlays += 1;
        break;
      case 'video_progress':
      case 'video_complete':
        if (typeof props.seconds === 'number' && props.seconds > 0) {
          videoWatchSeconds += props.seconds;
        }
        break;
      case 'feedback':
        if (props.value === 'up') feedbackUp += 1;
        else if (props.value === 'neutral') feedbackNeutral += 1;
        else if (props.value === 'down') feedbackDown += 1;
        break;
    }
  }

  return {
    periodStart: sinceTs || null,
    visits: pageOpens,
    uniqueSessions: sessions.size,
    avgDurationSeconds: durationCount ? Math.round(durationSum / durationCount) : null,
    sectionViews,
    assistant: {
      opens: assistantOpens,
      interactions: assistantInteractions,
    },
    video: {
      plays: videoPlays,
      watchSeconds: Math.round(videoWatchSeconds),
    },
    feedback: {
      up: feedbackUp,
      neutral: feedbackNeutral,
      down: feedbackDown,
      total: feedbackUp + feedbackNeutral + feedbackDown,
    },
  };
}

export function periodStartFromDays(days) {
  const d = Number(days);
  if (!Number.isFinite(d) || d <= 0) return null;
  return Date.now() - d * 24 * 60 * 60 * 1000;
}
