import { SectionHeading } from '@/components/shared/SectionHeading';
import { Icon, type IconName } from '@/components/shared/Icon';
import type { ReactNode } from 'react';

const BOOK_OPEN: ReactNode = (
  <>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h9z" />
    <path d="M6 21h12" />
  </>
);

const LAYOUT: ReactNode = (
  <>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </>
);

const EYE: ReactNode = (
  <>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </>
);

interface Outcome {
  icon: IconName | ReactNode;
  title: string;
  text: string;
}

/**
 * Co by měl hotový web dělat — záměr, ne záruka.
 */
const OUTCOMES: Outcome[] = [
  {
    icon: 'globe',
    title: 'Rychle vysvětlí, co děláte',
    text: 'Návštěvník by měl na první pohled pochopit, co je vaším podnikáním a pro koho je.',
  },
  {
    icon: BOOK_OPEN,
    title: 'Jasně ukáže nabídku',
    text: 'Co nabízíte, za kolik a jak to probíhá — viditelně a bez hledání.',
  },
  {
    icon: LAYOUT,
    title: 'Povede přirozeně',
    text: 'Navigace a pořadí sekcí by měly dát smysl i při první návštěvě. Důležité informace na dosah.',
  },
  {
    icon: 'smartphone',
    title: 'Bude fungovat všude',
    text: 'Stejná kvalita na mobilu, tabletu i desktopu — protože návštěvníci přicházejí z každého zařízení.',
  },
  {
    icon: 'mail',
    title: 'Ulehčí kontakt',
    text: 'Kdo se chce ozvat, najde cestu hned. Telefon, e-mail nebo objednávka na dosah jediného kliknutí.',
  },
  {
    icon: EYE,
    title: 'Předá značku',
    text: 'Web by měl působit jako důsledná prezentace vašeho podnikání — ne jako obecná šablona.',
  },
];

export default function WebWebyVysledek() {
  return (
    <section className="scroll-mt-20 border-y border-border bg-surface-muted py-20 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Výsledek"
          title="Co má hotový web dělat"
          description="Neslibuji počty zákazníků ani konverze. Mírím na to, aby web dělal svou práci: vysvětlit, ukázat, navést a předat."
          align="left"
        />

        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {OUTCOMES.map(({ icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_12px_32px_-16px_rgba(23,23,22,0.18)]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent">
                {typeof icon === 'string' ? (
                  <Icon name={icon as IconName} className="h-5.5 w-5.5" />
                ) : (
                  <Icon icon={icon} className="h-5.5 w-5.5" />
                )}
              </span>
              <h3 className="mt-5 text-base font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
