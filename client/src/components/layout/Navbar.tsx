import { useAuth } from '@client/features/auth/AuthProvider';
import {
  cartItemsAtom,
  cartSummaryAtom,
  cartTotalCountAtom,
  isCartOpenAtom,
} from '@client/features/cart/cartAtoms';
import { useAtomValue, useSetAtom } from 'jotai';
import type { FocusEvent } from 'react';
import { useEffect, useState } from 'react';
import {
  MdAdminPanelSettings,
  MdContactMail,
  MdFavorite,
  MdInfo,
  MdLogin,
  MdLogout,
  MdPersonAdd,
  MdReceiptLong,
  MdShoppingBag,
  MdStorefront,
} from 'react-icons/md';
import { Link, NavLink } from 'react-router-dom';
import * as s from './navbar.css';
import ThemeToggle from './ThemeToggle';

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
          <MdShoppingBag size={22} aria-hidden="true" />
          <span>Sofia's Shop</span>
        </Link>
        <span className={s.links}>
          <NavLink to="/products" className={getLinkClassName}>
            <MdStorefront size={18} aria-hidden="true" />
            <span>Products</span>
          </NavLink>
          <NavLink to="/about" className={getLinkClassName}>
            <MdInfo size={18} aria-hidden="true" />
            <span>About</span>
          </NavLink>
          <NavLink to="/contact" className={getLinkClassName}>
            <MdContactMail size={18} aria-hidden="true" />
            <span>Contact</span>
          </NavLink>
          {!token && (
            <>
              <NavLink to="/register" className={getLinkClassName}>
                <MdPersonAdd size={18} aria-hidden="true" />
                <span>Register</span>
              </NavLink>
              <NavLink to="/login" className={getLinkClassName}>
                <MdLogin size={18} aria-hidden="true" />
                <span>Login</span>
              </NavLink>
            </>
          )}
          {token && (
            <>
              <NavLink to="/orders" className={getLinkClassName}>
                <MdReceiptLong size={18} aria-hidden="true" />
                <span>My Orders</span>
              </NavLink>
              <NavLink to="/favorites" className={getLinkClassName}>
                <MdFavorite size={18} aria-hidden="true" />
                <span>Favorites</span>
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={getLinkClassName}>
                  <MdAdminPanelSettings size={18} aria-hidden="true" />
                  <span>Admin</span>
                </NavLink>
              )}
              <button className={s.link} onClick={logout}>
                <MdLogout size={18} aria-hidden="true" />
                <span>Logout</span>
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
