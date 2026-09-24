'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Miniatura reálného call rozhraní dema — vrací se vizuál VoiceDemo karty
 * (avatar, status, tlačítko, bubliny konverzace ze skutečného scénáře).
 * Její „život" se projeví až na hoveru rodičovské řady (group-hover).
 */

interface DemoCallPreviewProps {
  client: string;
  location: string;
  initials: string;
  scenario: string;
}

export default function DemoCallPreview({
  client,
  location,
  initials,
  scenario,
}: DemoCallPreviewProps) {
  const reduce = useReducedMotion();

  /* Z reálného scénáře dema — ukázka úvodního dotazu zákazníka. */
  const customerLine = scenario.split(',')[0];

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-xl border border-border/80 bg-surface shadow-[0_28px_70px_-40px_rgba(53,51,48,0.45)] transition-transform duration-300 ease-out group-hover:-translate-y-1"
    >
      {/* Header call karty */}
      <div className="flex items-center gap-3 border-b border-border/80 bg-surface-muted/60 px-4 py-3 sm:px-5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-[10px] font-semibold text-accent-bright">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-ink">{client}</p>
          <p className="truncate text-[10px] text-muted">{location}</p>
        </div>
        <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          Live
        </span>
      </div>

      {/* Tělo — stav hovoru + bubliny */}
      <div className="px-4 py-5 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-muted text-ink">
            <span
              className={`absolute inset-0 rounded-full border border-accent/25 ${
                reduce ? '' : 'group-hover:animate-ping'
              }`}
            />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-4 w-4">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
              <path d="M12 18v4" />
            </svg>
          </span>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-faint">
              Asistent naslouchá
            </p>
            <p className="font-mono text-[13px] font-semibold tabular-nums text-ink">
              00:07
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <motion.p
            className="inline-block max-w-[92%] rounded-xl bg-surface-muted px-3 py-1.5 text-left text-[11px] leading-snug text-ink"
            animate={reduce ? undefined : { opacity: [0.72, 1, 0.72] }}
            transition={reduce ? undefined : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            „{customerLine?.trim()}…“
          </motion.p>
          {/* Asistent „mluví“ — indikátor řeči místo vymyšlené odpovědi */}
          <div className="flex items-center justify-end gap-2">
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-faint">
              AI asistent
            </span>
            <span className="inline-flex items-center gap-1 rounded-xl bg-accent px-3 py-2">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="h-1 w-1 rounded-full bg-accent-bright"
                  animate={reduce ? undefined : { opacity: [0.35, 1, 0.35] }}
                  transition={
                    reduce
                      ? undefined
                      : { duration: 1.1, repeat: Infinity, delay: dot * 0.18 }
                  }
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
