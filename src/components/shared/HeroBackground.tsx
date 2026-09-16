'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroBackground() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.06, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.05]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-surface" />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <motion.div
        className="absolute top-1/4 left-1/3 w-[30rem] h-[30rem] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0.02) 0%, transparent 70%)',
          opacity,
          scale,
        }}
      />
    </div>
  );
}