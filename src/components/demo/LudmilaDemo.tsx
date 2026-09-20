'use client';

import { useState } from 'react';
import { Button } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';
import Reveal from '@/components/home/Reveal';

/**
 * Živé demo pro Textil Ludmila.
 *
 * Stránka je samostatný projekt na Vercelu (statický web + Vapi recepční
 * a anonymní tracking) — tady se pouze vkládá do rámu, aby bylo demo
 * dostupné pod recepce.tech/Ludmila. Vkládáme ho jako iframe, protože
 * recepční potřebuje vlastní origin (Vapi secure mode povoluje tokeny
 * jen pro *.vercel.app a localhost) i mikrofon, který prohlížeč pustí
 * do cross-origin iframu jen s atributem `allow`.
 */
const DEMO_URL = 'https://textil-ludmila-vapi.vercel.app/demo';
const DEMO_DOMAIN = 'textil-ludmila-vapi.vercel.app';

const NOTES = [
  {
    icon: 'phone-call' as const,
    title: 'Mikrofon',
    detail:
      'Recepční mluví. Až se prohlížeč zeptá na mikrofon, povolte ho — bez něj hovor nezačne.',
  },
  {
    icon: 'lock' as const,
    title: 'Anonymně',
    detail:
      'Demo sbírá jen anonymní statistiky návštěvnosti. Žádné formuláře, žádné osobní údaje.',
  },
  {
    icon: 'bolt' as const,
    title: 'Bez instalace',
    detail:
      'Vše běží v prohlížeči. Demo si můžete projít na počítači i na telefonu.',
  },
];

export default function LudmilaDemo() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Hero — komu je demo určené a co si v něm prohlédnout */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(23,23,22,0.055)_1px,transparent_0)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]"
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-12 pt-12 sm:pt-16 lg:px-8 lg:pb-14 lg:pt-20">
          <Reveal className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
              Demo · Textil Ludmila
            </p>

            <h1 className="text-balance mt-5 text-[2.55rem] font-semibold leading-[1.04] tracking-[-0.03em] text-ink sm:text-5xl lg:text-[3.9rem] lg:leading-[1.02]">
              Textil Ludmila
              <br />
              <span className="text-accent">s digitálním recepčním.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Živé demo webu pro prodejnu metrového textilu v Praze 6. Metrový
              textil, šití závěsů na míru i stínění oken — a k tomu recepční,
              který zákazníkovi odpoví i ve chvíli, kdy je prodejna zavřená.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href={DEMO_URL} size="lg">
                OTEVŘÍT DEMO
                <Icon name="arrow-right" className="h-4 w-4 -rotate-45" />
              </Button>
              <Button href="#ukazka" variant="secondary" size="lg">
                Prohlédnout zde
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Živé demo v rámu */}
      <section
        id="ukazka"
        className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 pb-16 lg:px-8 lg:pb-20"
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_18px_50px_-22px_rgba(23,23,22,0.2)]">
          {/* Browser chrome — reálná doména dema + odkaz mimo rám */}
          <div className="flex items-center gap-2 border-b border-border bg-surface-muted/80 px-4 py-2.5">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-panel-edge" />
              <span className="h-2.5 w-2.5 rounded-full bg-panel-edge" />
              <span className="h-2.5 w-2.5 rounded-full bg-panel-edge" />
            </div>

            <div className="ml-1 flex min-w-0 flex-1 items-center gap-2">
              <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-accent/20" />
              <span className="truncate text-[11px] font-medium text-ink">
                {DEMO_DOMAIN}/demo
              </span>
              <span className="hidden shrink-0 rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-medium text-muted sm:inline">
                Živé demo
              </span>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-faint transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
              >
                <span className="hidden sm:inline">Otevřít v nové záložce</span>
                <span className="sm:hidden">Otevřít</span>
                <Icon name="arrow-right" className="h-3 w-3 -rotate-45" />
              </a>
            </div>
          </div>

          {/* Rám — vlastní origin i mikrofon řeší atribut `allow` */}
          <div className="relative h-[min(880px,82vh)] min-h-[520px] w-full bg-page">
            <iframe
              src={DEMO_URL}
              title="Textil Ludmila — demo webu s digitálním recepčním"
              loading="lazy"
              allow="microphone; autoplay; fullscreen"
              onLoad={() => setLoaded(true)}
              className="h-full w-full border-0"
            />

            {!loaded && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                Načítám demo
              </span>
            )}
          </div>
        </div>

        {/* Jak si demo vyzkoušet */}
        <div className="mt-8 grid gap-6 border-t border-border pt-8 sm:grid-cols-3">
          {NOTES.map((note) => (
            <div key={note.title} className="flex gap-3">
              <Icon name={note.icon} className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  {note.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink">{note.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm leading-relaxed text-muted">
          Rám se nezobrazil?{' '}
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ink underline decoration-border-strong underline-offset-4 transition-colors hover:text-accent"
          >
            Otevřete demo v nové záložce
          </a>
          .
        </p>
      </section>
    </>
  );
}

