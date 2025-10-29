import { style } from '@vanilla-extract/css';
import { vars } from './theme.css';
import { sprinkles } from './sprinkles.css';

const transitionFast = '160ms ease';

export const card = style([
  sprinkles({
    display: 'grid',
    gap: 'md',
    padding: 'lg',
  }),
  {
    backgroundColor: vars.color.surface,
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.radius.lg,
    boxShadow: vars.shadow.sm,
  },
]);

export const field = style([
  sprinkles({
    display: 'grid',
    gap: 'xs',
  }),
]);

export const label = style([
  {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: vars.color.textMuted,
  },
]);

export const input = style([
  {
    width: '100%',
    padding: `${vars.space.sm} ${vars.space.md}`,
    borderRadius: vars.radius.md,
    border: `1px solid ${vars.color.border}`,
    backgroundColor: vars.color.surface,
    color: vars.color.text,
    font: 'inherit',
    transition: `border-color ${transitionFast}, box-shadow ${transitionFast}`,
    selectors: {
      '&::placeholder': {
        color: vars.color.textMuted,
      },
      '&:focus-visible': {
        outline: 'none',
        borderColor: vars.color.accent,
        boxShadow: `0 0 0 3px ${vars.color.focus}`,
      },
    },
  },
]);

export const actions = style([
  sprinkles({
    marginTop: 'md',
    display: 'flex',
    gap: 'sm',
  }),
  {
    alignItems: 'center',
  },
]);

const buttonBase = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'sm',
  }),
  {
    position: 'relative',
    borderRadius: vars.radius.md,
    border: '1px solid transparent',
    fontFamily: vars.font.heading,
    fontWeight: 600,
    fontSize: '0.95rem',
    lineHeight: 1,
    padding: `${vars.space.sm} ${vars.space.lg}`,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: `transform ${transitionFast}, box-shadow ${transitionFast}, background-color ${transitionFast}`,
    selectors: {
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 3px ${vars.color.focus}`,
      },
      '&:disabled': {
        opacity: 0.55,
        cursor: 'not-allowed',
        transform: 'none',
        boxShadow: 'none',
      },
    },
  },
]);

export const btnPrimary = style([
  buttonBase,
  {
    backgroundColor: vars.color.accent,
    color: vars.color.accentText,
    boxShadow: vars.shadow.xs,
    selectors: {
      '&:hover:not(:disabled)': {
        transform: 'translateY(-1px)',
        backgroundColor: vars.color.accentMuted,
      },
    },
  },
]);

export const btnSecondary = style([
  buttonBase,
  {
    backgroundColor: vars.color.surfaceMuted,
    color: vars.color.text,
    borderColor: vars.color.border,
    selectors: {
      '&:hover:not(:disabled)': {
        transform: 'translateY(-1px)',
      },
    },
  },
]);

export const btnOutline = style([
  buttonBase,
  {
    background: 'transparent',
    color: vars.color.text,
    borderColor: vars.color.border,
    selectors: {
      '&:hover:not(:disabled)': {
        transform: 'translateY(-1px)',
        backgroundColor: vars.color.surfaceMuted,
      },
    },
  },
]);

export const btnDanger = style([
  buttonBase,
  {
    backgroundColor: vars.color.danger,
    color: vars.color.accentText,
    selectors: {
      '&:hover:not(:disabled)': {
        transform: 'translateY(-1px)',
        filter: 'brightness(1.05)',
      },
    },
  },
]);

export const photoFrame = style([
  {
    display: 'block',
    borderRadius: vars.radius.lg,
    border: `1px solid ${vars.color.border}`,
    overflow: 'hidden',
    boxShadow: vars.shadow.sm,
  },
]);

export const sepiaPhoto = style([
  {
    width: '100%',
    display: 'block',
    filter: 'saturate(0.85) contrast(1.05)',
    transition: `filter ${transitionFast}`,
    selectors: {
      '&:hover': {
        filter: 'saturate(1) contrast(1.05)',
      },
    },
  },
]);

export const photoThumb = style([
  {
    display: 'block',
    width: '100%',
    borderRadius: vars.radius.md,
    border: `1px solid ${vars.color.border}`,
    overflow: 'hidden',
    boxShadow: vars.shadow.xs,
  },
]);
