'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const cursorVariant = useStore((s) => s.cursorVariant);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };

    const animate = () => {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      follower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const getCursorLabel = () => {
    switch (cursorVariant) {
      case 'pointer':
        return 'CLICK';
      case 'text':
        return 'TYPE';
      case 'hidden':
        return '';
      default:
        return 'EXPLORE';
    }
  };

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className={`h-2 w-2 rounded-full bg-[#00d4ff] transition-transform duration-150 ${
            cursorVariant === 'pointer' ? 'scale-150' : ''
          } ${cursorVariant === 'hidden' ? 'opacity-0' : ''}`}
        />
      </div>

      {/* Cursor follower ring */}
      <div
        ref={followerRef}
        className="pointer-events-none fixed z-[9998]"
      >
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#00d4ff]/30 transition-all duration-300 ${
            cursorVariant === 'pointer'
              ? 'scale-150 border-[#00d4ff]/60 bg-[#00d4ff]/10'
              : cursorVariant === 'hidden'
                ? 'opacity-0'
                : ''
          }`}
        >
          <span
            className={`text-[8px] font-mono tracking-widest text-[#00d4ff]/60 transition-opacity duration-300 ${
              cursorVariant === 'default' ? 'opacity-60' : 'opacity-0'
            }`}
          >
            {getCursorLabel()}
          </span>
        </div>
      </div>
    </>
  );
}
