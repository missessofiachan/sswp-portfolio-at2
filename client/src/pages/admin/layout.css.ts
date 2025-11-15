import { sprinkles } from '@client/app/sprinkles.css';
import { vars } from '@client/app/theme.css';
import { style } from '@vanilla-extract/css';

export const wrap = style([
  {
    display: 'grid',
    gap: vars.space.lg,
    gridTemplateColumns: 'minmax(220px, 260px) 1fr',
  },
  {
    '@media': {
      'screen and (max-width: 900px)': {
        gridTemplateColumns: '1fr',
      },
    },
  },
]);

export const side = style({
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.surface,
  padding: vars.space.md,
  boxShadow: vars.shadow.xs,
});

export const main = style([
  sprinkles({
    display: 'grid',
    gap: 'lg',
  }),
]);

export const link = style({
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.md,
  color: vars.color.textMuted,
  fontWeight: 500,
  transition: 'background-color 120ms ease, color 120ms ease',
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.surfaceMuted,
      color: vars.color.text,
    },
  },
});

export const active = style([
  link,
  {
    backgroundColor: vars.color.accent,
    color: vars.color.accentText,
  },
]);
