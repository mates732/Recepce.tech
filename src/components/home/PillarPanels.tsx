'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';

/**
 * Dvě dominanty — hlavní pilíře Recepce.tech.
 * Velké panely místo karet: hover zvětší plochu, prohloubí ji a
 * odhalí detaily (čísla, seznam, šipku). Limetka jen na čísle a hoveru.
 */

const PILLARS = [
  {
    n: '01',
    label: 'Web',
    title: 'WEBY',
    claim: 'Digitální prostor, který pracuje pro vaši značku.',
    points: ['Strategie & struktura', 'Design & vývoj', 'Konverze & měření'],
    href: '/weby',
  },
  {
    n: '02',
    label: 'Asistent',
    title: 'VIRTUÁLNÍ ASISTENTI',
    claim: 'Digitální pomocník, který pracuje, i když vy nemůžete.',
    points: ['Odpovědi & poptávky', 'Rezervace & informace', 'Předání člověku'],
    href: '/virtualni-asistenti',
  },
] as const;

export default function PillarPanels() {
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
      {PILLARS.map((p, i) => (
        <motion.div
          key={p.n}
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.75, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href={p.href}
            className="group relative block h-full overflow-hidden border border-panel-edge bg-panel p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] sm:p-10 lg:p-12"
          >
            {/* Hlavička — label vlevo, číslo vpravo v toku dokumentu.
                Žádná absolutní pozice → číslo nikdy nepřekryje titulek. */}
            <div className="flex items-start justify-between gap-4">
              <p className="pt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
                {p.label}
              </p>
              <span
                aria-hidden="true"
                className="text-[3.4rem] font-semibold leading-[0.85] tracking-[-0.04em] text-accent sm:text-[4.5rem]"
              >
                {p.n}
              </span>
            </div>

            <h3 className="mt-6 text-[clamp(1.7rem,3vw,2.6rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
              {p.title}
            </h3>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted sm:text-base">
              {p.claim}
            </p>

            {/* Hover reveal — detaily */}
            <div className="mt-8 grid grid-rows-[0fr] overflow-hidden transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr]">
              <ul className="min-h-0">
                {p.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2.5 border-t border-border py-2.5 text-[13px] font-medium text-ink-2"
                  >
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <span className="mt-8 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-200 group-hover:text-accent">
              Projít detail
              <Icon
                name="arrow-right"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>

            {/* Lime edge při hoveru */}
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent transition-[width] duration-300 group-hover:w-full"
            />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
