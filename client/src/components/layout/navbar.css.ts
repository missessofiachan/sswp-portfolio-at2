import { style } from '@vanilla-extract/css';
import { vars } from '../../app/theme.css';

export const nav = style({
  padding: vars.space.md,
  borderBottom: `1px solid ${vars.color.primary}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: vars.color.bg,
  color: vars.color.text,
});

export const left = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.lg,
});

export const links = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
});

export const link = style({
  marginRight: vars.space.md,
  textDecoration: 'none',
  color: 'inherit',
  selectors: {
    '&[data-active="true"]': {
      textDecoration: 'underline',
    },
  },
});

export const active = style({
  textDecoration: 'underline',
});

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
});

export const iconButton = style({
  background: 'transparent',
  border: 'none',
  color: 'inherit',
  cursor: 'pointer',
  padding: vars.space.xs,
  borderRadius: vars.radius.md,
});
