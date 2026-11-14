export const MOTION = {
  fast: 0.22,
  base: 0.44,
  slow: 0.65,
  ease: [0.16, 1, 0.3, 1] as const,
} as const;

export const reveal = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: MOTION.base, ease: MOTION.ease },
};
