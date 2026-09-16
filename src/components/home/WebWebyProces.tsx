import { SectionHeading } from '@/components/shared/SectionHeading';

const STEPS = [
  {
    number: '1',
    title: 'Kontext',
    text: 'Nejdřív si poslechnu. Co je váš podnik, komu mluví a co má web předat. Bez předpokladů, bez šablon.',
  },
  {
    number: '2',
    title: 'Struktura',
    text: 'Co přijde první, co druhé. Jak se návštěvník dostane od první sekce k tomu podstatnému — přirozeně, ne silou.',
  },
  {
    number: '3',
    title: 'Vizuál a detail',
    text: 'Typografie, rozložení, mezery a drobnosti, které se nezdají. Důvěra návštěvníka vzniká z detailu.',
  },
  {
    number: '4',
    title: 'Build a spuštění',
    text: 'Web postavím, otestuju a spustím. Víte, co je hotové a co lze dodatečně doplnit.',
  },
];

export default function WebWebyProces() {
  return (
    <section className="scroll-mt-20 border-y border-border bg-surface-muted py-20 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Jak na webu pracuju"
          title="Od první myšlenky po hotový web"
          description="Čtyři fáze. Bez korporátního procesu a bez zbytečných schůzek — jen pořádná práce, která je vidět."
          align="left"
        />

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step) => (
            <div key={step.number} className="border-t border-border pt-5">
              <span className="text-2xl font-semibold tracking-tight text-ink">
                {step.number}
              </span>
              <h3 className="mt-3 text-base font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
