import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';
import * as styles from './navbar.css';

const THEME_KEY = 'sswp:theme';

function getInitialTheme(): 'dark' | 'light' {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    /* ignore */
  }
  // default to dark (matches existing vars)
  return 'dark';
}

export default function Navbar() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => getInitialTheme());

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
    // set data-theme on the root element so vanilla-extract darkVars apply
    if (typeof document !== 'undefined') {
      if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
      else document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <Link to="/">TU Shop</Link>
        <div className={styles.links}>
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/legacy" className={linkClass}>
            Legacy
          </NavLink>
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
        </div>
      </div>
      <div className={styles.actions}>
        <button
          aria-label="Toggle dark mode"
          aria-pressed={theme === 'dark'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggle}
          className={styles.iconButton}
        >
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
      </div>
    </nav>
  );
}
