import { style } from '@vanilla-extract/css';
import { vars } from '@client/app/theme.css';

export const wrap = style({
  display: 'grid',
  gridTemplateColumns: '220px 1fr',
  gap: vars.space.lg,
});
export const side = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  backgroundColor: vars.color.surface,
  padding: vars.space.md,
  height: 'fit-content',
});
export const main = style({ display: 'grid', gap: vars.space.lg });
export const link = style({
  display: 'block',
  padding: '8px 10px',
  color: vars.color.text,
  borderRadius: vars.radius.md,
});
export const active = style({ backgroundColor: vars.color.primary, color: vars.color.primaryText });
