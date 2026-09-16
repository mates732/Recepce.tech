import { Button } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(23,23,22,0.055)_1px,transparent_0)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-16 pt-8 sm:pt-10 lg:min-h-[calc(100dvh-3.5rem)] lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-8 lg:pb-14 lg:pt-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-ink shadow-[0_1px_2px_rgba(23,23,22,0.04)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            AI recepce 24/7
          </span>

          <h1 className="text-balance mt-5 text-[2.55rem] font-semibold leading-[1.04] tracking-[-0.03em] text-ink sm:text-5xl lg:text-[3.55rem] lg:leading-[1.02]">
            Vaše recepce.
            <br />
            <span className="text-accent">24 hodin denně.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Telefon zazvoní ve 19:47. Ve víkendu. Nebo v noci, když už všichni jsou doma.
            Někdo zvedne. Odpoví. Rezervuje termín. A zákazník odevzdá — bez toho,
            aby čekal u telefonu, a bez toho, aby vám někdo přeje čekat.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="https://www.recepce.tech/cs/demo" size="lg">
              Zavolat si
              <Icon name="arrow-right" className="h-4 w-4" />
            </Button>
            <Button href="/#jak-to-funguje" variant="secondary" size="lg">
              Jak to funguje
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2.5">
            {['Nasazení během jednoho dne', 'Funguje s vaším číslem', 'Bez instalace a školení'].map((marker) => (
              <li
                key={marker}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                {marker}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-x-4 -inset-y-5 rounded-[2rem] bg-accent-soft/70 sm:-inset-x-6 sm:-inset-y-7"
          />
          <div className="relative">
            <p className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">Hero visual placeholder</p>
          </div>
        </div>
      </div>
    </section>
  );
}