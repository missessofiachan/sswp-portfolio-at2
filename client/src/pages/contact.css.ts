import { sprinkles } from '@client/app/sprinkles.css';
import { vars } from '@client/app/theme.css';
import { style } from '@vanilla-extract/css';

export const page = style([
  sprinkles({
    display: 'grid',
    gap: 'xl',
  }),
]);

export const header = style([
  sprinkles({
    display: 'grid',
    gap: 'sm',
  }),
]);

export const intro = style({
  fontSize: '1.05rem',
  maxWidth: '60ch',
  color: vars.color.textMuted,
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: vars.space.lg,
});

export const card = style({
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.surface,
  boxShadow: vars.shadow.xs,
  padding: vars.space.lg,
  display: 'grid',
  gap: vars.space.sm,
});

export const list = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: vars.space.sm,
});

export const emphasis = style({
  fontFamily: vars.font.heading,
  fontWeight: 600,
});

export const subtle = style({
  color: vars.color.textMuted,
  fontSize: '0.95rem',
});

export const form = style([
  sprinkles({
    display: 'grid',
    gap: 'md',
  }),
]);

export const field = style([
  sprinkles({
    display: 'grid',
    gap: 'xs',
  }),
]);

export const note = style({
  fontSize: '0.85rem',
  color: vars.color.textMuted,
});
