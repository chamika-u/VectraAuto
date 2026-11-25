export const MOTION = {
  fast: 0.4,
  base: 0.7,
  slow: 1.0,
  ease: [0.25, 0.1, 0.25, 1] as const,
} as const;

export const reveal = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: MOTION.base, ease: MOTION.ease },
};
