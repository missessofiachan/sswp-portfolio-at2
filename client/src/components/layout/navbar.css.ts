import { style } from '@vanilla-extract/css';
import { vars } from '@client/app/theme.css';

export const bar = style({
  borderBottom: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.bg
});

export const inner = style({
  maxWidth: vars.layout.maxWidth,
  marginInline: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingInline: vars.space.lg,
  paddingBlock: vars.space.md
});

export const brand = style({
  fontWeight: 800,
  color: vars.color.text,
  ':hover': { textDecoration: 'none' }
});

export const links = style({
  display: 'flex',
  gap: vars.space.md,
  alignItems: 'center'
});

export const link = style({
  color: vars.color.text,
});

export const linkActive = style({
  textDecoration: 'underline',
  textUnderlineOffset: '4px'
});
