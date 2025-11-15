/**
 * Vanilla Extract layout styles shared by the router shell (app chrome and
 * skip-link). Keeps structural primitives near the route config.
 */

import { vars } from '@client/app/theme.css';
import { style } from '@vanilla-extract/css';

export const shellLayout = style({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
});

export const mainContent = style({
  flex: '1 0 auto',
});

export const skipLink = style({
  position: 'absolute',
  top: '0.75rem',
  left: '50%',
  transform: 'translate(-50%, -200%)',
  backgroundColor: vars.color.accent,
  color: vars.color.accentText,
  padding: '0.6rem 1rem',
  borderRadius: vars.radius.md,
  fontWeight: 600,
  zIndex: 1000,
  transition: 'transform 150ms ease',
  boxShadow: vars.shadow.xs,
  selectors: {
    '&:focus-visible': {
      transform: 'translate(-50%, 0)',
      boxShadow: `0 0 0 3px ${vars.color.focus}`,
    },
  },
});
