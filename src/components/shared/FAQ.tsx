import { SectionHeading } from '@/components/shared/SectionHeading';

interface FAQItem {
  question: string;
  answer: string;
}

const WEBY_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Kolik nový web stojí?',
    answer:
      'Cena závisí na rozsahu — kolik stránek web má, jak je složitý obsah a jaké funkce jsou potřeba. Po krátké domluvě dostanete konkrétní částku předem, bez skrytých položek.',
  },
  {
    question: 'Jak dlouho trvá tvorba webu?',
    answer:
      'Závisí na rozsahu projektu a na tom, jak rychle jsou k dispozici podklady. Jednoduchá landing page se dá zvládnout ve dnech, větší web trvá déle. Termín se domluvíme předem a držím se ho.',
  },
  {
    question: 'Co ode mě potřebujete?',
    answer:
      'Na začátku stačí popsat podnikání a cíl webu — co má předat a komu. Podklady jako texty, loga a fotky posbíráme postupně. Když něco chybí, pomohu to připravit.',
  },
  {
    question: 'Pomůžete s obsahem?',
    answer:
      'Ano, podle rozsahu projektu — mohu připravit texty, strukturu obsahu i doporučení na fotky. Konečnou podobu vždy schvalujete vy.',
  },
  {
    question: 'Co když už mám doménu a hosting?',
    answer:
      'Žádný problém. Web postavím na stávajícím prostředí, pokud je vhodné. Kdyby nebylo, navrhnu řešení a vše na něm připravím za vás.',
  },
  {
    question: 'Budu si moci web později upravovat?',
    answer:
      'Ano. Domluvíme se, ve jaké podobě — od jednoduchých úprav textů a fotek po další vývoj, který mohu dělat za vás.',
  },
  {
    question: 'Co se děje po spuštění?',
    answer:
      'Web přejde do provozu a dostanete přehled toho, co je hotové a jak s ním pracovat. Další vývoj nebo úpravy jsou na domluvu — web může růst podle potřeby.',
  },
  {
    question: 'Umíte web napojit na další služby?',
    answer:
      'Ano, podle projektu — například rezervační systémy, poptávkové formuláře, analytiku nebo e-mailové nástroje. Vždy se nejdříve domluvíme, co dává smysl pro váš podnik.',
  },
];

interface FAQProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: FAQItem[];
}

export default function FAQ({
  id = 'faq',
  eyebrow = 'FAQ',
  title = 'Než začneme stavět',
  description = 'Nejčastější otázky k tvorbě webu, rozsahu, domluvě a tomu, co se děje po spuštění.',
  items = WEBY_FAQ_ITEMS,
}: FAQProps) {
  return (
    <section id={id} className="scroll-mt-20 bg-surface py-20 lg:py-28">
      <div className="mx-auto w-full max-w-4xl px-6 lg:px-8">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <div className="mt-12 space-y-4">
          {items.map((item) => (
            <details key={item.question} className="group rounded-2xl border border-border bg-surface p-5 open:border-border-strong">
              <summary className="cursor-pointer list-none pr-6 text-left text-base font-semibold text-ink marker:content-none">
                {item.question}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
