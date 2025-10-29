import { style } from '@vanilla-extract/css';
import { vars } from '@client/app/theme.css';
import { sprinkles } from '@client/app/sprinkles.css';

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
  },
]);
