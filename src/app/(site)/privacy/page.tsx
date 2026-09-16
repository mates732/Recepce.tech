import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy | Recepce.tech',
  description: 'Jak Recepce.tech nakládá s osobními údaji.',
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: 'Co sbírám',
    body: [
      'Recepce.tech nesbírá osobní údaje automaticky. Jediná data, která dostanu, jsou ta, která mi sami pošlete — jméno, e-mail a obsah zprávy z kontaktního formuláře nebo e-mailu.',
    ],
  },
  {
    title: 'K čemu je používám',
    body: [
      'Výhradně k odpovědi na vaši poptávku. Data nepředávám třetím stranám, nepoužívám je k marketingu a neprodávám je.',
    ],
  },
  {
    title: 'Cookies a analytika',
    body: [
      'Web nevyužívá sledovací cookies ani profilování. Pokud se to v budoucnu změní, bude tato stránka předem aktualizována.',
    ],
  },
  {
    title: 'Vaše práva',
    body: [
      'Na vaši žádost vám sdělím, jaké údaje o vás mám, a smažu je. Stačí napsat na níže uvedený e-mail.',
    ],
  },
  {
    title: 'Správce dat',
    body: ['Správcem osobních údajů je Matyáš Vojan — provozovatel Recepce.tech.'],
  },
];

export default function PrivacyPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-20 lg:px-8 lg:py-28">
      <Link
        href="/"
        className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
      >
        ← Zpět na hlavní stránku
      </Link>

      <h1 className="mt-8 text-4xl font-semibold tracking-[-0.02em] text-ink sm:text-5xl">
        Privacy
      </h1>
      <p className="mt-4 text-sm text-muted">
        Zásady zpracování osobních údajů · Platnost od 14. 9. 2026
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
          Dotazy k datům:{' '}
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
