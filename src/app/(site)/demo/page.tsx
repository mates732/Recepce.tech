import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/home/Reveal';
import { Icon } from '@/components/shared/Icon';
import { DEMO_SHOWCASES } from '@/lib/demo-showcase';

/**
 * /demo — jednoduchý prémiový index dem. Žádné karty ani preview panely:
 * hero + velké řádky (číslo, název, typ businessu, šipka). Každý řádek
 * odkazuje na existující URL /demo/[slug] — ty se tady nevytvářejí ani
 * nemění. Data přichází z demo-showcase (real data only).
 */

export const metadata: Metadata = {
  title: { absolute: 'Demo — vyzkoušejte si AI recepční | Recepce.tech' },
  description:
    'Živá dema AI recepčních pro různé typy businessů — gastro, retail, zdravotnictví i služby. Vyberte si a zavolejte rovnou.',
  alternates: { canonical: '/demo' },
  openGraph: {
    title: 'Demo — vyzkoušejte si AI recepční | Recepce.tech',
    description:
      'Živá dema AI recepčních pro různé typy businessů. Vyberte si a zavolejte rovnou.',
    url: 'https://www.recepce.tech/demo',
    siteName: 'Recepce.tech',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function DemoPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 pb-14 pt-16 lg:px-8 lg:pb-20 lg:pt-24">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted">
              Demo
            </p>
            <h1 className="text-balance mt-6 max-w-3xl text-[2.4rem] font-semibold leading-[1.02] tracking-[-0.035em] text-ink sm:text-[3.2rem] lg:text-[4.2rem]">
              Vyberte si, co chcete vyzkoušet.
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted sm:text-lg">
              Živá dema AI recepčních pro různé typy businessů.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── INDEX DEM — velké řádky ──────────────────────────────────── */}
      <section>
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
          {DEMO_SHOWCASES.map((demo, index) => (
            <Reveal key={demo.slug} y={16}>
              <Link
                href={`/demo/${demo.slug}`}
                className="group flex items-center gap-5 border-b border-border/60 py-7 transition-colors duration-300 hover:bg-surface-muted/25 sm:gap-8 sm:py-9"
              >
                <span className="w-8 shrink-0 font-mono text-[13px] tabular-nums text-faint sm:text-sm">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[1.35rem] font-semibold uppercase leading-[1.1] tracking-[-0.015em] text-ink sm:text-[1.8rem] lg:text-[2.1rem]">
                    {demo.client}
                  </span>
                  <span className="mt-1.5 block text-[12px] font-medium uppercase tracking-[0.18em] text-muted sm:text-[13px]">
                    {demo.descriptor} · AI recepční
                  </span>
                </span>

                <Icon
                  name="arrow-right"
                  className="h-5 w-5 shrink-0 text-muted transition-all duration-200 group-hover:translate-x-1.5 group-hover:text-ink sm:h-6 sm:w-6"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section>
        <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="text-balance text-[1.9rem] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[2.5rem]">
                Chcete vlastní AI recepční?
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted sm:text-base">
                Dema jsou jen ukázky. Vaše recepční může být vytvořená přesně
                pro váš business.
              </p>
              <Link
                href="/#kontakt"
                className="group mt-9 inline-flex items-center gap-2.5 text-[15px] font-semibold text-ink"
              >
                <span className="border-b border-ink pb-0.5 transition-colors duration-200 group-hover:border-accent group-hover:text-accent">
                  Vytvořit vlastní řešení
                </span>
                <Icon
                  name="arrow-right"
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
