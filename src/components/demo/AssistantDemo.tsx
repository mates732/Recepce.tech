'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import Reveal from '@/components/home/Reveal';
import { Icon } from '@/components/shared/Icon';

interface AssistantConfig {
  id: string;
  name: string;
  category: string;
  business: string;
  role: string;
  icon: Parameters<typeof Icon>[0]['name'];
  status: string;
  initialMessage: string;
  fallback: string;
  endpoint?: string;
  assistantId?: string;
  questions?: { question: string; keywords: string[]; answer: string }[];
}

type Speaker = 'visitor' | 'assistant';
type Status = 'idle' | 'typing' | 'error';

interface Message {
  key: number;
  speaker: Speaker;
  text: string;
}

const REPLY_DELAY_MS = 700;
const ERROR_TEXT = 'Odpověď se nepodařilo doručit. Zkuste to znovu.';

/** Normalizace dotazu — bez diakritiky, malá písmena, bez interpunkce. */
function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Skóre shody dotazu s připravenou otázkou (klíčová slova + slova z otázky). */
function scoreQuestion(asked: string, question: string, keywords: string[]) {
  let score = 0;
  for (const term of [normalize(question), ...keywords.map(normalize)]) {
    if (!term) continue;
    if (asked.includes(term)) {
      score += 3;
      continue;
    }
    score += term.split(' ').filter((word) => word.length > 3 && asked.includes(word)).length;
  }
  return score;
}

/**
 * Odpověď asistenta.
 *
 * Ukázka odpovídá z připravených odpovědí — v projektu žádné API není.
 * Jakmile má asistent vyplněný `endpoint`, posílá se dotaz na server
 * a zbytek komponenty zůstává stejný.
 */
async function requestReply(assistant: AssistantConfig, question: string) {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new Error('offline');
  }

  if (assistant.endpoint) {
    const response = await fetch(assistant.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assistantId: assistant.assistantId, message: question }),
    });
    if (!response.ok) throw new Error('request-failed');
    const data = (await response.json()) as { reply?: string };
    if (!data.reply) throw new Error('empty-reply');
    return data.reply;
  }

  await new Promise((resolve) => setTimeout(resolve, REPLY_DELAY_MS));

  const asked = normalize(question);
  let bestScore = 0;
  let bestAnswer = assistant.fallback;

  const questions = assistant.questions ?? [];

  for (const item of questions) {
    const score = scoreQuestion(asked, item.question, item.keywords);
    if (score >= 2 && score > bestScore) {
      bestScore = score;
      bestAnswer = item.answer;
    }
  }

  return bestAnswer;
}

function bubbleClass(speaker: Speaker) {
  return speaker === 'visitor'
    ? 'rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-sm leading-relaxed text-accent-bright'
    : 'rounded-2xl rounded-bl-md border border-border bg-surface-muted px-4 py-2.5 text-sm leading-relaxed text-ink';
}

/**
 * Jeden asistent = jeden samostatný blok s vlastním demo oknem.
 *
 * Stav (zprávy, odesílání, chyba) žije uvnitř této komponenty, takže se
 * asistenti navzájem neovlivňují. Na desktopu je vlevo popis s otázkami,
 * vpravo chat. Na mobilu jde popis s otázkami první, chat pod ním.
 */
