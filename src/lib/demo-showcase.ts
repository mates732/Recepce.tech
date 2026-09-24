import type { IconName } from '@/components/shared/Icon';
import type { VapiDemoSlug } from '@/lib/vapi/server';

/**
 * Veřejné ukázky Recepce.tech. Každé demo má vlastní URL /demo/[slug]
 * (neprýměnné) — /demo je showroom, který je jen kataloguje a odkazuje na ně.
 * Data jsou čistě prezentace — žádné klíče, ID asistentů se řeší výhradně
 * serverově přes /api/vapi/session.
 */

export interface DemoSuggestion {
  text: string;
  icon: IconName;
}

export interface DemoShowcase {
  slug: VapiDemoSlug;
  client: string;
  /** Krátká značka pro hero label (např. „RECEPCE.TECH × UGO“). */
  brand: string;
  location: string;
  initials: string;
  /** Kategorie pro showroom kartu (např. „GASTRO“). */
  category: string;
  /** Krátký popis pro showroom kartu. */
  tagline: string;
  /** Typ dema + štítky capabilities pro kartu. */
  demoType: string;
  capabilities: string[];
  /** Featured demo zabírá v gridu 2 sloupce. */
  featured?: boolean;
  /** Konkrétní scénář pro vybrané demo (sekce pod kartou). */
  scenario: string;
  suggestions: DemoSuggestion[];
}

