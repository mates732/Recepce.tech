import Image from 'next/image';
import { Icon } from '@/components/shared/Icon';
import type { WebyFeaturedProject } from '@/data/weby-projects';

/**
 * Editorial prezentace skutečného hotového webu — case study, ne karta v gridu.
 * Žádná rekonstrukce webu: buď skutečný snímek obrazovky (previewImage),
 * nebo upravený typografický panel s vyhrazeným místem pro snímek.
 *
 * Snímek se nikdy neocrává — ráfek je vyšší než snímek a s object-contain,
 * takže je vždy vidět celý zachycený stav stránky (hlavička, hlavní fotka
 * i nadpis). Vyšší snímek se vejde bez změny kódu.
 */

/** Rám náhledu: 1440/1120 ≈ výšší viewport, object-contain = žádné oříznutí. */
const PREVIEW_ASPECT = 'aspect-[1440/1120]';

function BrowserChrome({ project }: { project: WebyFeaturedProject }) {
  return (
    <div className="flex items-center gap-2 border-b border-border bg-surface-muted/80 px-4 py-2.5">
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-panel-edge" />
        <span className="h-2.5 w-2.5 rounded-full bg-panel-edge" />
        <span className="h-2.5 w-2.5 rounded-full bg-panel-edge" />
      </div>
      <div className="ml-1 flex min-w-0 flex-1 items-center gap-2">
        <span className="h-3.5 w-3.5 shrink-0 rounded-full" style={{ background: `${project.accent}33` }} />
        <span className="truncate text-[11px] font-medium text-ink">{project.domain}</span>
        <span className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border border-accent/25 bg-accent-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Živý web
        </span>
      </div>
    </div>
  );
}

export default function WebyRealShowcase({ project }: { project: WebyFeaturedProject }) {
  return (
    <article className="relative">
      {/* Oversized project number — decorative, desktop only */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-0 z-0 hidden select-none text-[9rem] font-semibold leading-none tracking-[-0.06em] text-ink/[0.05] lg:block"
      >
        01
      </span>

      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Metadata */}
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-faint">
              01 / 01
            </span>
            <span className="h-px w-10 bg-border-strong" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
              {project.type}
            </span>
          </div>

          <h3 className="text-balance mt-4 text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
            {project.name}
          </h3>

          <p className="mt-3 text-sm font-medium text-muted">{project.category}</p>

          {/* Domain row — subtle, factual */}
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="group mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-ink transition-colors duration-200 hover:border-accent/40"
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: project.accent }} />
            {project.domain}
            <Icon
              name="arrow-right"
              className="h-3 w-3 text-faint transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </a>

          <p className="mt-6 text-base leading-relaxed text-muted">{project.description}</p>

          {/* Craft points */}
          <div className="mt-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
              Co jsem řešil
            </p>
            <ul className="mt-4 space-y-2.5">
              {project.craftPoints.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-2">
                  <span
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: project.accent }}
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA — real live website */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-accent px-7 text-[15px] font-medium text-accent-bright shadow-sm transition-colors duration-200 hover:bg-accent-hover"
            >
              PROHLÉDNOUT WEB
              <Icon name="arrow-right" className="h-4 w-4" />
            </a>
            <span className="text-xs leading-relaxed text-faint">
              Živý web — otevře se v nové kartě
            </span>
          </div>
        </div>

        {/* Preview — real screenshot, or a reserved slot for it */}
        <div className="relative lg:col-span-7">
          {/* Offset tint block derived from the project's own palette */}
          <div
            aria-hidden="true"
            className="absolute -inset-x-4 -inset-y-5 rounded-[2rem] opacity-[0.08] sm:-inset-x-6 sm:-inset-y-7"
            style={{ background: project.accent }}
          />

          {project.previewImage ? (
            /* Celý náhled je klikatelný a vede na živý web (nová karta). */
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.name} — otevřít živý web v nové kartě`}
              className="group relative block overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_18px_50px_-22px_rgba(23,23,22,0.2)] transition-shadow duration-200 hover:shadow-[0_28px_64px_-24px_rgba(23,23,22,0.3)]"
            >
              <BrowserChrome project={project} />

              {/* Snímek bez oříznutí — vždy vidět celý zachycený stav stránky */}
              <div className={`relative ${PREVIEW_ASPECT} w-full bg-surface-muted`}>
                <Image
                  src={project.previewImage}
                  alt={`Snímek webu ${project.name}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-contain object-top"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-panel/0 transition-colors duration-200 group-hover:bg-panel/[0.03]"
                />
                <span className="pointer-events-none absolute bottom-3 right-3 hidden items-center gap-1.5 rounded-full bg-panel/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:inline-flex">
                  Otevřít web
                  <Icon name="arrow-right" className="h-3 w-3" />
                </span>
              </div>
            </a>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_18px_50px_-22px_rgba(23,23,22,0.2)]">
              <BrowserChrome project={project} />

              {/* Vyhrazené místo pro skutečný snímek — bez klikacího překryvu */}
              <div className="relative aspect-[16/10] w-full">
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
                  style={{
                    background: `linear-gradient(150deg, ${project.accent}0F 0%, ${project.accent}05 100%)`,
                  }}
                >
                  {/* Subtle background grid */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(23,23,22,0.05)_1px,transparent_0)] [background-size:24px_24px]"
                  />
                  <p className="relative text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: project.accent }}>
                    Jezdecká škola · Praha
                  </p>
                  <p className="relative mt-3 text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
                    {project.domain}
                  </p>
                  <span aria-hidden="true" className="relative mt-5 h-px w-16" style={{ background: `${project.accent}55` }} />
                  <p className="relative mt-5 max-w-xs text-xs leading-relaxed text-faint">
                    Snímek webu se doplňuje — mezitím se podívejte přímo na{' '}
                    <a href={project.url} target="_blank" rel="noreferrer" className="font-medium text-ink underline decoration-border-strong underline-offset-2 hover:decoration-accent">
                      {project.domain}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
