import { vars } from '@client/app/theme.css';
import { style } from '@vanilla-extract/css';

export const wrap = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
});

export const pill = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  paddingInline: vars.space.sm,
  paddingBlock: '4px',
  borderRadius: vars.radius.pill,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.surfaceMuted,
  fontSize: '0.75rem',
  fontWeight: 600,
  color: vars.color.text,
});

export const dot = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
});

export const ok = style({ backgroundColor: vars.color.success });
export const bad = style({ backgroundColor: vars.color.danger });
export const idle = style({ backgroundColor: vars.color.warning });

export const muted = style({ color: vars.color.textMuted });
