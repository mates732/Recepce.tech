'use client';

import { useStore } from '@/store/useStore';

export default function SoundToggle() {
  const audioEnabled = useStore((s) => s.audioEnabled);
  const toggleAudio = useStore((s) => s.toggleAudio);

  return (
    <button
      onClick={toggleAudio}
      className="group fixed right-6 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-300 hover:border-[#00d4ff]/40 hover:bg-[#00d4ff]/10"
      aria-label={audioEnabled ? 'Disable sound' : 'Enable sound'}
    >
      {audioEnabled ? (
        <svg
          className="h-5 w-5 text-[#00d4ff]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 010 14.14" />
          <path d="M15.54 8.46a5 5 0 010 7.07" />
        </svg>
      ) : (
        <svg
          className="h-5 w-5 text-white/40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}
