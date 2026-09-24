'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';
import VoiceDemo from '@/components/demo/VoiceDemo';
import {
  DEMO_SHOWCASES,
  findShowcaseBySlug,
  getDefaultShowcase,
  type DemoShowcase,
} from '@/lib/demo-showcase';
import type { VapiDemoSlug } from '@/lib/vapi/server';
import { useRouter } from 'next/navigation';

/**
 * Přepínač ukázek + hlasová demo karta. Vždy je vidět jen jedno demo —
 * každé má vlastní URL /demo/[slug]; přepínač na ni naviguje (sdílitelný
 * odkaz na konkrétní demo, přístupné klávesnici).
 */
interface DemoShowcaseSwitcherProps {
  activeSlug: VapiDemoSlug;
}

const DEMO_CTA = {
  href: '/#kontakt',
  label: 'Chci vlastní AI recepci',
  note: 'Připravíme ukázku na vaše reálné situace — bez hardware, s vaším stávajícím číslem.',
};

function DemoPicker({
  showcases,
  selected,
  onSelect,
}: {
  showcases: DemoShowcase[];
  selected: DemoShowcase;
  onSelect: (showcase: DemoShowcase) => void;
}) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(() =>
    Math.max(0, showcases.findIndex((item) => item.slug === selected.slug)),
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const listId = useId();
  const selectedIndex = useMemo(
    () => showcases.findIndex((item) => item.slug === selected.slug),
    [showcases, selected.slug],
  );

  const close = useCallback(() => {
    setOpen(false);
    setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    triggerRef.current?.focus();
  }, [selectedIndex]);

  const openAndFocus = useCallback(() => {
    setOpen(true);
    setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [selectedIndex]);

  /* Klik mimo seznam zavře. */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      const node = event.target as Node;
      if (!containerRef.current?.contains(node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  /* Fokus na aktivní volbu. */
  useEffect(() => {
    if (!open) return;
    optionRefs.current[focusedIndex]?.focus();
  }, [open, focusedIndex]);

  /* Klávesnice: šipky, Home/End, Enter/Space, Escape. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setFocusedIndex((current) =>
          current >= showcases.length - 1 ? 0 : current + 1,
        );
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setFocusedIndex((current) =>
          current <= 0 ? showcases.length - 1 : current - 1,
        );
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        setFocusedIndex(0);
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        setFocusedIndex(showcases.length - 1);
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const item = showcases[focusedIndex];
        if (!item) return;
        onSelect(item);
        setOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [close, focusedIndex, onSelect, open, showcases]);

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? close() : openAndFocus())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openAndFocus();
          }
        }}
        className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 text-left transition-colors duration-200 hover:border-border-strong focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-[10px] font-semibold text-accent-bright">
            {selected.initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-ink">
              {selected.client}
            </span>
            <span className="block truncate text-[11px] text-muted">
              {selected.location}
            </span>
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-muted"
          aria-hidden="true"
        >
          <Icon name="chevron-right" className="h-4 w-4 -rotate-90" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={listId}
            role="listbox"
            aria-label="Seznam dostupných dem"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-0 z-40 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-surface p-1.5 shadow-[0_18px_50px_-30px_rgba(23,23,22,0.28)]"
          >
            {showcases.map((item, index) => {
              const isActive = item.slug === selected.slug;
              return (
                <button
                  key={item.slug}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  tabIndex={-1}
                  onClick={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
                    isActive ? 'bg-accent-soft' : 'hover:bg-surface-muted'
                  }`}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-[9px] font-semibold text-accent-bright">
                    {item.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink">
                      {item.client}
                    </span>
                    <span className="block truncate text-[11px] text-muted">
                      {item.location}
                    </span>
                  </span>
                  {isActive && (
                    <Icon name="check" className="ml-auto h-4 w-4 shrink-0 text-ink" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DemoShowcaseSwitcher({ activeSlug }: DemoShowcaseSwitcherProps) {
  const router = useRouter();
  const selected = useMemo(
    () => findShowcaseBySlug(activeSlug) ?? getDefaultShowcase(),
    [activeSlug],
  );

  const selectSlug = useCallback(
    (slug: VapiDemoSlug) => {
      router.push(`/demo/${slug}`);
    },
    [router],
  );

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Přepínač — vždy viditelné jen jedno demo */}
      <div className="flex justify-center">
        <DemoPicker
          showcases={DEMO_SHOWCASES}
          selected={selected}
          onSelect={(item) => selectSlug(item.slug)}
        />
      </div>

      {/* Aktivní demo — vždy jen jedno */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={selected.slug}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          className="mt-8"
        >
          <VoiceDemo showcase={selected} showFeedback cta={DEMO_CTA} key={selected.slug} />

          {/* Konkrétní scénář vybraného dema */}
          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-border bg-surface-muted/40 px-5 py-5 text-center sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
              Vyzkoušejte konkrétní scénář
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/80 sm:text-[15px]">
              {selected.scenario}
            </p>
            <p className="mt-3 text-sm font-semibold text-ink">
              Stačí zavolat.
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
