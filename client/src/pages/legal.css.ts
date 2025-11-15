import { sprinkles } from '@client/app/sprinkles.css';
import { vars } from '@client/app/theme.css';
import { style } from '@vanilla-extract/css';

export const page = style([
  sprinkles({
    display: 'grid',
    gap: 'xl',
    width: '100%',
  }),
  {
    paddingBlock: vars.space['2xl'],
  },
]);

export const header = style([
  sprinkles({
    display: 'grid',
    gap: 'sm',
  }),
  {
    textAlign: 'center',
    justifyItems: 'center',
  },
]);

export const iconWrap = style({
  height: '64px',
  width: '64px',
  borderRadius: vars.radius.pill,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginInline: 'auto',
  background: `linear-gradient(135deg, ${vars.color.accent} 0%, ${vars.color.warning} 100%)`,
  color: vars.color.accentText,
  boxShadow: vars.shadow.sm,
});

export const subtitle = style({
  color: vars.color.textMuted,
});

export const panel = style([
  sprinkles({
    display: 'grid',
    gap: 'lg',
  }),
  {
    borderRadius: vars.radius.lg,
    border: `1px solid ${vars.color.border}`,
    backgroundColor: vars.color.surface,
    boxShadow: vars.shadow.sm,
    padding: vars.space.xl,
  },
]);

export const section = style([
  sprinkles({
    display: 'grid',
    gap: 'sm',
  }),
  {
    lineHeight: 1.7,
  },
]);

export const sectionTitle = style({
  margin: 0,
});

export const bulletList = style({
  margin: 0,
  paddingLeft: '1.4rem',
  display: 'grid',
  gap: vars.space.xs,
});

export const helperText = style({
  color: vars.color.textMuted,
  fontSize: '0.95rem',
});
