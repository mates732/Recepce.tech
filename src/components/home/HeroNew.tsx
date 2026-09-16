'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';

const INCOMING_DELAY_MS = 1600;

export function HeroNew() {
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnswered(true), INCOMING_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] bg-[var(--color-ink)] text-[var(--color-surface)] overflow-hidden">
      {/* subtle texture only, no purple/blue gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear(45deg, var(--color-surface) 0 1px, transparent 1px 18px)',
        }}
      />

      {/* deep warm accent field, slim on the right */}        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-[42%] w-[22%] bg-[var(--color-accent)] opacity-20"
        style={{ '--color-accent': 'var(--color-accent)' } as React.CSSProperties}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-14 pt-20 sm:px-8 lg:justify-center lg:pt-28">
        {/* top corner label like event log */}
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-muted px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          </span>
          Příchozí hovor
        </span>

        {/* main typographic event */}
        <div className="mt-6 text-center sm:text-left">
          <p className="text-[14px] font-medium uppercase tracking-[0.32em] text-faint">
            +420 777 123 456
          </p>
          <h1 className="mt-6 text-[clamp(3rem,14vw,9rem)] leading-[0.92] tracking-[-0.04em] text-ink sm:text-left font-semibold">
            Zvedá
            <br />
            <span className="text-[var(--color-accent)]">Klára</span>.
          </h1>
        </div>

        {/* call card rising from the typographic field */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={answered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 w-full max-w-md rounded-2xl border border-border bg-surface-muted p-5 text-left shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)]"
        >
          {answered ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-surface-muted text-[10px] font-semibold">
                    KV
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">Klara Veselá</p>
                    <p className="text-[11px] text-faint">AI recepční · Kadeřnictví U Matěje</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Přijímá
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-4">
                <p className="text-sm text-muted">Klára:</p>
                <p className="text-base leading-relaxed text-ink-2">
                  Dobrý den, tady Klára. Jak vám mohu pomoci?
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-[11px] text-faint">
                <Icon name="phone" className="h-3.5 w-3.5" />
                Hovor přijatý · #INC-4201
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-8">
              <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted text-ink-2">
                <Icon name="phone" className="h-7 w-7" />
              </span>
              <p className="mt-4 text-sm font-medium text-ink-2">Příchozí hovor od zákaznice</p>
              <p className="mt-1 text-xs text-faint">AI recepční ještě nevyslechla.</p>
            </div>
          )}
        </motion.div>

        {/* quiet invitation */}
        <div className="mt-16 text-center">
          <a
            href="#klara"
            className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-surface-muted px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-soft"
          >
            Poslechnout hovor
            <Icon name="arrow-right" className="h-4 w-4" />
          </a>
          <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-ink/30">
            Klára je jen první ze čtyř receptionistů
          </p>
        </div>
      </div>

      {/* scroll whisper */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-ink/20">
        Přesuňte dolů
      </div>
    </section>
  );
}
