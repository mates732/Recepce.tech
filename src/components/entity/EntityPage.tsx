'use client';

import Link from 'next/link';
import { Entity, EntityType } from '../../types/graph';
import { getRelationshipsFrom, relationshipContext, ENTITY_TYPE_LABELS } from '../../lib/graph';
import Reveal from '@/components/shared/Reveal';
import RevealSequence from '@/components/shared/RevealSequence';
import Index from '@/components/shared/Index';

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-8 md:px-16 lg:px-24 ${className}`}>
      {children}
    </div>
  );
}

function Relationships({ entityId }: { entityId: string }) {
  const entity = getRelationshipsFrom(entityId)[0]?.source;
  if (!entity) return null;

  const relationships = getRelationshipsFrom(entityId);
  if (relationships.length === 0) return null;

  const narratives = relationships
    .map((rel) => relationshipContext(entity, rel))
    .filter((n): n is { narrative: string; other: Entity } => n !== null);

  if (narratives.length === 0) return null;

  return (
    <Section className="flex min-h-[30vh] items-center">
      <div className="max-w-xl">
        <RevealSequence staggerDelay={250} delayChildren={250}>
          {narratives.map(({ narrative, other }) => (
            <Link
              key={other.id}
              href={`/${other.slug}`}
              className="group block"
            >
              <p className="text-sm font-light leading-[1.7] text-black transition-colors duration-700 group-hover:text-black">
                {narrative}
              </p>
              <p className="mt-1 text-base font-light text-black transition-colors duration-700 group-hover:text-black">
                {other.title}
              </p>
            </Link>
          ))}
        </RevealSequence>
      </div>
    </Section>
  );
}

function QuestionPage({ entity }: { entity: Entity }) {
  return (
    <main className="min-h-screen">
      <section className="flex h-screen items-center justify-center">
        <div className="max-w-3xl px-8 text-center" style={{ marginTop: '-4vh' }}>
          <Reveal spring>
            <h1 className="text-5xl font-light tracking-[-0.01em] text-black md:text-7xl" style={{ lineHeight: 1.1 }}>
              {entity.title}
            </h1>
          </Reveal>
        </div>
      </section>
      {entity.summary && (
        <Section className="flex min-h-[50vh] items-center">
          <div className="max-w-xl">
            <Reveal delay={250}>
              <p className="text-base font-light leading-[1.8] text-black">{entity.summary}</p>
            </Reveal>
          </div>
        </Section>
      )}
      <Relationships entityId={entity.id} />
      <ReturnHome />
    </main>
  );
}

function ObservationPage({ entity }: { entity: Entity }) {
  return (
    <main className="min-h-screen">
      <Section className="flex min-h-[70vh] items-center pt-32">
        <div className="max-w-xl">
          <Reveal delay={0}>
            <p className="mb-10 text-[10px] font-light uppercase tracking-[0.3em] text-black">{ENTITY_TYPE_LABELS[entity.type]}</p>
          </Reveal>
          <Reveal delay={250}>
            <h1 className="mb-12 text-3xl font-light leading-[1.2] text-black md:text-4xl">{entity.title}</h1>
          </Reveal>
          {entity.body ? (
            <RevealSequence staggerDelay={350} delayChildren={350}>
              {entity.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </RevealSequence>
          ) : (
            <Reveal delay={350}>
              <p className="text-base font-light leading-[1.8] text-black">{entity.summary}</p>
            </Reveal>
          )}
        </div>
      </Section>
      <Relationships entityId={entity.id} />
      <ReturnHome />
    </main>
  );
}

function ExperimentPage({ entity }: { entity: Entity }) {
  return (
    <main className="min-h-screen">
      <Section className="flex min-h-[70vh] items-center pt-32">
        <div className="max-w-xl">
          <Reveal delay={0}>
            <p className="mb-10 text-[10px] font-light uppercase tracking-[0.3em] text-black">{ENTITY_TYPE_LABELS[entity.type]}</p>
          </Reveal>
          <Reveal delay={250}>
            <h1 className="mb-12 text-3xl font-light leading-[1.2] text-black md:text-4xl">{entity.title}</h1>
          </Reveal>
          {entity.body ? (
            <RevealSequence staggerDelay={350} delayChildren={350}>
              {entity.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </RevealSequence>
          ) : (
            <Reveal delay={350}>
              <p className="text-base font-light leading-[1.8] text-black">{entity.summary}</p>
            </Reveal>
          )}
        </div>
      </Section>
      <Relationships entityId={entity.id} />
      <ReturnHome />
    </main>
  );
}

function SystemPage({ entity }: { entity: Entity }) {
  return (
    <main className="min-h-screen">
      <Section className="flex min-h-[70vh] items-center pt-32">
        <div className="max-w-xl">
          <Reveal delay={0}>
            <p className="mb-10 text-[10px] font-light uppercase tracking-[0.3em] text-black">{ENTITY_TYPE_LABELS[entity.type]}</p>
          </Reveal>
          <Reveal delay={250}>
            <h1 className="mb-12 text-3xl font-light leading-[1.2] text-black md:text-4xl">{entity.title}</h1>
          </Reveal>
          {entity.body ? (
            <RevealSequence staggerDelay={350} delayChildren={350}>
              {entity.body.map((line, i) => (
                <p key={i} className="text-base font-light leading-[1.8] text-black">{line}</p>
              ))}
            </RevealSequence>
          ) : (
            <Reveal delay={350}>
              <p className="text-base font-light leading-[1.8] text-black">{entity.summary}</p>
            </Reveal>
          )}
        </div>
      </Section>
      <Relationships entityId={entity.id} />
      {entity.nextQuestion && (
        <Section className="flex min-h-[40vh] items-center">
          <div className="max-w-xl">
            <Reveal delay={0}>
              <p className="mb-10 text-[10px] font-light uppercase tracking-[0.3em] text-black">Next question</p>
            </Reveal>
            <Reveal delay={250}>
              <p className="text-2xl font-light leading-[1.3] text-black md:text-3xl">{entity.nextQuestion}</p>
            </Reveal>
          </div>
        </Section>
      )}
      <ReturnHome />
    </main>
  );
}

function DefaultPage({ entity }: { entity: Entity }) {
  return (
    <main className="min-h-screen">
      <Section className="flex min-h-[70vh] items-center pt-32">
        <div className="max-w-xl">
          <Reveal delay={0}>
            <p className="mb-10 text-[10px] font-light uppercase tracking-[0.3em] text-black">{ENTITY_TYPE_LABELS[entity.type]}</p>
          </Reveal>
          <Reveal delay={250}>
            <h1 className="mb-12 text-3xl font-light leading-[1.2] text-black md:text-4xl">{entity.title}</h1>
          </Reveal>
          <Reveal delay={350}>
            <p className="text-base font-light leading-[1.8] text-black">{entity.summary}</p>
          </Reveal>
          {entity.body && (
            <div className="mt-12">
              <RevealSequence staggerDelay={350}>
                {entity.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </RevealSequence>
            </div>
          )}
        </div>
      </Section>
      <Relationships entityId={entity.id} />
      <ReturnHome />
    </main>
  );
}

function ReturnHome() {
  return (
    <Section className="flex min-h-[40vh] items-center">
      <Reveal>
        <Link href="/" className="text-[11px] font-light uppercase tracking-[0.25em] text-black transition-colors duration-700 hover:text-black">
          Mindspace
        </Link>
      </Reveal>
    </Section>
  );
}

const renderers: Record<EntityType, React.ComponentType<{ entity: Entity }>> = {
  question: QuestionPage,
  observation: ObservationPage,
  experiment: ExperimentPage,
  system: SystemPage,
  project: DefaultPage,
  technology: DefaultPage,
  article: DefaultPage,
  insight: DefaultPage,
  failure: DefaultPage,
  principle: DefaultPage,
  person: DefaultPage,
  tool: DefaultPage,
  decision: DefaultPage,
  pattern: DefaultPage,
};

export default function EntityPage({ entity }: { entity: Entity }) {
  const Renderer = renderers[entity.type] ?? DefaultPage;
  return (
    <>
      <Index n={1} label={`Entity: ${entity.title}`} />
      <Renderer entity={entity} />
    </>
  );
}