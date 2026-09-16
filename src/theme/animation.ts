export const motion = {
  default: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } as const,
  enter: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
  scroll: { once: true, amount: 0.2 },
};
