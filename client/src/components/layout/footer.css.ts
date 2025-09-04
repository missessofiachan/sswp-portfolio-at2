import { style } from '@vanilla-extract/css';
import { vars } from '@client/app/theme.css';

export const bar = style({
  borderTop: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.bg,
  position: 'sticky',
  bottom: 0,
});

export const inner = style({
  maxWidth: vars.layout.maxWidth,
  marginInline: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingInline: vars.space.lg,
  paddingBlock: vars.space.md,
});

export const small = style({
  fontSize: '12px',
  color: vars.color.textMuted,
});

export const right = style({
  display: 'flex',
  gap: vars.space.md,
  alignItems: 'center',
});
