'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Icon } from '@/components/shared/Icon';

type From = 'customer' | 'ai';

interface Msg {
  from: From;
  text: string;
}

interface Scenario {
  id: string;
  tab: string;
  title: string;
  description: string;
  business: string;
  caller: string;
  duration: string;
  outcome: string;
  messages: Msg[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'booking',
    tab: 'Objednání termínu',
    title: 'Rezervace termínu bez čekání',
    description:
      'Zákaznice zavolá, vybere si čas a má hotovo. Bez čekání, bez přepojování, bez zápisu do papírového diáře.',
    business: 'Zlatý Hřeben · holičství',
    caller: 'Petr Novák',
    duration: '01:32',
    outcome: 'Rezervace zapsána do kalendáře — út 14. 5., 9:30',
    messages: [
      {
        from: 'customer',
        text: 'Dobrý den, chtěl bych se objednat na střih a úpravu vousů.',
      },
      {
        from: 'ai',
        text: 'Dobrý den, samozřejmě. Mohu se zeptat, který den by vám vyhovoval?',
      },
      { from: 'customer', text: 'Nejlíp příští úterý dopoledne.' },
      {
        from: 'ai',
        text: 'Příští úterý máme volno v 9:30 a v 11:00. Který čas vám vyhovuje?',
      },
      { from: 'customer', text: 'V 9:30 prosím.' },
      {
        from: 'ai',
        text: 'Výborně. Rezervace je potvrzená: úterý 14. 5. v 9:30, střih a úprava vousů. Těšíme se na vás.',
      },
    ],
  },
  {
    id: 'change',
    tab: 'Změna rezervace',
    title: 'Změna rezervace za pár vteřin',
    description:
      'Zákazník potřebuje posunout rezervaci. Virtuální asistent změnu provede okamžitě a potvrdí ji.',
    business: 'Zlatý Hřeben · holičství',
    caller: 'Jan Svoboda',
    duration: '00:58',
    outcome: 'Rezervace upravena — dnes 20:00, střih a úprava vousů',
    messages: [
      {
        from: 'customer',
        text: 'Dobrý den, mám rezervaci na dnešek v 19:00. Mohl bych přijít o hodinu později?',
      },
      {
        from: 'ai',
        text: 'Dobrý den, určitě. Na jaké jméno je rezervace vedená?',
      },
      { from: 'customer', text: 'Jan Svoboda, rezervace na střih.' },
      {
        from: 'ai',
        text: 'Hotovo. Vaše rezervace je přesunutá na dnešek 20:00, střih a úprava vousů. Těšíme se na vás.',
      },
    ],
  },
  {
    id: 'hours',
    tab: 'Otevírací doba',
    title: 'Přesná odpověď na dotaz',
    description:
      'Zákazník se jen ptá. Dostane správnou odpověď — a nabídku, aby se rovnou objednal.',
    business: 'Zlatý Hřeben · holičství',
    caller: 'Tomáš Kříž',
    duration: '00:41',
    outcome: 'Dotaz zaznamenán · žádná rezervace',
    messages: [
      {
        from: 'customer',
        text: 'Dobrý den, chtěl bych vědět, jestli máte otevřeno v sobotu.',
      },
      {
        from: 'ai',
        text: 'Dobrý den. V sobotu máme otevřeno od 8:00 do 12:00. Chcete rovnou rezervovat termín?',
      },
      { from: 'customer', text: 'Ne, jen jsem se ptal. Děkuji.' },
      { from: 'ai', text: 'Není zač. Přeji hezký den.' },
    ],
  },
  {
    id: 'services',
    tab: 'Služby a ceny',
    title: 'Dotaz proměněný v rezervaci',
    description:
      'Dotaz na službu nebo cenu se promění v rezervaci dřív, než by zákazník stihl zavěsit.',
    business: 'Zlatý Hřeben · holičství',
    caller: 'Alena Horáková',
    duration: '01:15',
    outcome: 'Rezervace zapsána — st 20. 5., 17:00',
    messages: [
      {
        from: 'customer',
        text: 'Dobrý den, nabízíte i tradiční holení břitvem?',
      },
      {
        from: 'ai',
        text: 'Dobrý den. Ano, tradiční holení břitvem nabízíme. Trvá 45 minut, cena je 690 Kč.',
      },
      { from: 'customer', text: 'A máte volno příští středu?' },
      {
        from: 'ai',
        text: 'Příští středu máme volno ve 14:00 a v 17:00. Který čas vám vyhovuje?',
      },
      { from: 'customer', text: 'V 17:00.' },
      {
        from: 'ai',
        text: 'Rezervace potvrzena: středa 20. 5. v 17:00, tradiční holení. Těšíme se na vás.',
      },
    ],
  },
  {
    id: 'handoff',
    tab: 'Předání člověku',
    title: 'Když je potřeba člověk',
    description:
      'Když si Virtuální asistent neví rady, požadavek převezme člověk. Zákazník vždy najde pomoc.',
    business: 'Zlatý Hřeben · holičství',
    caller: 'Petr Dvořák',
    duration: '01:07',
    outcome: 'Předáno lidskému operátorovi — ozve se do konce dne',
    messages: [
      {
        from: 'customer',
        text: 'Dobrý den, potřeboval bych poradit s objednáním větší skupiny — jdeme v pěti.',
      },
      {
        from: 'ai',
        text: 'Rozumím. Tento požadavek předám kolegovi, který se vám ozve. Mohu si zapsat jméno a telefon?',
      },
      { from: 'customer', text: 'Petr Dvořák, 603 123 456.' },
      {
        from: 'ai',
        text: 'Děkuji, pane Dvořáku. Kolega se vám ozve do konce dne. Přeji hezký den.',
      },
    ],
  },
];

