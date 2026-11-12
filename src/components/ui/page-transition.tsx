"use client";

import { motion, useReducedMotion } from "motion/react";
import { MOTION } from "@/lib/motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.base, ease: MOTION.ease }}
      className="motion-page"
    >
      {children}
    </motion.div>
  );
}
