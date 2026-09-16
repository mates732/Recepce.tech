import type { Metadata } from 'next';
import Reveal from '@/components/home/Reveal';
import { Button } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';

export const metadata: Metadata = {
  title: 'O mně — Matyáš Vojan',
  description:
    'Nahlédni do světa Matyáše Vojana: projekty, tvorba, trénink, experimenty a to, co právě vzniká za Recepce.tech.',
  alternates: { canonical: '/o-mne' },
  openGraph: {
    title: 'O mně — Matyáš Vojan',
    description:
      'Osobní digitální prostor člověka za Recepce.tech. Projekty, experimenty a věci, které právě stavím.',
    url: '/o-mne',
    siteName: 'Recepce.tech',
    locale: 'cs_CZ',
    type: 'profile',
  },
};

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/matyas.dev/', value: '@matyas.dev' },
  { label: 'YouTube', href: 'https://www.youtube.com/@Big.matysek', value: '@Big.matysek' },
  { label: 'Kontakt', href: 'mailto:vojanmatyas@gmail.com', value: 'vojanmatyas@gmail.com' },
] as const;

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    name: 'Matyáš Vojan',
    url: 'https://www.recepce.tech/o-mne',
    jobTitle: 'Zakladatel Recepce.tech',
    worksFor: { '@type': 'Organization', name: 'Recepce.tech', url: 'https://www.recepce.tech' },
    sameAs: [
      'https://www.instagram.com/matyas.dev/',
      'https://www.youtube.com/@Big.matysek',
    ],
  },
} as const;

export default function OMePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(53,51,48,0.05)_1px,transparent_0)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 pt-14 lg:px-8 lg:pb-28 lg:pt-20">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
              Matyáš Vojan · O mně
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="text-balance mt-6 max-w-4xl text-[clamp(2.6rem,7vw,5.4rem)] font-semibold leading-[1.0] tracking-[-0.04em] text-ink">
              Tohle je můj svět.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Weby, projekty, posilovna, kamera, YouTube a spousta věcí, které mě baví stavět.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <Reveal>
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">Sekce 02</p>
              <h2 className="mt-5 text-[clamp(1.8rem,3.6vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
                Když zrovna nekóduju.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
                Posilovna je druhá část systému. Ne pro čísla na papíře, ale pro režim, který drží konzistenci.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
                Trénuji silově 4× týdně, Upper/Lower split. Sleduju objemy, progresuji v základech — mrtvý tah, sedma, bench, řád.
                Žádné stroje, žádné „pump“ series. Jen tíha, která žere sílu a dává zpátky klid v hlavě.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
                K tomu běh — 2× týdně tempo, 1× dlouhý. Ne proto, že bych se chtěl připravit na maraton, ale protože mozgu
                se hodí opakovaný rytmus, kdy nic neřešíš, jen dáváš nohy před sebe.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <Reveal>
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                  Sekce 03
                </p>
                <h2 className="mt-5 text-[clamp(1.9rem,4vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink">
                  Okno do mých tréninků.
                </h2>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
                  Kamera je další nástroj. Najdeš mě i na YouTube.
                </p>
              </div>
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-border bg-panel p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
                    YouTube / Video
                  </p>
                  <a
                    href="https://www.youtube.com/@Big.matysek"
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-5 flex items-center justify-between gap-4 rounded-xl border border-border bg-surface px-5 py-4 transition-colors duration-200 hover:border-border-strong"
                  >
                    <span className="flex items-center gap-2 text-sm text-ink">
                      <Icon name="camera" className="h-4 w-4" />
                      @Big.matysek
                    </span>
                    <Icon
                      name="arrow-right"
                      className="h-4 w-4 -rotate-45 text-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <Reveal>
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">Sekce 06</p>
              <h2 className="mt-5 text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-ink">
                A z toho všeho vznikl Recepce.tech.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
                Prostor, kde se potkává design, web, technologie, automatizace, AI a moje vlastní experimenty.
              </p>
              <div className="mt-9">
                <Button href="/" size="lg">
                  Prozkoumat Recepce.tech
                  <Icon name="arrow-right" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
          <Reveal>
            <h2 className="max-w-3xl text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-ink">
              Tohle je jen část.
              <br />
              <span className="text-muted">Zbytek se právě staví.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SOCIAL_LINKS.map((link, i) => (
              <Reveal key={link.label} delay={i * 0.06}>
                <a
                  href={link.href}
                  {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="group flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4 transition-colors duration-200 hover:border-border-strong"
                >
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
                      {link.label}
                    </p>
                    <p className="mt-1 text-sm text-ink">{link.value}</p>
                  </div>
                  <Icon
                    name="arrow-right"
                    className="h-4 w-4 -rotate-45 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
