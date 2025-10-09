import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as s from './footer.css';
import ConnectionStatus from './ConnectionStatus';

export default function Footer() {
  const [now, setNow] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date().toLocaleTimeString()), 1000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <footer className={s.bar}>
      <div className={s.inner}>
        <span className={s.small}>Local time: {now}</span>
        <span className={s.right}>
          <Link to="/contact" className={s.small}>
            Need a hand? Get in touch →
          </Link>
          <ConnectionStatus />
        </span>
      </div>
    </footer>
  );
}
