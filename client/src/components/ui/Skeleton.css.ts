/**
 * Skeleton loading component styles
 */

import { style, keyframes } from '@vanilla-extract/css';

const pulse = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.5 },
});

export const skeletonBase = style({
  backgroundColor: '#e0e0e0',
  borderRadius: '4px',
  animation: `${pulse} 1.5s ease-in-out infinite`,
});

export const skeletonText = style([
  skeletonBase,
  {
    height: '1em',
    marginBottom: '0.5em',
  },
]);

export const skeletonTitle = style([
  skeletonBase,
  {
    height: '1.5em',
    width: '60%',
    marginBottom: '1em',
  },
]);

export const skeletonCard = style({
  padding: '1rem',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  marginBottom: '1rem',
});

export const skeletonImage = style([
  skeletonBase,
  {
    width: '100%',
    paddingTop: '66.67%', // 3:2 aspect ratio
    position: 'relative',
  },
]);

export const skeletonButton = style([
  skeletonBase,
  {
    height: '40px',
    width: '120px',
  },
]);
