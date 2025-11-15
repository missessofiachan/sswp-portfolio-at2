/**
 * Styles for the inline ErrorDisplay component, covering layout, heading,
 * and control elements.
 */

import { sprinkles } from '@client/app/sprinkles.css';
import { vars } from '@client/app/theme.css';
import { style } from '@vanilla-extract/css';

export const container = style([
  sprinkles({ display: 'grid', gap: 'sm', padding: 'md' }),
  {
    borderRadius: vars.radius.md,
    border: `1px solid ${vars.color.danger}`,
    backgroundColor: 'rgba(247, 168, 184, 0.12)',
    color: vars.color.text,
  },
]);

export const heading = style({
  margin: 0,
  fontSize: '1rem',
  fontWeight: 600,
});

export const message = style({
  margin: 0,
  color: vars.color.text,
});

export const metaRow = style([
  sprinkles({ display: 'flex', gap: 'sm', alignItems: 'center' }),
  {
    fontSize: '0.75rem',
    color: vars.color.textMuted,
    flexWrap: 'wrap',
  },
]);

export const code = style({
  fontFamily: vars.font.mono,
  backgroundColor: 'rgba(0,0,0,0.05)',
  padding: '0.125rem 0.375rem',
  borderRadius: vars.radius.sm,
});

export const headerRow = style([
  sprinkles({ display: 'flex' }),
  {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: vars.space.sm,
  },
]);

export const closeButton = style({
  background: 'transparent',
  border: 'none',
  color: vars.color.textMuted,
  cursor: 'pointer',
  fontSize: '1rem',
  lineHeight: 1,
  padding: vars.space.xs,
});

export const actionButton = style({
  fontSize: '0.75rem',
  padding: `${vars.space.xs} ${vars.space.sm}`,
  lineHeight: 1.2,
});
