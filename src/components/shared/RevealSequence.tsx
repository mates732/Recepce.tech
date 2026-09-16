'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { easeOut, SMALL_MOVE, STAGGER_DELAY } from '@/lib/animations';

interface Props {
  children: ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  className?: string;
  spring?: boolean;
}

export default function RevealSequence({
  children,
  staggerDelay = STAGGER_DELAY,
  delayChildren = 0,
  className,
  spring = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay / 1000,
        delayChildren: delayChildren / 1000,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: SMALL_MOVE },
    visible: {
      opacity: 1,
      y: 0,
      transition: spring
        ? ({ type: 'spring' as const, stiffness: 120, damping: 20, mass: 1 })
        : ({ duration: 0.8, ease: easeOut }),
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={container}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={item}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={item}>{children}</motion.div>
      }
    </motion.div>
  );
}