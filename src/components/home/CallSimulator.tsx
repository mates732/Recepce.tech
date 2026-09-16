'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';

const CALLER_NAME = 'Tereza Černá';
const CALLER_INITIALS = 'TC';
const BUSINESS_NAME = 'Manic Párek';

type Phase = 'ringing' | 'answered' | 'msg-customer' | 'ai-thinking' | 'msg-ai' | 'success';

const FLOW: { phase: Phase; fromIdx: number; delay: number }[] = [
  { phase: 'ringing', fromIdx: -1, delay: 2400 },
  { phase: 'answered', fromIdx: -1, delay: 2400 + 1600 },
  { phase: 'msg-customer', fromIdx: 0, delay: 2400 + 1600 + 1800 },
  { phase: 'ai-thinking', fromIdx: -1, delay: 2400 + 1600 + 1800 + 2200 },
  { phase: 'msg-ai', fromIdx: 1, delay: 2400 + 1600 + 1800 + 2200 + 2200 },
  { phase: 'msg-customer', fromIdx: 2, delay: 2400 + 1600 + 1800 + 2200 + 2200 + 1600 },
  { phase: 'ai-thinking', fromIdx: -1, delay: 2400 + 1600 + 1800 + 2200 + 2200 + 1600 + 1800 },
  { phase: 'msg-ai', fromIdx: 3, delay: 2400 + 1600 + 1800 + 2200 + 2200 + 1600 + 1800 + 2200 },
  { phase: 'msg-customer', fromIdx: 4, delay: 2400 + 1600 + 1800 + 2200 + 2200 + 1600 + 1800 + 2200 + 1400 },
  { phase: 'ai-thinking', fromIdx: -1, delay: 2400 + 1600 + 1800 + 2200 + 2200 + 1600 + 1800 + 2200 + 1400 + 1200 },
  { phase: 'msg-ai', fromIdx: 3, delay: 2400 + 1600 + 1800 + 2200 + 2200 + 1600 + 1800 + 2200 + 1400 + 1200 + 2000 },
  { phase: 'success', fromIdx: -1, delay: 2400 + 1600 + 1800 + 2200 + 2200 + 1600 + 1800 + 2200 + 1400 + 1200 + 2000 + 1600 },
];

const SCENARIO = [
  { actor: 'customer' as const, text: 'Dobrý den, chtěla bych se znovu objednat na střih.' },
  { actor: 'ai' as const, text: 'Dobrý den, Terezo. Máte zájem o tentokrát o úterý nebo středu?' },
  { actor: 'customer' as const, text: 'Úterý dopoledne by bylo super.' },
  { actor: 'ai' as const, text: 'Máme volno ve 15:30. Je to v pořádku?' },
  { actor: 'customer' as const, text: 'Ano, je to v pořádku.' },
];

