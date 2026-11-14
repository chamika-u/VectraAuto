"use client";

import { motion } from "motion/react";
import { MOTION } from "@/lib/motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.base, ease: MOTION.ease }}
    >
      {children}
    </motion.div>
  );
}
