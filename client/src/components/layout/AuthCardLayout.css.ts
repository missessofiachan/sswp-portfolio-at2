import { sprinkles } from '@client/app/sprinkles.css';
import { vars } from '@client/app/theme.css';
import { style } from '@vanilla-extract/css';

export const wrapper = style([
  sprinkles({ py: 'lg' }),
  {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: vars.color.background,
  },
]);

export const card = style({
  width: '100%',
  maxWidth: '480px',
  backgroundColor: vars.color.surface,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  boxShadow: vars.shadow.md,
  padding: vars.space.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
});

export const header = style({
  textAlign: 'center',
  display: 'grid',
  gap: vars.space.xs,
});

export const iconWrap = style({
  fontSize: '2.5rem',
});

export const title = style({
  margin: 0,
  fontSize: '1.5rem',
  fontWeight: 700,
});

export const subtitle = style({
  margin: 0,
  color: vars.color.textMuted,
});

export const footer = style({
  borderTop: `1px solid ${vars.color.border}`,
  paddingTop: vars.space.md,
  textAlign: 'center',
  fontSize: '0.875rem',
});
