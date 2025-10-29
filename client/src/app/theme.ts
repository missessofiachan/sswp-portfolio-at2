import { darkThemeClass, lightThemeClass } from './theme.css';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'theme';

export function readStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }

  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

export function persistTheme(mode: ThemeMode) {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore storage failures (e.g., private mode)
  }
}

export function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') {
    return;
  }

  const html = document.documentElement;
  html.classList.remove(lightThemeClass, darkThemeClass);
  html.classList.add(mode === 'dark' ? darkThemeClass : lightThemeClass);
  html.dataset.theme = mode;
}
