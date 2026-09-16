'use client';

import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';

/**
 * Profilková karta klienta ve stylu příchozího hovoru — vizuál sekce
 * VIRTUÁLNÍ ASISTENTI na homepage. Místo demo fotky: profil zákazníka,
 * který volá, a spojení s Recepce.tech. Paletové barvy, žádná stock fotka.
 */

export default function ClientProfileCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-xl"
    >
      {/* Karta — příchozí hovor */}
      <div className="border border-panel-edge bg-panel px-7 py-8 sm:px-9 sm:py-10">
        <div className="flex items-center gap-5">
          {/* Profilový „fotografický“ úhel — abstraktní silueta v paletě.
              Když bude reálná fotografie klienta, vymění se jen tento blok. */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border bg-surface-muted">
            <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <rect width="80" height="80" fill="#D8D2C8" />
              <circle cx="40" cy="30" r="14" fill="#A49E94" />
              <path d="M12 80c0-17 12-28 28-28s28 11 28 28z" fill="#A49E94" />
            </svg>
            {/* Živý indikátor hovoru */}
            <span className="absolute bottom-1 right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
              <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-panel bg-accent" />
            </span>
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
              Příchozí hovor
            </p>
            <p className="mt-1.5 truncate text-2xl font-semibold tracking-[-0.02em] text-ink">
              Zákazník volá
            </p>
            <p className="mt-1 text-sm text-muted">
              Út 14:32 · 00:12
              <span className="tabular-nums" />
            </p>
          </div>
        </div>

        {/* Co asistent řeší */}
        <ul className="mt-7 space-y-0 border-t border-border">
          {[
            { icon: 'phone-call' as const, text: 'Zvedne ve prvním vyzvánění' },
            { icon: 'message-circle' as const, text: 'Odpoví na dotaz podle nastavení' },
            { icon: 'calendar-check' as const, text: 'Rezervaci zapíše do kalendáře' },
          ].map(({ icon, text }) => (
            <li
              key={text}
              className="flex items-center gap-3 border-b border-border py-3 text-sm font-medium text-ink-2 last:border-b-0"
            >
              <Icon name={icon} className="h-4 w-4 shrink-0 text-accent" />
              {text}
            </li>
          ))}
        </ul>

        {/* Spojení s Recepce.tech */}
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
          <span className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            Připojeno k Recepce.tech
          </span>
          <span className="text-[11px] font-medium tracking-[0.08em] text-faint">
            24/7
          </span>
        </div>
      </div>
    </motion.div>
  );
}
