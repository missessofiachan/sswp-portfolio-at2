import { style } from '@vanilla-extract/css';
import { sprinkles } from '@client/app/sprinkles.css';
import { vars } from '@client/app/theme.css';

const transition = '180ms ease';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: 50,
});

export const backdrop = style({
  position: 'fixed',
  inset: 0,
  background: 'rgba(15, 23, 42, 0.55)',
  transition: `opacity ${transition}`,
});

export const panelRegion = style({
  position: 'fixed',
  insetBlock: 0,
  right: 0,
  display: 'flex',
  maxWidth: '100%',
  paddingInlineStart: vars.space.xl,
});

export const panelContainer = style({
  width: '100vw',
  maxWidth: '28rem',
});

export const panel = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
  }),
  {
    height: '100vh',
    backgroundColor: vars.color.surface,
    color: vars.color.text,
    boxShadow: vars.shadow.lg,
    borderLeft: `1px solid ${vars.color.border}`,
  },
]);

export const header = style([
  sprinkles({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    px: { mobile: 'md', tablet: 'lg' },
    py: 'lg',
  }),
  {
    gap: vars.space.md,
  },
]);

export const title = style({
  fontFamily: vars.font.heading,
  fontWeight: 600,
  fontSize: '1.125rem',
  margin: 0,
  color: vars.color.text,
});

export const closeButton = style({
  display: 'grid',
  placeItems: 'center',
  width: '2.25rem',
  height: '2.25rem',
  borderRadius: vars.radius.pill,
  border: 'none',
  background: 'transparent',
  color: vars.color.textMuted,
  cursor: 'pointer',
  transition: `color ${transition}, background-color ${transition}`,
  selectors: {
    '&:hover': {
      color: vars.color.text,
      backgroundColor: vars.color.surfaceMuted,
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${vars.color.focus}`,
    },
  },
});

export const closeIcon = style({
  width: '1.5rem',
  height: '1.5rem',
});

export const content = style([
  sprinkles({
    flexDirection: 'column',
    px: { mobile: 'md', tablet: 'lg' },
    py: 'lg',
  }),
  {
    flex: 1,
    display: 'flex',
    overflowY: 'auto',
  },
]);

export const emptyState = style({
  width: '100%',
  textAlign: 'center',
  paddingBlock: vars.space.xl,
});

export const emptyIcon = style({
  marginInline: 'auto',
  width: '3rem',
  height: '3rem',
  color: vars.color.textMuted,
});

export const emptyTitle = style({
  marginTop: vars.space.sm,
  fontSize: '0.95rem',
  fontWeight: 600,
  color: vars.color.text,
});

export const emptyCopy = style({
  marginTop: vars.space.xs,
  fontSize: '0.9rem',
  color: vars.color.textMuted,
});

export const emptyAction = style({
  marginTop: vars.space.lg,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.accent,
  color: vars.color.accentText,
  fontWeight: 600,
  fontSize: '0.9rem',
  boxShadow: vars.shadow.xs,
  transition: `background-color ${transition}, transform ${transition}`,
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.accentMuted,
      textDecoration: 'none',
      transform: 'translateY(-1px)',
    },
  },
});

export const listWrapper = style({
  width: '100%',
});

export const itemsList = style({
  listStyle: 'none',
  margin: 0,
  marginBlock: `calc(${vars.space.lg} * -1)`,
  padding: 0,
});

export const item = style({
  display: 'flex',
  gap: vars.space.md,
  paddingBlock: vars.space.lg,
  borderBottom: `1px solid ${vars.color.border}`,
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
  },
});

export const itemImageWrapper = style({
  width: '96px',
  height: '96px',
  flexShrink: 0,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  overflow: 'hidden',
  backgroundColor: vars.color.surfaceMuted,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const itemImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
});

export const itemPlaceholderIcon = style({
  width: '2rem',
  height: '2rem',
  color: vars.color.textMuted,
});

export const itemBody = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
});

export const itemHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: vars.space.sm,
  color: vars.color.text,
});

export const itemName = style({
  margin: 0,
  fontWeight: 600,
  fontSize: '1rem',
  color: vars.color.text,
});

export const itemTotal = style({
  margin: 0,
  fontWeight: 600,
});

export const itemMeta = style({
  marginTop: vars.space.xs,
  fontSize: '0.85rem',
  color: vars.color.textMuted,
});

export const itemFooter = style({
  marginTop: 'auto',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: vars.space.md,
  fontSize: '0.9rem',
});

export const quantityControls = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
});

export const quantityButton = style({
  width: '2rem',
  height: '2rem',
  borderRadius: vars.radius.pill,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.textMuted,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: `background-color ${transition}, color ${transition}, transform ${transition}`,
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.surfaceMuted,
      color: vars.color.text,
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${vars.color.focus}`,
    },
  },
});

export const quantityValue = style({
  minWidth: '2rem',
  textAlign: 'center',
  fontWeight: 600,
  color: vars.color.text,
});

export const removeButton = style({
  border: 'none',
  background: 'transparent',
  color: vars.color.danger,
  fontWeight: 600,
  cursor: 'pointer',
  transition: `color ${transition}`,
  selectors: {
    '&:hover': {
      color: '#b91c1c',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${vars.color.focus}`,
      borderRadius: vars.radius.sm,
    },
  },
});

export const footer = style([
  sprinkles({
    px: { mobile: 'md', tablet: 'lg' },
    py: 'lg',
  }),
  {
    borderTop: `1px solid ${vars.color.border}`,
    backgroundColor: vars.color.surface,
  },
]);

export const summarySection = style({
  display: 'grid',
  gap: vars.space.sm,
});

export const summaryDivider = style({
  borderTop: `1px solid ${vars.color.border}`,
  paddingTop: vars.space.sm,
});

export const summaryRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.9rem',
  color: vars.color.textMuted,
});

export const summaryTotal = style([
  summaryRow,
  {
    fontSize: '1rem',
    fontWeight: 600,
    color: vars.color.text,
  },
]);

export const actions = style({
  display: 'grid',
  gap: vars.space.sm,
  marginTop: vars.space.lg,
});

export const fullWidthButton = style({
  width: '100%',
  justifyContent: 'center',
  textAlign: 'center',
});

export const ghostDanger = style({
  backgroundColor: vars.color.surface,
  color: vars.color.danger,
  border: `1px solid rgba(220, 38, 38, 0.5)`,
  selectors: {
    '&:hover': {
      backgroundColor: 'rgba(248, 113, 113, 0.12)',
    },
  },
});

export const footerNote = style({
  marginTop: vars.space.sm,
  textAlign: 'center',
  fontSize: '0.85rem',
  color: vars.color.textMuted,
});
