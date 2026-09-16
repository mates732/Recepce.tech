'use client';

import Reveal from './Reveal';

const STEPS = [
  { label: 'Question' },
  { label: 'Observation' },
  { label: 'Experiment' },
  { label: 'System' },
  { label: 'New Question' },
];

export default function TransformationModel() {
  return (
    <div className="flex flex-col items-center">
      {STEPS.map((step, i) => (
        <div key={step.label} className="flex flex-col items-center">
          <Reveal delay={i * 250} spring>
            <span className="text-sm md:text-base font-light tracking-wide text-black">
              {step.label}
            </span>
          </Reveal>
          {i < STEPS.length - 1 && (
            <Reveal delay={i * 250 + 150}>
              <span className="my-4 text-xs text-black/[0.08]">↓</span>
            </Reveal>
          )}
        </div>
      ))}
    </div>
  );
}