export function CallSimulator({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>('ringing');
  const [msgIdx, setMsgIdx] = useState<number | null>(null);
  const reducesMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (reducesMotion.current) {
      setPhase('success');
      return;
    }

    FLOW.forEach((step) => {
      const id = setTimeout(() => {
        setPhase(step.phase);
        setMsgIdx(step.fromIdx >= 0 ? step.fromIdx : null);
      }, step.delay);
      return () => clearTimeout(id);
    });

    return () => {};
  }, []);

  const isSuccess = phase === 'success';

  const headerText = isSuccess ? 'Rezervováno' : phase === 'ringing' ? 'Příchozí hovor' : 'Provozuji hovor';
  const subText = isSuccess ? 'Úterý 15:30 · střih' : phase === 'ringing' ? 'Zvedáme…' : phase === 'answered' ? 'Připojeno' : 'Virtuální asistent odpovídá';

  const showCustomerMsg = phase === 'msg-customer' && msgIdx !== null;
  const showAiMsg = phase === 'msg-ai' && msgIdx !== null;
  const showAiThinking = phase === 'ai-thinking';

  const currentCustomerMsg = showCustomerMsg ? SCENARIO[msgIdx] : null;
  const currentAiMsg = showAiMsg ? SCENARIO[msgIdx] : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-panel/50 backdrop-blur-sm">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-panel/50 backdrop-blur-sm" aria-label="Zavřít" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_60px_-20px_rgba(23,23,22,0.4)]"
      >
        <div className="flex items-center justify-between border-b border-border bg-surface-muted/70 px-5 py-3">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink">
              {isSuccess ? (
                <>
                  <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  Rezervováno
                </>
              ) : phase === 'ringing' ? (
                <>
                  <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-accent animate-pulse" />
                  Příchozí hovor
                </>
              ) : (
                <>
                  <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {headerText}
                </>
              )}
            </span>
          </div>
          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-faint">{subText}</span>
        </div>

        <div className="flex items-center gap-3 border-b border-border bg-surface-muted/40 px-5 py-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-panel text-[10px] font-semibold text-ink">{CALLER_INITIALS}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{CALLER_NAME}</p>
            <p className="truncate text-xs text-muted">{BUSINESS_NAME}</p>
          </div>
          {phase === 'ringing' && (
            <span className="shrink-0 rounded-full border border-accent/20 bg-accent-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent animate-pulse">RING</span>
          )}
          {phase !== 'ringing' && phase !== 'success' && (
            <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-bright">Virtuální asistent</span>
          )}
          {isSuccess && (
            <span className="shrink-0 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink">POTVRDĚNO</span>
          )}
        </div>

        <div className="flex flex-col min-h-[280px]">
          <AnimatePresence mode="wait">
            {phase === 'ringing' && (
              <motion.div key="ringing" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="flex flex-col items-center justify-center gap-3.5 px-5 py-10 text-center">
                <motion.span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-bright shadow-sm" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}>
                  <Icon name="phone" className="h-6 w-6" />
                </motion.span>
                <p className="text-sm font-semibold text-ink">Příchozí hovor od zákaznice</p>
                <p className="text-xs text-muted">Virtuální asistent odpoví za okamžik…</p>
              </motion.div>
            )}

            {phase === 'answered' && (
              <motion.div key="answered" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="flex flex-col items-center justify-center gap-3.5 px-5 py-10 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-600 text-ink shadow-sm">
                  <Icon name="check" className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold text-ink">Hovor přijat</p>
                <p className="text-xs text-muted">Virtuální asistent odpovídá…</p>
              </motion.div>
            )}

            {showCustomerMsg && currentCustomerMsg && (
              <motion.div key={`c-${msgIdx}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }} className="flex flex-col gap-2.5 px-5 py-5">
                <div className="flex items-center gap-2">
                  <span className="grid h-2.5 w-2.5 shrink-0 place-items-center rounded-full bg-panel text-[7px] text-ink font-semibold">{CALLER_INITIALS}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">{CALLER_NAME}</span>
                </div>
                <p className="rounded-lg rounded-bl-md border border-border bg-surface-muted px-4 py-2.5 text-sm leading-relaxed text-ink">{currentCustomerMsg.text}</p>
              </motion.div>
            )}

            {showAiMsg && currentAiMsg && (
              <motion.div key={`ai-${msgIdx}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }} className="flex flex-col gap-2.5 px-5 py-5">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">Virtuální asistent</span>
                </div>
                <p className="rounded-lg rounded-br-md border border-accent/15 bg-accent-soft px-4 py-2.5 text-sm leading-relaxed text-ink">{currentAiMsg.text}</p>
              </motion.div>
            )}

            {showAiThinking && (
              <motion.div key="thinking" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }} className="flex flex-col gap-2.5 px-5 py-5">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">Virtuální asistent</span>
                </div>
                <div className="rounded-lg rounded-br-md border border-accent/15 bg-accent-soft px-4 py-2.5">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    {[0, 1, 2].map((i) => (
                      <motion.span key={i} className="inline-block h-1.5 w-1.5 rounded-full bg-accent/70" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {isSuccess && (
              <motion.div key="success" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col gap-3 px-5 py-5">
                <div className="flex items-center gap-2.5">
                  <motion.span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-600 text-ink shadow-sm" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }}>
                    <Icon name="check-circle" className="h-4.5 w-4.5" />
                  </motion.span>
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">Rezervováno</p>
                    <p className="text-xs text-emerald-700">Úterý 15:30 · střih</p>
                  </div>
                </div>
                <div className="border-t border-border pt-2.5 space-y-1.5">
                  <div className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-1.5">
                    <span className="text-[11px] font-medium text-muted">Termín</span>
                    <span className="text-[11px] font-semibold text-ink">Úterý 15:30</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-1.5">
                    <span className="text-[11px] font-medium text-muted">Služba</span>
                    <span className="text-[11px] font-semibold text-ink">Střih</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-1.5">
                    <span className="text-[11px] font-medium text-emerald-700">Stav</span>
                    <span className="text-[11px] font-semibold text-emerald-800">Potvrzeno</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted">Zákaznice obdrží potvrzení.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t border-border bg-surface-muted/70 px-5 py-3">
          <span className="text-[10px] font-medium text-faint">Virtuální asistent · 24/7</span>
          <Button variant="secondary" size="md" onClick={onClose} aria-label="Zavřít simulaci">Zavřít</Button>
        </div>
      </motion.div>
    </div>
  );
}
