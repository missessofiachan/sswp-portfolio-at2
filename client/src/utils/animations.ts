/**
 * @file animations.ts
 * @description Shared animation constants for Framer Motion
 * @version 1.0.0
 */

import type { Variants } from 'framer-motion';

/**
 * Fade in and slide up animation
 * Useful for page transitions and content reveals
 */
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/**
 * Stagger container animation for children
 * Use this as a parent container to animate children sequentially
 *
 * @example
 * ```tsx
 * <motion.div variants={staggerContainer} initial="initial" animate="animate">
 *   {items.map(item => (
 *     <motion.div key={item.id} variants={fadeInUp}>
 *       {item.content}
 *     </motion.div>
 *   ))}
 * </motion.div>
 * ```
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Fade in animation (no movement)
 * Simple fade for subtle transitions
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Scale in animation
 * Useful for modals, cards, and interactive elements
 */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

/**
 * Slide in from right
 * Useful for sidebars and drawers
 */
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
};

/**
 * Slide in from left
 * Useful for sidebars and drawers
 */
export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};
