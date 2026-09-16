'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CALLER_INITIALS = 'PN';
const CALLER_NAME = 'Petr Novák';
const BUSINESS_NAME = 'Zlatý Hřeben';

// ── Scenario timeline ──────────────────────────────────────────────────────
const SCENARIO = [
  {
    actor: 'incoming' as const,
    text: null,
    showAfterMs: 0,
  },
  {
    actor: 'customer' as const,
    text: 'Dobrý den, chtěl bych se objednat na střih a úpravu vousů.',
    showAfterMs: 2400,
  },
  {
    actor: 'ai' as const,
    text: 'Dobrý den, určitě. Ve středu máme volno ve 14:00 nebo v 16:30. Který termín vám vyhovuje?',
    showAfterMs: 3600,
  },
  {
    actor: 'customer' as const,
    text: 'V 14:00 prosím.',
    showAfterMs: 2800,
  },
  {
    actor: 'ai' as const,
    text: 'Dobře. Rezervuji vám středu 14:00 — střih a úprava vousů. Souhlasí?',
    showAfterMs: 2600,
  },
  {
    actor: 'customer' as const,
    text: 'Ano, děkuji.',
    showAfterMs: 2000,
  },
];

type State =
  | { step: 'incoming' }
  | { step: 'ringing' }
  | { step: 'connected'; index: number }
  | { step: 'customer-speaking'; message: typeof SCENARIO[1] }
  | { step: 'ai-thinking' }
  | { step: 'ai-speaking'; message: typeof SCENARIO[2] }
  | { step: 'confirming' }
  | { step: 'success' };

