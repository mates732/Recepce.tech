'use client';

import { LayoutGroup } from 'framer-motion';
import type { ReactNode } from 'react';

export default function LayoutProvider({ children }: { children: ReactNode }) {
  return <LayoutGroup>{children}</LayoutGroup>;
}
