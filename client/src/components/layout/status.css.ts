import { style } from '@vanilla-extract/css';
import { vars } from '@client/app/theme.css';

export const wrap = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
});

export const pill = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  paddingInline: '8px',
  paddingBlock: '2px',
  borderRadius: vars.radius.sm,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.surface,
  color: vars.color.text,
  fontSize: '12px',
});

export const dot = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
});

export const ok = style({ backgroundColor: vars.color.primary });
export const bad = style({ backgroundColor: vars.color.danger });
export const idle = style({ backgroundColor: vars.color.textMuted });

export const muted = style({ color: vars.color.textMuted });
