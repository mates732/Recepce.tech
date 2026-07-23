'use client';

import dynamic from 'next/dynamic';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useMousePosition } from '@/hooks/useMousePosition';

import Hero from '@/components/sections/Hero';

import CustomCursor from '@/components/ui/CustomCursor';
import SoundToggle from '@/components/ui/SoundToggle';
import ScrollProgress from '@/components/ui/ScrollProgress';
import CommandPalette from '@/components/ui/CommandPalette';

const Scene = dynamic(() => import('@/components/canvas/Scene'), {
  ssr: false,
});

function AppContent() {
  useScrollProgress();
  useMousePosition();

  return (
    <>
      <CustomCursor />
      <SoundToggle />
      <ScrollProgress />
      <CommandPalette />

      <Scene />

      <main className="relative z-10">
        <Hero />

        <footer className="border-t border-white/[0.03] py-8 text-center">
          <div className="mx-auto max-w-4xl px-6">
            <p className="font-mono text-xs tracking-widest text-white/15">
              MINDSPACE — THE ENGINE v2.4.1
            </p>
            <p className="mt-2 font-mono text-[10px] text-white/10">
              110% kvalita v AI &amp; Web Developmentu
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

export default function Home() {
  return <AppContent />;
}
