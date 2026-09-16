export const easeOut = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;

export const springGentle = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 20,
  mass: 1,
};

export const springSnap = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 15,
  mass: 0.8,
};

export const springHeavy = {
  type: 'spring' as const,
  stiffness: 80,
  damping: 25,
  mass: 1.5,
};

export const REVEAL_DELAYS = {
  headline: 0,
  paragraph: 250,
  visual: 350,
  cta: 500,
} as const;

export const STAGGER_DELAY = 250;

export const SMALL_MOVE = 16;

export const TEMPO = {
  fast: { duration: 0.6 },
  normal: { duration: 1 },
  slow: { duration: 1.5 },
  enter: { duration: 2 },
} as const;