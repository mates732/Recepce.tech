import { SectionHeading } from '@/components/shared/SectionHeading';

/**
 * Jak probíhá nasazení — horizontální čtyři buňky. Linka je kreslená
 * jako segmenty uvnitř buněk: začíná u bubliny 1 a fyzicky končí
 * u poslední bubliny — nikdy nevedie mimo obsah.
 */

const STEPS = [
  {
    title: 'Zjistíme, jak firma komunikuje',
    meta: 'První hovor',
    text: 'Jak volají zákazníci, které dotazy se opakují nejčastěji a které informace musí asistent znát. Z toho vznikne rozsah toho, co bude řešit sám.',
  },
  {
    title: 'Konfigurace na míru',
    meta: 'Podle vašeho provozu',
    text: 'Jaký hlas bude mít, jakým tónem bude mluvit a jaké bude mít znalosti o vaší firmě. Všechno důležité nastavíme podle vás.',
  },
  {
    title: 'Testy do posledního detailu',
    meta: 'Ještě před spuštěním',
    text: 'Asistenta vyzkoušíte na vašich reálných situacích. Doladíme formulace, rezervace i předání člověku — aby fungoval do detailu.',
  },
  {
    title: 'Nasazení a doladění',
    meta: 'Po pár dnech v provozu',
    text: 'Asistent začne zvedat telefon. Sbíráme data z prvních hovorů a podle potřeby rozsah dále doladíme.',
  },
];

export default function Nasazeni() {
  return (
    <section id="nasazeni" className="scroll-mt-20 bg-surface py-20 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Jak probíhá nasazení"
          title="Čtyři kroky. Od hovoru po spuštění."
          description="Žádný hardware, žádná instalace, žádná změna čísla. Asistent nastavíme podle vašeho provozu a ladíme ho na reálných situacích."
        />

        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative">
              {/* Segment linky — jen na buňkách 1–3: od pravého okraje bubliny
                  přes mezeru mřížky až k levému okraji následující bubliny.
                  Poslední buňka žádný segment nemá → linka končí uvnitř řady. */}
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-12 -right-8 top-6 hidden h-px bg-border lg:block"
                />
              )}
              <div className="relative flex items-center gap-4 lg:flex-col lg:items-start">
                <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border bg-surface shadow-sm">
                  <span className="text-base font-semibold text-ink">{i + 1}</span>
                </span>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                  {step.meta}
                </p>
              </div>
              <h3 className="mt-5 text-base font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
