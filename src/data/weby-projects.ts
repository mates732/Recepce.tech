/**
 * /weby — projektová data.
 *
 * WEBY_FEATURED_PROJECTS — skutečné, spuštěné weby (zakázky). Každý má
 * ověřitelnou URL a prezentuje se jako realizovaná práce. Žádné vymyšlené
 * výsledky ani metriky.
 *
 * WEBY_PROJECTS — ukázkové koncepty. Nejsou to zakázky od skutečných
 * klientů — vždy to musí být na stránce zřejmé. Každý koncept je ale
 * skutečně postavený a nasazený — má ověřitelnou URL.
 */

/**
 * Skutečný hotový web. Snímek obrazovky se doplňuje do public/weby/
 * a cesta se zapíše do `previewImage` (null = zobrazí se upravený panel).
 */
export interface WebyFeaturedProject {
  id: string;
  name: string;
  url: string;
  domain: string;
  type: string;
  category: string;
  description: string;
  craftPoints: string[];
  accent: string;
  previewImage: string | null;
}

export interface WebyProject {
  id: string;
  name: string;
  type: string;
  category: string;
  demoName: string;
  domain: string;
  url: string;
  headline: string;
  body: string;
  cta: string;
  description: string;
}

/**
 * Realizované weby — zatím jediná zakázka, řazená na první místo.
 * Fakta (služby, místo, cílovka, CTA, paleta) vychází z živého webu.
 */
export const WEBY_FEATURED_PROJECTS: WebyFeaturedProject[] = [
  {
    id: 'ponici',
    name: 'PONICI.CZ',
    url: 'https://www.ponici.cz',
    domain: 'ponici.cz',
    type: 'Redesign',
    category: 'Jezdecká škola · Císařský ostrov, Praha',
    description:
      'Redesign webu jezdecké školy pro děti i dospělé. Nová struktura i vizuál postavené kolem služeb školy — od individuálních lekcí přes skokový výcvik po tábory a vyjížďky.',
    craftPoints: [
      'Struktura postavená kolem služeb školy — obsah, který rozhoduje o objednání',
      'CTA „Domluvit jízdy“ propojené s jednotlivými službami',
      'Klidný vizuál v hnědé paletě vedené identitou školy',
    ],
    accent: '#3C2D19',
    // Skutečný snímek webu (1440×900, zachycen z živého ponici.cz)
    previewImage: '/weby/ponici-cz.jpg',
  },
];

/**
 * Ukázkové koncepty — skutečně postavené a nasazené weby, ne zákázky.
 * Fakta vychází z živého webu konceptu.
 */
export const WEBY_PROJECTS: WebyProject[] = [
  {
    id: 'zlaty-hreben',
    name: 'Zlatý Hřeben',
    type: 'Koncept · live',
    category: 'Pánské holičství · Brno',
    demoName: 'ZLATÝ HŘEBEN',
    domain: 'zlaty-hreben.vercel.app',
    url: 'https://zlaty-hreben.vercel.app/',
    headline: 'Exkluzivní pánské holičství v Brně.',
    body: 'Prémiové střihy, úprava vousů a tradiční holení. Rezervuj si svůj termín.',
    cta: 'Rezervovat termín',
    description:
      'Koncept webu pro pánské holičství — služby, ceník a rezervace termínu na přehledném místě. Postaven a nasazený jako reálný web, ne jen mockup.',
  },
];
