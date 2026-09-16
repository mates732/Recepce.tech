import Link from 'next/link';
import Index from './Index';

interface FocusItem {
  title: string;
  summary: string;
  slug: string;
  status?: string;
  statusLabel?: string;
}

interface Props {
  activeQuestion?: FocusItem;
  runningExperiment?: FocusItem;
  latestChange?: FocusItem;
  nextQuestion?: FocusItem;
  newestObservation?: FocusItem;
  nextMilestone?: FocusItem;
  variant?: 'grid' | 'narrative';
}

function FocusEntry({ item, label }: { item: FocusItem; label: string }) {
  return (
    <Link href={`/${item.slug}`} className="group block">
      <p className="text-xs font-light uppercase tracking-widest text-black mb-2">
        {label}
      </p>
      <p className="text-base font-light leading-relaxed text-black transition-colors duration-300 group-hover:text-black">
        {item.title}
      </p>
      <p className="mt-1 text-sm font-light text-black leading-relaxed line-clamp-2">
        {item.summary}
      </p>
      {item.statusLabel && (
        <p className="mt-2 text-xs font-light text-black">
          ● {item.statusLabel}
        </p>
      )}
    </Link>
  );
}

function NarrativeFocus({
  activeQuestion,
  runningExperiment,
  newestObservation,
  nextMilestone,
}: {
  activeQuestion?: FocusItem;
  runningExperiment?: FocusItem;
  newestObservation?: FocusItem;
  nextMilestone?: FocusItem;
}) {
  if (!activeQuestion && !newestObservation && !nextMilestone) return null;

  return (
    <div className="space-y-10">
      {activeQuestion && (
        <div>
          <Index n="2.2" label="Active Question" />
          <p className="text-xs font-light uppercase tracking-widest text-black mb-3">
            Active Question
          </p>
          <p className="text-xl md:text-2xl font-light leading-[1.3] text-black">
            {activeQuestion.title}
          </p>
          {runningExperiment?.statusLabel && (
            <>
              <Index n="2.2.1" label="Status" />
              <p className="mt-3 text-sm font-light text-black">
                ● {runningExperiment.statusLabel}
              </p>
            </>
          )}
        </div>
      )}

      {newestObservation && (
        <div>
          <Index n="2.3" label="Latest Observation" />
          <p className="text-xs font-light uppercase tracking-widest text-black mb-2">
            Latest Observation
          </p>
          <p className="text-sm font-light leading-relaxed text-black">
            {newestObservation.title}
          </p>
        </div>
      )}

      {nextMilestone && (
        <div>
          <Index n="2.4" label="Next Milestone" />
          <p className="text-xs font-light uppercase tracking-widest text-black mb-2">
            Next Milestone
          </p>
          <p className="text-sm font-light leading-relaxed text-black">
            {nextMilestone.title}
          </p>
        </div>
      )}
    </div>
  );
}

export default function CurrentFocus({
  activeQuestion,
  runningExperiment,
  latestChange,
  nextQuestion,
  newestObservation,
  nextMilestone,
  variant = 'grid',
}: Props) {
  if (variant === 'narrative') {
    return (
      <NarrativeFocus
        activeQuestion={activeQuestion}
        runningExperiment={runningExperiment}
        newestObservation={newestObservation ?? latestChange}
        nextMilestone={nextMilestone ?? nextQuestion}
      />
    );
  }

  const items = [
    activeQuestion && { item: activeQuestion, label: 'Active Question' },
    runningExperiment && { item: runningExperiment, label: 'Running Experiment' },
    newestObservation && { item: newestObservation, label: 'Latest Observation' },
    !newestObservation && latestChange && { item: latestChange, label: 'Latest Change' },
    nextMilestone && { item: nextMilestone, label: 'Next Milestone' },
    !nextMilestone && nextQuestion && { item: nextQuestion, label: 'Next Question' },
  ].filter(Boolean) as { item: FocusItem; label: string }[];

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
      {items.map(({ item, label }) => (
        <FocusEntry key={label} item={item} label={label} />
      ))}
    </div>
  );
}