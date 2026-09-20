import { Icon } from '@/components/shared/Icon';
import Reveal from '@/components/home/Reveal';
import VapiCallButton from '@/components/demo/VapiCallButton';
import LudmilaStickyCta from '@/components/demo/LudmilaStickyCta';

/**
 * Stránka pro Textil Ludmila — zákazník si tady přímo vyzkouší digitálního
 * recepčního: jedno tlačítko na zahájení hovoru (Vapi, přes /api/vapi/session)
 * + stručné info. Web prodejny to není a nechce být.
 */
const PHONE = '+420720943766';
const PHONE_LABEL = '+420 720 943 766';

const NOTES = [
  {
    icon: 'phone-call' as const,
    title: 'Mikrofon',
    detail:
      'Až se prohlížeč zeptá na mikrofon, povolte ho — bez něj hovor nezačne.',
  },
  {
    icon: 'lock' as const,
    title: 'Anonymně',
    detail:
      'Nechceme od vás žádné osobní údaje. Jen si vyzkoušíte, jak recepční odpovídá.',
  },
  {
    icon: 'clock' as const,
    title: 'Kdykoliv',
    detail:
      'Stejný recepční odpovídá zákazníkům i večer a o víkendu, kdy je prodejna zavřená.',
  },
];

export default function LudmilaDemo() {
  return (
    <>
      {/* Hero + karta s tlačítkem na hovor */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(23,23,22,0.055)_1px,transparent_0)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]"
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-10 sm:pt-14 lg:px-8 lg:pb-20 lg:pt-16">
          <Reveal>
            <div className="mx-auto max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                Demo · Textil Ludmila
              </p>

              <h1 className="text-balance mt-4 text-[2.15rem] font-semibold leading-[1.08] tracking-[-0.02em] text-ink sm:mt-5 sm:text-[2.7rem] sm:leading-[1.05] lg:text-[3.25rem] lg:leading-[1.05] lg:tracking-[-0.03em]">
                Textil Ludmila
                <br />
                <span className="text-accent">s digitálním recepčním.</span>
              </h1>

              <p className="mt-5 text-[15px] leading-[1.75] text-ink/80 sm:mt-6 sm:text-base lg:mt-7 lg:text-[17px]">
                Ozvěte se mu přímo tady. Odpoví na otázky o látkách, šití
                závěsů na míru nebo stínění oken — a to i ve chvíli, kdy je
                prodejna v Praze 6 zavřená.
              </p>
            </div>

            {/* Karta recepčního — tlačítko na zapnutí asistenta */}
            <div id="recepce" className="mx-auto mt-10 max-w-xl scroll-mt-20 sm:mt-12">
              <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_60px_-32px_rgba(53,51,48,0.5)]">
                <div className="flex items-center gap-3 border-b border-border bg-surface-muted/70 px-5 py-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-bright">
                    TL
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      Digitální recepční
                    </p>
                    <p className="truncate text-[11px] text-muted">
                      Textil Ludmila · Praha 6
                    </p>
                  </div>
                  <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[10px] font-medium text-muted">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                      aria-hidden="true"
                    />
                    Připraven
                  </span>
                </div>

                <div className="px-5 py-5 sm:px-6 sm:py-6">
                  <VapiCallButton
                    slug="ludmila"
                    assistantName="Digitální recepční Textil Ludmila"
                  />
                  <p className="mt-4 text-center text-xs leading-relaxed text-faint">
                    Nebo zavolejte přímo:{' '}
                    <a
                      href={`tel:${PHONE}`}
                      className="font-medium text-muted underline decoration-border-strong/40 underline-offset-4 transition-colors duration-200 hover:text-ink hover:decoration-ink"
                    >
                      {PHONE_LABEL}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stručné info — editorial řádky, ikona vlevo, label + text */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-28 md:pb-16 lg:px-8 lg:pb-20">
        <Reveal y={16}>
          <div className="mx-auto max-w-2xl border-t border-border">
            {NOTES.map((note) => (
              <div
                key={note.title}
                className="flex items-start gap-3.5 border-b border-border py-5"
              >
                <span className="mt-px inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border">
                  <Icon name={note.icon} className="h-4 w-4 text-accent" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
                    {note.title}
                  </p>
                  <p className="mt-1.5 text-[13.5px] leading-[1.7] text-ink/80 sm:text-sm lg:text-[15px] lg:leading-[1.75]">
                    {note.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Mobilní sticky CTA — jen telefon, viz komponenta. */}
      <LudmilaStickyCta />
    </>
  );
}
