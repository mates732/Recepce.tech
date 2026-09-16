import { Button } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';

const DEMO_URL = 'https://www.recepce.tech/cs/demo';

const DEMO_POINTS = [
  'Uslyšíte skutečný hovor s AI recepční',
  'Vyzkoušíte si rezervaci termínu naživo',
  'Uvidíte, jak se rezervace zapíše do kalendáře',
];

export function DemoSection() {
  return (
    <section className="bg-panel">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-28">
        {/* Copy */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-bright">
            Živé demo
          </p>
          <h2 className="text-balance mt-4 text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Podívejte se, jak to funguje
          </h2>
          <p className="text-balance mt-5 text-base leading-relaxed text-slate-400 sm:text-lg">
            Vyzkoušejte si hovor s AI recepční na vlastní uši. Zjistíte, jak přijme
            objednávku, odpoví na dotaz a zapíše rezervaci — během jediného hovoru.
          </p>

          <ul className="mt-8 space-y-3.5">
            {DEMO_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm text-slate-300">
                <Icon name="check" className="h-4 w-4 shrink-0 text-accent-bright" strokeWidth={2.25} />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href={DEMO_URL} size="lg">
              Spustit demo
              <Icon name="arrow-right" className="h-4 w-4" />
            </Button>
            <Button href="mailto:info@recepce.tech" variant="onDark" size="lg">
              Kontaktovat nás
            </Button>
          </div>
        </div>

        {/* Phone mockup */}
        <div className="flex justify-center">
          <div className="w-[290px] rounded-[2.4rem] border border-border bg-[var(--color-ink)] p-3 shadow-[0_32px_80px_-32px_rgba(0,0,0,0.7)]">
            <div className="overflow-hidden rounded-[1.9rem] border border-border bg-surface">
              {/* Phone header */}
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <span className="text-xs font-semibold text-ink">Recepce.tech</span>
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Hovor
                </span>
              </div>

              {/* Caller */}
              <div className="flex items-center gap-2.5 border-b border-border px-5 py-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-panel text-[10px] font-semibold text-ink">
                  KV
                </span>
                <div>
                  <p className="text-xs font-semibold text-ink">Klára Veselá</p>
                  <p className="text-[10px] text-muted">+420 777 654 321</p>
                </div>
              </div>

              {/* Mini transcript */}
              <div className="space-y-2 px-5 py-4">
                <div className="ml-auto w-fit max-w-[90%] rounded-xl rounded-br-md bg-surface-muted px-3 py-1.5 text-[11px] leading-relaxed text-ink">
                  Dobrý den, chtěla bych rezervovat masáž na pátek.
                </div>
                <div className="w-fit max-w-[90%] rounded-xl rounded-bl-md border border-accent/15 bg-accent-soft px-3 py-1.5 text-[11px] leading-relaxed text-ink">
                  Dobrý den, v pátek máme volno v 15:00 a v 17:00. Vyhovoval by vám některý z těchto časů?
                </div>
                <div className="ml-auto w-fit max-w-[90%] rounded-xl rounded-br-md bg-surface-muted px-3 py-1.5 text-[11px] leading-relaxed text-ink">
                  Ano, v 15:00 prosím.
                </div>
              </div>

              {/* Action */}
              <div className="border-t border-border bg-surface-muted/60 px-5 py-3.5">
                <span className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-accent px-4 text-[11px] font-medium text-accent-bright">
                  <Icon name="calendar-check" className="h-3.5 w-3.5" />
                  Rezervovat termín
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}