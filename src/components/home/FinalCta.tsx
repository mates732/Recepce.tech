import { Button } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';

const DEMO_URL = 'https://www.recepce.tech/cs/demo';

export default function FinalCta() {
  return (
    <section className="bg-surface py-24 lg:py-32">
      <div className="mx-auto w-full max-w-3xl px-6 text-center lg:px-8">
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl lg:leading-[1.08]">
          Telefon zvedne někdo za vás.
        </h2>
        <p className="text-balance mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Připojte recepční k vašemu číslu a nikdy nepřijdete o hovor. Nasadíte to za jeden den.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={DEMO_URL} size="lg">
            Vyzkoušet demo
            <Icon name="arrow-right" className="h-4 w-4" />
          </Button>
          <Button href="mailto:info@recepce.tech" variant="secondary" size="lg">
            Napsat nám
          </Button>
        </div>

        <p className="mt-8 text-sm text-faint">
          Žádný hardware · Žádná instalace · Funguje s vaším číslem · 24/7 · Bez toho, aby někdo musel zvednout telefon
        </p>
      </div>
    </section>
  );
}