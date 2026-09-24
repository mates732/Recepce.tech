'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';
import { Icon } from '@/components/shared/Icon';
import Link from 'next/link';

interface VapiCallButtonProps {
  slug: string;
  assistantName: string;
  /** Témata k inspiraci — zobrazí se před hovorem (nelze je posílat za uživatele). */
  suggestions?: string[];
  /** Po skončení hovoru zobrazit hodnocení (POST /api/demo-feedback). */
  showFeedback?: boolean;
  /** Konverzní CTA zobrazené po skončení hovoru. */
  cta?: { href: string; label: string; note?: string };
}

type CallState = 'idle' | 'connecting' | 'active' | 'ended' | 'error';

interface TranscriptLine {
  id: string;
  role: 'assistant' | 'caller' | 'system';
  text: string;
  atSec: number;
}

type FeedbackState = 'idle' | 'sending' | 'sent' | 'error';

/* Stránka (např. mobilní sticky CTA na /Ludmila) se může podle stavu hovoru
   přizpůsobit — vyhazujeme to jako window event, ať komponenta zůstane
   znovupoužitelná bez prop-drillingu. */
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

function formatError(error: unknown) {
  if (error instanceof Response) {
    return `Vapi start failed (${error.status} ${error.statusText || 'Response'}).`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Hovor se nepodařilo spustit.';
}

async function formatResponseError(response: Response) {
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
            : JSON.stringify(json);
    } else {
      bodyText = await response.text();
    }
  } catch {
    bodyText = '';
  }

  const statusLabel = `${response.status} ${response.statusText || 'Response'}`.trim();
  return bodyText
    ? `Vapi start failed (${statusLabel}): ${bodyText}`
    : `Vapi start failed (${statusLabel}).`;
}