export default function ProductDemo() {
  const [activeId, setActiveId] = useState(SCENARIOS[0].id);
  const active = SCENARIOS.find((s) => s.id === activeId) ?? SCENARIOS[0];

  return (
    <section className="scroll-mt-20 border-y border-border bg-surface-muted py-20 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Demo · Virtuální asistent"
          title="Tak vypadá hovor s asistentem"
          description="Žádné nahrávky. Žádné menu. Skutečné konverzace, které asistent zvládne sám."
        />

        {/* Tabs */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {SCENARIOS.map((s) => {
            const isActive = s.id === activeId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveId(s.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-panel text-ink shadow-sm'
                    : 'border border-border bg-surface text-muted hover:border-border-strong hover:text-ink'
                }`}
              >
                {s.tab}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-14"
          >
            {/* Scenario context */}
            <div className="flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {active.tab}
              </p>
              <h3 className="text-balance mt-3 text-2xl font-semibold tracking-[-0.015em] text-ink sm:text-3xl">
                {active.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {active.description}
              </p>
              <div className="mt-7 flex items-center gap-2.5 rounded-xl border border-border bg-accent-soft px-4 py-3">
                <Icon name="check-circle" className="h-4.5 w-4.5 shrink-0 text-accent" />
                <p className="text-sm font-medium text-ink-2">{active.outcome}</p>
              </div>
            </div>

            {/* Chat card */}
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_16px_48px_-24px_rgba(23,23,22,0.16)]">
              <div className="flex items-center justify-between border-b border-border bg-surface-muted/70 px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent-ink">
                    {active.business.charAt(0)}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-ink">{active.business}</p>
                    <p className="text-[11px] text-muted">
                      {active.caller} · {active.duration}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Hovor vyřešen
                </span>
              </div>

              <div className="flex flex-col gap-3.5 px-5 py-6">
                {active.messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.12, ease: 'easeOut' }}
                    className={
                      msg.from === 'customer' ? 'self-start max-w-[85%]' : 'self-end max-w-[85%]'
                    }
                  >
                    <p
                      className={`mb-1 text-[10px] font-medium uppercase tracking-wide text-faint ${
                        msg.from === 'ai' ? 'text-right' : ''
                      }`}
                    >
                      {msg.from === 'customer' ? 'Zákazník' : 'Virtuální asistent'}
                    </p>
                    <div
                      className={
                        msg.from === 'customer'
                          ? 'rounded-2xl rounded-bl-md border border-border bg-surface-muted px-4 py-2.5 text-sm leading-relaxed text-ink'
                          : 'rounded-2xl rounded-br-md border border-accent/15 bg-accent-soft px-4 py-2.5 text-sm leading-relaxed text-ink'
                      }
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}