'use client';

import { useRef } from 'react';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Icon, type IconName } from '@/components/shared/Icon';

/**
 * Co asistent přebírá — horizontální pás schopností, který uživatel
 * scrolluje (mini scrollbar, snap). Na konci pásu je „a mnohem více“.
 */

interface Skill {
  icon: IconName;
  title: string;
  text: string;
}

const SKILLS: Skill[] = [
  {
    icon: 'phone-call',
    title: 'Telefonní hovory',
    text: 'Zvedne v prvním vyzvánění — ráno, večer, o víkendu.',
  },
  {
    icon: 'calendar-check',
    title: 'Booking',
    text: 'Nabídne volné termíny a rezervaci potvrdí podle pravidel provozu.',
  },
  {
    icon: 'clock',
    title: 'Domlouvání termínů',
    text: 'Přesouvá, ruší a potvrzuje — zákazník nemusí čekat na zpětné volání.',
  },
  {
    icon: 'calendar',
    title: 'Rezervace',
    text: 'Zápisy do kalendáře bez přepisování a ztracených lístků.',
  },
  {
    icon: 'check-circle',
    title: 'Nabídka služeb',
    text: 'Co děláte, za kolik a jak to probíhá — vždy podle nastavení.',
  },
  {
    icon: 'user',
    title: 'Seznámení',
    text: 'Představí firmu a provede zákazníka prvním kontaktem.',
  },
  {
    icon: 'message-circle',
    title: 'SMS požadavky',
    text: 'Vyřídí, co přijde zprávou — potvrdí, zeptá se, doporučí.',
  },
  {
    icon: 'phone',
    title: 'Přepojení, když si neví rady',
    text: 'Složitější požadavek předá člověku — s kontaktem a kontextem.',
  },
  {
    icon: 'building',
    title: 'Znalost firmy',
    text: 'Zná vaše služby, ceny, otevírací dobu i to, jak fungujete.',
  },
  {
    icon: 'user-check',
    title: 'Asistence při absenci',
    text: 'Když je odborník mimo, vezme požadavek a zajistí zpětnou vazbu.',
  },
  {
    icon: 'zap',
    title: 'Doporučené řešení',
    text: 'Navede zákazníka k tomu, co pro jeho situaci dává smysl.',
  },
];

export default function CoPrebira() {
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  function onScroll() {
    const track = trackRef.current;
    const bar = barRef.current;
    if (!track || !bar) return;
    const max = track.scrollWidth - track.clientWidth;
    const ratio = max > 0 ? track.scrollLeft / max : 0;
    bar.style.width = `${Math.max(12, ratio * 100)}%`;
  }

  return (
    <section id="co-prebira" className="scroll-mt-20 bg-surface py-20 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Co asistent přebírá"
          title="Konkrétní úkoly, ne obecné sliby"
          description="Asistent pokrývá první kontakt i běžnou agendu provozu. Nastavíte, co řeší sám a co předává vašemu týmu."
        />
      </div>

      {/* Pás — přes celou šířku viewportu, zarovnaný k obsahu */}
      <div className="relative mt-14">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-3 lg:px-[max(1.5rem,calc((100vw-72rem)/2+2rem))]"
        >
          {SKILLS.map(({ icon, title, text }, i) => (
            <div
              key={title}
              className="w-[240px] shrink-0 snap-start border-t border-border pt-5 sm:w-[260px]"
            >
              <div className="flex items-baseline justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent-soft text-accent">
                  <Icon name={icon} className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-semibold tracking-[0.18em] text-faint">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}

          {/* Závěrečná karta — a mnohem více */}
          <div className="w-[240px] shrink-0 snap-start border-t border-accent pt-5 sm:w-[260px]">
            <p className="text-2xl font-semibold tracking-[-0.02em] text-ink">A mnohem více.</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Rozsah se vždy nastaví podle vašeho provozu — co má asistent
              řešit sám a co přepojí na vás.
            </p>
          </div>
        </div>

        {/* Mini scrollbar v paletě */}
        <div className="mx-auto mt-4 hidden w-full max-w-6xl px-6 lg:block lg:px-8">
          <div className="h-px w-full bg-border">
            <div ref={barRef} className="h-px w-[12%] bg-accent transition-[width] duration-150" />
          </div>
        </div>

        {/* Nápověda — na střed pod mini scrollbar */}
        <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
          ← Scrollujte →
        </p>
      </div>
    </section>
  );
}
