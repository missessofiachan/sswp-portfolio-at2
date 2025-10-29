import { useEffect, useMemo, useState } from 'react';
import * as Toggle from '@radix-ui/react-toggle';
import { applyTheme, persistTheme, readStoredTheme, type ThemeMode } from '@client/app/theme';
import { icon, toggle } from './themeToggle.css';

/**
 * ThemeToggle
 *
 * Renders a button that toggles the application's color scheme between "light" and "dark".
 *
 * Behavior:
 * - Maintains local state `mode` of type `'light' | 'dark'`, initialized via `getInitial()`.
 * - When `mode` changes, a `useEffect`:
 *   - Guards against server-side rendering by returning early if `document` is undefined.
 *   - Persists the current mode to `localStorage` (wrapped in a try/catch to avoid errors in restricted environments).
 *   - Applies or removes the visual theme on the document root:
 *     - Adds the `dark` CSS class and sets `data-theme="dark"` when mode is `'dark'`.
 *     - Removes the `dark` class and the `data-theme` attribute when mode is `'light'`.
 *
 * Accessibility:
 * - The button uses `aria-pressed` to indicate the active state (`true` when dark mode is active).
 * - The button `title` and visible text describe the action (e.g., "Switch to dark mode" / "Switch to light mode").
 *
 * Side effects:
 * - Mutates `document.documentElement` by toggling a class and an attribute.
 * - Writes to `localStorage` under the key `"theme"`.
 *
 * Usage:
 * - Intended to be used as a simple UI control in a layout/header to allow users to toggle theme preference.
 *
 * @returns A JSX button element that toggles the application's theme between "light" and "dark".
 */
export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(() => readStoredTheme());

  useEffect(() => {
    applyTheme(mode);
    persistTheme(mode);
  }, [mode]);

  const label = mode === 'light' ? 'Switch to dark theme' : 'Switch to light theme';

  const { sunIcon, moonIcon } = useMemo(() => {
    const sun = (
      <svg className={icon} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="5" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="10" y1="1" x2="10" y2="3" />
          <line x1="10" y1="17" x2="10" y2="19" />
          <line x1="1" y1="10" x2="3" y2="10" />
          <line x1="17" y1="10" x2="19" y2="10" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="14.36" y1="14.36" x2="15.78" y2="15.78" />
          <line x1="4.22" y1="15.78" x2="5.64" y2="14.36" />
          <line x1="14.36" y1="5.64" x2="15.78" y2="4.22" />
        </g>
      </svg>
    );

    const moon = (
      <svg className={icon} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M17.293 13.293A8 8 0 016.707 2.707a.75.75 0 00-.832-.832A8 8 0 1018 14.125a.75.75 0 00-.707-.832z"
          fill="currentColor"
        />
      </svg>
    );

    return { sunIcon: sun, moonIcon: moon };
  }, []);

  return (
    <Toggle.Root
      className={toggle}
      aria-label={label}
      title={label}
      pressed={mode === 'dark'}
      onPressedChange={(pressed: boolean) => setMode(pressed ? 'dark' : 'light')}
    >
      {mode === 'dark' ? moonIcon : sunIcon}
      <span className="sr-only">{label}</span>
    </Toggle.Root>
  );
}
