'use client';

import type { ProductMode } from '@/lib/productStore';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TransitionSection } from '@/components/home/Transitions';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Icon } from '@/components/shared/Icon';

interface Option {
  mode: ProductMode;
  href: string;
  label: string;
  description: string;
  icon: 'phone' | 'globe';
}

const OPTIONS: Option[] = [
  {
    mode: 'asistenti',
    href: '/virtualni-asistenti',
    label: 'VIRTUÁLNÍ ASISTENT',
    description:
      'Chcete automatizovat komunikaci se zákazníky — zvednout telefony, rezervovat termíny, odpovídat na dotazy i mimo pracovní dobu.',
    icon: 'phone',
  },
  {
    mode: 'weby',
    href: '/weby',
    label: 'NOVÝ WEB',
    description:
      'Chcete lepší web a online prezentaci — design, který vaši firmu dobře reprezentuje a přivádí zákazníky.',
    icon: 'globe',
  },
];

function OptionCard({ option }: { option: Option }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative min-w-0"
    >
      <Link
        href={option.href}
        className="relative flex h-full flex-col rounded-2xl border border-border bg-surface p-8 transition-all duration-200 hover:border-border-strong hover:shadow-[0_16px_40px_-20px_rgba(23,23,22,0.18)]"
        aria-label={`Zvolit: ${option.label}`}
      >
        {/* subtle top accent */}
        <span
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-muted text-[11px] font-semibold uppercase tracking-[0.14em] text-faint transition-colors duration-200 group-hover:text-muted"
          aria-hidden="true"
        >
          Přepnout
        </span>

        <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Icon name={option.icon} className="h-5 w-5" />
        </span>

        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          {option.label}
        </p>

        <p className="text-base leading-relaxed text-ink">{option.description}</p>

        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
          Vybrat
          <Icon name="arrow-right" className="h-4 w-4" />
        </span>
      </Link>
    </motion.div>
  );
}

export default function CoPotrebujete() {
  return (
    <section style={{ color: 'var(--color-ink)', background: 'var(--color-surface)' }}>
      <TransitionSection>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 20px' }}>
          <SectionHeading
            eyebrow="00. co potřebujete vyřešit?"
            title="Co je vaše priorita?"
            description="Nebo chcete virtuálního asistenta. Nebo nový web. Obě služby jsou součástí téže značky."
            align="center"
            size="display"
          />
        </div>
      </TransitionSection>

      <TransitionSection className="max-w-[1000px] mx-auto px-5 pb-20">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {OPTIONS.map((option) => (
            <OptionCard key={option.mode} option={option} />
          ))}
        </div>
      </TransitionSection>
    </section>
  );
}
