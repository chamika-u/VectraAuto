export const MOTION = {
  fast: 0.18,
  base: 0.32,
  slow: 0.48,
  ease: [0.22, 1, 0.36, 1] as const,
} as const;

export const reveal = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: MOTION.base, ease: MOTION.ease },
};
