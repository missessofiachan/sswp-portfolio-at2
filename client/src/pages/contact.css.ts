import { style } from '@vanilla-extract/css';
import { vars } from '@client/app/theme.css';

export const page = style({
  display: 'grid',
  gap: vars.space.xl,
});

export const header = style({
  display: 'grid',
  gap: vars.space.sm,
});

export const intro = style({
  fontSize: '1.1rem',
  color: vars.color.textMuted,
  maxWidth: '60ch',
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: vars.space.lg,
});

export const card = style({
  backgroundColor: vars.color.surface,
  border: `2px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: vars.space.lg,
  boxShadow: vars.shadow.card,
  display: 'grid',
  gap: vars.space.sm,
});

export const list = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'grid',
  gap: vars.space.sm,
});

export const emphasis = style({
  fontFamily: vars.font.display,
  fontSize: '1.05rem',
});

export const subtle = style({
  color: vars.color.textMuted,
  fontSize: '0.95rem',
});

export const form = style({
  display: 'grid',
  gap: vars.space.md,
});

export const field = style({
  display: 'grid',
  gap: vars.space.xs,
});

export const note = style({
  fontSize: '0.85rem',
  color: vars.color.textMuted,
});
