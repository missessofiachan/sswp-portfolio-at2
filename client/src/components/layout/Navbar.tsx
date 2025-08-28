import { Link, NavLink } from 'react-router-dom';
import * as s from './navbar.css';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const link = ({ isActive }: { isActive: boolean }) => `${s.link} ${isActive ? s.linkActive : ''}`;
  return (
    <nav className={s.bar}>
      <div className={s.inner}>
        <Link className={s.brand} to="/">TU Shop</Link>
        <span className={s.links}>
          <NavLink to="/products" className={link}>
          Products
          </NavLink>
          <NavLink to="/legacy" className={link}>
          Legacy
          </NavLink>
          <NavLink to="/register" className={link}>
          Register
          </NavLink>
          <NavLink to="/login" className={link}>
          Login
          </NavLink>
          <NavLink to="/admin" className={link}>Admin</NavLink>
          <ThemeToggle />
        </span>
      </div>
    </nav>
  );
}
