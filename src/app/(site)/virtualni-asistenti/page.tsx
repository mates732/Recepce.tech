import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/shared/Icon';
import HeroVirtualniAsistenti from '@/components/home/HeroVirtualniAsistenti';
import { CoJeZmena } from '@/components/home/CoJeZmena';
import TrustStrip from '@/components/home/TrustStrip';
import CoPrebira from '@/components/home/CoPrebira';
import HowItWorks from '@/components/home/HowItWorks';
import Nasazeni from '@/components/home/Nasazeni';
import Benefits from '@/components/home/Benefits';
import FinalCtaAsistenti from '@/components/home/FinalCtaAsistenti';

export const metadata: Metadata = {
  title: 'Virtuální asistenti | Recepce.tech',
  description:
    'Virtuální asistent přijímá hovory, řeší běžné dotazy i složitější úkony a podle nastavení pomáhá s rezervacemi. Složitější situace předává člověku.',
};

export default function VirtualniAsistentiPage() {
  return (
    <>
      <HeroVirtualniAsistenti />
      <section id="co-je">
        <CoJeZmena />
      </section>
      <TrustStrip />
      <section id="jak-to-funguje">
        <HowItWorks />
      </section>
      <CoPrebira />
      <Nasazeni />
      <Benefits />
      <FinalCtaAsistenti />

      {/* Redirect na samostatnou demo stránku */}
      <section className="border-t border-border bg-surface py-16 lg:py-20">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-8 px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
              Demo
            </p>
            <h2 className="text-balance mt-3 text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">
              Nechte si to ukázat naživo.
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
              Skutečné konverzace, které asistent zvládne sám — rezervace,
              změna objednávky, dotazy na provoz i předání člověku.
            </p>
          </div>
          <Link
            href="/demo"
            className="group inline-flex h-12 shrink-0 items-center gap-2.5 bg-accent px-7 text-[13px] font-semibold uppercase tracking-[0.1em] text-accent-bright transition-colors duration-200 hover:bg-accent-hover"
          >
            VYZKOUŠET DEMO
            <Icon
              name="arrow-right"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    </>
  );
}