export const DEMO_SHOWCASES: DemoShowcase[] = [
  {
    slug: 'ugo-stromovka',
    client: 'UGO Salaterie – Stromovka',
    brand: 'UGO',
    location: 'Stromovka · Praha 7',
    initials: 'UG',
    category: 'GASTRO',
    tagline:
      'AI recepční pro dotazy na menu, alergeny a provozní dobu. Příjme objednávku k vyzvednutí.',
    demoType: 'VOICE',
    capabilities: ['VOICE', 'FAQ', 'OBJEDNÁVKY'],
    featured: true,
    scenario:
      'Jste zákazník UGO a potřebujete rychle zjistit, jestli máte dnes otevřeno, co si dát k obědu nebo jestli konkrétní jídlo obsahuje určitý alergen.',
    suggestions: [
      { text: 'Máte dnes otevřeno?', icon: 'clock' },
      { text: 'Kde vás najdu?', icon: 'search' },
      { text: 'Co máte v nabídce?', icon: 'utensils' },
      { text: 'Co byste mi doporučili?', icon: 'smile' },
      { text: 'Máte něco bez lepku?', icon: 'leaf' },
      { text: 'Jak funguje UGO Fanda?', icon: 'zap' },
      { text: 'Chci si objednat.', icon: 'phone-call' },
    ],
  },
  {
    slug: 'ludmila',
    client: 'Textil Ludmila',
    brand: 'TEXTIL LUDMILA',
    location: 'Praha 6',
    initials: 'TL',
    category: 'RETAIL',
    tagline:
      'Digitální recepční pro poradenství s látkami, metráž a šití závěsů na míru.',
    demoType: 'VOICE',
    capabilities: ['VOICE', 'PORADENSTVÍ'],
    scenario:
      'Vybíráte látku na závěsy na míru — potřebujete poradit s metráží, zjistit, co se hodí na stínění oken, nebo se doptat na termín realizace.',
    suggestions: [
      { text: 'Potřebuju látku na závěsy.', icon: 'scissors' },
      { text: 'Kolik metrů látky potřebuju?', icon: 'message-circle' },
      { text: 'Co na stínění oken?', icon: 'search' },
      { text: 'Jak dlouho trvá šití na míru?', icon: 'clock' },
    ],
  },
  {
    slug: 'therapy-point',
    client: 'Therapy Point',
    brand: 'THERAPY POINT',
    location: 'Praha',
    initials: 'TP',
    category: 'ZDRAVOTNICTVÍ',
    tagline:
      'Virtuální recepce pro pacienty — termíny rehabilitace, pobočky i ceny a pojišťovny.',
    demoType: 'VOICE',
    capabilities: ['VOICE', 'REZERVACE', 'FAQ'],
    scenario:
      'Jste pacient a potřebujete najít termín rehabilitace, zjistit, kde máte nejbližší pobočku, nebo se zeptat na ceny a hrazení pojišťovnou.',
    suggestions: [
      { text: 'Potřebuju termín na rehabilitaci.', icon: 'calendar-check' },
      { text: 'Jaké služby nabízíte?', icon: 'book-open' },
      { text: 'Kde máte pobočky?', icon: 'building' },
      { text: 'Kolik stojí terapie a jak je to s pojišťovnou?', icon: 'message-circle' },
    ],
  },
  {
    slug: 'noname-barbershop',
    client: 'NoName Barbershop',
    brand: 'NONAME BARBERSHOP',
    location: 'Praha',
    initials: 'NB',
    category: 'BEAUTY',
    tagline:
      'AI recepční pro objednávky, dotazy zákazníků a rezervace termínů k barberům.',
    demoType: 'VOICE',
    capabilities: ['VOICE', 'BOOKING', 'FAQ'],
    scenario:
      'Chcete střih na pátek večer a potřebujete vědět, který barber má volno, kolik stojí skin fade a kdy je nejbližší volný termín.',
    suggestions: [
      { text: 'Potřebuju střih na pátek večer.', icon: 'scissors' },
      { text: 'Který barber má volno zítra?', icon: 'calendar' },
      { text: 'Kolik stojí skin fade?', icon: 'message-circle' },
      { text: 'Máte volný termín po 17:00?', icon: 'clock' },
    ],
  },
  {
    slug: 'atombike',
    client: 'Atombike Cycle Hospital',
    brand: 'ATOMBIKE',
    location: 'Praha 6',
    initials: 'AC',
    category: 'SERVIS',
    tagline:
      'Hlasový asistent pro servis kol, půjčovnu a dostupnost zboží na prodejně.',
    demoType: 'VOICE',
    capabilities: ['VOICE', 'SERVIS', 'PUJČOVNA'],
    scenario:
      'Jste cyklista a potřebujete rychle vyřešit servis svého kola, půjčit si kolo na výlet nebo zjistit, jestli je přívěs volný na víkend.',
    suggestions: [
      { text: 'Potřebuju servis kola.', icon: 'wrench' },
      { text: 'Chci si půjčit kolo.', icon: 'clock' },
      { text: 'Máte Trek v L?', icon: 'search' },
      { text: 'Potřebuju přívěs na víkend.', icon: 'calendar' },
    ],
  },
  {
    slug: 'paws-and-care',
    client: 'Paws & Care',
    brand: 'PAWS & CARE',
    location: 'Praha',
    initials: 'PC',
    category: 'SLUŽBY',
    tagline:
      'Virtuální recepce, která provází výběrem služeb a domluví další krok s majitelem.',
    demoType: 'VOICE',
    capabilities: ['VOICE', 'FAQ'],
    scenario:
      'Jste majitel mazlíčka a potřebujete zjistit, jaké služby nabízíme, vybrat si tu pravou a domluvit si rovnou další krok.',
    suggestions: [
      { text: 'Jaké služby nabízíte?', icon: 'book-open' },
      { text: 'Potřebuju poradit s výběrem služby.', icon: 'smile' },
      { text: 'Jaký je další krok?', icon: 'arrow-right' },
      { text: 'Můžu se rovnou objednat?', icon: 'phone-call' },
    ],
  },
];

/** Primární demo — výchozí volba pro /demo/[slug] fallbacky. */
export function getDefaultShowcase(): DemoShowcase {
  return DEMO_SHOWCASES[0];
}

/** Najde ukázku podle URL slugu, jinak undefined (→ 404). */
export function findShowcaseBySlug(slug: string): DemoShowcase | undefined {
  return DEMO_SHOWCASES.find((item) => item.slug === slug);
}

/** Všechny URL demo stránek — pro generateStaticParams. */
export function getAllShowcaseSlugs(): string[] {
  return DEMO_SHOWCASES.map((item) => item.slug);
}

/** Karty v pořadí pro showroom: featured první, pak zbytek. */
export const SHOWROOM_ORDER: DemoShowcase[] = [
  ...DEMO_SHOWCASES.filter((item) => item.featured),
  ...DEMO_SHOWCASES.filter((item) => !item.featured),
];
