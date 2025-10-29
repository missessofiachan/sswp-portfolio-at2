/**
 * Order Detail Page Styles
 *
 * Vanilla Extract styles for the order detail page.
 *
 * @fileoverview Order detail page styles
 * @module pages/OrderDetail.css
 */

import { style } from '@vanilla-extract/css';
import { vars } from '../app/theme.css';

export const container = style({
  maxWidth: 1200,
  margin: '0 auto',
  padding: vars.space.lg,
});

export const loading = style({
  textAlign: 'center',
  padding: vars.space.xl,
  color: vars.color.textMuted,
});

export const error = style({
  textAlign: 'center',
  padding: vars.space.xl,
  color: vars.color.danger,
});

export const header = style({
  marginBottom: vars.space.lg,
});

export const backLink = style({
  display: 'inline-block',
  color: vars.color.accent,
  textDecoration: 'none',
  marginBottom: vars.space.md,
  fontWeight: 500,
  transition: 'color 150ms ease',
  selectors: {
    '&:hover': {
      color: vars.color.accentMuted,
      textDecoration: 'underline',
    },
  },
});

export const title = style({
  fontSize: 32,
  fontWeight: 700,
  marginBottom: vars.space.xs,
  color: vars.color.text,
});

export const orderId = style({
  color: vars.color.textMuted,
  fontSize: 16,
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: vars.space.md,
  marginBottom: vars.space.lg,
});

export const card = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: vars.space.md,
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
});

export const cardTitle = style({
  fontSize: 18,
  fontWeight: 600,
  marginBottom: vars.space.sm,
  color: vars.color.text,
});

export const statusBadge = style({
  display: 'inline-block',
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.radius.pill,
  color: '#fff',
  fontWeight: 600,
  fontSize: 14,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: vars.space.sm,
});

export const statusDescription = style({
  color: vars.color.textMuted,
  fontSize: 14,
  marginBottom: vars.space.sm,
});

export const dates = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  fontSize: 14,
  color: vars.color.text,
});

export const paymentMethod = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontSize: 16,
  marginBottom: vars.space.sm,
  color: vars.color.text,
});

export const paymentIcon = style({
  fontSize: 24,
});

export const paymentStatus = style({
  fontSize: 14,
  color: vars.color.textMuted,
});

export const address = style({
  fontStyle: 'normal',
  lineHeight: 1.6,
  color: vars.color.text,
});

export const tracking = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  fontSize: 14,
  color: vars.color.text,
});

export const itemsList = style({
  marginBottom: vars.space.md,
});

export const item = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: vars.space.sm,
  borderBottom: `1px solid ${vars.color.border}`,
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
  },
});

export const itemImage = style({
  width: 60,
  height: 60,
  objectFit: 'cover',
  borderRadius: vars.radius.sm,
});

export const itemDetails = style({
  flex: 1,
});

export const itemName = style({
  fontWeight: 600,
  marginBottom: vars.space.xs,
  color: vars.color.text,
});

export const itemMeta = style({
  fontSize: 14,
  color: vars.color.textMuted,
});

export const itemPrice = style({
  fontWeight: 600,
  fontSize: 16,
  color: vars.color.text,
});

export const summary = style({
  borderTop: `2px solid ${vars.color.border}`,
  paddingTop: vars.space.md,
  marginTop: vars.space.md,
});

export const summaryRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: vars.space.sm,
  fontSize: 16,
  color: vars.color.text,
});

export const summaryRowTotal = style([
  summaryRow,
  {
    fontSize: 20,
    fontWeight: 700,
    paddingTop: vars.space.sm,
    borderTop: `1px solid ${vars.color.border}`,
    color: vars.color.text,
  },
]);

export const notes = style({
  color: vars.color.text,
  lineHeight: 1.6,
  fontSize: 14,
});

export const actions = style({
  display: 'flex',
  gap: vars.space.md,
  justifyContent: 'flex-end',
  marginTop: vars.space.lg,
});

export const cancelButton = style({
  backgroundColor: vars.color.danger,
  color: '#fff',
  border: 'none',
  borderRadius: vars.radius.md,
  padding: `${vars.space.sm} ${vars.space.lg}`,
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 150ms ease',
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: '#dc2626',
      transform: 'translateY(-1px)',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});
