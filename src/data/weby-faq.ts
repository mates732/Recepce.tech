/**
 * /weby — časté otázky.
 * Pravidla: žádné vymyšlené ceny ani termíny, odpovědi závislé na rozsahu
 * vždy výslovně označit.
 */

export interface WebyFaqItem {
  question: string;
  answer: string;
}

export const WEBY_FAQ_ITEMS: WebyFaqItem[] = [
  {
    question: 'Kolik nový web stojí?',
    answer:
      'Cena závisí na rozsahu — kolik stránek web má, jak je složitý obsah a jaké funkce jsou potřeba. Po krátké domluvě dostanete konkrétní částku předem, bez skrytých položek.',
  },
  {
    question: 'Jak dlouho tvorba webu trvá?',
    answer:
      'Závisí na rozsahu projektu a na tom, jak rychle jsou k dispozici podklady. Jednoduchá landing page se dá zvládnout ve dnech, větší web trvá déle. Termín se domluvíme předem a držím se ho.',
  },
  {
    question: 'Co ode mě potřebujete?',
    answer:
      'Na začátku stačí popsat podnikání a cíl webu — co má předat a komu. Podklady jako texty, loga a fotky posbíráme postupně. Když něco chybí, pomůžu to připravit.',
  },
  {
    question: 'Pomůžete s obsahem?',
    answer:
      'Ano, podle rozsahu projektu — můžu připravit texty, strukturu obsahu i doporučení na fotky. Konečnou podobu vždy schvalujete vy.',
  },
  {
    question: 'Co když už mám doménu a hosting?',
    answer:
      'Žádný problém. Web postavím na stávajícím prostředí, pokud je vhodné. Kdyby nebylo, navrhnu řešení a vše na něm připravím za vás.',
  },
  {
    question: 'Budu si moct web později upravovat?',
    answer:
      'Ano. Domluvíme se, ve jaké podobě — od jednoduchých úprav textů a fotek po další vývoj, který můžu dělat za vás.',
  },
  {
    question: 'Co se děje po spuštění?',
    answer:
      'Web přejde do provozu a dostanete přehled toho, co je hotové a jak s ním pracovat. Další vývoj nebo úpravy jsou na domluvu — web může růst podle potřeby.',
  },
  {
    question: 'Umíte web napojit na další služby?',
    answer:
      'Ano, podle projektu — například rezervační systémy, poptávkové formuláře, analytiku nebo e-mailové nástroje. Vždy se nejdřív domluvíme, co dává smysl pro váš podnik.',
  },
];