export default function VapiCallButton({
  slug,
  assistantName,
  suggestions,
  showFeedback = false,
  cta,
}: VapiCallButtonProps) {
  const [state, setState] = useState<CallState>('idle');
  const [error, setError] = useState('');
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);
  const [sessionAssistantId, setSessionAssistantId] = useState('');

  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('idle');

  const vapiRef = useRef<Vapi | null>(null);
  const startRef = useRef(0);
  const lineSeq = useRef(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  function disposeVapi() {
    const vapi = vapiRef.current;
    vapiRef.current = null;
    if (!vapi) return;

    try {
      vapi.stop();
    } catch {
      // Vapi/Daily can already have destroyed the meeting during call-end.
    }
  }

  useEffect(() => {
    return () => {
      disposeVapi();
    };
  }, []);

  const pushLine = useCallback(
    (role: TranscriptLine['role'], text: string) => {
      lineSeq.current += 1;
      const atSec = startRef.current > 0 ? Math.round((Date.now() - startRef.current) / 1000) : 0;
      setLines((prev) => [...prev, { id: `line-${lineSeq.current}`, role, text, atSec }]);
    },
    [],
  );

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

  function resetForNewCall() {
    setLines([]);
    setElapsed(0);
    setAssistantSpeaking(false);
    setFeedbackRating(0);
    setFeedbackComment('');
    setFeedbackState('idle');
  }

  async function startCall() {
    if (state === 'connecting' || state === 'active') return;

    setError('');
    resetForNewCall();
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
        throw new Error(data.error ?? 'Demo není nakonfigurované.');
      }

      setSessionAssistantId(data.assistantId);

      const vapi = new Vapi(data.publicKey);
      vapiRef.current = vapi;
      vapi.on('call-start', () => {
        setState('active');
        notifyCallState(true);
        pushLine('system', 'Hovor spojen — povolte mikrofon a mluvte přirozeně');
      });
      vapi.on('call-end', () => {
        vapiRef.current = null;
        setState((s) => (s === 'ended' ? s : 'ended'));
        notifyCallState(false);
        pushLine('system', 'Hovor ukončen');
      });
      vapi.on('speech-start', () => setAssistantSpeaking(true));
      vapi.on('speech-end', () => setAssistantSpeaking(false));
      vapi.on('message', (msg: unknown) => {
        const m = msg as {
          type?: string;
          role?: string;
          transcript?: string;
          transcriptType?: string;
        };
        if (m?.type === 'transcript' && m.transcript && m.transcriptType === 'final') {
          const role: TranscriptLine['role'] =
            m.role === 'assistant' || m.role === 'system' ? m.role : 'caller';
          pushLine(role, m.transcript);
        }
      });
      vapi.on('error', (event: unknown) => {
        console.error('[VapiCallButton] vapi error event:', event);
      });

      try {
        await vapi.start(data.assistantId);
      } catch (startError) {
        if (startError instanceof Response) {
          const message = await formatResponseError(startError);
          console.error('[VapiCallButton] vapi start response:', message);
          throw new Error(message);
        }

        throw startError;
      }
    } catch (callError) {
      console.error('[VapiCallButton] startCall error:', callError);
      disposeVapi();
      notifyCallState(false);
      setError(formatError(callError));
      setState('error');
    }
  }

  function stopCall() {
    disposeVapi();
    notifyCallState(false);
    pushLine('system', 'Hovor ukončen');
    setState('ended');
  }

  async function submitFeedback() {
    if (feedbackRating === 0 || feedbackState === 'sending') return;

    setFeedbackState('sending');
    try {
      const response = await fetch('/api/demo-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          assistantId: sessionAssistantId || undefined,
          rating: feedbackRating,
          comment: feedbackComment.trim() || undefined,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setFeedbackState('sent');
    } catch (feedbackError) {
      console.error('[VapiCallButton] feedback error:', feedbackError);
      setFeedbackState('error');
    }
  }

  const active = state === 'active';
  const connecting = state === 'connecting';
  const inCall = connecting || active;
  const ended = state === 'ended';
  const showTranscript = lines.length > 0;

  const buttonLabel = connecting
    ? 'Vytáčím…'
    : active
      ? 'Ukončit hovor'
      : ended
        ? 'Zavolat znovu'
        : 'Zahájit demo hovor';

  return (
    <div className="mt-4">
      {/* Stavová karta během hovoru */}
      {inCall && (
        <div
          className="mb-3 overflow-hidden rounded-2xl border border-border bg-surface-muted px-5 py-5 text-center"
          role="status"
          aria-live="polite"
        >
          <div className="relative mx-auto grid h-16 w-16 place-items-center">
            <span
              className="absolute inset-0 rounded-full border border-accent/25 animate-ping"
              aria-hidden="true"
            />
            <span className="relative grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-bright">
              <Icon name={active ? 'mic' : 'phone-call'} className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
            {connecting ? 'Vytáčím demo' : assistantSpeaking ? 'Asistent mluví' : 'Poslouchám…'}
          </p>
          <p className="mt-1 text-base font-semibold text-ink">{assistantName}</p>
          <p className="mt-1 font-mono text-sm tabular-nums text-muted">{formatClock(elapsed)}</p>
          {active && (
            <p className="mt-1 text-xs text-muted">Mluvte přirozeně, asistent poslouchá.</p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={active ? stopCall : startCall}
        disabled={connecting}
        className="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-accent px-6 text-sm font-semibold text-accent-bright transition-colors duration-200 hover:bg-accent-hover disabled:cursor-wait disabled:opacity-70"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-bright/15">
          <Icon name={active ? 'phone-off' : 'phone-call'} className="h-4 w-4" />
        </span>
        {buttonLabel}
      </button>
      {error && (
        <div className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-red-700">
          <p>{error}</p>
          <button type="button" onClick={startCall} className="shrink-0 font-semibold underline underline-offset-2">
            Zkusit znovu
          </button>
        </div>
      )}

      {/* Témata k inspiraci — jen návrh, za uživatele je posílat neumíme */}
      {!inCall && suggestions && suggestions.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
            Co můžete asistentovi říct
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Živý transkript — během hovoru i po něm */}
      {showTranscript && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface">
          <header className="flex items-center justify-between border-b border-border bg-surface-muted/70 px-4 py-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
              Transkript
            </span>
            <span className="font-mono text-xs tabular-nums text-muted">
              {formatClock(elapsed)}
            </span>
          </header>
          <div
            ref={scrollRef}
            className="max-h-72 space-y-2.5 overflow-y-auto px-4 py-4"
            aria-live="polite"
          >
            {lines.map((line) =>
              line.role === 'system' ? (
                <div key={line.id} className="text-center">
                  <span className="rounded-full bg-surface-muted/70 px-3 py-1 text-[11px] text-faint">
                    {line.text}
                  </span>
                </div>
              ) : (
                <div
                  key={line.id}
                  className={`flex ${line.role === 'caller' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      line.role === 'assistant'
                        ? 'bg-accent text-accent-bright'
                        : 'bg-surface-muted text-ink'
                    }`}
                  >
                    <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-[0.14em] opacity-60">
                      {line.role === 'assistant' ? assistantName : 'Vy'} · {formatClock(line.atSec)}
                    </span>
                    {line.text}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* Hodnocení po hovoru */}
      {ended && showFeedback && feedbackState !== 'sent' && (
        <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm font-semibold text-ink">Jak vám hovor přišel?</p>
          <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Hodnocení hovoru">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={feedbackRating === value}
                aria-label={`${value} z 5`}
                onClick={() => setFeedbackRating(value)}
                className={`grid h-10 w-10 place-items-center rounded-full border text-sm font-semibold transition-colors duration-150 ${
                  feedbackRating >= value
                    ? 'border-accent bg-accent text-accent-bright'
                    : 'border-border bg-surface text-muted hover:border-border-strong'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <textarea
            value={feedbackComment}
            onChange={(event) => setFeedbackComment(event.target.value)}
            placeholder="Chcete něco dodat? (nepovinné)"
            rows={2}
            maxLength={500}
            className="mt-3 w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-faint focus:border-border-strong focus:outline-none"
          />
          {feedbackState === 'error' && (
            <p role="alert" className="mt-2 text-xs text-red-700">
              Hodnocení se nepodařilo odeslat. Zkuste to prosím znovu.
            </p>
          )}
          <button
            type="button"
            onClick={submitFeedback}
            disabled={feedbackRating === 0 || feedbackState === 'sending'}
            className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-medium text-accent-bright transition-colors duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {feedbackState === 'sending' ? 'Odesílám…' : 'Odeslat hodnocení'}
          </button>
        </div>
      )}

      {/* Poděkování + konverzní CTA */}
      {ended && (feedbackState === 'sent' || !showFeedback) && cta && (
        <div className="mt-4 rounded-2xl border border-border bg-surface p-5 text-center">
          {showFeedback && (
            <p className="text-sm font-medium text-ink">Děkujeme za hodnocení!</p>
          )}
          <p className="mt-1 text-sm leading-relaxed text-muted">{cta.note}</p>
          <Link
            href={cta.href}
            className="mt-3 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium text-accent-bright transition-colors duration-200 hover:bg-accent-hover"
          >
            {cta.label}
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
