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
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceMuted: '#eef2f6',
    text: '#0f172a',
    textMuted: '#475569',
    accent: '#2563eb',
    accentMuted: '#3b82f6',
    accentText: '#ffffff',
    border: '#d0d7e2',
    focus: 'rgba(37, 99, 235, 0.35)',
    danger: '#dc2626',
    success: '#16a34a',
    warning: '#f59e0b',
  },
  space: sharedSpace,
  radius: sharedRadius,
  font: sharedFonts,
  shadow: {
    xs: '0 1px 2px rgba(15, 23, 42, 0.08)',
    sm: '0 4px 12px rgba(15, 23, 42, 0.08)',
    md: '0 12px 30px rgba(15, 23, 42, 0.08)',
    lg: '0 32px 60px rgba(15, 23, 42, 0.10)',
  },
  size: sharedSize,
});

export const darkThemeClass = createTheme(vars, {
  color: {
    background: '#0b1120',
    surface: '#111827',
    surfaceMuted: '#1e293b',
    text: '#e2e8f0',
    textMuted: '#94a3b8',
    accent: '#3b82f6',
    accentMuted: '#60a5fa',
    accentText: '#0b1120',
    border: '#1f2937',
    focus: 'rgba(96, 165, 250, 0.4)',
    danger: '#f87171',
    success: '#22c55e',
    warning: '#fbbf24',
  },
  space: sharedSpace,
  radius: sharedRadius,
  font: sharedFonts,
  shadow: {
    xs: '0 1px 2px rgba(15, 23, 42, 0.45)',
    sm: '0 6px 18px rgba(15, 23, 42, 0.45)',
    md: '0 20px 45px rgba(15, 23, 42, 0.45)',
    lg: '0 40px 80px rgba(15, 23, 42, 0.55)',
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
export {};
