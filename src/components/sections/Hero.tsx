'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';

export default function Hero() {
  const setCommandPaletteOpen = useStore((s) => s.setCommandPaletteOpen);
  const setCursorVariant = useStore((s) => s.setCursorVariant);

  return (
    <section
      id="section-0"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
    >
      {/* Ambient grid lines */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 212, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Scan line effect */}
      <div className="pointer-events-none absolute inset-0 animate-scan">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#00d4ff]/10 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00d4ff]/20 bg-[#00d4ff]/5 px-4 py-1.5 font-mono text-[11px] tracking-widest text-[#00d4ff]/70">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00d4ff]" />
            SYSTEM ONLINE — V.2.4.1
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl lg:text-8xl"
        >
          <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
            Mindspace
          </span>
          <br />
          <span className="bg-gradient-to-r from-[#00d4ff] via-[#00d4ff] to-[#8b5cf6] bg-clip-text text-transparent">
            The Engine
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/40 md:text-xl"
        >
          Vstupte do mysli, kde se myšlenky mění v{' '}
          <span className="text-white/80">110% realitu</span>. 
          Každý nápad je precizně dotažen — od konceptu po funkční produkt.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => {
              document
                .getElementById('section-1')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            onMouseEnter={() => setCursorVariant('pointer')}
            onMouseLeave={() => setCursorVariant('default')}
            className="group relative overflow-hidden rounded-xl border border-[#00d4ff]/30 bg-[#00d4ff]/10 px-8 py-3.5 font-mono text-sm tracking-wider text-[#00d4ff] transition-all duration-300 hover:border-[#00d4ff]/60 hover:bg-[#00d4ff]/20"
          >
            <span className="relative z-10 flex items-center gap-2">
              Spustit Simulaci
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#00d4ff]/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>

          <button
            onClick={() => setCommandPaletteOpen(true)}
            onMouseEnter={() => setCursorVariant('pointer')}
            onMouseLeave={() => setCursorVariant('default')}
            className="group rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 font-mono text-sm tracking-wider text-white/60 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white/80"
          >
            <span className="flex items-center gap-2">
              <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-white/30">
                ⌘K
              </kbd>
              Otevřít Terminál
            </span>
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] tracking-widest text-white/20">
              SCROLL TO EXPLORE
            </span>
            <div className="flex flex-col items-center gap-1">
              <div className="h-8 w-[1px] bg-gradient-to-b from-[#00d4ff]/40 to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
