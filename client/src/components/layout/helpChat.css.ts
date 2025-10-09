import { style } from '@vanilla-extract/css';
import { vars } from '@client/app/theme.css';

export const container = style({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  zIndex: 1000,
});

export const chatButton = style({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  border: `2px solid ${vars.color.border}`,
  backgroundColor: vars.color.primary,
  color: vars.color.primaryText,
  fontSize: '24px',
  cursor: 'pointer',
  boxShadow: vars.shadow.card,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  selectors: {
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    },
  },
});

export const helpPanel = style({
  position: 'absolute',
  bottom: '80px',
  right: '0',
  width: '320px',
  backgroundColor: vars.color.surface,
  border: `2px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  boxShadow: vars.shadow.card,
  overflow: 'hidden',
  animation: 'fadeInUp 0.3s ease',
});

export const header = style({
  padding: vars.space.md,
  borderBottom: `1px solid ${vars.color.border}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: vars.color.secondary,
});

export const closeBtn = style({
  background: 'none',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  color: vars.color.textMuted,
  padding: '0',
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  selectors: {
    '&:hover': {
      color: vars.color.text,
    },
  },
});

export const options = style({
  padding: vars.space.sm,
  display: 'grid',
  gap: vars.space.xs,
});

export const option = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: vars.space.sm,
  borderRadius: vars.radius.sm,
  textDecoration: 'none',
  color: vars.color.text,
  transition: 'background-color 0.2s ease',
  selectors: {
    '&:hover': {
      backgroundColor: 'rgba(91, 207, 251, 0.1)',
    },
  },
});

export const icon = style({
  fontSize: '20px',
  minWidth: '24px',
  textAlign: 'center',
});

export const footer = style({
  padding: vars.space.sm,
  borderTop: `1px solid ${vars.color.border}`,
  backgroundColor: 'rgba(91, 207, 251, 0.05)',
  textAlign: 'center',
});

export const footerText = style({
  margin: 0,
  fontSize: '12px',
  color: vars.color.textMuted,
});

export const footerLink = style({
  color: vars.color.link,
  textDecoration: 'none',
  selectors: {
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

export const section = style({
  padding: `0 ${vars.space.sm} ${vars.space.sm}`,
});

export const sectionTitle = style({
  margin: `${vars.space.sm} 0 ${vars.space.xs} 0`,
  fontSize: '13px',
  fontWeight: 600,
  color: vars.color.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  padding: `0 ${vars.space.sm}`,
});

export const quickActions = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space.xs,
  padding: `0 ${vars.space.sm}`,
});

export const actionBtn = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.surface,
  color: vars.color.text,
  fontSize: '12px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  selectors: {
    '&:hover': {
      backgroundColor: 'rgba(91, 207, 251, 0.1)',
    },
  },
});

export const optionTitle = style({
  margin: '0 0 4px 0',
  fontSize: '14px',
  fontWeight: 600,
});

export const optionDescription = style({
  margin: 0,
  fontSize: '12px',
  color: vars.color.textMuted,
});

export const chatModes = style({
  display: 'flex',
  borderBottom: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.secondary,
});

export const modeBtn = style({
  flex: 1,
  padding: `${vars.space.sm} ${vars.space.md}`,
  border: 'none',
  backgroundColor: 'transparent',
  color: vars.color.textMuted,
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  selectors: {
    '&:hover': {
      backgroundColor: 'rgba(91, 207, 251, 0.1)',
      color: vars.color.text,
    },
  },
});

export const activeModeBtn = style([
  modeBtn,
  {
    backgroundColor: vars.color.primary,
    color: vars.color.primaryText,
    selectors: {
      '&:hover': {
        backgroundColor: vars.color.primary,
        color: vars.color.primaryText,
      },
    },
  },
]);

export const aiChatContainer = style({
  padding: vars.space.sm,
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

export const messagesContainer = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  maxHeight: '150px',
  overflowY: 'auto',
  padding: `0 ${vars.space.xs}`,
});

export const message = style({
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.radius.sm,
  fontSize: '12px',
  lineHeight: 1.4,
});

export const userMessage = style([
  message,
  {
    backgroundColor: vars.color.primary,
    color: vars.color.primaryText,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
]);

export const aiMessage = style([
  message,
  {
    backgroundColor: 'rgba(91, 207, 251, 0.1)',
    color: vars.color.text,
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },
]);

export const chatInput = style({
  display: 'flex',
  gap: vars.space.xs,
  padding: `${vars.space.xs} 0`,
});

export const inputField = style({
  flex: 1,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  fontSize: '12px',
  backgroundColor: vars.color.surface,
  color: vars.color.text,
  selectors: {
    '&:focus': {
      outline: 'none',
      borderColor: vars.color.primary,
      boxShadow: `0 0 0 2px rgba(146, 63, 43, 0.2)`,
    },
  },
});

export const sendBtn = style({
  padding: `${vars.space.xs} ${vars.space.sm}`,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.primary,
  color: vars.color.primaryText,
  fontSize: '12px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  selectors: {
    '&:hover': {
      backgroundColor: 'rgba(146, 63, 43, 0.9)',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});

export const aiSuggestions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
  marginBottom: vars.space.sm,
});

export const suggestionBtn = style({
  padding: `${vars.space.xs} ${vars.space.sm}`,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  backgroundColor: 'transparent',
  color: vars.color.text,
  fontSize: '11px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  selectors: {
    '&:hover': {
      backgroundColor: 'rgba(91, 207, 251, 0.1)',
      borderColor: vars.color.primary,
    },
  },
});
