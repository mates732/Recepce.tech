'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export function useMousePosition() {
  const setMousePosition = useStore((s) => s.setMousePosition);
  const setMouseNormalized = useStore((s) => s.setMouseNormalized);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setMouseNormalized({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setMousePosition, setMouseNormalized]);
}
