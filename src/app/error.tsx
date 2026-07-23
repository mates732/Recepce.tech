'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="text-center">
        <span className="mb-4 inline-block font-mono text-xs tracking-[0.3em] text-[#ff6b6b]/50">
          [ ERROR ]
        </span>
        <h2 className="mb-4 text-2xl font-bold text-white/80">
          Něco se pokazilo
        </h2>
        <p className="mb-8 font-mono text-sm text-white/30">
          {error.message || 'Neočekávaná chyba'}
        </p>
        <button
          onClick={() => unstable_retry()}
          className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 font-mono text-xs tracking-wider text-white/40 transition-all duration-300 hover:border-[#00d4ff]/20 hover:text-[#00d4ff]/60"
        >
          Zkusit znovu
        </button>
      </div>
    </div>
  );
}
