import { useEffect, useState } from 'react';
import { btnOutline } from '@client/app/ui.css';

function getInitial(): 'light' | 'dark' {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return 'light';
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<'light' | 'dark'>(getInitial());

  useEffect(() => {
    localStorage.setItem('theme', mode);
    const html = document.documentElement;
    if (mode === 'dark') html.setAttribute('data-theme', 'dark');
    else html.removeAttribute('data-theme');
  }, [mode]);

  return (
    <button className={btnOutline} onClick={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))}>
      {mode === 'light' ? 'Dark mode' : 'Light mode'}
    </button>
  );
}

