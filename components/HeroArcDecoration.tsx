"use client";

import { motion } from "motion/react";
import { arc } from "motion";

// Hero хэсгийн ард муруй замаар тасралтгүй хөдөлдөг чимэглэл.
export default function HeroArcDecoration() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute top-8 right-8 h-16 w-16 rounded-full bg-orange-400/50 blur-md"
      animate={{ x: 200, y: -120 }}
      transition={{
        duration: 0.6,
        path: arc(),
        repeat: Infinity,
        repeatType: "mirror",
        repeatDelay: 0.4,
      }}
    />
  );
}
