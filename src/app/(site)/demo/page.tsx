import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/home/Reveal';
import { Icon } from '@/components/shared/Icon';
import DemoLabCard from '@/components/demo/DemoLabCard';
import { SHOWROOM_ORDER } from '@/lib/demo-showcase';

/**
 * Recepce.tech Demo Lab — showroom existujících dem. /demo je jen katalog:
 * karty odkazují na již existující URL /demo/[slug], které se tady
 * nevytvářejí ani neupravují. UGO je featured (2 sloupce).
 */

export const metadata: Metadata = {
  title: { absolute: 'Demo Lab — vyzkoušejte si AI recepci | Recepce.tech' },
  description:
    'Živé ukázky AI recepčních Recepce.tech — gastro, retail, beauty i zdravotnictví. Vyberte scénář a zavolejte si s asistentem hned.',
  alternates: { canonical: '/demo' },
  openGraph: {
    title: 'Demo Lab — vyzkoušejte si AI recepci | Recepce.tech',
    description:
      'Živé ukázky AI recepčních Recepce.tech — vyberte scénář a zavolejte si s asistentem hned.',
    url: 'https://www.recepce.tech/demo',
    siteName: 'Recepce.tech',
    locale: 'cs_CZ',
    type: 'website',
  },
};

const CTA_LINKS = [
  {
    href: '/#kontakt',
    label: 'Vytvořit vlastní řešení',
    primary: true,
  },
  {
    href: '/virtualni-asistenti',
    label: 'Zjistit více',
    primary: false,
  },
];

export default function DemoPage() {
  const featured = SHOWROOM_ORDER.find((item) => item.featured);
  const rest = SHOWROOM_ORDER.filter((item) => item.slug !== featured?.slug);

  return (
    <>
      {/* ── KOMPAKTNÍ HERO ───────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-6 pb-10 pt-12 lg:px-8 lg:pb-12 lg:pt-16">
          <Reveal className="mx-auto max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
              RECEPCE.TECH / DEMO LAB
            </p>

            <h1 className="text-balance mt-4 text-[2.1rem] font-semibold leading-[1.06] tracking-[-0.03em] text-ink sm:mt-5 sm:text-[2.8rem] lg:text-[3.4rem]">
              Vyzkoušejte si Recepce.tech.
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              <p className="text-[15px] leading-relaxed text-muted sm:text-base">
                Vyberte si scénář a otevřete si živé demo.
              </p>
              <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
                <span
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"
                  aria-hidden="true"
                />
                Live demos
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── DEMO GRID — featured přes 2 sloupce + standardní karty ───── */}
      <section className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-8 lg:py-14">
        <Reveal y={16}>
          <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
            {featured && (
              <div className="sm:col-span-2">
                <DemoLabCard showcase={featured} featured />
              </div>
            )}
            {rest.map((showcase) => (
              <DemoLabCard key={showcase.slug} showcase={showcase} />
            ))}

            {/* Doplňková CTA karta — dotváří mřížku do sudého počtu */}
            <Reveal y={16} className="h-full">
              <div className="flex h-full flex-col justify-between rounded-2xl border border-dashed border-border bg-surface-muted/30 p-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                    VAŠE FIRMA
                  </p>
                  <h3 className="mt-2 text-base font-semibold tracking-[-0.01em] text-ink">
                    Chybí tu váš scénář?
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Každá recepce se nastavuje podle konkrétního provozu —
                    připravíme ukázku i pro váš business.
                  </p>
                </div>
                <Link
                  href="/#kontakt"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors duration-200 hover:text-accent"
                >
                  Napsat nám
                  <Icon name="arrow-right" className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </Reveal>
      </section>

      {/* ── CTA NA VLASTNÍ ŘEŠENÍ ────────────────────────────────────── */}
      <section className="border-t border-border bg-surface-muted/40">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                Vlastní řešení
              </p>
              <h2 className="text-balance mt-3 text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">
                Chcete vlastní AI recepční?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink/80 sm:text-base">
                Tohle jsou jen ukázky. Vaše recepční může být vytvořená přesně
                podle vašeho businessu.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {CTA_LINKS.map((cta) => (
                  <Link
                    key={cta.href}
                    href={cta.href}
                    className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold transition-colors duration-200 ${
                      cta.primary
                        ? 'bg-accent text-accent-bright hover:bg-accent-hover'
                        : 'border border-border-strong text-ink hover:bg-surface-muted'
                    }`}
                  >
                    {cta.label}
                    <Icon name="arrow-right" className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
