import { Link, NavLink } from 'react-router-dom';
import * as s from './navbar.css';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@client/features/auth/AuthProvider';

/**
 * Navbar component that renders the top-level site navigation.
 *
 * Uses the authentication context returned by useAuth() to determine which
 * navigation items to display and to provide a logout action:
 * - token: presence indicates an authenticated user
 * - isAdmin: when true, shows the Admin link
 * - logout: invoked when the Logout button is clicked
 *
 * Navigation behavior:
 * - Always visible: "Products", "Legacy"
 * - If not authenticated: "Register", "Login"
 * - If authenticated: "Logout" button and, if isAdmin, "Admin" link
 * - ThemeToggle is always rendered as part of the navigation
 *
 * Styling and helpers:
 * - Uses a CSS module `s` for layout and link styles (s.bar, s.inner, s.brand,
 *   s.links, s.link, s.linkActive)
 * - getLinkClassName is a small helper that composes the link class with the
 *   active class when a NavLink is active
 *
 * Accessibility notes:
 * - Navigation links use NavLink for semantic navigation and active state
 * - Logout is a button element (appropriate for an action)
 *
 * @component
 * @returns {JSX.Element} The navigation bar element ready to be rendered in the app
 *
 * @example
 * <Navbar />
 */
export default function Navbar() {
  const { token, logout, isAdmin } = useAuth();
  const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `${s.link} ${isActive ? s.linkActive : ''}`;
  return (
    <nav className={s.bar}>
      <div className={s.inner}>
        <Link className={s.brand} to="/">
          Sofia's Shop
        </Link>
        <span className={s.links}>
          <NavLink to="/products" className={getLinkClassName}>
            Products
          </NavLink>
          <NavLink to="/about" className={getLinkClassName}>
            About
          </NavLink>
          <NavLink to="/contact" className={getLinkClassName}>
            Contact
          </NavLink>
          <NavLink to="/legacy" className={getLinkClassName}>
            Legacy
          </NavLink>
          {!token && (
            <>
              <NavLink to="/register" className={getLinkClassName}>
                Register
              </NavLink>
              <NavLink to="/login" className={getLinkClassName}>
                Login
              </NavLink>
            </>
          )}
          {token && (
            <>
              {isAdmin && (
                <NavLink to="/admin" className={getLinkClassName}>
                  Admin
                </NavLink>
              )}
              <button className={s.link} onClick={logout}>
                Logout
              </button>
            </>
          )}
          <ThemeToggle />
        </span>
      </div>
    </nav>
  );
}
