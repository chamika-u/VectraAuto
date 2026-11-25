export const MOTION = {
  fast: 0.35,
  base: 0.6,
  slow: 0.85,
  ease: [0.22, 1, 0.36, 1] as const,
} as const;

export const reveal = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: MOTION.base, ease: MOTION.ease },
};
