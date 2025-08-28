// design tokens (vanilla-extract)
import { createGlobalTheme } from '@vanilla-extract/css';

// Light / default theme (applies to :root)
export const vars = createGlobalTheme(':root', {
  color: {
    bg: '#0b0b0f',
    text: '#f6f6f6',
    primary: '#7c5cff',
  },
  space: { xs: '4px', sm: '8px', md: '16px', lg: '24px' },
  radius: { md: '10px' },
});

// Dark-mode toggle: when <html data-theme="dark"> is set, these vars override the defaults.
// This keeps the existing vars contract but swaps sensible light colors for the dark theme.
export const darkVars = createGlobalTheme('[data-theme="dark"]', {
  color: {
    bg: '#f6f6f6',
    text: '#0b0b0f',
    primary: '#7c5cff',
  },
  space: { xs: '4px', sm: '8px', md: '16px', lg: '24px' },
  radius: { md: '10px' },
});
