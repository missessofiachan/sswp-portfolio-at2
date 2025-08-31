// design tokens (vanilla-extract)
import { createGlobalTheme, globalStyle } from '@vanilla-extract/css';

// Design tokens – modern light theme focused on white, light blue and light pink
export const vars = createGlobalTheme(':root', {
  color: {
    bg: '#ffffff', // white base
    surface: '#f8fafc', // soft surface (slate-50)
    text: '#0f172a', // slate-900
    textMuted: '#475569', // slate-600
    primary: '#60a5fa', // light blue (sky-400)
    primaryText: '#0b1220',
    secondary: '#f9a8d4', // light pink (pink-300)
    secondaryText: '#1a1020',
    border: '#e2e8f0', // slate-200
    link: '#2563eb', // blue-600
    linkHover: '#1d4ed8', // blue-700
    danger: '#ef4444',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
  },
  shadow: {
    card: '0 1px 2px rgba(2, 6, 23, 0.06), 0 1px 3px rgba(2, 6, 23, 0.10)',
  },
  font: {
    body: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, "Apple Color Emoji", "Segoe UI Emoji", sans-serif',
  },
  layout: {
    maxWidth: '1120px',
  },
});

// Dark theme overrides (enabled when <html data-theme="dark"> is present)
export const dark = createGlobalTheme('[data-theme="dark"]', {
  color: {
    bg: '#0b0b0f',
    surface: '#111827',
    text: '#f6f7fb',
    textMuted: '#cbd5e1',
    primary: '#60a5fa',
    primaryText: '#06101e',
    secondary: '#f472b6',
    secondaryText: '#120914',
    border: '#1f2937',
    link: '#93c5fd',
    linkHover: '#60a5fa',
    danger: '#ef4444',
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
  color: vars.color.text,
  fontFamily: vars.font.body,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});
globalStyle('a', { color: vars.color.link, textDecoration: 'none' });
globalStyle('a:hover', { color: vars.color.linkHover, textDecoration: 'underline' });

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
