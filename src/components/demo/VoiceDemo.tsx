'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';
import Link from 'next/link';
import { Icon } from '@/components/shared/Icon';
import type { DemoShowcase } from '@/lib/demo-showcase';

/**
 * Veřejný hlasový demo klient pro jednu ukázku (např. UGO Salaterie).
 *
 * Funguje výhradně s reálným Vapi hovorem: /api/vapi/session vrátí do
 * prohlížeče jen veřejný klíč a ID asistenta (soukromý VAPI_API_KEY zůstává
 * na serveru). Když Vapi není nakonfigurované, komponenta to explicitně
 * řekne — nikdy nesimuluje fiktivní konverzaci.
 */

interface VoiceDemoProps {
  showcase: DemoShowcase;
  showFeedback?: boolean;
  /** Konverzní CTA zobrazené po skončení hovoru. */
  cta?: { href: string; label: string; note?: string };
}

type CallState = 'idle' | 'connecting' | 'active' | 'ended' | 'error';
type ConnectingStep = 'prepare' | 'dial';

interface TranscriptLine {
  id: string;
  role: 'assistant' | 'caller';
  text: string;
  atSec: number;
}

type FeedbackState = 'idle' | 'sending' | 'sent' | 'error';

const UNCONFIGURED_TEXT =
  'Tento hlasový asistent není v tomto prostředí nakonfigurován.';

/* Stránka se může podle stavu hovoru přizpůsobit (stejný event jako ostatní dema). */
function notifyCallState(active: boolean) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('vapi-call-state', { detail: { active } }),
  );
}

function formatClock(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatError(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error) return error;
  return 'Hovor se nepodařilo spustit. Zkuste to prosím znovu.';
}

async function formatResponseError(response: Response): Promise<string> {
  const contentType = response.headers.get('content-type') ?? '';
  let bodyText = '';
  try {
    if (contentType.includes('application/json')) {
      const json = (await response.json()) as Record<string, unknown>;
      bodyText =
        typeof json.error === 'string'
          ? json.error
          : typeof json.message === 'string'
            ? json.message
            : '';
    } else {
      bodyText = await response.text();
    }
  } catch {
    bodyText = '';
  }
  return bodyText || 'Hovor se nepodařilo spustit. Zkuste to prosím znovu.';
}

/* Vapi SDK hlásí chyby i jako Response (např. 403 „Key doesn't allow
   assistantId“) — přečteme tělo, ať uživatel vidí skutečnou příčinu. */
async function formatVapiErrorResponse(response: Response): Promise<string> {
  let detail = '';
  try {
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const json = (await response.json()) as Record<string, unknown>;
      detail =
        typeof json.message === 'string'
          ? json.message
          : typeof json.error === 'string'
            ? json.error
            : '';
    } else {
      detail = (await response.text()).slice(0, 200);
    }
  } catch {
    detail = '';
  }
  const status = `${response.status} ${response.statusText || ''}`.trim();
  return detail
    ? `Vapi: ${detail} (HTTP ${status})`
    : `Vapi hovor se nepodařilo zahájit (HTTP ${status}).`;
}

function extractErrorMessage(event: unknown): string {
  if (typeof event === 'string' && event) return event;
  if (event && typeof event === 'object') {
    const record = event as Record<string, unknown>;
    for (const key of ['errorMessage', 'message', 'errorMsg']) {
      const value = record[key];
      if (typeof value === 'string' && value) return value;
    }
  }
  return '';
}

