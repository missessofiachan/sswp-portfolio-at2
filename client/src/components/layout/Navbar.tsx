import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { FocusEvent } from 'react';
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
  const { token, logout, isAdmin } = useAuth();
  const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `${s.link} ${isActive ? s.linkActive : ''}`;
  const cartCount = useAtomValue(cartTotalCountAtom);
  const cartItems = useAtomValue(cartItemsAtom);
  const cartSummary = useAtomValue(cartSummaryAtom);
  const setCartOpen = useSetAtom(isCartOpenAtom);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const handlePreviewOpen = () => setShowCartPreview(true);
  const handlePreviewClose = () => setShowCartPreview(false);
  const handlePreviewBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget as Node)) {
      handlePreviewClose();
    }
  };

  useEffect(() => {
    if (!showCartPreview) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handlePreviewClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCartPreview]);

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
              <NavLink to="/orders" className={getLinkClassName}>
                My Orders
              </NavLink>
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
            className={s.cartContainer}
            onMouseEnter={handlePreviewOpen}
            onMouseLeave={handlePreviewClose}
            onFocus={handlePreviewOpen}
            onBlur={handlePreviewBlur}
          >
            <button
              className={`${s.link} ${s.cartButton}`}
              aria-label="View cart"
              aria-haspopup="dialog"
              aria-expanded={showCartPreview}
              onClick={() => {
                setCartOpen(true);
                handlePreviewClose();
              }}
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
              {cartCount > 0 && <span className={s.cartBadge}>{cartCount}</span>}
            </button>
            {showCartPreview && (
              <div className={s.cartPreview}>
                <div className={s.cartPreviewTitle}>Cart Preview</div>
                {cartItems.length === 0 ? (
                  <div className={s.cartEmpty}>Cart is empty</div>
                ) : (
                  <ul className={s.cartItemsList}>
                    {cartItems.map((item) => (
                      <li key={item.id} className={s.cartItem}>
                        {item.image && (
                          <img src={item.image} alt={item.name} className={s.cartItemImage} />
                        )}
                        <span className={s.cartItemName}>{item.name}</span>
                        <span className={s.cartItemQuantity}>x{item.quantity}</span>
                        <span className={s.cartItemPrice}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className={s.cartTotal}>Total: ${cartSummary.total.toFixed(2)}</div>
                <Link
                  to="/checkout"
                  className={s.cartCheckoutButton}
                  onClick={() => {
                    setCartOpen(false);
                    handlePreviewClose();
                  }}
                >
                  Checkout
                </Link>
              </div>
            )}
          </div>
          <ThemeToggle />
        </span>
      </div>
    </nav>
  );
}
