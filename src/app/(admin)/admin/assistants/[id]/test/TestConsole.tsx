'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';
import { Icon } from '@/components/shared/Icon';
import { Badge, Button } from '@/components/admin/ui';
import { formatDuration } from '@/lib/format';
import type { Assistant, TranscriptMessage } from '@/data/ops';

type ConsoleState = 'idle' | 'connecting' | 'active' | 'ended' | 'error';

interface LogLine {
  id: string;
  role: TranscriptMessage['role'];
  text: string;
  atSec: number;
}

/** Simulovaný scénář — použije se, když asistent nemá reálné Vapi napojení. */
const SIMULATION: Array<{ delayMs: number; role: TranscriptMessage['role']; text: string }> = [
  { delayMs: 800, role: 'system', text: 'Simulovaný hovor — asistent nemá aktivní Vapi napojení' },
  { delayMs: 1600, role: 'assistant', text: 'Dobrý den, tady UGO z UGO Salaterie Stromovka. Jak vám můžu pomoct?' },
  { delayMs: 5200, role: 'caller', text: 'Dobrý den, máte dnes ještě otevřeno?' },
  { delayMs: 7600, role: 'assistant', text: 'Otevřeno máme dnes do devatenácti hodin.' },
  { delayMs: 11400, role: 'caller', text: 'Super. A kolik stojí Caesar salát?' },
  { delayMs: 13800, role: 'assistant', text: 'Caesar stojí 195 korun, k salátu můžeme přidat bagetu nebo limonádu za 45 korun.' },
  { delayMs: 19400, role: 'caller', text: 'Díky, to stačí.' },
  { delayMs: 21000, role: 'assistant', text: 'Děkuji za zavolání, přeji hezký den!' },
  { delayMs: 24000, role: 'system', text: 'Simulovaný hovor ukončen' },
];

let lineSeq = 0;
function makeLine(role: TranscriptMessage['role'], text: string, atSec: number): LogLine {
  lineSeq += 1;
  return { id: `line-${lineSeq}`, role, text, atSec };
}

