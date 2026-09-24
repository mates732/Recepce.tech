import Reveal from '@/components/home/Reveal';
import DemoShowcaseSwitcher from '@/components/demo/DemoShowcase';
import type { DemoShowcase } from '@/lib/demo-showcase';

/**
 * Sdílený obsah demo stránky — hero + přepínač s aktivní kartou + Co umí.
 * Používá ho /demo (výchozí UGO) i /demo/[slug] pro každé demo zvlášť.
 */
export default function DemoPageContent({ showcase }: { showcase: DemoShowcase }) {
  return (
    <>
      {/* ── HERO + HLAVNÍ VOICE DEMO ─────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Jemný tečkovaný podklad — stejný motiv jako u ostatních dem */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(23,23,22,0.055)_1px,transparent_0)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]"
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-12 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
              <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
              RECEPCE.TECH × {showcase.brand}
            </p>

            <h1 className="text-balance mt-4 text-[2.15rem] font-semibold leading-[1.08] tracking-[-0.02em] text-ink sm:mt-5 sm:text-[2.7rem] sm:leading-[1.05] lg:text-[3.25rem] lg:leading-[1.05] lg:tracking-[-0.03em]">
              Vyzkoušejte AI recepci
              <br />
              <span className="text-accent">v praxi.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.75] text-ink/80 sm:text-base">
              Zavolejte si s AI asistentem {showcase.client} a vyzkoušejte, jak
              může během několika sekund odbavit běžné zákaznické dotazy.
            </p>
          </Reveal>

          {/* Přepínač dem + aktivní demo karta — téměř hned pod herem */}
          <Reveal delay={0.08} className="mt-10 sm:mt-12">
            <DemoShowcaseSwitcher activeSlug={showcase.slug} />
          </Reveal>
        </div>
      </section>

      {/* ── CO UMÍ? ──────────────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
          <Reveal>
            <div className="mx-auto max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                Co umí?
              </p>
              <h2 className="text-balance mt-3 text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">
                Čtyři věci, které zvládne sám.
              </h2>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:mt-12">
            {CAPABILITIES.map((item, index) => (
              <Reveal key={item.number} delay={index * 0.06} y={16}>
                <div className="flex items-start gap-4 border-t border-border pt-5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                    {item.number}
                  </span>
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-ink">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const CAPABILITIES = [
  {
    number: '01',
    title: 'Odpoví na běžné dotazy',
    detail: 'Provozní doba, nabídka, ceny, alergeny — bez čekání.',
  },
  {
    number: '02',
    title: 'Pomůže s výběrem',
    detail: 'Provede zákazníka nabídkou a doporučí, co hledá.',
  },
  {
    number: '03',
    title: 'Předá složitější situace člověku',
    detail: 'Co nespadá do nastaveného rozsahu, přepojí s kontextem.',
  },
  {
    number: '04',
    title: 'Funguje i mimo pracovní špičku',
    detail: 'Večer, o víkendu i ve špičce, když je obsluha zaneprázdněná.',
  },
];
