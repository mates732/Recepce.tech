import type { IconName } from '@/components/shared/Icon';
import type { VapiDemoSlug } from '@/lib/vapi/server';

/**
 * Veřejné ukázky na /demo — jedna je vždy aktivní, návštěvník si vybere
 * v přepínači. UGO je výchozí (primární demo pro klienta). Data jsou
 * čistě prezentace — žádné klíče, ID asistentů se řeší výhradně serverově
 * přes /api/vapi/session.
 */

export interface DemoSuggestion {
  text: string;
  icon: IconName;
}

export interface DemoShowcase {
  slug: VapiDemoSlug;
  client: string;
  location: string;
  initials: string;
  /** Konkrétní scénář pro vybrané demo (sekce pod kartou). */
  scenario: string;
  suggestions: DemoSuggestion[];
}

export const DEMO_SHOWCASES: DemoShowcase[] = [
  {
    slug: 'ugo-stromovka',
    client: 'UGO Salaterie',
    location: 'Stromovka · Praha 7',
    initials: 'UG',
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
    slug: 'atombike',
    client: 'Atombike Cycle Hospital',
    location: 'Praha 6',
    initials: 'AC',
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
    slug: 'therapy-point',
    client: 'Therapy Point',
    location: 'Praha',
    initials: 'TP',
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
    location: 'Praha',
    initials: 'NB',
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
    slug: 'paws-and-care',
    client: 'Paws & Care',
    location: 'Praha',
    initials: 'PC',
    scenario:
      'Jste majitel mazlíčka a potřebujete zjistit, jaké služby nabízíme, vybrat si tu pravou a domluvit si rovnou další krok.',
    suggestions: [
      { text: 'Jaké služby nabízíte?', icon: 'book-open' },
      { text: 'Potřebuju poradit s výběrem služby.', icon: 'smile' },
      { text: 'Jaký je další krok?', icon: 'arrow-right' },
      { text: 'Můžu se rovnou objednat?', icon: 'phone-call' },
    ],
  },
  {
    slug: 'ludmila',
    client: 'Textil Ludmila',
    location: 'Praha 6',
    initials: 'TL',
    scenario:
      'Vybíráte látku na závěsy na míru — potřebujete poradit s metráží, zjistit, co se hodí na stínění oken, nebo se doptat na termín realizace.',
    suggestions: [
      { text: 'Potřebuju látku na závěsy.', icon: 'scissors' },
      { text: 'Kolik metrů látky potřebuju?', icon: 'message-circle' },
      { text: 'Co na stínění oken?', icon: 'search' },
      { text: 'Jak dlouho trvá šití na míru?', icon: 'clock' },
    ],
  },
];

/** Primární demo — UGO je pro klienta první volba. */
export function getDefaultShowcase(): DemoShowcase {
  return DEMO_SHOWCASES[0];
}