export default function AssistantDemo({ assistant }: { assistant: AssistantConfig }) {
  const questions = assistant.questions ?? [];

  const [messages, setMessages] = useState<Message[]>([
    { key: 0, speaker: 'assistant', text: assistant.initialMessage },
  ]);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorText, setErrorText] = useState('');

  const nextKey = useRef(1);
  const lastQuestion = useRef('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    list.scrollTo({ top: list.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
  }, [messages, status]);

  const deliver = useCallback(
    async (question: string) => {
      setErrorText('');
      setStatus('typing');
      try {
        const reply = await requestReply(assistant, question);
        const key = nextKey.current++;
        setMessages((prev) => [...prev, { key, speaker: 'assistant', text: reply }]);
        setStatus('idle');
      } catch {
        setErrorText(ERROR_TEXT);
        setStatus('error');
      }
    },
    [assistant],
  );

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || status === 'typing') return;

      lastQuestion.current = text;
      const key = nextKey.current++;
      setDraft('');
      setMessages((prev) => [...prev, { key, speaker: 'visitor', text }]);
      void deliver(text);
    },
    [deliver, status],
  );

  const retry = useCallback(() => {
    if (!lastQuestion.current) return;
    void deliver(lastQuestion.current);
  }, [deliver]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(draft);
  }

  const busy = status === 'typing';
  const hasAsked = messages.some((message) => message.speaker === 'visitor');

  return (
    <section
      id={assistant.id}
      aria-labelledby={`${assistant.id}-title`}
      className="scroll-mt-20 border-t border-border"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Popis asistenta + otázky */}
          <Reveal className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-surface-muted text-ink">
                <Icon name={assistant.icon} className="h-5 w-5" />
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
                {assistant.category}
              </p>
            </div>

            <h2
              id={`${assistant.id}-title`}
              className="mt-6 text-[clamp(1.9rem,4vw,2.7rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-ink"
            >
              {assistant.name}
            </h2>
            <p className="mt-2 text-sm font-medium text-ink-2">{assistant.business}</p>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted">{assistant.role}</p>

            <p className="mt-9 text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
              Můžete se zeptat například:
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {questions.map((item) => (
                <button
                  key={item.question}
                  type="button"
                  onClick={() => send(item.question)}
                  disabled={busy}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-ink transition-colors duration-200 hover:border-border-strong hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {item.question}
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-faint">
              Kliknutím se otázka odešle do ukázky tohoto asistenta.
            </p>
          </Reveal>

          {/* Vlastní demo okno tohoto asistenta */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_16px_48px_-24px_rgba(23,23,22,0.16)]">
              {/* Header */}
              <div className="flex items-center justify-between gap-4 border-b border-border bg-surface-muted/70 px-5 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface text-xs font-semibold text-ink">
                    {assistant.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{assistant.name}</p>
                    <p className="truncate text-[11px] text-muted">{assistant.business}</p>
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-muted">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  {assistant.status}
                </span>
              </div>

              {/* Zprávy */}
              <div
                ref={listRef}
                role="log"
                aria-live="polite"
                aria-busy={busy}
                aria-label={`Ukázka konverzace s asistentem ${assistant.name}`}
                className="flex h-[360px] flex-col gap-3 overflow-y-auto px-5 py-5 sm:h-[400px]"
              >
                {messages.map((message) => (
                  <div
                    key={message.key}
                    className={`max-w-[85%] break-words ${
                      message.speaker === 'visitor' ? 'self-end' : 'self-start'
                    }`}
                  >
                    <div className={bubbleClass(message.speaker)}>{message.text}</div>
                  </div>
                ))}

                {!hasAsked && (
                  <p className="mt-1 text-xs leading-relaxed text-faint">
                    Toto je ukázka. Napište vlastní dotaz, nebo použijte připravené otázky.
                  </p>
                )}

                {busy && (
                  <div className="max-w-[85%] self-start">
                    <div
                      className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border bg-surface-muted px-4 py-3"
                      aria-label={`${assistant.name} píše`}
                    >
                      {[0, 1, 2].map((dot) => (
                        <span
                          key={dot}
                          className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-ink/40"
                          style={{ animationDelay: `${dot * 150}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Chybový stav */}
              {status === 'error' && (
                <div className="flex items-center justify-between gap-4 border-t border-border bg-surface-muted/60 px-5 py-3">
                  <p className="text-xs leading-relaxed text-ink-2">{errorText}</p>
                  <button
                    type="button"
                    onClick={retry}
                    className="shrink-0 text-xs font-semibold text-ink underline underline-offset-4 transition-colors duration-200 hover:text-muted"
                  >
                    Zkusit znovu
                  </button>
                </div>
              )}

              {/* Vstup */}
              <form onSubmit={onSubmit} className="border-t border-border bg-surface-muted/60 px-5 py-4">
                <div className="flex items-center gap-2">
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Napište zprávu…"
                    aria-label={`Napište zprávu asistentovi ${assistant.name}`}
                    autoComplete="off"
                    className="h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm text-ink placeholder:text-faint focus:border-border-strong focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={busy || draft.trim().length === 0}
                    aria-label="Odeslat zprávu"
                    className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium text-accent-bright transition-colors duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Odeslat
                    <Icon name="arrow-right" className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-faint">
                  Ukázka · odpovědi jsou připravené pro tento scénář.
                </p>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}