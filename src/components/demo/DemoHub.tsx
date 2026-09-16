'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal from '@/components/home/Reveal';
import { Icon } from '@/components/shared/Icon';
import VapiCallButton from '@/components/demo/VapiCallButton';

interface DemoProject {
  id: string;
  number: string;
  client: string;
  type: string;
  location: string;
  headline: string;
  description: string;
  suggestionMode: 'inspiration';
  suggestions: string[];
  problems: { id: string; title: string; detail: string }[];
}

const DEMO_PROJECTS: DemoProject[] = [
  {
    id: 'atombike',
    number: '01',
    client: 'Atombike Cycle Hospital',
    type: 'Voice Assistant',
    location: 'Praha 6',
    headline: 'Promluvte si s asistentem.',
    description:
      'Pro Atombike jsme připravili hlasového asistenta pro první kontakt se zákazníkem.',
    suggestionMode: 'inspiration',
    suggestions: [
      'Potřebuju servis kola.',
      'Chci si půjčit kolo.',
      'Máte Trek v L?',
      'Potřebuju přívěs na víkend.',
    ],
    problems: [
      {
        id: 'servis',
        title: 'Servis',
        detail: 'Zákazník může popsat, co potřebuje se svým kolem.',
      },
      {
        id: 'pujcovna',
        title: 'Půjčovna',
        detail: 'Asistent pomáhá s dotazy na půjčení kol.',
      },
      {
        id: 'privesy',
        title: 'Přívěsy',
        detail: 'Řeší základní požadavky kolem půjčovny přívěsů.',
      },
      {
        id: 'skladovost',
        title: 'Skladovost',
        detail: 'Pomáhá zjistit dostupnost konkrétního zboží.',
      },
      {
        id: 'vyzvednuti',
        title: 'Vyzvednutí',
        detail: 'Pomáhá se zorientovat v možnostech vyzvednutí na prodejně.',
      },
    ],
  },
  {
    id: 'noname-barbershop',
    number: '02',
    client: 'NoName Barbershop',
    type: 'Virtuální recepce',
    location: 'Praha',
    headline: 'Virtuální recepce',
    description:
      'Virtuální asistent pro barbershop, který zákazníkům pomáhá s výběrem služby, barberem, cenou a rezervací termínu.',
    suggestionMode: 'inspiration',
    suggestions: [
      'Potřebuju střih na pátek večer.',
      'Který barber má volno zítra?',
      'Kolik stojí skin fade?',
      'Máte volný termín po 17:00?',
    ],
    problems: [
      {
        id: 'vyber-sluzby',
        title: 'Výběr služby',
        detail: 'Asistent pomáhá zvolit vhodný typ střihu nebo úpravy vousů.',
      },
      {
        id: 'vyber-barbera',
        title: 'Výběr barbera',
        detail: 'Zákazník se rychle zorientuje, který barber je vhodný.',
      },
      {
        id: 'ceny',
        title: 'Cena',
        detail: 'Asistent poskytne základní orientaci v ceně služeb.',
      },
      {
        id: 'rezervace',
        title: 'Rezervace termínu',
        detail: 'Asistent pomůže s rezervací termínu podle preferencí zákazníka.',
      },
    ],
  },
  {
    id: 'paws-and-care',
    number: '03',
    client: 'Paws & Care',
    type: 'Virtuální recepce',
    location: 'Praha',
    headline: 'Virtuální recepce',
    description:
      'Virtuální asistent pro Paws & Care, který pomáhá zákazníkům s běžnými dotazy a provází je výběrem služeb a dalšími kroky.',
    suggestionMode: 'inspiration',
    suggestions: [
      'Jaké služby nabízíte?',
      'Potřebuju poradit s výběrem služby.',
      'Jaký je další krok?',
      'Můžu se rovnou objednat?',
    ],
    problems: [
      {
        id: 'bezne-dotazy',
        title: 'Běžné dotazy',
        detail: 'Asistent pomáhá zákazníkům s běžnými dotazy.',
      },
      {
        id: 'vyber-sluzeb',
        title: 'Výběr služeb',
        detail: 'Asistent provází zákazníka výběrem vhodné služby.',
      },
      {
        id: 'dalsi-kroky',
        title: 'Další kroky',
        detail: 'Asistent vysvětlí navazující kroky v komunikaci.',
      },
    ],
  },
];

