'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getEntityBySlug } from '@/lib/graph';
import Index from './Index';

interface ChainStep {
  type: string;
  title: string;
  slug: string;
}

interface Props {
  steps: ChainStep[];
}

function ChainStepRow({ step, index, isLast }: { step: ChainStep; index: number; isLast: boolean }) {
  const [open, setOpen] = useState(false);
  const entity = getEntityBySlug(step.slug);

  return (
    <div>
      <Index n={`4.${index + 2}`} label={`Chain: ${step.type}`} />
      <div className="group">
        <div className="flex items-center gap-4 py-1">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-4 flex-1 text-left"
          >
            <span className="text-xs font-mono uppercase tracking-wider text-black shrink-0 w-24">
              {step.type}
            </span>
            <span className="h-px flex-1 bg-black/[0.06] group-hover:bg-black/[0.12] transition-colors duration-300" />
            <span className="text-sm font-light text-black group-hover:text-black transition-colors duration-300 flex items-center gap-2">
              {step.title}
              <span className="text-xs text-black/[0.3] transition-transform duration-300">
                {open ? '▾' : '▸'}
              </span>
            </span>
          </button>
        </div>

        <AnimatePresence>
          {open && entity && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="pl-28 pr-4 py-3">
                <p className="text-xs font-light text-black/[0.6] leading-relaxed mb-2">
                  {entity.summary}
                </p>
                <Link
                  href={`/${step.slug}`}
                  className="text-[10px] font-light uppercase tracking-wider text-black hover:text-black transition-colors duration-300"
                >
                  Full entry →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isLast && (
          <div className="flex pl-28">
            <span className="text-xs text-black/[0.06]">↓</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChainPreview({ steps }: Props) {
  if (steps.length < 2) return null;

  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <ChainStepRow key={step.slug} step={step} index={i} isLast={i === steps.length - 1} />
      ))}
    </div>
  );
}