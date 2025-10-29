import { style, styleVariants } from '@vanilla-extract/css';
import { sprinkles } from '@client/app/sprinkles.css';
import { vars } from '@client/app/theme.css';

const base = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'sm',
  }),
  {
    borderRadius: vars.radius.md,
    borderWidth: 1,
    borderStyle: 'solid',
    fontFamily: vars.font.heading,
    fontWeight: 600,
    fontSize: '0.95rem',
    lineHeight: 1,
    padding: `${vars.space.sm} ${vars.space.lg}`,
    cursor: 'pointer',
    transition: 'transform 150ms ease, box-shadow 150ms ease, background-color 150ms ease',
    textDecoration: 'none',
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

export const buttonVariants = styleVariants({
  primary: [
    base,
    {
      backgroundColor: vars.color.accent,
      color: vars.color.accentText,
      borderColor: vars.color.accent,
      boxShadow: vars.shadow.xs,
      selectors: {
        '&:hover:not(:disabled)': {
          transform: 'translateY(-1px)',
          backgroundColor: vars.color.accentMuted,
        },
      },
    },
  ],
  secondary: [
    base,
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
  ],
  outline: [
    base,
    {
      backgroundColor: 'transparent',
      color: vars.color.text,
      borderColor: vars.color.border,
      selectors: {
        '&:hover:not(:disabled)': {
          transform: 'translateY(-1px)',
          backgroundColor: vars.color.surfaceMuted,
        },
      },
    },
  ],
  danger: [
    base,
    {
      backgroundColor: vars.color.danger,
      color: vars.color.accentText,
      borderColor: vars.color.danger,
      selectors: {
        '&:hover:not(:disabled)': {
          transform: 'translateY(-1px)',
          filter: 'brightness(1.05)',
        },
      },
    },
  ],
});
