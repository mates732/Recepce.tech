'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';
import Reveal from '@/components/home/Reveal';
import LudmilaStickyCta from '@/components/demo/LudmilaStickyCta';

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

  /* Pojistka: kdyby iframe doběhl ještě před hydratací Reactu (typicky
     v dev režimu), `onLoad` se nezachytí — status po chvíli přepneme sami. */
  useEffect(() => {
    const timeout = window.setTimeout(() => setLoaded(true), 4000);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <>
      {/* Hero — komu je demo určené a co si v něm prohlédnout */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(23,23,22,0.055)_1px,transparent_0)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]"
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-10 pt-10 sm:pt-14 lg:px-8 lg:pb-14 lg:pt-20">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
              Demo · Textil Ludmila
            </p>

            {/* Mobil: kompaktnější stupeň (3 řádky), desktop vzdušný — proto vlastní
                max-width, aby headline nikdy neběžel přes celou šířku. */}
            <h1 className="text-balance mt-4 max-w-[46rem] text-[2.15rem] font-semibold leading-[1.08] tracking-[-0.02em] text-ink sm:mt-5 sm:text-[2.7rem] sm:leading-[1.05] lg:text-[3.65rem] lg:leading-[1.03] lg:tracking-[-0.03em]">
              Textil Ludmila
              <br />
              <span className="text-accent">s digitálním recepčním.</span>
            </h1>

            <p className="mt-5 max-w-[38rem] text-[15px] leading-[1.75] text-ink/80 sm:mt-6 sm:text-base lg:mt-7 lg:text-[17px]">
              Živé demo webu pro prodejnu metrového textilu v Praze 6. Metrový
              textil, šití závěsů na míru i stínění oken — a k tomu recepční,
              který zákazníkovi odpoví i ve chvíli, kdy je prodejna zavřená.
            </p>

            {/* CTA: primární + sekundární. Na mobilu se mačkají podle obsahu,
                ne přes celou šířku — velký tap target, ale žádný „blok“. */}
            <div className="mt-8 flex flex-col items-start gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-4">
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

      {/* Živé demo v rámu — jemný reveal, jinak beze změny */}
      <section
        id="ukazka"
        className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 pb-28 md:pb-16 lg:px-8 lg:pb-20"
      >
        <Reveal y={16}>
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-[0_24px_60px_-32px_rgba(53,51,48,0.5)] sm:rounded-2xl">
            {/* Browser chrome — reálná doména dema + odkaz mimo rám */}
            <div className="flex items-center gap-2 border-b border-border bg-surface-muted/70 px-3 py-2.5 sm:px-4">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-panel-edge" />
                <span className="h-2.5 w-2.5 rounded-full bg-panel-edge" />
                <span className="h-2.5 w-2.5 rounded-full bg-panel-edge" />
              </div>

              <div className="ml-1 flex min-w-0 flex-1 items-center gap-2">
              {/* Stav náhledu držíme v liště — nikdy nezakrývá obsah dema. */}
              <span className="hidden h-3.5 w-3.5 shrink-0 rounded-full bg-accent/20 sm:inline-block" />
              <span className="truncate text-[11px] font-medium text-ink">
                {DEMO_DOMAIN}/demo
              </span>
              <span className="shrink-0 rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-medium text-muted">
                {loaded ? 'Živé demo' : 'Načítám demo'}
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
          <div className="relative h-[min(820px,78vh)] min-h-[460px] w-full bg-page sm:min-h-[520px]">
            <iframe
              src={DEMO_URL}
              title="Textil Ludmila — demo webu s digitálním recepčním"
              loading="lazy"
              allow="microphone; autoplay; fullscreen"
              onLoad={() => setLoaded(true)}
              className="h-full w-full border-0"
            />
          </div>
        </div>
        </Reveal>

        {/* Jak si demo vyzkoušet — editorial řádky, ikona vlevo, label + text */}
        <Reveal y={16}>
          <div className="mt-10 grid gap-y-7 border-t border-border pt-8 sm:mt-12 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-0 sm:pt-10 lg:gap-x-12">
            {NOTES.map((note) => (
              <div key={note.title} className="flex items-start gap-3.5">
                <span className="mt-px inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border">
                  <Icon name={note.icon} className="h-4 w-4 text-accent" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
                    {note.title}
                  </p>
                  <p className="mt-2 text-[13.5px] leading-[1.7] text-ink/80 sm:text-sm lg:text-[15px] lg:leading-[1.75]">
                    {note.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Decentní fallback pod náhledem */}
        <p className="mt-7 text-[13px] leading-relaxed text-faint">
          Rám se nezobrazil?{' '}
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted underline decoration-border-strong/40 underline-offset-4 transition-colors duration-200 hover:text-ink hover:decoration-ink"
          >
            Otevřete demo v nové záložce
          </a>
          .
        </p>
      </section>

      {/* Mobilní sticky CTA — jen na telefonu, viz komponenta. */}
      <LudmilaStickyCta />
    </>
  );
}