export default function TestConsole({ assistant }: { assistant: Assistant }) {
  const [state, setState] = useState<ConsoleState>('idle');
  const [lines, setLines] = useState<LogLine[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [mode, setMode] = useState<'unknown' | 'vapi' | 'simulated'>('unknown');
  const [notice, setNotice] = useState('');

  const vapiRef = useRef<InstanceType<typeof Vapi> | null>(null);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const startRef = useRef<number>(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const pushLine = useCallback((role: TranscriptMessage['role'], text: string) => {
    const atSec = startRef.current > 0 ? Math.round((Date.now() - startRef.current) / 1000) : 0;
    setLines((prev) => [...prev, makeLine(role, text, atSec)]);
  }, []);

  const cleanupTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const disposeVapi = useCallback(() => {
    const vapi = vapiRef.current;
    vapiRef.current = null;
    if (!vapi) return;
    try {
      vapi.stop();
    } catch {
      // Vapi/Daily může být už zničený během ukončování hovoru.
    }
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

  // Úklid při odchodu z komponenty
  useEffect(() => {
    return () => {
      cleanupTimers();
      disposeVapi();
    };
  }, [cleanupTimers, disposeVapi]);

  function runSimulation() {
    setMode('simulated');
    setNotice('Vapi není pro tohoto asistenta nakonfigurováno — přehrává se simulovaný scénář.');
    SIMULATION.forEach((step, i) => {
      const t = setTimeout(() => {
        pushLine(step.role, step.text);
        if (i === SIMULATION.length - 1) setState('ended');
      }, step.delayMs);
      timersRef.current.push(t);
    });
  }

  async function startCall() {
    if (state === 'connecting' || state === 'active') return;

    setLines([]);
    setElapsed(0);
    setNotice('');
    setState('connecting');
    startRef.current = Date.now();

    let session: { mode: string; publicKey?: string; assistantId?: string; error?: string };
    try {
      const res = await fetch(`/api/admin/assistants/${assistant.id}/test-session`, {
        method: 'POST',
      });
      session = await res.json();
    } catch {
      session = { mode: 'simulated', error: 'Nepodařilo se ověřit Vapi konfiguraci.' };
    }

    if (session.mode === 'vapi' && session.publicKey && session.assistantId) {
      setMode('vapi');
      try {
        const vapi = new Vapi(session.publicKey);
        vapiRef.current = vapi;

        vapi.on('call-start', () => {
          setState('active');
          pushLine('system', 'Hovor spojen — mluvte přirozeně');
        });
        vapi.on('call-end', () => {
          vapiRef.current = null;
          setState((s) => (s === 'ended' ? s : 'ended'));
          pushLine('system', 'Hovor ukončen');
        });
        vapi.on('message', (msg: unknown) => {
          const m = msg as { type?: string; role?: string; transcript?: string; transcriptType?: string };
          if (m?.type === 'transcript' && m.transcript && m.transcriptType === 'final') {
            const role: TranscriptMessage['role'] =
              m.role === 'assistant' || m.role === 'system' ? m.role : 'caller';
            pushLine(role, m.transcript);
          }
        });
        vapi.on('error', (event: unknown) => {
          console.error('[TestConsole] vapi error:', event);
          setNotice('Vapi hlásilo chybu během hovoru — zkontrolujte konfiguraci asistenta.');
        });

        await vapi.start(session.assistantId);
        return;
      } catch (error) {
        console.error('[TestConsole] start failed:', error);
        disposeVapi();
        setNotice('Reálný Vapi hovor se nepodařilo zahájit — spouštím simulaci.');
      }
    } else if (session.error) {
      setNotice(session.error);
    }

    runSimulation();
  }

  function endCall() {
    cleanupTimers();
    disposeVapi();
    if (state === 'active' || state === 'connecting') {
      pushLine('system', 'Hovor ukončen adminem');
    }
    setState('ended');
  }

  function restart() {
    cleanupTimers();
    disposeVapi();
    setLines([]);
    setElapsed(0);
    setNotice('');
    setState('idle');
  }

  const inCall = state === 'connecting' || state === 'active';

  const ROLE_STYLES: Record<TranscriptMessage['role'], string> = {
    assistant: 'bg-accent text-accent-bright',
    caller: 'bg-surface-muted text-ink',
    system: 'bg-transparent text-faint',
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Transkript */}
      <div className="flex min-h-[420px] flex-col rounded-xl border border-border bg-surface">
        <header className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${
                state === 'active'
                  ? 'animate-pulse bg-emerald-500'
                  : state === 'connecting'
                    ? 'animate-pulse bg-amber-500'
                    : state === 'error'
                      ? 'bg-red-500'
                      : 'bg-muted'
              }`}
            />
            <span className="font-medium text-ink">Transkript</span>
            {mode === 'vapi' && <Badge tone="positive">Vapi</Badge>}
            {mode === 'simulated' && <Badge tone="outline">Simulace</Badge>}
          </div>
          <span className="font-mono text-sm tabular-nums text-muted">
            {formatDuration(elapsed)}
          </span>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted">
              <Icon name="phone-call" className="mb-3 h-10 w-10" />
              <p className="text-sm">Zatím žádná konverzace.</p>
              <p className="mt-1 text-xs">
                Spusťte test hovor a transkript se zobrazí tu v reálném čase.
              </p>
            </div>
          ) : (
            lines.map((line) =>
              line.role === 'system' ? (
                <div key={line.id} className="text-center">
                  <span className="rounded-full bg-surface-muted/70 px-3 py-1 text-[11px] text-muted">
                    {line.text}
                  </span>
                </div>
              ) : (
                <div
                  key={line.id}
                  className={`flex ${line.role === 'caller' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${ROLE_STYLES[line.role]}`}
                  >
                    <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-[0.14em] opacity-60">
                      {line.role === 'assistant' ? assistant.name : 'Volající'} · {formatDuration(line.atSec)}
                    </span>
                    {line.text}
                  </div>
                </div>
              )
            )
          )}
        </div>

        {notice && (
          <div className="border-t border-border bg-amber-50 px-5 py-2.5 text-xs text-amber-800">
            {notice}
          </div>
        )}
      </div>

      {/* Ovládací panel */}
      <aside className="space-y-4">
        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <div className="relative mx-auto grid h-24 w-24 place-items-center">
            {state === 'active' && (
              <span className="absolute inset-0 animate-ping rounded-full border border-accent/30" aria-hidden="true" />
            )}
            <span
              className={`relative grid h-16 w-16 place-items-center rounded-full ${
                state === 'active' ? 'bg-accent text-accent-bright' : 'bg-surface-muted text-ink'
              }`}
            >
              <Icon name={state === 'active' ? 'mic' : 'phone-call'} className="h-6 w-6" />
            </span>
          </div>
          <p className="mt-4 font-medium text-ink">
            {state === 'idle' && 'Připraveno k testu'}
            {state === 'connecting' && 'Spojuji…'}
            {state === 'active' && 'Hovor probíhá'}
            {state === 'ended' && 'Hovor ukončen'}
            {state === 'error' && 'Chyba hovoru'}
          </p>
          <p className="mt-1 text-xs text-muted">
            {mode === 'vapi'
              ? 'Reálný hovor přes Vapi web SDK'
              : mode === 'simulated'
                ? 'Simulovaný scénář (offline)'
                : 'Režim se rozpozná při spuštění'}
          </p>

          <div className="mt-5 space-y-2">
            {!inCall ? (
              <Button onClick={startCall} className="w-full">
                <Icon name="play" className="h-4 w-4" />
                {state === 'ended' ? 'Zavolat znovu' : 'Zahájit test hovor'}
              </Button>
            ) : (
              <Button onClick={endCall} className="w-full !bg-red-600 hover:!bg-red-700">
                <Icon name="phone-off" className="h-4 w-4" />
                Ukončit hovor
              </Button>
            )}
            <Button onClick={restart} variant="secondary" className="w-full" disabled={inCall}>
              <Icon name="rotate-ccw" className="h-4 w-4" />
              Restart konverzace
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Konfigurace testu
          </h3>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Hlas</dt>
              <dd className="text-right text-ink">{assistant.voice.voice.split(' (')[0]}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Jazyk</dt>
              <dd className="text-right text-ink">{assistant.voice.language}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Vapi ID</dt>
              <dd className="text-right font-mono text-xs text-ink">
                {assistant.vapiAssistantId ?? '—'}
              </dd>
            </div>
          </dl>
        </div>

        <p className="px-1 text-xs leading-relaxed text-muted">
          Test používá stejný assistant prompt a hlas jako ostrá linka. Hovor se nezapisuje do
          statistik klienta.
        </p>
      </aside>
    </div>
  );
}
