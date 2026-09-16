'use client';

import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/shared/SectionHeading';
import WebyConceptPreview from '@/components/home/WebyConceptPreview';
import WebyRealShowcase from '@/components/home/WebyRealShowcase';
import {
  WEBY_FEATURED_PROJECTS,
  WEBY_PROJECTS,
  type WebyProject,
} from '@/data/weby-projects';

function ProjectBlock({
  project,
  index,
  total,
}: {
  project: WebyProject;
  index: number;
  total: number;
}) {
  const flipped = index % 2 === 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14"
    >
      {/* Metadata */}
      <div className={flipped ? 'lg:order-2 lg:col-span-5' : 'lg:col-span-5'}>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-faint">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <span className="h-px w-10 bg-border-strong" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
            {project.type}
          </span>
        </div>

        <h3 className="text-balance mt-4 text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
          {project.name}
        </h3>

        <p className="mt-3 text-sm font-medium text-muted">{project.category}</p>

        <p className="mt-5 text-base leading-relaxed text-muted">{project.description}</p>

        <ul className="mt-6 space-y-2.5">
          <li className="flex items-start gap-2.5 text-sm text-ink-2">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            Struktura a obsah šité na typ provozu
          </li>
          <li className="flex items-start gap-2.5 text-sm text-ink-2">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            Rezervace / objednání na přehledném místě
          </li>
          <li className="flex items-start gap-2.5 text-sm text-ink-2">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            Postaveno a nasazeno jako reálný web
          </li>
        </ul>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-200 hover:text-accent"
          >
            Otevřít koncept ↗
          </a>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-faint" />
            Koncept · není zakázka
          </span>
        </div>
      </div>

      {/* Large editorial preview — link to live concept */}
      <div className={flipped ? 'lg:order-1 lg:col-span-7' : 'lg:col-span-7'}>
        <WebyConceptPreview project={project} />
      </div>
    </motion.article>
  );
}

export default function WebWebyPortfolio() {
  return (
    <section id="prace" className="scroll-mt-20 border-y border-border bg-surface py-20 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Vybrané projekty"
          title="Co jsem postavil."
          description="Skutečný web pro klienta i ukázkový koncept postavený od nuly. U konceptu si představte na jeho místě svůj podnik."
          align="left"
        />

        {/* Real completed work first — case-study treatment */}
        {WEBY_FEATURED_PROJECTS.length > 0 && (
          <div className="mt-16 lg:mt-20">
            {WEBY_FEATURED_PROJECTS.map((project) => (
              <WebyRealShowcase key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Info o konceptu — až nad samotným konceptem, nikdy nad zakázku */}
        <div className={WEBY_FEATURED_PROJECTS.length > 0 ? 'mt-20 lg:mt-28' : 'mt-16 lg:mt-20'}>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-faint">
              Ukázkový koncept
            </span>
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-faint">
            Níže je ukázkový koncept — navržený a postavený jako reálný web,
            který běží na vlastní adrese. Ne zákázka od klienta.
          </p>
        </div>

        {/* Editorial concept blocks */}
        <div className="mt-12 space-y-20 lg:mt-14 lg:space-y-28">
          {WEBY_PROJECTS.map((project, index) => (
            <ProjectBlock
              key={project.id}
              project={project}
              index={index}
              total={WEBY_PROJECTS.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
