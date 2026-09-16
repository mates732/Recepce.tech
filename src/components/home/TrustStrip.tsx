import { Icon, type IconName } from '@/components/shared/Icon';

interface Item {
  icon: IconName;
  title: string;
  text: string;
}

const ITEMS: Item[] = [
  {
    icon: 'clock',
    title: '24 hodin denně',
    text: 'Odpovídá ve dne i v noci, o víkendu i o svátcích.',
  },
  {
    icon: 'phone-call',
    title: 'Bez zmeškaných hovorů',
    text: 'Každý hovor je přijatý a každý dotaz zaznamenaný.',
  },
  {
    icon: 'calendar-check',
    title: 'Rezervace do kalendáře',
    text: 'Rezervace se zapisují samy. Bez přepisů a zapomenutých termínů.',
  },
  {
    icon: 'user-check',
    title: 'Personál u klienta',
    text: 'Vaši lidé zůstanou s klientem. Telefon zvedne asistent.',
  },
  {
    icon: 'zap',
    title: 'Od prvního dne',
    text: 'Nasazení bez hardware, bez IT a bez změny čísla.',
  },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-border bg-surface-muted">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-x-6 gap-y-8 px-6 py-10 sm:grid-cols-2 sm:py-12 lg:grid-cols-5 lg:px-8">
        {ITEMS.map(({ icon, title, text }) => (
          <div key={title} className="flex items-start gap-3.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
              <Icon name={icon} className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}