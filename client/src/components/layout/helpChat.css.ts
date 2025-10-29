import { style } from '@vanilla-extract/css';
import { vars } from '@client/app/theme.css';

export const container = style({
  position: 'fixed',
  bottom: vars.space.lg,
  right: vars.space.lg,
  zIndex: 80,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

export const chatButton = style({
  width: '56px',
  height: '56px',
  borderRadius: vars.radius.pill,
  border: 'none',
  background: `linear-gradient(135deg, ${vars.color.accent} 0%, ${vars.color.accentMuted} 100%)`,
  color: vars.color.accentText,
  fontSize: '1.5rem',
  boxShadow: vars.shadow.md,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 160ms ease, box-shadow 160ms ease',
  selectors: {
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: vars.shadow.lg,
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${vars.color.focus}`,
    },
  },
});

export const helpPanel = style({
  width: '320px',
  maxWidth: 'calc(100vw - 32px)',
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.surface,
  boxShadow: vars.shadow.lg,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderBottom: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.surfaceMuted,
});

export const closeBtn = style({
  width: '32px',
  height: '32px',
  borderRadius: vars.radius.pill,
  border: 'none',
  background: 'transparent',
  color: vars.color.textMuted,
  fontSize: '1.2rem',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  selectors: {
    '&:hover': {
      color: vars.color.text,
    },
  },
});

export const options = style({
  padding: vars.space.md,
  display: 'grid',
  gap: vars.space.sm,
});

export const option = style({
  display: 'grid',
  gap: vars.space.xs,
  padding: vars.space.sm,
  borderRadius: vars.radius.md,
  border: `1px solid transparent`,
  backgroundColor: vars.color.surface,
  transition: 'border-color 120ms ease, background-color 120ms ease',
  selectors: {
    '&:hover': {
      borderColor: vars.color.accent,
      backgroundColor: vars.color.surfaceMuted,
    },
  },
});

export const icon = style({
  fontSize: '1.2rem',
  color: vars.color.accent,
});

export const footer = style({
  borderTop: `1px solid ${vars.color.border}`,
  padding: vars.space.sm,
  textAlign: 'center',
  backgroundColor: vars.color.surfaceMuted,
});

export const footerText = style({
  margin: 0,
  fontSize: '0.75rem',
  color: vars.color.textMuted,
});

export const footerLink = style({
  color: vars.color.accent,
});

export const section = style({
  padding: `${vars.space.sm} ${vars.space.md}`,
  display: 'grid',
  gap: vars.space.sm,
});

export const sectionTitle = style({
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  color: vars.color.textMuted,
});

export const quickActions = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: vars.space.xs,
});

export const actionBtn = style({
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  backgroundColor: vars.color.surface,
  color: vars.color.text,
  fontSize: '0.8rem',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background-color 120ms ease, border-color 120ms ease',
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.surfaceMuted,
      borderColor: vars.color.accent,
    },
  },
});

export const optionTitle = style({
  fontWeight: 600,
  margin: 0,
});

export const optionDescription = style({
  margin: 0,
  fontSize: '0.85rem',
  color: vars.color.textMuted,
});

export const chatModes = style({
  display: 'flex',
  borderBottom: `1px solid ${vars.color.border}`,
});

export const modeBtn = style({
  flex: 1,
  padding: `${vars.space.sm} ${vars.space.md}`,
  border: 'none',
  background: 'transparent',
  color: vars.color.textMuted,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'color 120ms ease, background-color 120ms ease',
  selectors: {
    '&:hover': {
      color: vars.color.text,
      backgroundColor: vars.color.surfaceMuted,
    },
  },
});

export const activeModeBtn = style([
  modeBtn,
  {
    color: vars.color.accentText,
    backgroundColor: vars.color.accent,
  },
]);

export const aiChatContainer = style({
  padding: vars.space.md,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

export const messagesContainer = style({
  maxHeight: '200px',
  overflowY: 'auto',
  display: 'grid',
  gap: vars.space.xs,
});

export const message = style({
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.radius.md,
  fontSize: '0.85rem',
  lineHeight: 1.4,
});

export const userMessage = style([
  message,
  {
    backgroundColor: vars.color.accent,
    color: vars.color.accentText,
    justifySelf: 'end',
  },
]);

export const aiMessage = style([
  message,
  {
    backgroundColor: vars.color.surfaceMuted,
    color: vars.color.text,
    justifySelf: 'start',
  },
]);

export const chatInput = style({
  display: 'flex',
  gap: vars.space.xs,
});

export const inputField = style({
  flex: 1,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  backgroundColor: vars.color.surface,
  color: vars.color.text,
});

export const sendBtn = style({
  borderRadius: vars.radius.md,
  border: 'none',
  padding: `${vars.space.xs} ${vars.space.sm}`,
  backgroundColor: vars.color.accent,
  color: vars.color.accentText,
  cursor: 'pointer',
});

export const aiSuggestions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
});

export const suggestionBtn = style({
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  backgroundColor: 'transparent',
  color: vars.color.text,
  cursor: 'pointer',
  transition: 'border-color 120ms ease, background-color 120ms ease',
  selectors: {
    '&:hover': {
      borderColor: vars.color.accent,
      backgroundColor: vars.color.surfaceMuted,
    },
  },
});
