/**
 * @file AnimatedLoading.tsx
 * @description Animated loading component using Framer Motion with Trans Pride colors
 * @version 1.0.0
 */

import { sprinkles } from '@client/app/sprinkles.css';
import { motion } from 'framer-motion';
import './TransPrideSpinner.css';

interface AnimatedLoadingProps {
  message?: string;
  variant?: 'border' | 'grow' | 'trans-pride';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Animated loading component with Framer Motion transitions
 *
 * @param message - Optional loading message to display below spinner
 * @param variant - Spinner variant: 'trans-pride' (default), 'border', or 'grow'
 * @param size - Spinner size (sm: 2rem, md: 3rem, lg: 4rem)
 *
 * @example
 * ```tsx
 * <AnimatedLoading message="Loading products..." variant="trans-pride" />
 * ```
 */
export default function AnimatedLoading({
  message,
  variant = 'trans-pride',
  size = 'md',
}: AnimatedLoadingProps) {
  const sizeMap = {
    sm: '2rem',
    md: '3rem',
    lg: '4rem',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={sprinkles({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      })}
      style={{ minHeight: 160 }}
    >
      {variant === 'trans-pride' ? (
        <div
          className="trans-pride-spinner"
          role="status"
          aria-hidden="true"
          style={{ width: sizeMap[size], height: sizeMap[size] }}
        >
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <div
          className={`spinner-${variant === 'border' ? 'border' : 'grow'}`}
          role="status"
          aria-hidden="true"
          style={{ width: sizeMap[size], height: sizeMap[size] }}
        >
          <span className="sr-only">Loading...</span>
        </div>
      )}
      {message && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={sprinkles({
            marginTop: 'md',
            color: 'textMuted',
          })}
          aria-live="polite"
        >
          {message}
        </motion.div>
      )}
    </motion.div>
  );
}
