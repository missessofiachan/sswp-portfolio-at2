import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import * as s from './navbar.css';
import ThemeToggle from './ThemeToggle';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  cartTotalCountAtom,
  cartItemsAtom,
  cartSummaryAtom,
  isCartOpenAtom,
} from '@client/features/cart/cartAtoms';
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
  const navigate = useNavigate();
  const { token, logout, isAdmin } = useAuth();
  const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `${s.link} ${isActive ? s.linkActive : ''}`;
  const cartCount = useAtomValue(cartTotalCountAtom);
  const cartItems = useAtomValue(cartItemsAtom);
  const cartSummary = useAtomValue(cartSummaryAtom);
  const setCartOpen = useSetAtom(isCartOpenAtom);
  const [showCartPreview, setShowCartPreview] = useState(false);
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
          <div
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setShowCartPreview(true)}
            onMouseLeave={() => setShowCartPreview(false)}
          >
            <button
              className={s.link}
              style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
              aria-label="View cart"
              onClick={() => navigate('/checkout')}
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -8,
                    background: '#d49a6a',
                    color: '#fff',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: 12,
                    fontWeight: 700,
                    minWidth: 18,
                    textAlign: 'center',
                    lineHeight: '1.2',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
            {showCartPreview && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  minWidth: 260,
                  background: '#fff',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  borderRadius: 8,
                  zIndex: 100,
                  padding: 12,
                  color: '#2d1c0b',
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Cart Preview</div>
                {cartItems.length === 0 ? (
                  <div style={{ color: '#888', fontSize: 14 }}>Cart is empty</div>
                ) : (
                  <ul
                    style={{
                      listStyle: 'none',
                      margin: 0,
                      padding: 0,
                      maxHeight: 180,
                      overflowY: 'auto',
                    }}
                  >
                    {cartItems.map((item) => (
                      <li
                        key={item.id}
                        style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: 32,
                              height: 32,
                              objectFit: 'cover',
                              borderRadius: 4,
                              marginRight: 8,
                            }}
                          />
                        )}
                        <span style={{ flex: 1 }}>{item.name}</span>
                        <span style={{ marginLeft: 8 }}>x{item.quantity}</span>
                        <span style={{ marginLeft: 8, fontWeight: 500 }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <div
                  style={{
                    borderTop: '1px solid #eee',
                    marginTop: 8,
                    paddingTop: 8,
                    fontWeight: 600,
                    textAlign: 'right',
                  }}
                >
                  Total: ${cartSummary.total.toFixed(2)}
                </div>
                <button
                  style={{
                    marginTop: 10,
                    width: '100%',
                    background: '#d49a6a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '6px 0',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setCartOpen(false);
                    navigate('/checkout');
                  }}
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
          <ThemeToggle />
        </span>
      </div>
    </nav>
  );
}
