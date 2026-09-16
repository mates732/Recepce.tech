import { Button } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';

const DEMO_URL = '/demo';

export default function FinalCtaAsistenti() {
  return (
    <section className="bg-surface py-24 lg:py-32">
      <div className="mx-auto w-full max-w-3xl px-6 text-center lg:px-8">
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl lg:leading-[1.08]">
          Vaši zákazníci volají už dnes.
          <br />
          <span className="text-accent">Kdo jim zvedne telefon?</span>
        </h2>
        <p className="text-balance mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Připravím ukázku na vaše reálné situace a nastavíme rozsah, který bude asistent ve vašem provozu řešit.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={DEMO_URL} size="lg">
            CHCI UKÁZKU PRO SVŮJ PROVOZ
            <Icon name="arrow-right" className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-8 text-sm text-faint">
          Žádný hardware · Žádná instalace · Funguje s vaším stávajícím číslem · Rozsah kdykoli upravíte
        </p>
      </div>
    </section>
  );
}
