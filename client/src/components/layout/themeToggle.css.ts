import { style } from '@vanilla-extract/css';
import { vars } from '@client/app/theme.css';

export const toggle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: vars.radius.pill,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.surface,
  color: vars.color.text,
  boxShadow: vars.shadow.xs,
  cursor: 'pointer',
  transition: 'transform 120ms ease, box-shadow 120ms ease',
  selectors: {
    '&:hover': {
      transform: 'translateY(-1px)',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${vars.color.focus}`,
    },
    '&[data-state="on"]': {
      backgroundColor: vars.color.surfaceMuted,
    },
  },
});

export const icon = style({
  width: '20px',
  height: '20px',
});
