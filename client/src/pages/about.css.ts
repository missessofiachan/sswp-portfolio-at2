import { sprinkles } from '@client/app/sprinkles.css';
import { vars } from '@client/app/theme.css';
import { style } from '@vanilla-extract/css';

export const page = style([
  sprinkles({
    display: 'grid',
    gap: 'xl',
  }),
]);

export const hero = style([
  sprinkles({
    display: 'grid',
    gap: 'md',
    padding: 'xl',
  }),
  {
    position: 'relative',
    borderRadius: vars.radius.lg,
    border: `1px solid ${vars.color.border}`,
    background: `linear-gradient(135deg, ${vars.color.surface} 0%, ${vars.color.surfaceMuted} 100%)`,
    boxShadow: vars.shadow.md,
  },
]);

export const missionHeadline = style({
  fontSize: '2.4rem',
  margin: 0,
  letterSpacing: '-0.02em',
});

export const missionLead = style({
  fontSize: '1.1rem',
  maxWidth: '60ch',
  color: vars.color.textMuted,
});

export const stats = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.lg,
});

export const statCard = style({
  minWidth: '180px',
  padding: vars.space.md,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.surface,
  boxShadow: vars.shadow.xs,
});

export const statNumber = style({
  fontFamily: vars.font.heading,
  fontSize: '1.8rem',
  marginBottom: vars.space.xs,
});

export const valuesSection = style([
  sprinkles({
    display: 'grid',
    gap: 'md',
  }),
]);

export const valueGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: vars.space.md,
});

export const valueCard = style({
  padding: vars.space.lg,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.surface,
  boxShadow: vars.shadow.xs,
  display: 'grid',
  gap: vars.space.sm,
});

export const timeline = style({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'grid',
  gap: vars.space.md,
  borderLeft: `2px solid ${vars.color.border}`,
  paddingLeft: vars.space.lg,
});

export const timelineItem = style({
  position: 'relative',
  paddingLeft: vars.space.sm,
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      border: `2px solid ${vars.color.accent}`,
      backgroundColor: vars.color.surface,
      left: `calc(-${vars.space.lg} - 4px)`,
      top: '4px',
    },
  },
});

export const faqSection = style([
  sprinkles({
    display: 'grid',
    gap: 'md',
  }),
]);

export const faqList = style({
  display: 'grid',
  gap: vars.space.sm,
});

export const faqItem = style({
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.surface,
  boxShadow: vars.shadow.xs,
  overflow: 'hidden',
});

export const faqSummary = style({
  padding: `${vars.space.md} ${vars.space.lg}`,
  cursor: 'pointer',
  fontFamily: vars.font.heading,
  fontSize: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const faqContent = style({
  padding: `${vars.space.sm} ${vars.space.lg} ${vars.space.lg}`,
  color: vars.color.textMuted,
  lineHeight: 1.7,
});

export const highlight = style({
  color: vars.color.accent,
  fontWeight: 600,
});
