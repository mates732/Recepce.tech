'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CallSimulator } from '@/components/home/CallSimulator';
import { Button } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';

export function CallLauncher() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <>
      <Button href="#" onClick={handleClick} size="lg">
        Zavolat AI
        <Icon name="arrow-right" className="h-4 w-4" />
      </Button>
      <AnimatePresence>
        {open && <CallSimulator onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
