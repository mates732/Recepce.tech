'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TransitionSection } from '@/components/home/Transitions';
import { Icon } from '@/components/shared/Icon';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { type IconName } from '@/components/shared/Icon';

interface Problem {
  label: string;
  text: string;
  solution: string;
  icon: IconName;
}

const PROBLEMS: Problem[] = [
  {
    label: 'Zmeškaný hovor',
    text: 'Telefon zazvoní, když není nikdo, kdo by zvedl. Zákazník nechce čekat ani posílat zprávu — zavolá konkurenci. Příjem zakázky končí u vyzvánění.',
    solution: 'Asistent zvedne v prvním vyzvánění — kdykoli.',
    icon: 'phone-off',
  },
  {
    label: 'Stejný dotaz stokrát',
    text: 'Otevírací doba, ceny, parkování, jestli je potřeba rezervace. Stejné otázky stále dokola. A když zrovna obsluhujete, na telefon nikdo nedosáhne.',
    solution: 'Odpoví hned a pokaždé stejně správně.',
    icon: 'message-circle',
  },
  {
    label: 'Rezervace v papírech',
    text: 'Objednávky přicházejí telefonem, e-mailem i přes Instagram. Někdo je přepisuje do diáře, někdy se ztratí. A termín, který se nezapsal, je ztracený zákazník.',
    solution: 'Termín potvrdí a zapíše podle pravidel provozu.',
    icon: 'calendar',
  },
  {
    label: 'Telefon uprostřed práce',
    text: 'Zrovna máte klienta a zazvoní telefon. Přerušíte práci, nebo necháte zazvonit? Obojí něco stojí — buď vás, nebo zákazníka.',
    solution: 'Vy zůstanete u klienta. Telefon vyřeší asistent.',
    icon: 'phone-call',
  },
  {
    label: 'Zákazník večer i o víkendu',
    text: 'Termín potřebuje na zítřek, ale volá ve 21:40. Otevřeno nemáte. Pokud nikdo nezvedne, ráno si najde někoho jiného.',
    solution: 'Funguje i ve 22:00, o víkendu i o svátcích.',
    icon: 'clock',
  },
];

export function CoJeZmena() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <TransitionSection>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-14">
            <SectionHeading
              eyebrow="Problém"
              title="Když nikdo nemůže zvednout telefon"
              align="left"
              className="lg:col-span-7"
            />
            <p className="text-balance max-w-md text-base leading-relaxed text-muted lg:col-span-5 lg:justify-self-end lg:pb-2 lg:text-lg">
              Pět situací, které provozům běžně stojí zákazníky. Ne proto, že
              by o službu nestáli — ale proto, že se nedovolali.
            </p>
          </div>
        </TransitionSection>

        <TransitionSection className="mt-16">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: interactive list of situations */}
            <div>
              <p className="mb-6 text-[12px] font-semibold uppercase tracking-[0.2em] text-muted">
                Situace v provozu
              </p>
              <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface-muted p-5 sm:p-6">
                {PROBLEMS.map((p, i) => {
                  const isActive = active === i;
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-expanded={isActive}
                      className="w-full cursor-pointer rounded-xl border-none bg-transparent p-0 text-left transition-colors duration-200"
                      style={{ background: isActive ? 'var(--color-accent-soft)' : 'transparent' }}
                    >
                      <div className="flex items-center justify-between gap-3 px-3 py-3">
                        <div className="flex items-center gap-3">
                          <Icon
                            name={p.icon}
                            className="h-5 w-5 shrink-0"
                            style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-muted)' }}
                          />
                          <span
                            className={`text-[15px] font-semibold ${isActive ? 'text-ink' : 'text-ink-2'}`}
                          >
                            {p.label}
                          </span>
                        </div>
                        <span
                          className={`text-[11px] font-semibold tabular-nums ${
                            isActive ? 'text-accent' : 'text-faint'
                          }`}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="px-3 pb-3 text-sm leading-relaxed text-ink-2"
                        >
                          {p.text}
                        </motion.p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: what the assistant does with each situation */}
            <div className="flex flex-col lg:pt-[4.75rem]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-muted">
                Řešení
              </p>
              <h3 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-4xl">
                Asistent, který zvedá telefon pokaždé.
              </h3>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
                Někdo, kdo je na telefonu, když vy nemůžete být. Pracuje podle nastavení
                pro váš konkrétní provoz — ne podle obecné šablony.
              </p>
              <ul className="mt-8">
                {PROBLEMS.map((p, i) => (
                  <li
                    key={p.label}
                    className={`flex flex-col gap-1 border-t border-border py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 ${
                      i === PROBLEMS.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <span className="flex items-center gap-2.5 text-sm font-semibold text-ink">
                      <span
                        className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold"
                        style={{ background: 'var(--color-accent-soft)', color: 'var(--color-accent)' }}
                      >
                        ✓
                      </span>
                      {p.label}
                    </span>
                    <span className="pl-7 text-sm text-muted sm:pl-0 sm:text-right">
                      {p.solution}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TransitionSection>
      </div>
    </section>
  );
}
