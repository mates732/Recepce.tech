'use client';

import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';
import { Icon } from '@/components/shared/Icon';

interface VapiCallButtonProps {
  slug: string;
  assistantName: string;
}

type CallState = 'idle' | 'connecting' | 'active' | 'error';

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

export default function VapiCallButton({ slug, assistantName }: VapiCallButtonProps) {
  const [state, setState] = useState<CallState>('idle');
  const [error, setError] = useState('');
  const vapiRef = useRef<Vapi | null>(null);

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

  async function startCall() {
    if (state === 'connecting' || state === 'active') return;

    setError('');
    setState('connecting');

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

      const vapi = new Vapi(data.publicKey);
      vapiRef.current = vapi;
      vapi.on('call-start', () => setState('active'));
      vapi.on('call-end', () => {
        vapiRef.current = null;
        setState('idle');
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
      setError(formatError(callError));
      setState('error');
    }
  }

  function stopCall() {
    disposeVapi();
    setState('idle');
    setError('');
  }

  const active = state === 'active';
  const connecting = state === 'connecting';
  const inCall = connecting || active;

  return (
    <div className="mt-4">
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
              <Icon name="phone-call" className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
            {connecting ? 'Vytáčím demo' : 'Hovor probíhá'}
          </p>
          <p className="mt-1 text-base font-semibold text-ink">{assistantName}</p>
          <p className="mt-1 text-xs text-muted">
            {connecting ? 'Povolte mikrofon a chvíli vyčkejte.' : 'Mluvte přirozeně, asistent poslouchá.'}
          </p>
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
        {connecting ? 'Vytáčím…' : active ? 'Ukončit hovor' : 'Zahájit demo hovor'}
      </button>
      {error && (
        <div className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-red-700">
          <p>{error}</p>
          <button type="button" onClick={startCall} className="shrink-0 font-semibold underline underline-offset-2">
            Zkusit znovu
          </button>
        </div>
      )}
    </div>
  );
}
