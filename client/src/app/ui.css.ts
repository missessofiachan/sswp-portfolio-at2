import { style } from '@vanilla-extract/css';
import { vars } from './theme.css';

export const card = style({
  backgroundColor: vars.color.surface,
  border: `2px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  boxShadow: vars.shadow.card,
  padding: vars.space.lg,
  position: 'relative',
  selectors: {
    '&::after': {
      content: '',
      position: 'absolute',
      inset: '6px',
      border: `1px dashed rgba(58, 43, 26, 0.25)`,
      borderRadius: vars.radius.sm,
      pointerEvents: 'none',
    },
  },
});

export const input = style({
  width: '100%',
  padding: `${vars.space.sm} ${vars.space.md}`,
  border: `2px solid rgba(110, 73, 44, 0.45)`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.surface,
  color: vars.color.text,
  selectors: {
    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 0 3px rgba(146, 63, 43, 0.2)`,
      borderColor: vars.color.primary,
    },
  },
});

export const label = style({
  display: 'block',
  marginBottom: vars.space.xs,
  color: vars.color.textMuted,
  fontSize: '0.9rem',
});

export const field = style({
  marginBottom: vars.space.md,
});

export const actions = style({
  marginTop: vars.space.md,
  display: 'flex',
  gap: vars.space.sm,
  alignItems: 'center',
});

export const btn = style({
  appearance: 'none',
  border: `2px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontWeight: 600,
  fontFamily: vars.font.display,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  cursor: 'pointer',
  backgroundColor: vars.color.secondary,
  color: vars.color.text,
  boxShadow: vars.shadow.card,
  transition: 'transform 0.2s ease, filter 0.2s ease',
  selectors: {
    '&:hover': {
      transform: 'translate(-1px, -1px)',
      filter: 'brightness(1.05)',
    },
    '&:disabled': {
      opacity: 0.55,
      cursor: 'not-allowed',
      transform: 'none',
      filter: 'none',
      boxShadow: 'none',
    },
    '&:disabled:hover': {
      transform: 'none',
      filter: 'none',
    },
  },
});

export const btnPrimary = style([
  btn,
  {
    backgroundColor: vars.color.primary,
    color: vars.color.primaryText,
    borderColor: '#6e2d1f',
    selectors: {
      '&:hover': {
        filter: 'saturate(1.2)',
      },
    },
  },
]);

export const btnSecondary = style([
  btn,
  {
    backgroundColor: vars.color.secondary,
    color: vars.color.secondaryText,
    selectors: { '&:hover': { filter: 'saturate(1.1)' } },
  },
]);

export const btnOutline = style([
  btn,
  {
    backgroundColor: 'transparent',
    border: `2px solid ${vars.color.border}`,
    color: vars.color.text,
    selectors: {
      '&:hover': {
        borderColor: vars.color.link,
        filter: 'brightness(1.05)',
      },
    },
  },
]);

export const btnDanger = style([
  btn,
  {
    backgroundColor: vars.color.danger,
    color: '#ffffff',
    borderColor: '#5c0904',
    selectors: {
      '&:hover': {
        filter: 'brightness(0.95)',
      },
    },
  },
]);

export const photoFrame = style({
  display: 'block',
  borderRadius: vars.radius.sm,
  border: `2px solid ${vars.color.border}`,
  boxShadow: '6px 6px 0 rgba(82, 52, 27, 0.25)',
  backgroundColor: 'rgba(255, 248, 235, 0.8)',
  overflow: 'hidden',
});

export const sepiaPhoto = style({
  display: 'block',
  width: '100%',
  filter: 'sepia(0.85) contrast(1.05) saturate(0.75)',
  transition: 'filter 0.3s ease',
  selectors: {
    '&:hover': {
      filter: 'sepia(0.65) contrast(1.15) saturate(0.9)',
    },
  },
});

export const photoThumb = style({
  display: 'block',
  borderRadius: vars.radius.sm,
  border: `1px solid ${vars.color.border}`,
  boxShadow: '3px 3px 0 rgba(82, 52, 27, 0.2)',
  backgroundColor: 'rgba(255, 248, 235, 0.8)',
  overflow: 'hidden',
});
