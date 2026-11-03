"use client";

import { MotionConfig } from "motion/react";

/** Client boundary for app-wide motion settings. `reducedMotion="user"` honours the OS setting everywhere. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
