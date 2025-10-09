import { style } from '@vanilla-extract/css';
import { vars } from '@client/app/theme.css';

export const toggle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: '9999px',
  cursor: 'pointer',
  backgroundColor: vars.color.surface,
  border: `2px solid ${vars.color.border}`,
  boxShadow: vars.shadow.card,
  color: vars.color.text,
  transition: 'transform 0.2s ease, filter 0.2s ease',
  userSelect: 'none',
  selectors: {
    '&:hover': {
      transform: 'translate(-1px, -1px)',
      filter: 'brightness(1.05)',
    },
    '&:active': {
      transform: 'translate(0, 0)',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 3px rgba(146, 63, 43, 0.2)`,
    },
  },
});

export const icon = style({
  width: '20px',
  height: '20px',
});
