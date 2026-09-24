'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';
import type { DemoShowcase } from '@/lib/demo-showcase';

/**
 * Karta dema pro showroom /demo — vypadá jako preview skutečného hlasového
 * produktu (waveform + call rozhraní), ne jako blogový card. Celá karta je
 * klikatelná a vede na existující URL /demo/[slug].
 */

interface DemoLabCardProps {
  showcase: DemoShowcase;
  featured?: boolean;
}

/* Čísla karet — stabilní pořadí podle definice showcaseů. */
const DEMO_ORDER = [
  'ugo-stromovka',
  'ludmila',
  'therapy-point',
  'noname-barbershop',
  'atombike',
  'paws-and-care',
] as const;

const SHOWCASE_NUMBER = new Map(
  DEMO_ORDER.map((slug, index) => [slug, String(index + 1).padStart(2, '0')]),
);

/* Dekorativní waveform — statický rytmus výšek, „nafoukne" se na hoveru. */
function Waveform({ active }: { active: boolean }) {
  const BARS = [10, 18, 26, 14, 30, 22, 12, 28, 16, 24, 9, 20, 30, 13, 25, 17, 29, 11, 21, 15];

  return (
    <div className="flex h-10 items-center justify-center gap-[3px]" aria-hidden="true">
      {BARS.map((height, index) => (
        <motion.span
          key={index}
          className="w-[3px] rounded-full bg-accent/70"
          animate={{ scaleY: active ? [1, height / 15, 1] : 0.45 }}
          transition={
            active
              ? {
                  duration: 0.9 + (index % 5) * 0.12,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.045,
                }
              : { duration: 0.3 }
          }
          style={{ height }}
        />
      ))}
    </div>
  );
}

/* Miniatura „call rozhraní" — tři bubliny naznačující konverzaci. */
function CallPreview({ speaking }: { speaking: boolean }) {
  return (
    <div className="flex flex-col gap-1.5" aria-hidden="true">
      <motion.span
        className="h-2 w-3/5 rounded-full bg-accent/80"
        animate={{ opacity: speaking ? [1, 0.55, 1] : 0.8 }}
        transition={speaking ? { duration: 1.4, repeat: Infinity } : { duration: 0.3 }}
      />
      <span className="ml-auto h-2 w-2/5 rounded-full bg-surface-muted" />
      <span className="h-2 w-1/2 rounded-full bg-surface-muted" />
    </div>
  );
}

export default function DemoLabCard({ showcase, featured = false }: DemoLabCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="group h-full"
    >
      <Link
        href={`/demo/${showcase.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-200 hover:border-border-strong focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      >
        {/* Preview zóna — „skutečný produkt", ne ilustrace */}
        <div className="relative border-b border-border bg-surface-muted/40 px-5 pb-4 pt-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-faint">
              {String(SHOWCASE_NUMBER.get(showcase.slug) ?? '')}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">
              <span className="h-1 w-1 rounded-full bg-emerald-500" aria-hidden="true" />
              Live
            </span>
          </div>

          {featured ? (
            <div className="mt-4">
              <Waveform active={!reduce} />
              <div className="mx-auto mt-4 max-w-[240px]">
                <CallPreview speaking={!reduce} />
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <Waveform active={false} />
            </div>
          )}
        </div>

        {/* Obsah karty */}
        <div className="flex flex-1 flex-col p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            {showcase.category}
          </p>
          <h3
            className={`mt-2 font-semibold tracking-[-0.01em] text-ink ${
              featured ? 'text-xl sm:text-2xl' : 'text-base'
            }`}
          >
            {showcase.client}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{showcase.tagline}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {showcase.capabilities.map((capability) => (
              <span
                key={capability}
                className="rounded-full border border-border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted"
              >
                {capability}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between pt-5">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors duration-200 group-hover:text-accent">
              Vyzkoušet demo
              <Icon
                name="arrow-right"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-faint">
              {showcase.demoType}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