export default function VoiceDemo({
  showcase,
  showFeedback = false,
  cta,
}: VoiceDemoProps) {
  const { slug, client, location, initials, suggestions } = showcase;

  const [state, setState] = useState<CallState>('idle');
  const [connectingStep, setConnectingStep] = useState<ConnectingStep>('prepare');
  const [error, setError] = useState('');
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);
  /* Proběhl už první projev řeči? Mezi spojením a první mluvou ukazujeme
     stav „Připojeno“, potom naslouchání/odpovídání. */
  const [hasSpeech, setHasSpeech] = useState(false);
  const [sessionAssistantId, setSessionAssistantId] = useState('');
  const [configured, setConfigured] = useState<boolean | null>(null);

  const [feedbackRating, setFeedbackRating] = useState<0 | 1 | 5>(0);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('idle');

  const vapiRef = useRef<Vapi | null>(null);
  const startRef = useRef(0);
  const lineSeq = useRef(0);
  const startedRef = useRef(false);
  /* Rozběhané partial transkripty — klíč podle role, finále je nahradí. */
  const pendingPartial = useRef<Partial<Record<'assistant' | 'caller', string>>>({});
  /* Otázka z návrhového čipu čekající na spojení hovoru. */
  const pendingSuggestionRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const pushLine = useCallback(
    (role: TranscriptLine['role'], text: string) => {
      lineSeq.current += 1;
      const atSec =
        startRef.current > 0
          ? Math.round((Date.now() - startRef.current) / 1000)
          : 0;
      setLines((prev) => [...prev, { id: `line-${lineSeq.current}`, role, text, atSec }]);
    },
    [],
  );

  const upsertPartial = useCallback(
    (role: TranscriptLine['role'], text: string) => {
      const pendingId = pendingPartial.current[role];
      if (pendingId) {
        setLines((prev) =>
          prev.map((line) => (line.id === pendingId ? { ...line, text } : line)),
        );
        return;
      }
      lineSeq.current += 1;
      const id = `partial-${role}-${lineSeq.current}`;
      pendingPartial.current[role] = id;
      const atSec =
        startRef.current > 0
          ? Math.round((Date.now() - startRef.current) / 1000)
          : 0;
      setLines((prev) => [...prev, { id, role, text, atSec }]);
    },
    [],
  );

  const finalizePartial = useCallback(
    (role: TranscriptLine['role'], text: string) => {
      const pendingId = pendingPartial.current[role];
      pendingPartial.current[role] = undefined;
      if (pendingId) {
        setLines((prev) =>
          prev.map((line) => (line.id === pendingId ? { ...line, text } : line)),
        );
        return;
      }
      pushLine(role, text);
    },
    [pushLine],
  );

  /* Dostupnost reálného hovoru — dotaz na server pro vybrané demo,
     žádná env proměnná neteče do prohlížeče. Při přepnutí dema se komponenta
     remountuje (key v DemoShowcase), takže stav startuje vždy čistý. */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch('/api/vapi/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug }),
        });
        if (!cancelled) setConfigured(response.ok);
      } catch {
        if (!cancelled) setConfigured(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  function disposeVapi() {
    const vapi = vapiRef.current;
    vapiRef.current = null;
    if (!vapi) return;
    try {
      vapi.stop();
    } catch {
      // Vapi/Daily už mohl hovor zničit při call-end.
    }
  }

  useEffect(() => {
    return () => {
      disposeVapi();
      notifyCallState(false);
    };
  }, []);

  // Časovač hovoru
  useEffect(() => {
    if (state !== 'active') return;
    const interval = setInterval(() => {
      setElapsed(Math.round((Date.now() - startRef.current) / 1000));
    }, 500);
    return () => clearInterval(interval);
  }, [state]);

  // Auto-scroll transkriptu
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const startCall = useCallback(
    async (initialQuestion?: string) => {
      if (state === 'connecting' || state === 'active') return;

      setError('');
      setLines([]);
      setElapsed(0);
      setAssistantSpeaking(false);
      setHasSpeech(false);
      setFeedbackRating(0);
      setFeedbackState('idle');
      pendingPartial.current = {};
      pendingSuggestionRef.current = initialQuestion ?? null;
      startedRef.current = false;
      setConnectingStep('prepare');
      setState('connecting');
      startRef.current = Date.now();

      try {
        const response = await fetch('/api/vapi/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug }),
        });
        const data = (await response.json()) as {
          publicKey?: string;
          assistantId?: string;
          error?: string;
        };

        if (!response.ok || !data.publicKey || !data.assistantId) {
          setConfigured(false);
          throw new Error(data.error ?? UNCONFIGURED_TEXT);
        }

        setSessionAssistantId(data.assistantId);
        setConnectingStep('dial');

        const vapi = new Vapi(data.publicKey);
        vapiRef.current = vapi;

        vapi.on('call-start', () => {
          startedRef.current = true;
          setState('active');
          notifyCallState(true);

          /* Návrhová otázka → skutečná zpráva do konverzace. */
          const question = pendingSuggestionRef.current;
          pendingSuggestionRef.current = null;
          if (question) {
            try {
              vapi.send({
                type: 'add-message',
                message: { role: 'user', content: question },
              });
              pushLine('caller', question);
            } catch (sendError) {
              console.error('[VoiceDemo] add-message failed:', sendError);
            }
          }
        });

        vapi.on('call-end', () => {
          vapiRef.current = null;
          notifyCallState(false);
          setState((current) => (current === 'ended' ? current : 'ended'));
        });

        vapi.on('speech-start', () => {
          setHasSpeech(true);
          setAssistantSpeaking(true);
        });
        vapi.on('speech-end', () => setAssistantSpeaking(false));

        vapi.on('message', (msg: unknown) => {
          const m = msg as {
            type?: string;
            role?: string;
            transcript?: string;
            transcriptType?: string;
          };
          if (m?.type !== 'transcript' || !m.transcript) return;
          setHasSpeech(true);
          const role: TranscriptLine['role'] =
            m.role === 'assistant' ? 'assistant' : 'caller';
          if (m.transcriptType === 'partial') {
            upsertPartial(role, m.transcript);
          } else if (m.transcriptType === 'final') {
            finalizePartial(role, m.transcript);
          }
        });

        vapi.on('error', (event: unknown) => {
          console.error('[VoiceDemo] vapi error event:', event);
          if (!startedRef.current) {
            /* Hovor nikdy nezačal (např. zamítnutý mikrofon nebo nepovolený
               asistent u veřejného klíče) — ukaž konkrétní příčinu. */
            notifyCallState(false);
            void (async () => {
              const message =
                typeof Response !== 'undefined' && event instanceof Response
                  ? await formatVapiErrorResponse(event)
                  : extractErrorMessage(event) ||
                    'Hovor se nepodařilo spustit. Zkontrolujte prosím přístup k mikrofonu.';
              setError(message);
              setState('error');
            })();
          }
        });

        try {
          await vapi.start(data.assistantId);
        } catch (startError) {
          if (startError instanceof Response) {
            throw new Error(await formatResponseError(startError));
          }
          throw startError;
        }
      } catch (callError) {
        console.error('[VoiceDemo] startCall error:', callError);
        disposeVapi();
        notifyCallState(false);
        setError(formatError(callError));
        setState('error');
      }
    },
    [finalizePartial, pushLine, slug, state, upsertPartial],
  );

  function stopCall() {
    disposeVapi();
    notifyCallState(false);
    setState('ended');
  }

  function handleSuggestion(question: string) {
    if (configured === false) return;

    if (state === 'active') {
      const vapi = vapiRef.current;
      if (!vapi) return;
      try {
        vapi.send({
          type: 'add-message',
          message: { role: 'user', content: question },
        });
        pushLine('caller', question);
      } catch (sendError) {
        console.error('[VoiceDemo] add-message failed:', sendError);
      }
      return;
    }

    void startCall(question);
  }

  async function submitFeedback(rating: 1 | 5) {
    if (feedbackState === 'sending' || feedbackState === 'sent') return;

    setFeedbackRating(rating);
    setFeedbackState('sending');
    try {
      const response = await fetch('/api/demo-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          assistantId: sessionAssistantId || undefined,
          rating,
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setFeedbackState('sent');
    } catch (feedbackError) {
      console.error('[VoiceDemo] feedback error:', feedbackError);
      setFeedbackState('error');
    }
  }

  const connecting = state === 'connecting';
  const active = state === 'active';
  const inCall = connecting || active;
  const ended = state === 'ended';
  const showTranscript = lines.length > 0;

  const statusLabel = connecting
    ? connectingStep === 'prepare'
      ? 'Připravuji spojení…'
      : 'Připojování…'
    : active
      ? !hasSpeech
        ? 'Připojeno'
        : assistantSpeaking
          ? 'Asistent odpovídá'
          : 'Asistent naslouchá'
      : ended
        ? 'Hovor ukončen'
        : state === 'error'
          ? 'Hovor se nepodařilo spojit'
          : 'Připraveno k hovoru';

  const buttonLabel = connecting
    ? 'Připojuji…'
    : active
      ? 'Ukončit hovor'
      : ended
        ? 'Zavolat znovu'
        : state === 'error'
          ? 'Zkusit znovu'
          : 'Zavolat asistentovi';

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* Hlavní demo karta — hrdino stránky */}
      <div
        id="demo-hovor"
        className="scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_60px_-32px_rgba(53,51,48,0.5)]"
      >
        {/* Header karty */}
        <div className="flex items-center gap-3 border-b border-border bg-surface-muted/70 px-4 py-3.5 sm:px-5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-bright">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{client}</p>
            <p className="truncate text-[11px] text-muted">
              {location} · AI hlasový asistent · Čeština
            </p>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
              <span
                className={`h-1.5 w-1.5 rounded-full bg-emerald-500 ${active ? 'animate-pulse' : ''}`}
                aria-hidden="true"
              />
              {active ? 'Live' : 'Online'}
            </span>
          </div>
        </div>

        {/* Stav hovoru + hlavní tlačítko */}
        <div className="px-5 py-6 sm:px-7 sm:py-7">
          <div role="status" aria-live="polite" className="text-center">
            <div className="relative mx-auto grid h-20 w-20 place-items-center">
              {inCall && (
                <span
                  className="absolute inset-0 rounded-full border border-accent/25 animate-ping"
                  aria-hidden="true"
                />
              )}
              <span
                className={`relative grid h-14 w-14 place-items-center rounded-full transition-colors duration-300 ${
                  active
                    ? 'bg-accent text-accent-bright'
                    : 'bg-surface-muted text-ink'
                }`}
              >
                <Icon
                  name={active ? 'mic' : ended ? 'check' : 'phone-call'}
                  className="h-6 w-6"
                />
              </span>
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
              {statusLabel}
            </p>
            {inCall && (
              <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-ink">
                {formatClock(elapsed)}
              </p>
            )}
            {state === 'idle' && (
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">
                Po kliknutí povolte mikrofon — hovor začne okamžitě.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={active ? stopCall : () => void startCall()}
            disabled={connecting || configured === false}
            className="mt-6 inline-flex h-16 w-full items-center justify-center gap-3 rounded-full bg-accent px-6 text-base font-semibold text-accent-bright transition-colors duration-200 hover:bg-accent-hover disabled:cursor-wait disabled:opacity-60"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-bright/15">
              <Icon name={active ? 'phone-off' : 'phone-call'} className="h-5 w-5" />
            </span>
            {buttonLabel}
          </button>

          {error && (
            <div
              role="alert"
              className="mt-3 flex items-start justify-center gap-2 text-center text-xs leading-relaxed text-red-700"
            >
              <p>{error}</p>
              {!ended && (
                <button
                  type="button"
                  onClick={() => void startCall()}
                  className="shrink-0 font-semibold underline underline-offset-2"
                >
                  Zkusit znovu
                </button>
              )}
            </div>
          )}
        </div>

        {/* Živý transkript — jen reálné události z Vapi */}
        {showTranscript && (
          <div className="border-t border-border">
            <header className="flex items-center justify-between bg-surface-muted/70 px-4 py-2.5 sm:px-5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
                Živý transkript
              </span>
              <span className="font-mono text-xs tabular-nums text-muted">
                {formatClock(elapsed)}
              </span>
            </header>
            <div
              ref={scrollRef}
              aria-live="polite"
              aria-label="Přepis hovoru"
              className="max-h-80 space-y-3 overflow-y-auto px-4 py-4 sm:px-5"
            >
              {lines.map((line) => (
                <div
                  key={line.id}
                  className={line.role === 'caller' ? 'text-left' : 'text-right'}
                >
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${
                      line.role === 'caller' ? 'text-faint' : 'text-muted'
                    }`}
                  >
                    {line.role === 'caller' ? 'Zákazník' : 'AI asistent'}
                    {' · '}
                    {formatClock(line.atSec)}
                  </span>
                  <p
                    className={`mt-0.5 inline-block max-w-[88%] rounded-2xl px-3.5 py-2 text-left text-sm leading-relaxed ${
                      line.role === 'assistant'
                        ? 'bg-accent text-accent-bright'
                        : 'bg-surface-muted text-ink'
                    }`}
                  >
                    „{line.text}“
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fallback pro nekonfigurované prostředí — žádná fake konverzace */}
      {configured === false && (
        <div
          role="note"
          className="mt-4 flex items-start gap-2.5 rounded-2xl border border-border bg-surface-muted/50 px-4 py-3.5 text-sm leading-relaxed text-muted"
        >
          <Icon name="alert-circle" className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{UNCONFIGURED_TEXT}</p>
        </div>
      )}

      {/* Hodnocení po hovoru */}
      {ended && showFeedback && feedbackState !== 'sent' && (
        <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm font-semibold text-ink">Jak se vám demo líbilo?</p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              aria-label="Líbilo se"
              aria-pressed={feedbackRating === 5}
              disabled={feedbackState === 'sending'}
              onClick={() => void submitFeedback(5)}
              className="grid h-12 w-12 place-items-center rounded-full border border-border bg-surface text-lg transition-colors duration-150 hover:border-border-strong disabled:cursor-wait disabled:opacity-60"
            >
              👍
            </button>
            <button
              type="button"
              aria-label="Nelíbilo se"
              aria-pressed={feedbackRating === 1}
              disabled={feedbackState === 'sending'}
              onClick={() => void submitFeedback(1)}
              className="grid h-12 w-12 place-items-center rounded-full border border-border bg-surface text-lg transition-colors duration-150 hover:border-border-strong disabled:cursor-wait disabled:opacity-60"
            >
              👎
            </button>
            {feedbackState === 'sending' && (
              <span className="text-xs text-faint">Odesílám…</span>
            )}
            {feedbackState === 'error' && (
              <span role="alert" className="text-xs text-red-700">
                Hodnocení se nepodařilo odeslat.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Konverzní CTA po hovoru */}
      {ended && (feedbackState === 'sent' || !showFeedback) && cta && (
        <div className="mt-4 rounded-2xl border border-border bg-surface p-5 text-center sm:p-6">
          <p className="text-sm font-semibold text-ink">
            Chcete podobného asistenta pro svůj podnik?
          </p>
          {cta.note && (
            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted">
              {cta.note}
            </p>
          )}
          <Link
            href={cta.href}
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-bright transition-colors duration-200 hover:bg-accent-hover sm:w-auto"
          >
            {cta.label}
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Návrhové otázky — kliknutí spustí hovor / pošle otázku asistentovi */}
      <div className="mt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
          Vyzkoušejte například
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <li key={suggestion.text}>
              <button
                type="button"
                onClick={() => handleSuggestion(suggestion.text)}
                disabled={configured === false}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted transition-colors duration-150 hover:border-border-strong hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Icon name={suggestion.icon} className="h-3.5 w-3.5 shrink-0" />
                {suggestion.text}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-2.5 text-xs leading-relaxed text-faint">
          {active
            ? 'Klikněte na otázku — asistent ji zpracuje během hovoru.'
            : 'Klikněte na otázku a rovnou si ji nechte asistentovi zodpovědět.'}
        </p>
      </div>
    </div>
  );
}