function DemoSelector({
  projects,
  selected,
  onSelect,
}: {
  projects: DemoProject[];
  selected: DemoProject;
  onSelect: (project: DemoProject) => void;
}) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(
    projects.findIndex((project) => project.id === selected.id),
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const listId = useId();
  const selectedIndex = useMemo(
    () => projects.findIndex((project) => project.id === selected.id),
    [projects, selected.id],
  );

  const close = useCallback(() => {
    setOpen(false);
    setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    triggerRef.current?.focus();
  }, [selectedIndex]);

  const openAndFocus = useCallback(() => {
    setOpen(true);
    setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [selectedIndex]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const node = event.target as Node;
      if (!containerRef.current?.contains(node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    optionRefs.current[focusedIndex]?.focus();
  }, [open, focusedIndex]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setFocusedIndex((current) =>
          current >= projects.length - 1 ? 0 : current + 1,
        );
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setFocusedIndex((current) =>
          current <= 0 ? projects.length - 1 : current - 1,
        );
        return;
      }

      if (event.key === 'Home') {
        event.preventDefault();
        setFocusedIndex(0);
        return;
      }

      if (event.key === 'End') {
        event.preventDefault();
        setFocusedIndex(projects.length - 1);
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const project = projects[focusedIndex];
        if (!project) return;
        onSelect(project);
        setOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [close, focusedIndex, onSelect, open, projects]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? close() : openAndFocus())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openAndFocus();
          }
        }}
        className="group w-full rounded-2xl border border-border bg-surface px-5 py-4 text-left shadow-[0_18px_50px_-34px_rgba(23,23,22,0.24)] transition-colors duration-200 hover:border-border-strong focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
              Vyberte demo
            </p>
            <p className="mt-1 truncate text-base font-semibold text-ink sm:text-lg">
              {selected.client}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted sm:text-sm">
              {selected.type} · {selected.location}
            </p>
          </div>
          <motion.span
            animate={{ rotate: open ? 180 : 0, y: open ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-muted"
            aria-hidden="true"
          >
            <Icon name="arrow-right" className="h-5 w-5 rotate-90" />
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={listId}
            role="listbox"
            aria-label="Seznam dostupných dem"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-0 z-40 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-surface p-1.5 shadow-[0_18px_50px_-30px_rgba(23,23,22,0.28)]"
          >
            {projects.map((project, index) => {
              const isActive = project.id === selected.id;
              return (
                <button
                  key={project.id}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    onSelect(project);
                    setOpen(false);
                  }}
                  tabIndex={-1}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
                    isActive
                      ? 'bg-accent-soft'
                      : 'hover:bg-surface-muted'
                  }`}
                >
                  <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                    {project.number}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink sm:text-base">
                      {project.client}
                    </span>
                    <span className="block truncate text-xs text-muted sm:text-sm">
                      {project.type}
                    </span>
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProblemList({ items }: { items: DemoProject['problems'] }) {
  return (
    <div className="mt-8 rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
        Co jsme řešili
      </h3>
      <div className="mt-3 divide-y divide-border">
        {items.map((item, index) => (
          <div key={item.id} className="group py-3 first:pt-1">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink sm:text-base">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted transition-colors duration-200 group-hover:text-ink-2">
                  {item.detail}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DemoPanel({ project }: { project: DemoProject }) {
  return (
    <motion.article
      key={project.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      className="mt-7 grid gap-5 lg:mt-8 lg:grid-cols-12"
    >
      <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7 lg:col-span-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
          Case study / {project.number}
        </p>

        <h2 className="mt-4 text-balance text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-ink">
          {project.client}
        </h2>

        <p className="mt-4 text-xl leading-tight tracking-[-0.02em] text-ink-2 sm:text-2xl">
          {project.headline}
        </p>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          {project.description}
        </p>

        <ProblemList items={project.problems} />
      </section>
    </motion.article>
  );
}

export default function DemoHub() {
  const [activeProjectId, setActiveProjectId] = useState(DEMO_PROJECTS[0]?.id ?? '');

  const activeProject = useMemo(() => {
    return DEMO_PROJECTS.find((project) => project.id === activeProjectId) ?? DEMO_PROJECTS[0];
  }, [activeProjectId]);

  if (!activeProject) return null;

  return (
    <>
      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-6 pb-10 pt-12 sm:pb-12 lg:px-8 lg:pt-16">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-faint">Demo lab</p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-5 max-w-4xl text-balance text-[clamp(2.1rem,5.6vw,4.2rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink">
              Vyzkoušejte si, co jsme postavili.
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Skutečné projekty. Skutečná dema. Vyberte si projekt a podívejte se,
              jak může vypadat digitální asistent v reálném provozu.
            </p>
          </Reveal>

          <Reveal delay={0.18} className="mt-8">
            <DemoSelector
              projects={DEMO_PROJECTS}
              selected={activeProject}
              onSelect={(project) => setActiveProjectId(project.id)}
            />
            <VapiCallButton slug={activeProject.id} assistantName={activeProject.client} />
          </Reveal>

          <AnimatePresence mode="wait" initial={false}>
            <DemoPanel key={activeProject.id} project={activeProject} />
          </AnimatePresence>

          {DEMO_PROJECTS.length <= 1 && (
            <p className="mt-7 text-sm text-faint">Další dema připravujeme.</p>
          )}
        </div>
      </section>
    </>
  );
}
