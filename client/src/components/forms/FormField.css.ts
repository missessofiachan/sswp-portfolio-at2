import { vars } from '@client/app/theme.css';
import { style } from '@vanilla-extract/css';

const transitionFast = '160ms ease';

export const field = style({
  display: 'grid',
  gap: vars.space.xs,
});

export const label = style({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: vars.color.text,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const required = style({
  color: vars.color.danger,
  marginLeft: vars.space.xs,
});

export const controlWrapper = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'stretch',
});

export const control = style({
  appearance: 'none',
  width: '100%',
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.surface,
  color: vars.color.text,
  font: 'inherit',
  padding: `${vars.space.sm} ${vars.space.md}`,
  transition: `border-color ${transitionFast}, box-shadow ${transitionFast}`,

  selectors: {
    '&:focus-visible': {
      outline: 'none',
      borderColor: vars.color.accent,
      boxShadow: `0 0 0 3px ${vars.color.focus}`,
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    '&[data-error="true"]': {
      borderColor: vars.color.danger,
      boxShadow: `0 0 0 3px rgba(247, 168, 184, 0.25)`,
    },
  },
});

export const controlWithAffix = style({
  paddingLeft: `calc(${vars.space.md} + 1.75rem)`,
});

export const controlWithSuffix = style({
  paddingRight: `calc(${vars.space.md} + 1.75rem)`,
});

export const prefix = style({
  position: 'absolute',
  left: vars.space.sm,
  top: '50%',
  transform: 'translateY(-50%)',
  color: vars.color.textMuted,
  pointerEvents: 'none',
});

export const suffix = style({
  position: 'absolute',
  right: vars.space.sm,
  top: '50%',
  transform: 'translateY(-50%)',
  color: vars.color.textMuted,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
});

export const message = style({
  fontSize: '0.75rem',
  lineHeight: 1.4,
});

export const hint = style({
  color: vars.color.textMuted,
});

export const error = style({
  color: vars.color.danger,
});

export const messageRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: vars.space.xs,
});

export const toggleButton = style({
  background: 'none',
  border: 'none',
  color: vars.color.accent,
  cursor: 'pointer',
  fontSize: '0.75rem',
  fontWeight: 600,
  padding: 0,
});
