import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/home/Reveal';
import { Icon } from '@/components/shared/Icon';
import DemoCallPreview from '@/components/demo/DemoCallPreview';
import { SHOWROOM_ORDER } from '@/lib/demo-showcase';

/**
 * RECEPCE.TECH DEMO LAB — editorial showcase existujících dem.
 *
 * Žádný SaaS katalog: asymetrické řady, velká typografie, hodně whitespace,
 * preview jako miniatura reálného call rozhraní. Každá řada odkazuje na
 * již existující URL /demo/[slug] — ta se tady nevytvářejí ani nemění.
 */

export const metadata: Metadata = {
  title: { absolute: 'Demo Lab — vyzkoušejte si AI recepci | Recepce.tech' },
  description:
    'Skutečné AI recepční. Skutečné scénáře. Vyberte si a rovnou si je vyzkoušejte — gastro, retail, beauty i zdravotnictví.',
  alternates: { canonical: '/demo' },
  openGraph: {
    title: 'Demo Lab — vyzkoušejte si AI recepci | Recepce.tech',
    description:
      'Skutečné AI recepční. Skutečné scénáře. Vyberte si a rovnou si je vyzkoušejte.',
    url: 'https://www.recepce.tech/demo',
    siteName: 'Recepce.tech',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function DemoPage() {
  return (
    <>
      {/* ── HERO — kompaktní, editorial ──────────────────────────────── */}
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 pb-12 pt-14 lg:px-8 lg:pb-16 lg:pt-20">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted">
              Recepce.tech / Demo Lab
            </p>
            <h1 className="text-balance mt-6 max-w-3xl text-[2.4rem] font-semibold leading-[1.02] tracking-[-0.035em] text-ink sm:text-[3.2rem] lg:text-[4.2rem]">
              Vyzkoušejte si Recepce.tech.
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted sm:text-lg">
              Skutečné AI recepční. Skutečné scénáře.{' '}
              <span className="text-ink">Vyberte si.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── DEMO ŘADY — asymetrický editorial layout ─────────────────── */}
      <section>
        {SHOWROOM_ORDER.map((demo, index) => {
          const reversed = index % 2 === 1;

          return (
            <Reveal key={demo.slug} y={22}>
              <Link
                href={`/demo/${demo.slug}`}
                className="group block border-b border-border/60 transition-colors duration-300 hover:bg-surface-muted/25"
              >
                <div
                  className={`mx-auto grid w-full max-w-6xl items-center gap-8 px-6 py-12 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-16 ${
                    reversed ? '' : ''
                  }`}
                >
                  {/* Textový blok */}
                  <div
                    className={`lg:col-span-5 ${
                      reversed ? 'lg:order-2 lg:pl-6' : 'lg:order-1 lg:pr-6'
                    }`}
                  >
                    <div className="flex items-baseline gap-5">
                      <span className="text-[13px] font-semibold tracking-[0.08em] text-faint">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h2 className="text-[1.55rem] font-semibold uppercase leading-[1.05] tracking-[-0.015em] text-ink sm:text-[1.9rem] lg:text-[2.15rem]">
                          {demo.client}
                        </h2>
                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                          {demo.location}
                        </p>
                      </div>
                    </div>

                    <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted sm:text-base">
                      {demo.tagline}
                    </p>

                    <p className="mt-4 text-[12px] font-medium uppercase tracking-[0.16em] text-faint">
                      {demo.capabilities.join(' · ')}
                    </p>

                    <span className="mt-8 inline-flex items-center gap-2.5 text-[15px] font-semibold text-ink">
                      <span className="border-b border-ink pb-0.5 transition-colors duration-200 group-hover:border-accent group-hover:text-accent">
                        Vyzkoušet
                      </span>
                      <Icon
                        name="arrow-right"
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5"
                      />
                    </span>
                  </div>

                  {/* Vizuální preview — miniatura reálného call UI */}
                  <div
                    className={`lg:col-span-7 ${
                      reversed ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <DemoCallPreview
                      client={demo.client}
                      location={demo.location}
                      initials={demo.initials}
                      scenario={demo.scenario}
                    />
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
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
