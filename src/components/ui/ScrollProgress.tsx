'use client';

import { useStore, type SectionId } from '@/store/useStore';

const SECTION_LABELS: Record<SectionId, string> = {
  0: 'SYNAPSE',
  1: 'SPARKS',
  2: 'FORGE',
  3: 'FUEL',
  4: 'MIND',
};

export default function ScrollProgress() {
  const activeSection = useStore((s) => s.activeSection);

  return (
    <div className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
      {([0, 1, 2, 3, 4] as SectionId[]).map((id) => (
        <div key={id} className="group flex items-center gap-3">
          <span
            className={`text-[10px] font-mono tracking-widest transition-all duration-500 ${
              activeSection === id
                ? 'translate-x-0 text-[#00d4ff] opacity-100'
                : 'translate-x-2 text-white/20 opacity-0 group-hover:opacity-60'
            }`}
          >
            {SECTION_LABELS[id]}
          </span>
          <div
            className={`h-[2px] w-6 transition-all duration-500 ${
              activeSection === id
                ? 'w-10 bg-[#00d4ff]'
                : 'w-6 bg-white/10 group-hover:bg-white/30'
            }`}
          />
        </div>
      ))}
    </div>
  );
}
