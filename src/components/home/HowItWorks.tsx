import { SectionHeading } from '@/components/shared/SectionHeading';
import { Icon } from '@/components/shared/Icon';

interface Step {
  title: string;
  text: string;
}

const STEPS: Step[] = [
  {
    title: 'Zákazník zavolá',
    text: 'Telefon zazvoní na vaše číslo. Někdo zvedne — ve prvním vyzvánění, i ve 22:00.',
  },
  {
    title: 'Asistent vyřeší běžné požadavky',
    text: 'Vyřídí běžné dotazy, informace o provozu a dostupné služby. Podle nastavení řeší i rezervace a složitější úkony.',
  },
  {
    title: 'Odpověď nebo jasný další krok',
    text: 'Zákazník dostane odpověď, nebo návrh, co bude dál. Hovor se neztratí a je jasné, co se během něj řešilo.',
  },
  {
    title: 'Složitější situace jdou člověku',
    text: 'Požadavky mimo nastavený rozsah předává asistent člověku — vždy s kontaktem a kontextem.',
  },
];

export default function HowItWorks() {
  return (
    <section id="jak-to-funguje" className="scroll-mt-20 bg-surface py-20 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Jak to funguje"
          title="Co asistent řeší a kdy předává člověku"
          description="Asistent je nastavený podle konkrétního provozu. Neřeší všechno, ale spolehlivě pokrývá první kontakt a běžné požadavky."
        />

        {/* Linka jako segmenty v jednotlivých buňkách — začíná u bubliny 1
            a fyzicky končí uvnitř poslední bubliny. Nikdy nevede „do prázdna“. */}
        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {STEPS.map(({ title, text }, i) => (
            <div key={title} className="relative">
              {/* Segment: od pravého okraje bubliny přes mezeru mřížky až
                  k levému okraji následující bubliny — linka není nikdy přerušená
                  a nikdy nekončí ve vzduchu. */}
              <span
                aria-hidden="true"
                className="absolute left-12 -right-8 top-6 hidden h-px bg-border lg:block"
              />
              <div className="relative flex items-center gap-4 lg:flex-col lg:items-start">
                <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border bg-surface shadow-sm">
                  <span className="text-base font-semibold text-ink">{i + 1}</span>
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}

          {/* Koncový uzel — žádný odchozí segment, linka zde končí */}
          <div className="relative">
            <div className="relative flex items-center gap-4 lg:flex-col lg:items-start">
              <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-accent/40 bg-accent text-accent-bright shadow-sm">
                <Icon name="check" className="h-5 w-5" />
              </span>
            </div>
            <h3 className="mt-5 text-base font-semibold text-ink">Hovor ukončen</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
                Výsledek je vždy jasný: vyřešeno asistentem, nebo připraveno
                pro vás.
              </p>
          </div>
        </div>
      </div>
    </section>
  );
}
