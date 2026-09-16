'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const OSOBA = {
  jmeno: 'Matyáš Vojan',
  titul: 'Recepce.tech',
  text: 'Weby stavím od konceptu po spuštění sám — strukturu, vizuál i kód. Nepracuju se šablonami z krabice; každý podnik potřebuje vlastní tvar.',
  detail: 'K firmám, které kromě webu potřebují i někoho, kdo zvedne telefon, patří druhá půlka Recepce.tech — virtuální asistenti.',
};

export default function KdoZatimStoji() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const osoba = OSOBA;

  return (
    <section className="scroll-mt-20 bg-surface py-24 lg:py-32">
      <div className="mx-auto w-full max-w-5xl px-6 lg:px-8" ref={ref}>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 items-center">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative"
          >
            <div className="overflow-hidden rounded-2xl bg-panel shadow-[0_18px_50px_-20px_rgba(23,23,22,0.3)]">
              {/* Founder placeholder — SVG avatar + name plate, no external image */}
              <div className="relative aspect-[4/5]">
                <svg
                  viewBox="0 0 400 500"
                  preserveAspectRatio="xMidYMid slice"
                  className="absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  <rect fill="var(--color-ink)" width="400" height="500" />
                  <circle cx="200" cy="220" r="90" fill="var(--color-ink-2)" />
                  <path d="M130 340c0-60 50-100 70-100s70 40 70 100z" fill="var(--color-ink-2)" />
                  <path d="M200 320c-50 0-90 40-90 100 0 20 10 40 25 45 15-5 25-25 25-45 0-60 40-100 90-100z" fill="var(--color-ink-2)" />
                </svg>
                {/* Name plate */}
                <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-border bg-surface p-4">
                  <p className="text-sm font-semibold text-ink">{osoba.jmeno}</p>
                  <p className="text-xs text-muted">{osoba.titul}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.12, ease: 'easeOut' }}
            className="flex flex-col"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Člověk za Recepce.tech
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl lg:text-4xl">
              {osoba.jmeno}
            </h2>
            <p className="mt-2 text-sm font-medium text-muted">{osoba.titul}</p>
            <div className="mt-6 rounded-xl bg-accent-soft p-5">
              <p className="text-base leading-relaxed text-ink">{osoba.text}</p>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted">{osoba.detail}</p>
            <div className="mt-6 flex items-center gap-3 text-xs text-muted">
              <span className="flex h-1.5 w-1.5 rounded-full bg-accent" />
              Přímý kontakt — e-mail, telefon, chat
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
