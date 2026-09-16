'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Reveal from './Reveal';
import RevealSequence from './RevealSequence';
import { easeOut, SMALL_MOVE } from '@/lib/animations';

interface SectionProps {
  children: ReactNode;
  className?: string;
}

function Section({ children, className = '' }: SectionProps) {
  return (
    <div className={`px-8 md:px-16 lg:px-24 ${className}`}>
      {children}
    </div>
  );
}

interface NarrativeSectionProps {
  label: string;
  paragraphs: string[];
  className?: string;
}

function NarrativeSection({ label, paragraphs, className = '' }: NarrativeSectionProps) {
  return (
    <Section className={`flex min-h-[70vh] items-center ${className}`}>
      <div className="max-w-xl">
        <Reveal delay={0}>
          <p className="mb-10 text-[10px] font-light uppercase tracking-[0.3em] text-black">
            {label}
          </p>
        </Reveal>
        <RevealSequence staggerDelay={350} delayChildren={250}>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-base font-light leading-[1.8] text-black">
              {p}
            </p>
          ))}
        </RevealSequence>
      </div>
    </Section>
  );
}

interface SystemTemplateProps {
  question: {
    title: string;
  };
  observation: {
    paragraphs: string[];
  };
  experiment: {
    paragraphs: string[];
  };
  system: {
    features: string[];
    body?: string[];
  };
  nextQuestion: {
    title: string;
  };
  returnHref?: string;
  returnLabel?: string;
}

export default function SystemTemplate({
  question,
  observation,
  experiment,
  system,
  nextQuestion,
  returnHref = '/',
  returnLabel = 'Mindspace',
}: SystemTemplateProps) {
  return (
    <main className="min-h-screen">
      {/* ── The Question ── */}
      <section className="flex h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: SMALL_MOVE }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.3, ease: easeOut }}
          className="max-w-3xl px-8 text-center"
          style={{ marginTop: '-4vh' }}
        >
          <h1
            className="text-5xl font-light tracking-[-0.01em] text-black md:text-7xl"
            style={{ lineHeight: 1.1 }}
          >
            {question.title}
          </h1>
        </motion.div>
      </section>

      {/* ── The Observation ── */}
      <NarrativeSection label="Observation" paragraphs={observation.paragraphs} />

      <Section>
        <div className="mx-auto max-w-xl">
          <div className="h-[1px] bg-black/[0.06]" />
        </div>
      </Section>

      {/* ── The Experiment ── */}
      <NarrativeSection label="Experiment" paragraphs={experiment.paragraphs} />

      <Section>
        <div className="mx-auto max-w-xl">
          <div className="h-[1px] bg-black/[0.06]" />
        </div>
      </Section>

      {/* ── The System ── */}
      <Section className="flex min-h-[60vh] items-center">
        <div className="max-w-xl">
          <Reveal delay={0}>
            <p className="mb-10 text-[10px] font-light uppercase tracking-[0.3em] text-black">
              System
            </p>
          </Reveal>
          <RevealSequence staggerDelay={350} delayChildren={250}>
            {system.body?.map((line, i) => (
              <p key={`body-${i}`} className="text-base font-light leading-[1.8] text-black">
                {line}
              </p>
            ))}
            {system.features.map((feature, i) => (
              <p key={`feat-${i}`} className="text-sm font-light text-black">
                {feature}
              </p>
            ))}
          </RevealSequence>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-xl">
          <div className="h-[1px] bg-black/[0.06]" />
        </div>
      </Section>

      {/* ── The Next Question ── */}
      <Section className="flex min-h-[50vh] items-center">
        <div className="max-w-xl">
          <Reveal delay={0}>
            <p className="mb-10 text-[10px] font-light uppercase tracking-[0.3em] text-black">
              Next question
            </p>
          </Reveal>
          <Reveal delay={250}>
            <p className="text-2xl font-light leading-[1.3] text-black md:text-3xl">
              {nextQuestion.title}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ── Return ── */}
      <Section className="flex min-h-[40vh] items-center">
        <Reveal delay={0}>
          <Link
            href={returnHref}
            className="text-[11px] font-light uppercase tracking-[0.25em] text-black transition-colors duration-700 hover:text-black"
          >
            {returnLabel}
          </Link>
        </Reveal>
      </Section>
    </main>
  );
}

import type { ReactNode } from 'react';