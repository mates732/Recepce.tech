import { SectionHeading } from '@/components/shared/SectionHeading';
import { Icon, type IconName } from '@/components/shared/Icon';

/**
 * Co dostane každý web — základ, ne balíček služeb.
 */
const ZAKLAD: { title: string; text: string }[] = [
  {
    title: 'Koncept a struktura',
    text: 'Nejdřív se domluvíme, co má web říkat, komu a v jakém pořadí. Teprve pak se kreslí.',
  },
  {
    title: 'Vizuální směr',
    text: 'Typografie, rozložení a detaily, které drží značku pohromadě. Vizuál, který respektuje to, co web má říct.',
  },
  {
    title: 'Postavený web',
    text: 'Funkční, responzivní, bez zbytečného kódu. Výsledek, který se dá používat a po spuštění dál rozvíjet.',
  },
  {
    title: 'Spuštění a předání',
    text: 'Web jde na provoz. S přehledem toho, co je hotové a co lze později doplnit.',
  },
];

/**
 * Rozšiřující možnosti — vždy závislé na rozsahu projektu, ne samozřejmost.
 */
const PODLE_ROZSAHU: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'pencil',
    title: 'Redesign',
    text: 'Převedu stávající web do nového vizuálního i strukturního směru. Rozsah závisí na tom, co už máte.',
  },
  {
    icon: 'code',
    title: 'Objednávky a formuláře',
    text: 'Rezervace, poptávkové formuláře a další funkce — pokud to dává smysl pro váš typ podnikání.',
  },
  {
    icon: 'search',
    title: 'SEO základ',
    text: 'Technicky pořádný základ pro vyhledávače: srozumitelná struktura, nadpisy, rychlost. Bez slibů o pozicích.',
  },
  {
    icon: 'wrench',
    title: 'Údržba a další vývoj',
    text: 'Web může růst s vaší firmou — postupně a podle potřeby. Domluvíme se, co a kdy.',
  },
];

export default function WebCoNabizime() {
  return (
    <section className="scroll-mt-20 bg-surface py-20 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Co stavím"
          title="Co do webu dám vždy"
          description="Ne šablona a ne balíček služeb. Základ, který dostane každý projekt — zbytek se řeší podle rozsahu."
          align="left"
        />

        {/* Základ — každý web */}
        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          {ZAKLAD.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-surface p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                {item.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Podle rozsahu */}
        <div className="mt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lg font-semibold text-ink">Podle rozsahu projektu</h3>
            <p className="text-xs leading-relaxed text-faint">
              Nejsou samozřejmostí — řeší se vždy konkrétně, podle zadání.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PODLE_ROZSAHU.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-surface-muted p-6 transition-colors hover:border-border-strong"
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="text-base font-semibold text-ink">{item.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm font-medium text-muted">a další.</p>
        </div>
      </div>
    </section>
  );
}
