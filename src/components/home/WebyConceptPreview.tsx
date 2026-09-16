'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/shared/Icon';
import type { WebyProject } from '@/data/weby-projects';

/**
 * Live portál na ukázkový koncept.
 *
 * Spodní vrstva je vždy statický náhled webu (skutečný screenshot) —
 * okno tedy nikdy není prázdné (Safari neumí spolehlivě renderovat
 * transform na iframe, SPA konceptu se navíc vykresluje až na klientovi).
 * Když si živý iframe uvnitř pískne (`zlaty-hreben-ready`), plynule
 * se odhalí nad náhledem. Scale se aplikuje na wrapper div, ne na iframe.
 *
 * Celé okno je jeden odkaz: klik kdekoli otevře web v nové záložce.
 * Při najetí se obsah mírně přiblíží a objeví se výzva „Otevřít web ↗“.
 */
export default function WebyConceptPreview({ project }: { project: WebyProject }) {
  const frameWrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [liveReady, setLiveReady] = useState(false);

  useEffect(() => {
    const el = frameWrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setScale(entries[0].contentRect.width / 1280);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    // Koncept (React SPA) sám ohlásí, že je vyrenderovaný.
    function onMessage(e: MessageEvent) {
      if (e.data?.type === 'zlaty-hreben-ready') setLiveReady(true);
    }
    window.addEventListener('message', onMessage);
    // Fallback: i bez signálu odhalíme iframe po 12 s (kdyby ready nikdy nedorazil).
    const t = setTimeout(() => setLiveReady(true), 12000);
    return () => {
      window.removeEventListener('message', onMessage);
      clearTimeout(t);
    };
  }, []);

  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`${project.name} — otevřít živý web v nové záložce`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="group relative block overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_18px_50px_-22px_rgba(23,23,22,0.2)] transition-shadow duration-300 hover:shadow-[0_28px_64px_-24px_rgba(23,23,22,0.3)]"
    >
      {/* Browser chrome — reálná doména + stav + výzva k otevření */}
      <div className="flex items-center gap-2 border-b border-border bg-surface-muted/80 px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-panel-edge" />
          <span className="h-2.5 w-2.5 rounded-full bg-panel-edge" />
          <span className="h-2.5 w-2.5 rounded-full bg-panel-edge" />
        </div>
        <div className="ml-1 flex min-w-0 flex-1 items-center gap-2">
          <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-accent/20" />
          <span className="truncate text-[11px] font-medium text-ink">{project.domain}</span>
          <span className="shrink-0 rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-medium text-muted">
            {project.type}
          </span>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-faint transition-colors duration-200 group-hover:text-ink">
            Otevřít web
            <Icon
              name="arrow-right"
              className="h-3 w-3 -rotate-45 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>

      {/* Okno — statický náhled vždy, živý web se nad něj odhalí */}
      <div
        ref={frameWrapRef}
        className="relative aspect-[16/10] w-full overflow-hidden bg-page"
      >
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.02]">
          {/* Statický náhled — spodní vrstva, vidět dokud se live neodhalí */}
          <Image
            src="/weby/zlaty-hreben-live.jpg"
            alt={`${project.name} — náhled webu`}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover object-top"
          />

          {/* Živý web — wrapper nese scale (Safari neumí transform na iframe),
              odhalí se po signálu „ready“ od konceptu (nebo po 12 s fallbacku) */}
          <div
            className="absolute left-0 top-0 h-[800px] w-[1280px] origin-top-left transition-opacity duration-700"
            style={{
              transform: `scale(${scale || 0.44})`,
              opacity: liveReady ? 1 : 0,
            }}
          >
            <iframe
              src={project.url}
              title={`${project.name} — živý náhled konceptu`}
              loading="lazy"
              tabIndex={-1}
              className="h-[800px] w-[1280px] border-0"
            />
          </div>
        </div>

        {/* Načítání živého webu — jemný indikátor v paletě */}
        {!liveReady && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Načítám živou ukázku
          </span>
        )}

        {/* Portal hint při hoveru */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-bright opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          Otevřít web
          <Icon name="arrow-right" className="h-3 w-3 -rotate-45" />
        </span>
      </div>
    </motion.a>
  );
}
