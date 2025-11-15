/**
 * Vanilla Extract style definitions for the admin MetricsPanel component,
 * including responsive grid layout, typography, and inline badge/progress
 * primitives used to display telemetry values.
 */

import { sprinkles } from '@client/app/sprinkles.css';
import { vars } from '@client/app/theme.css';
import { style } from '@vanilla-extract/css';

export const panel = style([sprinkles({ display: 'grid', gap: 'lg' })]);

export const headerRow = style([
  sprinkles({ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }),
]);

export const title = style({
  margin: 0,
  fontSize: '1.25rem',
});

export const grid = style({
  display: 'grid',
  gap: vars.space.md,
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
});

export const metricCard = style([
  sprinkles({ padding: 'md', display: 'grid', gap: 'sm' }),
  {
    borderRadius: vars.radius.lg,
    border: `1px solid ${vars.color.border}`,
    backgroundColor: vars.color.surface,
    boxShadow: vars.shadow.xs,
  },
]);

export const metricLabel = style({
  fontSize: '0.875rem',
  color: vars.color.textMuted,
});

export const metricValue = style({
  fontSize: '1.5rem',
  fontWeight: 700,
});

export const badgeRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
});

export const badge = style({
  fontSize: '0.75rem',
  padding: '0.25rem 0.5rem',
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.surfaceMuted,
  border: `1px solid ${vars.color.border}`,
});

export const progressTrack = style({
  position: 'relative',
  height: 8,
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.surfaceMuted,
  overflow: 'hidden',
});

export const progressBar = style({
  height: '100%',
  borderRadius: vars.radius.pill,
  transition: 'width 0.3s ease',
});

export const infoRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.75rem',
  color: vars.color.textMuted,
});
