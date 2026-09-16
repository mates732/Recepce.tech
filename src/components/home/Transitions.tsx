'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { motion as motionConfig } from '@/theme/animation';

function useEnterOnScroll(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, amount: threshold });
  return [ref, visible] as const;
}

export function TransitionSection({
  children,
  className,
  threshold = 0.2,
}: {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}) {
  const [ref, visible] = useEnterOnScroll(threshold);
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={motionConfig.default}
      className={className}
    >
      {children}
    </motion.div>
  );
}
