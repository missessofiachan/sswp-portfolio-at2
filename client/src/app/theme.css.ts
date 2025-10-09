// design tokens (vanilla-extract)
import { createGlobalTheme, globalStyle } from '@vanilla-extract/css';

// Design tokens – modern light theme focused on white, light blue and light pink
export const vars = createGlobalTheme(':root', {
  color: {
    // Aged paper palette
    bg: '#f6ecd6',
    surface: '#fcf3e0',
    text: '#3a2b1a',
    textMuted: '#6d5b45',
    // Accents inspired by vintage inks
    primary: '#923f2b',
    primaryText: '#fef8ec',
    secondary: '#d7b48b',
    secondaryText: '#3a2b1a',
    border: '#c7a57a',
    link: '#8b3a29',
    linkHover: '#62281d',
    danger: '#8c1c13',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  radius: {
    sm: '4px',
    md: '6px',
    lg: '10px',
  },
  shadow: {
    card: '4px 4px 0 rgba(82, 52, 27, 0.25)',
  },
  font: {
    body: '"Libre Baskerville", "Times New Roman", serif',
    display: '"Playfair Display", "Libre Baskerville", serif',
  },
  layout: {
    maxWidth: '1120px',
  },
});

// Dark theme overrides (enabled when <html data-theme="dark"> is present)
export const dark = createGlobalTheme('[data-theme="dark"]', {
  color: {
    // Deep sepia night mode
    bg: '#1f1811',
    surface: '#2a2118',
    text: '#f0e7d6',
    textMuted: '#bda988',
    primary: '#c46d4c',
    primaryText: '#1f1811',
    secondary: '#aa8a5f',
    secondaryText: '#1f1811',
    border: '#5c4733',
    link: '#d9a074',
    linkHover: '#f2b894',
    danger: '#f87171',
  },
  space: vars.space,
  radius: vars.radius,
  shadow: vars.shadow,
  font: vars.font,
  layout: vars.layout,
});

// Global defaults
globalStyle('*,*::before,*::after', { boxSizing: 'border-box' });
globalStyle('html,body,#root', { height: '100%' });
globalStyle('body', {
  margin: 0,
  backgroundColor: vars.color.bg,
  backgroundImage:
    'radial-gradient(circle at 1px 1px, rgba(89, 63, 38, 0.08) 1px, transparent 0), linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(198, 167, 128, 0.12) 100%)',
  backgroundSize: '12px 12px, 100% 100%',
  color: vars.color.text,
  fontFamily: vars.font.body,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});
globalStyle('[data-theme="dark"] body', {
  backgroundColor: vars.color.bg,
  backgroundImage:
    'radial-gradient(circle at 1px 1px, rgba(255, 219, 173, 0.06) 1px, transparent 0), linear-gradient(180deg, rgba(48, 34, 21, 0.85) 0%, rgba(32, 23, 15, 0.95) 100%)',
  backgroundSize: '12px 12px, 100% 100%',
  color: vars.color.text,
});
globalStyle('a', { color: vars.color.link, textDecoration: 'none' });
globalStyle('a:hover', { color: vars.color.linkHover, textDecoration: 'underline' });

globalStyle('h1, h2, h3, h4, h5, h6', {
  fontFamily: vars.font.display,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
});

globalStyle('h1', {
  borderBottom: `4px double ${vars.color.border}`,
  paddingBottom: '0.35rem',
});

// Shared layout class (container)
export const container = {
  class: 'container',
};
globalStyle(`.${container.class}`, {
  maxWidth: vars.layout.maxWidth,
  marginInline: 'auto',
  paddingInline: vars.space.lg,
  paddingBlock: vars.space.lg,
});
