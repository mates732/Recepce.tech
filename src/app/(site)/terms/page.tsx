import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use | Recepce.tech',
  description: 'Podmínky používání webu Recepce.tech.',
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: '1. Předmět',
    body: [
      'Tyto podmínky upravují používání webu Recepce.tech. Web představuje služby Matyáše Vojana — tvorbu webů a virtuální asistenty.',
    ],
  },
  {
    title: '2. Obsah webu',
    body: [
      'Prezentované ukázky a koncepty jsou skutečně postavené a nasazené weby, které nejsou zakázkami klientů — vždy je u nich uvedeno, že jde o koncept.',
      'Popisy služeb jsou informativní. Konečný rozsah a podmínky spolupráce se vždy domlouvají individuálně před zahájením práce.',
    ],
  },
  {
    title: '3. Odpovědnost',
    body: [
      'Provozovatel neodpovídá za škody vzniklé použitím obsahu webu, ani za dočasnou nedostupnost webu nebo odkazovaných stránek třetích stran.',
    ],
  },
  {
    title: '4. Ochranné známky a autorská práva',
    body: [
      'Veškerý obsah webu (texty, vizuál, kód) je dílem provozovatele nebo je používán se souhlasem držitelů práv. Kopírování bez souhlasu není povoleno.',
    ],
  },
  {
    title: '5. Změny podmínek',
    body: ['Provozovatel může tyto podmínky kdykoli aktualizovat. Platná je vždy verze uveřejněná na této stránce.'],
  },
];

export default function TermsPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-20 lg:px-8 lg:py-28">
      <Link
        href="/"
        className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
      >
        ← Zpět na hlavní stránku
      </Link>

      <h1 className="mt-8 text-4xl font-semibold tracking-[-0.02em] text-ink sm:text-5xl">
        Terms of Use
      </h1>
      <p className="mt-4 text-sm text-muted">
        Podmínky používání webu Recepce.tech · Platnost od 14. 9. 2026
      </p>

      <div className="mt-12 space-y-10">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h2 className="text-lg font-semibold text-ink">{s.title}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-3 text-[15px] leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-14 border-t border-border pt-8">
        <p className="text-sm text-muted">
          Dotazy k podmínkám:{' '}
          <a
            href="mailto:vojanmatyas@gmail.com"
            className="font-medium text-ink underline decoration-border-strong underline-offset-4 hover:decoration-accent"
          >
            vojanmatyas@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
}
