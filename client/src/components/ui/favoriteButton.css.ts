import { vars } from '@client/app/theme.css';
import { style } from '@vanilla-extract/css';

export const button = style({
  appearance: 'none',
  border: 'none',
  background: 'transparent',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: vars.space.xs,
  borderRadius: vars.radius.full,
  cursor: 'pointer',
  color: vars.color.textMuted,
  transition: 'transform 0.2s ease, color 0.2s ease',
  selectors: {
    '&:hover': {
      color: vars.color.accent,
      transform: 'scale(1.05)',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${vars.color.focus}`,
    },
    '&[data-active="true"]': {
      color: vars.color.accent,
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.6,
      transform: 'none',
    },
  },
});
