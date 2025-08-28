// design tokens (vanilla-extract)
import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    bg: '#0b0b0f',
    text: '#f6f6f6',
    primary: '#7c5cff',
  },
  space: { xs: '4px', sm: '8px', md: '16px', lg: '24px' },
  radius: { md: '10px' },
});
