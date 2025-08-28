import { style } from '@vanilla-extract/css';
import { vars } from './theme.css';

export const card = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.card,
  padding: vars.space.lg
});

export const input = style({
  width: '100%',
  padding: `${vars.space.sm} ${vars.space.md}`,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  backgroundColor: '#fff',
  color: vars.color.text,
  selectors: {
    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 0 3px rgba(96,165,250,0.35)`,
      borderColor: vars.color.primary
    }
  }
});

export const label = style({
  display: 'block',
  marginBottom: vars.space.xs,
  color: vars.color.textMuted,
  fontSize: '0.9rem'
});

export const field = style({
  marginBottom: vars.space.md
});

export const actions = style({
  marginTop: vars.space.md,
  display: 'flex',
  gap: vars.space.sm,
  alignItems: 'center'
});

export const btn = style({
  appearance: 'none',
  border: 'none',
  borderRadius: vars.radius.md,
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontWeight: 600,
  cursor: 'pointer'
});

export const btnPrimary = style([
  btn,
  {
    backgroundColor: vars.color.primary,
    color: vars.color.primaryText,
    selectors: { '&:hover': { filter: 'brightness(0.95)' } }
  }
]);

export const btnSecondary = style([
  btn,
  {
    backgroundColor: vars.color.secondary,
    color: vars.color.secondaryText,
    selectors: { '&:hover': { filter: 'brightness(0.95)' } }
  }
]);

export const btnOutline = style([
  btn,
  {
    backgroundColor: 'transparent',
    border: `1px solid ${vars.color.border}`,
    color: vars.color.text,
    selectors: { '&:hover': { borderColor: vars.color.link } }
  }
]);

export const btnDanger = style([
  btn,
  {
    backgroundColor: vars.color.danger,
    color: '#ffffff',
    selectors: { '&:hover': { filter: 'brightness(0.95)' } }
  }
]);
