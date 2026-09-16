'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { easeOut, SMALL_MOVE, springGentle } from '@/lib/animations';

interface Props {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  spring?: boolean;
}

export default function Reveal({
  children,
  delay = 0,
  y = SMALL_MOVE,
  duration = 0.8,
  className,
  spring = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const animate = isInView ? { opacity: 1, y: 0 } : { opacity: 0, y };
  const transition = spring
    ? { ...springGentle, delay }
    : { duration, delay, ease: easeOut };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={animate}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}