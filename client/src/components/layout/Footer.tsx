import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ConnectionStatus from './ConnectionStatus';
import * as s from './footer.css';

export default function Footer() {
  const [now, setNow] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date().toLocaleTimeString()), 1000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <>
      <footer className={s.bar}>
        <div className={s.inner}>
          <span className={s.small}>Local time: {now}</span>
          <div className={s.right}>
            <nav className={s.links} aria-label="Legal and accessibility links">
              <Link to="/accessibility" className={s.small}>
                Accessibility
              </Link>
              <span className={s.separator} aria-hidden="true">
                ·
              </span>
              <Link to="/privacy-policy" className={s.small}>
                Privacy
              </Link>
              <span className={s.separator} aria-hidden="true">
                ·
              </span>
              <Link to="/terms-of-service" className={s.small}>
                Terms
              </Link>
            </nav>
            <Link to="/contact" className={s.small}>
              Need a hand? Get in touch →
            </Link>
            <ConnectionStatus />
          </div>
        </div>
      </footer>
    </>
  );
}
