'use client';

import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Icon, type IconName } from '@/components/shared/Icon';

interface Benefit {
  icon: IconName;
  title: React.ReactNode;
  text: string;
}

/** Ručně vedené zvýraznění — Ivory fix na Stone pozadí, kreslí se scrollem. */
function Marked({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      initial={{ backgroundSize: '0% 46%' }}
      whileInView={{ backgroundSize: '100% 46%' }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="marker-ivory"
    >
      {children}
    </motion.span>
  );
}

const BENEFITS: Benefit[] = [
  {
    icon: 'phone-call',
    title: (
      <>
        <Marked>Zákazník se dovolá</Marked> i ve chvíli, kdy nemůžete zvednout
        telefon
      </>
    ),
    text: 'Hovor neskončí bez reakce jen proto, že je špička, večer nebo víkend.',
  },
  {
    icon: 'user-check',
    title: (
      <>
        Běžný dotaz dostane <Marked>odpověď hned</Marked> při hovoru
      </>
    ),
    text: 'Asistent pokrývá opakující se dotazy k provozu a službám podle vašeho nastavení.',
  },
  {
    icon: 'calendar-check',
    title: 'Rezervace proběhne podle pravidel vašeho provozu',
    text: 'Tam, kde je rezervace nastavená, asistent nabídne dostupné termíny a rezervaci potvrdí.',
  },
  {
    icon: 'clock',
    title: 'Složitější požadavek nezapadne, ale předá se člověku',
    text: 'Nestandardní situace a rozhodnutí mimo nastavený rozsah zůstávají na vašem týmu.',
  },
  {
    icon: 'zap',
    title: 'Asistent se přizpůsobí konkrétnímu typu provozu',
    text: 'Jiný rozsah potřebuje salon, jiný klinika nebo restaurace. Nasazení se ladí podle vašich reálných scénářů.',
  },
  {
    icon: 'message-circle',
    title: 'Máte přehled o tom, co se v hovorech řešilo',
    text: 'Výsledek hovoru je jasný: co bylo vyřešeno asistentem a co čeká na člověka.',
  },
];

export default function Benefits() {
  return (
    <section id="vyhody" className="scroll-mt-20 border-y border-border bg-surface-muted py-20 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Výhody"
          title="Konkrétní výsledek pro každodenní provoz"
          description="Jasně víte, co asistent vyřeší sám a co má jít dál vašemu týmu."
        />

        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map(({ icon, title, text }) => (
            <div key={icon as string}>
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent-soft text-accent">
                <Icon name={icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.16em] text-faint">
          <span aria-hidden="true" className="h-px w-8 bg-accent" />
          Zvýrazněné dva rozhodují — ostatní z nich vyplývají.
        </p>
      </div>

      <style>{`
        .marker-ivory {
          background-image: linear-gradient(100deg,
            rgba(243,240,233,0) 1%,
            rgba(243,240,233,0.9) 2.5%,
            rgba(243,240,233,0.72) 6%,
            rgba(243,240,233,0.9) 10.5%,
            rgba(243,240,233,0.72) 15%,
            rgba(243,240,233,0.9) 24%,
            rgba(243,240,233,0.72) 33%,
            rgba(243,240,233,0.9) 47%,
            rgba(243,240,233,0.72) 60%,
            rgba(243,240,233,0.9) 76%,
            rgba(243,240,233,0.72) 88%,
            rgba(243,240,233,0.9) 96%,
            rgba(243,240,233,0) 100%);
          background-repeat: no-repeat;
          background-position: 0 82%;
          padding: 0 0.15em;
          margin: 0 -0.15em;
          border-radius: 0.45em;
        }
      `}</style>
    </section>
  );
}
