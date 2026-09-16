import { Button } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';

const CONTACT_WEB_URL = 'mailto:vojanmatyas@gmail.com';

export default function FinalCtaWeby() {
  return (
    <section className="bg-surface py-24 lg:py-32">
      <div className="mx-auto w-full max-w-3xl px-6 text-center lg:px-8">
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl lg:leading-[1.08]">
          Máte projekt?
          <br />
          <span className="text-accent">Postavím z něj web.</span>
        </h2>
        <p className="text-balance mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Řekněte mi, co potřebujete. Probereme, jestli spolu dává smysl web
          postavit — co má předat, jak by měl vypadat a co si představujete.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={CONTACT_WEB_URL} size="lg">
            CHCI NOVÝ WEB
            <Icon name="arrow-right" className="h-4 w-4" />
          </Button>
          <Button href="#prace" variant="secondary" size="lg">
            Zpět na práce
          </Button>
        </div>

        <p className="mt-8 text-sm font-medium uppercase tracking-[0.14em] text-faint">
          Koncept → Struktura → Design → Build → Spuštění
        </p>
      </div>
    </section>
  );
}
