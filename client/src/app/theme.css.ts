/**
 * Design token contract and light/dark theme definitions using Vanilla
 * Extract. Also wires global typography and reset styles.
 */
import { createTheme, createThemeContract, globalStyle } from '@vanilla-extract/css';

export const vars = createThemeContract({
  color: {
    background: null,
    surface: null,
    surfaceMuted: null,
    text: null,
    textMuted: null,
    accent: null,
    accentMuted: null,
    accentText: null,
    border: null,
    focus: null,
    danger: null,
    success: null,
    warning: null,
  },
  space: {
    none: null,
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
    '2xl': null,
  },
  radius: {
    none: null,
    sm: null,
    md: null,
    lg: null,
    pill: null,
  },
  font: {
    body: null,
    heading: null,
    mono: null,
  },
  shadow: {
    xs: null,
    sm: null,
    md: null,
    lg: null,
  },
  size: {
    container: null,
  },
});

const sharedSpace = {
  none: '0px',
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const;

const sharedRadius = {
  none: '0px',
  sm: '6px',
  md: '10px',
  lg: '16px',
  pill: '999px',
} as const;

const sharedFonts = {
  body: '"Inter", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  heading: '"Plus Jakarta Sans", "Inter", system-ui, sans-serif',
  mono: '"JetBrains Mono", "SFMono-Regular", ui-monospace, monospace',
} as const;

const sharedSize = {
  container: '1120px',
} as const;

export const lightThemeClass = createTheme(vars, {
  color: {
    background: '#ffffff',
    surface: '#ffffff',
    surfaceMuted: '#f3f4f6',
    text: '#111827',
    textMuted: '#6b7280',
    accent: '#55CDFC', // Trans pride flag blue
    accentMuted: '#3bb5e8', // Darker blue for hover
    accentText: '#0a0a0a',
    border: '#e5e7eb',
    focus: 'rgba(85, 205, 252, 0.35)',
    danger: '#F7A8B8', // Trans pride pink
    success: '#10b981',
    warning: '#F7A8B8', // Trans pride pink
  },
  space: sharedSpace,
  radius: sharedRadius,
  font: sharedFonts,
  shadow: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  size: sharedSize,
});

export const darkThemeClass = createTheme(vars, {
  color: {
    background: '#121212', // True dark background
    surface: '#1f2937',
    surfaceMuted: '#374151',
    text: '#f3f4f6', // Improved contrast - 12.6:1 on #121212
    textMuted: '#d1d5db', // Improved contrast - 7.1:1 on #121212
    accent: '#7dd3fc', // Trans pride flag blue - lighter for better contrast on dark
    accentMuted: '#93daff', // Even lighter for hover
    accentText: '#0a0a0a',
    border: '#374151', // Improved visibility
    focus: 'rgba(125, 211, 252, 0.4)',
    danger: '#F7A8B8', // Trans pride pink
    success: '#22c55e',
    warning: '#F7A8B8', // Trans pride pink
  },
  space: sharedSpace,
  radius: sharedRadius,
  font: sharedFonts,
  shadow: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.45)',
    sm: '0 6px 18px rgba(0, 0, 0, 0.45)',
    md: '0 20px 45px rgba(0, 0, 0, 0.45)',
    lg: '0 40px 80px rgba(0, 0, 0, 0.55)',
  },
  size: sharedSize,
});

globalStyle(':root', {
  color: vars.color.text,
  background: vars.color.background,
  fontFamily: vars.font.body,
  lineHeight: 1.5,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});

globalStyle('body', {
  margin: 0,
  minHeight: '100vh',
  background: vars.color.background,
  color: vars.color.text,
  transition: 'background 180ms ease, color 180ms ease',
  fontSize: 'var(--pref-font-size, 1rem)',
  lineHeight: '1.5',
});

// Font size preferences support
globalStyle('html h1', {
  fontSize: 'var(--pref-font-size-xl, 2rem)',
});

globalStyle('html h2', {
  fontSize: 'var(--pref-font-size-lg, 1.5rem)',
});

globalStyle('html h3', {
  fontSize: 'var(--pref-font-size-lg, 1.25rem)',
});

globalStyle('html small, html .small', {
  fontSize: 'var(--pref-font-size-sm, 0.875rem)',
});

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
});

globalStyle('a', {
  color: vars.color.accent,
  textDecoration: 'none',
});

globalStyle('a:hover', {
  textDecoration: 'underline',
});

globalStyle('h1, h2, h3, h4, h5, h6', {
  fontFamily: vars.font.heading,
  fontWeight: 600,
  letterSpacing: '-0.02em',
  color: vars.color.text,
});

globalStyle('code, pre', {
  fontFamily: vars.font.mono,
});

globalStyle('.sr-only', {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
});

export const containerClass = {
  className: 'app-container',
};

globalStyle(`.${containerClass.className}`, {
  maxWidth: vars.size.container,
  marginInline: 'auto',
  paddingInline: vars.space.lg,
  paddingBlock: vars.space.lg,
  width: '100%',
});
