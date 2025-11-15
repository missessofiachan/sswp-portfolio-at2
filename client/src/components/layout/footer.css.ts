import { sprinkles } from '@client/app/sprinkles.css';
import { vars } from '@client/app/theme.css';
import { style } from '@vanilla-extract/css';

export const bar = style([
  {
    borderTop: `1px solid ${vars.color.border}`,
    backgroundColor: vars.color.surface,
  },
]);

export const inner = style([
  sprinkles({
    px: 'lg',
    py: 'md',
  }),
  {
    width: '100%',
    maxWidth: vars.size.container,
    marginInline: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: vars.space.md,
    flexWrap: 'wrap',
  },
]);

export const small = style([
  {
    fontSize: '0.8rem',
    color: vars.color.textMuted,
  },
]);

export const right = style([
  {
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.md,
    flexWrap: 'wrap',
  },
]);

export const links = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.45rem',
  flexWrap: 'wrap',
});

export const separator = style({
  color: vars.color.textMuted,
  fontSize: '0.8rem',
});
