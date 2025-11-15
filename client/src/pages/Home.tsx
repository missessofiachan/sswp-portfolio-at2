import { sprinkles } from '@client/app/sprinkles.css';
import { vars } from '@client/app/theme.css';
import { motion } from 'framer-motion';
import type { JSX } from 'react';

/**
 * Home page component.
 *
 * Renders a welcoming heading for Sofia's Shop.
 *
 * @returns {JSX.Element} The rendered home page.
 */
export default function Home(): JSX.Element {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={sprinkles({ display: 'grid', gap: 'lg' })}
    >
      <motion.h1 layout>{"Welcome to Sofia's Shop"}</motion.h1>
      <motion.p layout style={{ fontSize: '1.05rem', color: vars.color.textMuted }}>
        Discover something magical today ✨
      </motion.p>
    </motion.main>
  );
}
