import { style } from '@vanilla-extract/css';
import { vars } from '@client/app/theme.css';

export const page = style({
  display: 'grid',
  gap: vars.space.xl,
});

export const hero = style({
  backgroundColor: vars.color.surface,
  border: `2px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.card,
  padding: vars.space.xl,
  display: 'grid',
  gap: vars.space.md,
  position: 'relative',
  selectors: {
    '&::after': {
      content: '',
      position: 'absolute',
      inset: '18px',
      border: `1px dashed rgba(58, 43, 26, 0.25)`,
      borderRadius: vars.radius.md,
      pointerEvents: 'none',
    },
  },
});

export const missionHeadline = style({
  fontSize: '2.4rem',
  lineHeight: 1.1,
  textTransform: 'uppercase',
  margin: 0,
});

export const missionLead = style({
  fontSize: '1.2rem',
  color: vars.color.textMuted,
  maxWidth: '56ch',
});

export const stats = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.lg,
});

export const statCard = style({
  minWidth: '180px',
  padding: vars.space.md,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  backgroundColor: 'rgba(255, 255, 255, 0.35)',
  backdropFilter: 'blur(2px)',
  selectors: {
    '[data-theme="dark"] &': {
      backgroundColor: 'rgba(48, 34, 21, 0.35)',
    },
  },
});

export const statNumber = style({
  fontFamily: vars.font.display,
  fontSize: '1.8rem',
  marginBottom: vars.space.xs,
});

export const valuesSection = style({
  display: 'grid',
  gap: vars.space.md,
});

export const valueGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: vars.space.md,
});

export const valueCard = style({
  backgroundColor: vars.color.surface,
  border: `2px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: vars.space.lg,
  boxShadow: vars.shadow.card,
  display: 'grid',
  gap: vars.space.sm,
});

export const timeline = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  borderLeft: `3px solid ${vars.color.border}`,
  paddingLeft: vars.space.lg,
  display: 'grid',
  gap: vars.space.md,
});

export const timelineItem = style({
  position: 'relative',
  paddingLeft: vars.space.sm,
  selectors: {
    '&::before': {
      content: '',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      border: `2px solid ${vars.color.primary}`,
      backgroundColor: vars.color.surface,
      position: 'absolute',
      left: '-30px',
      top: '4px',
    },
  },
});

export const faqSection = style({
  display: 'grid',
  gap: vars.space.md,
});

export const faqList = style({
  display: 'grid',
  gap: vars.space.sm,
});

export const faqItem = style({
  backgroundColor: vars.color.surface,
  border: `2px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  boxShadow: vars.shadow.card,
  overflow: 'hidden',
});

export const faqSummary = style({
  fontFamily: vars.font.display,
  fontSize: '1.05rem',
  padding: `${vars.space.md} ${vars.space.lg}`,
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const faqContent = style({
  padding: `${vars.space.sm} ${vars.space.lg} ${vars.space.lg}`,
  color: vars.color.textMuted,
  lineHeight: 1.7,
});

export const highlight = style({
  color: vars.color.primary,
});
