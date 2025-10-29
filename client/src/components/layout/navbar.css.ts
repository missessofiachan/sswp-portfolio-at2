import { style } from '@vanilla-extract/css';
import { vars } from '@client/app/theme.css';
import { sprinkles } from '@client/app/sprinkles.css';

export const bar = style([
  {
    borderBottom: `1px solid ${vars.color.border}`,
    backgroundColor: vars.color.surface,
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
]);

export const inner = style([
  sprinkles({
    px: 'lg',
    py: 'md',
  }),
  {
    width: '100%',
    maxWidth: vars.size.container,
    marginInline: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: vars.space.md,
  },
]);

export const brand = style([
  {
    fontFamily: vars.font.heading,
    fontWeight: 700,
    fontSize: '1.2rem',
    color: vars.color.text,
    letterSpacing: '-0.02em',
  },
]);

export const links = style([
  {
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.md,
  },
]);

export const link = style([
  {
    color: vars.color.textMuted,
    fontWeight: 500,
    position: 'relative',
    transition: 'color 150ms ease',
    selectors: {
      '&:hover': {
        color: vars.color.text,
      },
    },
  },
]);

export const linkActive = style([
  link,
  {
    color: vars.color.text,
    selectors: {
      '&::after': {
        content: '',
        position: 'absolute',
        left: 0,
        bottom: -6,
        width: '100%',
        height: '2px',
        borderRadius: vars.radius.pill,
        background: `linear-gradient(90deg, ${vars.color.accent}, ${vars.color.accentMuted})`,
      },
    },
  },
]);

export const cartBadge = style({
  position: 'absolute',
  top: -4,
  right: -8,
  backgroundColor: vars.color.accent,
  color: vars.color.surface,
  borderRadius: vars.radius.pill,
  padding: '2px 6px',
  fontSize: 12,
  fontWeight: 700,
  minWidth: 18,
  textAlign: 'center',
  lineHeight: '1.2',
});

export const cartPreview = style({
  position: 'absolute',
  right: 0,
  top: 'calc(100% + 10px)',
  minWidth: 260,
  backgroundColor: vars.color.surface,
  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  zIndex: 100,
  padding: vars.space.md,
  color: vars.color.text,
});

export const cartPreviewTitle = style({
  fontWeight: 600,
  marginBottom: vars.space.sm,
  color: vars.color.text,
});

export const cartEmpty = style({
  color: vars.color.textMuted,
  fontSize: 14,
});

export const cartItemsList = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  maxHeight: 180,
  overflowY: 'auto',
});

export const cartItem = style({
  display: 'flex',
  alignItems: 'center',
  marginBottom: vars.space.xs,
  gap: vars.space.xs,
});

export const cartItemImage = style({
  width: 32,
  height: 32,
  objectFit: 'cover',
  borderRadius: vars.radius.sm,
});

export const cartItemName = style({
  flex: 1,
  fontSize: 14,
});

export const cartItemQuantity = style({
  fontSize: 14,
  color: vars.color.textMuted,
});

export const cartItemPrice = style({
  fontSize: 14,
  fontWeight: 500,
});

export const cartTotal = style({
  borderTop: `1px solid ${vars.color.border}`,
  marginTop: vars.space.sm,
  paddingTop: vars.space.sm,
  fontWeight: 600,
  textAlign: 'right',
});

export const cartCheckoutButton = style({
  marginTop: vars.space.sm,
  width: '100%',
  backgroundColor: vars.color.accent,
  color: vars.color.surface,
  border: 'none',
  borderRadius: vars.radius.md,
  padding: `${vars.space.xs} 0`,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 150ms ease',
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.accentMuted,
      transform: 'translateY(-1px)',
    },
  },
});

export const cartContainer = style({
  position: 'relative',
  display: 'inline-block',
});

export const cartButton = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
});
