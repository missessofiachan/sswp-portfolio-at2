/**
 * Vanilla Extract styles for the admin SystemHealthPanel component. Provides
 * layout primitives for the card, responsive metric grid, and utility styles
 * used to render status badges and progress indicators.
 */

import { sprinkles } from '@client/app/sprinkles.css';
import { vars } from '@client/app/theme.css';
import { style } from '@vanilla-extract/css';

export const card = style([
  sprinkles({ display: 'grid', gap: 'md' }),
  {
    borderRadius: vars.radius.lg,
    border: `1px solid ${vars.color.border}`,
    backgroundColor: vars.color.surface,
    boxShadow: vars.shadow.sm,
    padding: vars.space.lg,
  },
]);

export const headerRow = style([
  sprinkles({ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }),
]);

export const title = style({
  margin: 0,
  fontSize: '1.25rem',
  fontWeight: 700,
});

export const statusBadge = style({
  fontSize: '0.75rem',
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.radius.pill,
  textTransform: 'uppercase',
});

export const grid = style({
  display: 'grid',
  gap: vars.space.md,
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
});

export const metricCard = style([
  sprinkles({ padding: 'md', display: 'grid', gap: 'xs' }),
  {
    borderRadius: vars.radius.md,
    border: `1px solid ${vars.color.border}`,
    backgroundColor: vars.color.surfaceMuted,
  },
]);

export const label = style({
  fontSize: '0.875rem',
  fontWeight: 600,
});

export const value = style({
  fontSize: '0.95rem',
});

export const progressTrack = style({
  position: 'relative',
  height: 8,
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.surface,
  overflow: 'hidden',
});

export const progressBar = style({
  height: '100%',
  borderRadius: vars.radius.pill,
  transition: 'width 0.3s ease',
});