export default function VirtualAssistantDemo() {
  const [state, setState] = useState<State>({ step: 'incoming' });
  const reducesMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (reducesMotion.current) {
      setState({ step: 'success' });
      return;
    }
    const t0 = setTimeout(() => setState({ step: 'ringing' }), 600);
    const t1 = setTimeout(() => setState({ step: 'connected', index: 1 }), 1600);
    const t2 = setTimeout(() => setState({ step: 'customer-speaking', message: SCENARIO[1] }), 1600 + SCENARIO[1].showAfterMs);
    const t3 = setTimeout(() => setState({ step: 'ai-thinking' }), 1600 + SCENARIO[1].showAfterMs + 1200);
    const t4 = setTimeout(() => setState({ step: 'ai-speaking', message: SCENARIO[2] }), 1600 + SCENARIO[1].showAfterMs + 1200 + 1800);
    const t5 = setTimeout(() => setState({ step: 'customer-speaking', message: SCENARIO[3] }), 1600 + SCENARIO[1].showAfterMs + 1200 + 1800 + SCENARIO[2].showAfterMs);
    const t6 = setTimeout(() => setState({ step: 'ai-thinking' }), 1600 + SCENARIO[1].showAfterMs + 1200 + 1800 + SCENARIO[2].showAfterMs + 1400);
    const t7 = setTimeout(() => setState({ step: 'ai-speaking', message: SCENARIO[4] }), 1600 + SCENARIO[1].showAfterMs + 1200 + 1800 + SCENARIO[2].showAfterMs + 1400 + 1800);
    const t8 = setTimeout(() => setState({ step: 'confirming' }), 1600 + SCENARIO[1].showAfterMs + 1200 + 1800 + SCENARIO[2].showAfterMs + 1400 + 1800 + SCENARIO[4].showAfterMs);
    const t9 = setTimeout(() => setState({ step: 'customer-speaking', message: SCENARIO[5] }), 1600 + SCENARIO[1].showAfterMs + 1200 + 1800 + SCENARIO[2].showAfterMs + 1400 + 1800 + SCENARIO[4].showAfterMs + 1200);
    const t10 = setTimeout(() => setState({ step: 'success' }), 1600 + SCENARIO[1].showAfterMs + 1200 + 1800 + SCENARIO[2].showAfterMs + 1400 + 1800 + SCENARIO[4].showAfterMs + 1200 + 1400);

    return () => {
      clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      clearTimeout(t5); clearTimeout(t6); clearTimeout(t7); clearTimeout(t8); clearTimeout(t9); clearTimeout(t10);
    };
  }, []);

  const step = state.step;
  const isConnected = step === 'connected' || ['customer-speaking', 'ai-thinking', 'ai-speaking', 'confirming'].includes(step as string);
  const isSuccess = step === 'success';
  const isActive = !isSuccess;

  const headerLabel = isSuccess ? 'Rezervováno' : isConnected ? 'Hovor probíhá' : 'Příchozí hovor';
  const headerSub = isSuccess
    ? 'Středa 14:00 · střih a úprava vousů'
    : step === 'incoming'
      ? 'Čeká na připojení'
      : step === 'ringing'
        ? 'Zvedá virtuální asistent…'
        : step === 'connected'
          ? 'Připojeno se zákazníkem'
          : step === 'customer-speaking'
            ? `${CALLER_NAME} mluví`
            : step === 'ai-thinking'
              ? 'Asistent připravuje odpověď…'
              : step === 'ai-speaking'
                ? 'Virtuální asistent odpovídá'
                : 'Čekám na potvrzení…';

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_14px_40px_-16px_rgba(23,23,22,0.18)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-surface-muted/70 px-5 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink">
            {isSuccess ? (
              <>
                <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                Rezervováno
              </>
            ) : step === 'ringing' ? (
              <>
                <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-accent animate-pulse" />
                Příchozí hovor
              </>
            ) : (
              <>
                <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {headerLabel}
              </>
            )}
          </span>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-faint">{headerSub}</span>
      </div>

      {/* Caller line */}
      <div className="flex items-center gap-3 border-b border-border bg-surface-muted/40 px-5 py-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-panel text-[10px] font-semibold text-ink">
          {CALLER_INITIALS}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{CALLER_NAME}</p>
          <p className="truncate text-xs text-muted">{BUSINESS_NAME}</p>
        </div>
        {isActive && (
          <span className="shrink-0 rounded-full border border-accent/20 bg-accent-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
            {step === 'ringing' ? 'Vyzvání' : 'Virtuální asistent'}
          </span>
        )}
        {isSuccess && (
          <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-bright">
            POTVRDĚNO
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col">
        <AnimatePresence mode="wait">
          {/* Incoming / ringing */}
          {step === 'incoming' && (
            <motion.div
              key="incoming"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center gap-3.5 px-5 py-8 text-center"
            >
              <motion.span
                className="grid h-11 w-11 place-items-center rounded-full bg-accent text-accent-bright shadow-sm"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </motion.span>
              <p className="text-sm font-semibold text-ink">Příchozí hovor od zákazníka</p>
              <p className="text-xs text-muted">Virtuální asistent přijímá hovor…</p>
            </motion.div>
          )}

          {step === 'ringing' && (
            <motion.div
              key="ringing"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex flex-col items-center justify-center gap-3.5 px-5 py-8 text-center"
            >
              <motion.span
                className="grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-bright shadow-sm"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </motion.span>
              <p className="text-sm font-semibold text-ink">Telefon zazvoní…</p>
              <p className="text-xs text-muted">Virtuální asistent odpoví za 2 sekundy</p>
            </motion.div>
          )}

          {/* Customer speaking */}
          {step === 'customer-speaking' && state.message && (
            <motion.div
              key={`customer-${state.message.text}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="flex flex-col gap-2.5 px-5 py-4"
            >
              <div className="flex items-center gap-2">
                <span className="grid h-2.5 w-2.5 shrink-0 place-items-center rounded-full bg-panel text-[7px] text-ink font-semibold">
                  {CALLER_INITIALS}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">{CALLER_NAME}</span>
              </div>
              <p className="rounded-lg rounded-bl-md border border-border bg-surface-muted px-4 py-2.5 text-sm leading-relaxed text-ink">
                {state.message.text}
              </p>
            </motion.div>
          )}

          {/* AI thinking */}
          {step === 'ai-thinking' && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="flex flex-col gap-2.5 px-5 py-4"
            >
              <div className="flex items-center justify-end gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">Virtuální asistent</span>
              </div>
              <div className="rounded-lg rounded-br-md border border-accent/15 bg-accent-soft px-4 py-2.5">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="inline-block h-1.5 w-1.5 rounded-full bg-accent/70"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* AI speaking */}
          {step === 'ai-speaking' && state.message && (
            <motion.div
              key={`ai-${state.message.text}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="flex flex-col gap-2.5 px-5 py-4"
            >
              <div className="flex items-center justify-end gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">Virtuální asistent</span>
              </div>
              <p className="rounded-lg rounded-br-md border border-accent/15 bg-accent-soft px-4 py-2.5 text-sm leading-relaxed text-ink">
                {state.message.text}
              </p>
            </motion.div>
          )}

          {/* Confirming — subtle prompt */}
          {step === 'confirming' && (
            <motion.div
              key="confirming"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="flex flex-col gap-2.5 px-5 py-4"
            >
              <div className="flex items-center justify-end gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">Virtuální asistent</span>
              </div>
              <p className="rounded-lg rounded-br-md border border-accent/15 bg-accent-soft px-4 py-2.5 text-sm leading-relaxed text-ink">
                Rezervace ve středu 14:00 je zapsána. Mám ji potvrdit?
              </p>
            </motion.div>
          )}

          {/* Success */}
          {isSuccess && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-3 px-5 py-4"
            >
              <div className="flex items-center gap-2.5">
                <motion.span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-bright shadow-sm"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.span>
                <div>
                  <p className="text-sm font-semibold text-ink">Rezervováno</p>
                  <p className="text-xs text-muted">Středa 14:00 · střih a úprava vousů</p>
                </div>
              </div>
              <div className="border-t border-border pt-2.5 space-y-1.5">
                <div className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-1.5">
                  <span className="text-[11px] font-medium text-muted">Rezervace</span>
                  <span className="text-[11px] font-semibold text-ink">Středa 14:00</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-1.5">
                  <span className="text-[11px] font-medium text-muted">Služba</span>
                  <span className="text-[11px] font-semibold text-ink">Střih a úprava vousů</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-accent-soft px-3 py-1.5">
                  <span className="text-[11px] font-medium text-muted">Stav</span>
                  <span className="text-[11px] font-semibold text-ink">Potvrzeno · zapsáno do kalendáře</span>
                </div>
              </div>
              <p className="text-[11px] text-muted">Zákazník obdrží potvrzení SMS zprávou i e-mailem.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
