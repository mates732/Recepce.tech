'use client';

import { Button } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';

/**
 * Hero stránky /weby — jednosloupcová kompozice. Žádný náhled konceptu
 * v hero: práce následují níže v portfoliu, info o konceptu patří až
 * nad samotný koncept, ne nad skutečnou zakázku.
 */
export default function HeroWeby() {
  return (
    <section className="relative overflow-hidden">
      {/* Background structure */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(23,23,22,0.055)_1px,transparent_0)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-12 sm:pt-16 lg:min-h-[calc(100dvh-3.5rem)] lg:px-8 lg:pb-14 lg:pt-20">
        <div className="max-w-3xl">
          <h1 className="text-balance text-[2.55rem] font-semibold leading-[1.04] tracking-[-0.03em] text-ink sm:text-5xl lg:text-[3.9rem] lg:leading-[1.02]">
            Weby, které mají
            <br />
            <span className="text-accent">vlastní charakter.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Jsem Matyáš a navrhuji i stavím weby — od konceptu přes strukturu a
            vizuál až po build a spuštění. Žádné balíčky služeb — jen web,
            který vypadá a funguje přesně tak, jak má.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="mailto:vojanmatyas@gmail.com" size="lg">
              CHCI NOVÝ WEB
              <Icon name="arrow-right" className="h-4 w-4" />
            </Button>
            <Button href="#prace" variant="secondary" size="lg">
              Práce
            </Button>
          </div>
        </div>
      </div>

      {/* Pointer toward the work */}
      <div className="relative mx-auto flex w-full max-w-6xl px-6 pb-12 lg:px-8">
        <a
          href="#prace"
          className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
        >
          <span className="h-px w-8 bg-border-strong transition-all duration-200 group-hover:w-12 group-hover:bg-accent" />
          Práce níže
        </a>
      </div>
    </section>
  );
}
