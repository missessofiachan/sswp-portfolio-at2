import { useEffect, useState } from 'react';
import { btnOutline } from '@client/app/ui.css';

function getInitial(): 'light' | 'dark' {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    // Prefer system preference if available
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
}

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
  const [mode, setMode] = useState<'light' | 'dark'>(() => getInitial());

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const html = document.documentElement;

    // Persist to localStorage when it changes
    try {
      localStorage.setItem('theme', mode);
    } catch {}

    // Apply classes/attributes
    if (mode === 'dark') {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
    } else {
      html.classList.remove('dark');
      html.removeAttribute('data-theme');
    }
  }, [mode]);

  return (
    <button
      className={btnOutline}
      onClick={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))}
      aria-pressed={mode === 'dark'}
      title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {mode === 'light' ? 'Dark mode' : 'Light mode'}
    </button>
  );
}
