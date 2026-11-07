/**
 * Shared Motion presets — every island imports from here so motion feels consistent.
 * Rules: mostly 0.3–0.7s, spring for interactive stuff, animate transform/opacity only.
 */
import type { Transition, Variants } from 'motion/react';

export const ease = {
  out: [0.22, 1, 0.36, 1] as const,      // calm deceleration (default)
  inOut: [0.65, 0, 0.35, 1] as const,
  snap: [0.16, 1, 0.3, 1] as const,
};
export const duration = { fast: 0.25, base: 0.5, slow: 0.7 };

export const spring = {
  soft: { type: 'spring', stiffness: 220, damping: 28, mass: 0.9 } satisfies Transition,
  snappy: { type: 'spring', stiffness: 380, damping: 32 } satisfies Transition,
  pill: { type: 'spring', stiffness: 460, damping: 38 } satisfies Transition,
  tilt: { stiffness: 220, damping: 22, mass: 0.6 },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
};
export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.base, ease: ease.out } },
};
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: duration.base, ease: ease.out } },
};
export const stagger = (gap = 0.07, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

export const viewport = { once: true, margin: '0px 0px -12% 0px', amount: 0.15 } as const;

/** Overlay / dialog presets (AnimatePresence) */
export const overlay: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.fast } },
  exit: { opacity: 0, transition: { duration: duration.fast } },
};
export const dialog: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: spring.soft },
  exit: { opacity: 0, y: 16, scale: 0.98, transition: { duration: duration.fast } },
};
