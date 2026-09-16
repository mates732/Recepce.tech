import Link from 'next/link';
import { Icon } from '@/components/shared/Icon';
import Reveal from '@/components/home/Reveal';
import ReceptionArtifact from '@/components/home/ReceptionArtifact';
import PillarPanels from '@/components/home/PillarPanels';
import ClientProfileCard from '@/components/home/ClientProfileCard';
import ContactSection from '@/components/home/ContactSection';
import StudioCard from '@/components/home/StudioCard';

/**
 * Recepce.tech — dark premium digital studio.
 *
 * Struktura: HERO (velký headline + 3D artefakt recepce) → DVA PILÍŘE
 * (velké panely WEBY / VIRTUÁLNÍ ASISTENTI) → WEBY (browser mockup)
 * → VIRTUÁLNÍ ASISTENTI (konverzační interface) → UKÁZKY A DEMO → KONTAKT
 * (otevřená kapitola s formulářem) → DIGITÁLNÍ VIZITKA.
 *
 * Vizuální jazyk: téměř černé plátno, off-white typografie, limetka
 * jen na CTA, číslech a mikroindikátorech. Pohyb je kontrolovaný —
 * reveal, parallax, jemná 3D rotace. Žádné gradienty, žádné karty
 * na pozadí, žádný cyberpunk.
 */

const SHOWCASE_LINKS = [
  {
    label: 'UKÁZKY WEBŮ',
    hint: 'Prohlédněte si ukázky webů z naší dílny.',
    href: '/weby',
    n: '01',
  },
  {
    label: 'DEMO VIRTUÁLNÍHO ASISTENTA',
    hint: 'Vyzkoušejte recepci naživo — scénáře, rezervace, předání.',
    href: '/demo',
    n: '02',
  },
] as const;

/* Buňky sekce WEBY — co vždy dostane web, stručně. */
const WEBY_CELLS = [
  { n: '1', title: 'Design', text: 'Vizuál na míru značce — typografie, proporcie, detail.' },
  { n: '2', title: 'Struktura', text: 'Obsah v pořadí, v jakém ho zákazník potřebuje.' },
  { n: '3', title: 'Funkčnost', text: 'Rezervace, formuláře a napojení, která dávají smysl.' },
  { n: '4', title: 'Rychlost', text: 'Postaveno na moderních technologiích — rychlé na každém zařízení.' },
] as const;

export default function HomeGateway() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 pb-24 pt-16 sm:pt-20 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-32 lg:pt-24">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted">
                Recepce.tech — digitální studio
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-7 text-[clamp(3rem,8.4vw,6.6rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-ink">
                <span className="block">Vaše firma.</span>
                <span className="block">
                  Lepší <span className="text-accent">digitální recepce</span>.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-8 max-w-md text-base leading-relaxed text-muted">
                Moderní web a virtuální asistent — digitální zkušenost firmy,
                která funguje i bez vás.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <a
                  href="#demo"
                  className="group inline-flex items-center gap-3 bg-accent px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-accent-bright transition-colors duration-200 hover:bg-accent-hover"
                >
                  NECHAT SI TO UKÁZAT
                  <Icon
                    name="arrow-right"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </a>
                <span className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-faint sm:inline">
                  Web × Virtuální asistenti
                </span>
              </div>
            </Reveal>
          </div>

          {/* 3D artefakt — digitální recepce */}
          <div className="lg:col-span-5">
            <ReceptionArtifact />
          </div>
        </div>
      </section>

      {/* ── DVA PILÍŘE ───────────────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <Reveal>
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                  CO DĚLÁME
                </p>
                <h2 className="mt-5 max-w-2xl text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
                  Dvě pilíře. Jedna digitální recepce.
                </h2>
              </div>
              <span
                aria-hidden="true"
                className="hidden text-[11px] font-semibold tracking-[0.2em] text-faint sm:block"
              >
                ( 02 )
              </span>
            </div>
          </Reveal>

          <div className="mt-12">
            <PillarPanels />
          </div>
        </div>
      </section>

      {/* ── WEBY ─────────────────────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <Reveal>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                  WEBY · 01
                </p>
                <h2 className="mt-5 text-[clamp(1.8rem,3.4vw,2.7rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-ink">
                  Web, který pracuje pro značku.
                </h2>
                <p className="mt-5 text-[15px] leading-relaxed text-muted">
                  Strategie, design, vývoj i konverze. Postaveno na moderních
                  technologiích — web jako produkt, ne jako vizitka.
                </p>
                <Link
                  href="/weby"
                  className="group mt-8 inline-flex items-center gap-2.5 bg-accent px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-accent-bright transition-colors duration-200 hover:bg-accent-hover"
                >
                  Prohlédnout weby
                  <Icon
                    name="arrow-right"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              {/* Bunky — co dostane každý web. Hairline grid, žádné karty. */}
              <Reveal delay={0.1}>
                <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2">
                  {WEBY_CELLS.map((cell) => (
                    <div key={cell.title} className="bg-surface px-7 py-8">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[2rem] font-semibold leading-none tracking-[-0.04em] text-muted">
                          {cell.n}
                        </span>
                        <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-ink">
                          {cell.title}
                        </h3>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-muted">{cell.text}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── VIRTUÁLNÍ ASISTENTI ─────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="order-2 lg:order-1 lg:col-span-8">
              <ClientProfileCard />
            </div>
            <div className="order-1 lg:order-2 lg:col-span-4">
              <Reveal>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                  VIRTUÁLNÍ ASISTENTI · 02
                </p>
                <h2 className="mt-5 text-[clamp(1.8rem,3.4vw,2.7rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-ink">
                  Komunikace, která nestojí váš čas.
                </h2>
                <p className="mt-5 text-[15px] leading-relaxed text-muted">
                  Odpovídá zákazníkům, bere poptávky, zapisuje rezervace,
                  sdílí základní informace a když je to potřeba — předá
                  člověku.
                </p>
                <Link
                  href="/virtualni-asistenti"
                  className="group mt-8 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-200 hover:text-accent"
                >
                  Více o asistentech
                  <Icon
                    name="arrow-right"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── UKÁZKY A DEMO ───────────────────────────────────────────────── */}
      <section id="demo" className="scroll-mt-20 border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <Reveal>
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                  UKÁZKY A DEMO
                </p>
                <h2 className="mt-5 text-[clamp(1.9rem,4vw,3.1rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-ink">
                  Chcete nahlédnout?
                </h2>
              </div>
              <span
                aria-hidden="true"
                className="hidden text-[11px] font-semibold tracking-[0.2em] text-faint sm:block"
              >
                ( 02 )
              </span>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
            {SHOWCASE_LINKS.map((d, i) => (
              <Reveal key={d.label} delay={i * 0.1}>
                <Link
                  href={d.href}
                  className="group flex items-center justify-between gap-6 border border-panel-edge bg-panel px-7 py-9 transition-all duration-300 hover:-translate-y-1 hover:border-border-strong sm:px-9"
                >
                  <span>
                    <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-ink">
                      {d.label}
                    </span>
                    <span className="mt-2 block max-w-xs text-[13px] leading-relaxed text-muted">
                      {d.hint}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-[2.2rem] font-semibold leading-none tracking-[-0.03em] text-accent/90"
                  >
                    {d.n}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── KONTAKT — finální kapitola ───────────────────────────────────── */}
      <section id="kontakt" className="scroll-mt-20 border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <ContactSection />
        </div>
      </section>

      {/* ── DIGITÁLNÍ VIZITKA ────────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
          <StudioCard />
        </div>
      </section>

</>
  );
}
