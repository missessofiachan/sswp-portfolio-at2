// design tokens (vanilla-extract)
import { createGlobalTheme, globalStyle } from '@vanilla-extract/css';

// Design tokens – modern light theme focused on white, light blue and light pink
export const vars = createGlobalTheme(':root', {
  color: {
    // Light mode
    bg: '#ffffff', // white background
    surface: '#f7f7f8', // subtle surface for cards/inputs
    text: '#0a0a0a', // near-black text
    textMuted: '#525252', // muted gray
    // Accents
    primary: '#5bcffb', // requested blue
    primaryText: '#0a0a0a', // readable on the light blue
    secondary: '#f5abb9', // requested pink
    secondaryText: '#0a0a0a',
    // UI chrome
    border: '#e5e7eb',
    link: '#0ea5e9', // cyan-500 (close to primary)
    linkHover: '#0284c7', // cyan-600 (darker on hover)
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
    // Dark mode with black background
    bg: '#000000', // black background
    surface: '#0b0b0f', // near-black surface
    text: '#f5f5f5',
    textMuted: '#c7c7c7',
    // Keep the same accents for brand consistency
    primary: '#5bcffb',
    primaryText: '#0a0a0a',
    secondary: '#f5abb9',
    secondaryText: '#0a0a0a',
    border: '#1f2937',
    link: '#5bcffb',
    linkHover: '#34bdf9',
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
