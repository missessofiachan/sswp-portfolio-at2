/**
 * Styling primitives for the toast container including positioning,
 * variant colors, and button affordances.
 */

import { vars } from '@client/app/theme.css';
import { style } from '@vanilla-extract/css';

export const container = style({
  position: 'fixed',
  bottom: vars.space.lg,
  right: vars.space.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  zIndex: 1100,
  width: 'min(320px, calc(100vw - 32px))',
});

export const toastBase = style({
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  boxShadow: vars.shadow.md,
  padding: vars.space.md,
  color: vars.color.text,
  backgroundColor: vars.color.surface,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  position: 'relative',
  overflow: 'hidden',
});

export const variantStyles = {
  info: style({
    borderColor: vars.color.accent,
    boxShadow: `0 10px 25px rgba(85, 205, 252, 0.2)`,
  }),
  success: style({
    borderColor: '#22c55e',
    boxShadow: `0 10px 25px rgba(34, 197, 94, 0.2)`,
  }),
  warning: style({
    borderColor: vars.color.warning,
    boxShadow: `0 10px 25px rgba(247, 168, 184, 0.2)`,
  }),
  error: style({
    borderColor: vars.color.danger,
    boxShadow: `0 10px 25px rgba(247, 168, 184, 0.25)`,
  }),
};

export const titleStyle = style({
  fontWeight: 600,
  fontSize: '0.95rem',
});

export const bodyStyle = style({
  fontSize: '0.875rem',
  lineHeight: 1.5,
});

export const actionsRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: vars.space.sm,
  gap: vars.space.sm,
});

export const requestIdStyle = style({
  fontSize: '0.75rem',
  color: vars.color.textMuted,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
});

export const copyButton = style({
  background: 'none',
  border: 'none',
  padding: 0,
  color: vars.color.accent,
  cursor: 'pointer',
  fontSize: '0.75rem',
  fontWeight: 600,
});

export const closeButton = style({
  position: 'absolute',
  top: vars.space.xs,
  right: vars.space.xs,
  background: 'transparent',
  border: 'none',
  color: vars.color.textMuted,
  cursor: 'pointer',
  padding: vars.space.xs,
  fontSize: '1rem',
  lineHeight: 1,
});
