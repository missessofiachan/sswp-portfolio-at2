import { useEffect, useRef, useId } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAtom, useAtomValue } from 'jotai';
import {
  cartItemsAtom,
  cartSummaryAtom,
  isCartOpenAtom,
  clearCartAtom,
  removeFromCartAtom,
  updateCartItemQuantityAtom,
} from '../../features/cart/cartAtoms';
import { btnOutline, btnPrimary } from '../../app/ui.css';
import * as s from './cart.css';

export function Cart() {
  const [isOpen, setIsOpen] = useAtom(isCartOpenAtom);
  const cartItems = useAtomValue(cartItemsAtom);
  const cartSummary = useAtomValue(cartSummaryAtom);
  const [, clearCart] = useAtom(clearCartAtom);
  const [, removeFromCart] = useAtom(removeFromCartAtom);
  const [, updateQuantity] = useAtom(updateCartItemQuantityAtom);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const handleClose = () => setIsOpen(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const nextQuantity = Math.max(newQuantity, 0);
    if (nextQuantity === 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, nextQuantity);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;
      const closeButton = closeButtonRef.current ?? dialogRef.current;
      closeButton?.focus({ preventScroll: true });
    } else if (previouslyFocusedElementRef.current) {
      if (document.contains(previouslyFocusedElementRef.current)) {
        previouslyFocusedElementRef.current.focus();
      }
      previouslyFocusedElementRef.current = null;
    }
  }, [isOpen]);

  const getFocusableElements = (container: HTMLElement | null): HTMLElement[] => {
    if (!container) return [];
    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ];
    return Array.from(container.querySelectorAll<HTMLElement>(selectors.join(','))).filter(
      (el) =>
        !el.hasAttribute('disabled') &&
        el.getAttribute('aria-hidden') !== 'true' &&
        el.tabIndex !== -1
    );
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;
    const container = dialogRef.current;
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement | null;

    if (container && !container.contains(activeElement)) {
      event.preventDefault();
      firstElement.focus();
      return;
    }

    if (event.shiftKey) {
      if (activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else if (activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={s.overlay}>
      <div className={s.backdrop} onClick={handleClose} />
      <div className={s.panelRegion}>
        <div className={s.panelContainer}>
          <div
            className={s.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            ref={dialogRef}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
          >
            <div className={s.header}>
              <h2 className={s.title} id={titleId}>
                Shopping Cart
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className={s.closeButton}
                ref={closeButtonRef}
              >
                <span className="sr-only">Close panel</span>
                <svg
                  className={s.closeIcon}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className={s.content}>
              {cartItems.length === 0 ? (
                <div className={s.emptyState}>
                  <svg
                    className={s.emptyIcon}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                    />
                  </svg>
                  <h3 className={s.emptyTitle}>Your cart is empty</h3>
                  <p className={s.emptyCopy}>Start adding some items to your cart.</p>
                  <Link to="/products" onClick={handleClose} className={s.emptyAction}>
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className={s.listWrapper}>
                  <ul role="list" className={s.itemsList}>
                    {cartItems.map((item) => (
                      <li key={item.id} className={s.item}>
                        <div className={s.itemImageWrapper}>
                          {item.image ? (
                            <img src={item.image} alt={item.name} className={s.itemImage} />
                          ) : (
                            <svg
                              className={s.itemPlaceholderIcon}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          )}
                        </div>
                        <div className={s.itemBody}>
                          <div className={s.itemHeader}>
                            <h3 className={s.itemName}>{item.name}</h3>
                            <p className={s.itemTotal}>
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <p className={s.itemMeta}>${item.price.toFixed(2)} each</p>
                          <div className={s.itemFooter}>
                            <div className={s.quantityControls}>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className={s.quantityButton}
                                aria-label={`Decrease quantity of ${item.name}`}
                              >
                                -
                              </button>
                              <span className={s.quantityValue}>{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className={s.quantityButton}
                                aria-label={`Increase quantity of ${item.name}`}
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className={s.removeButton}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className={s.footer}>
                <div className={s.summarySection}>
                  <div className={s.summaryRow}>
                    <span>Subtotal ({cartSummary.itemCount} items)</span>
                    <span>${cartSummary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className={s.summaryRow}>
                    <span>Est. Tax</span>
                    <span>${cartSummary.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className={s.summaryRow}>
                    <span>Est. Shipping</span>
                    <span>
                      {cartSummary.shippingCost === 0
                        ? 'Free'
                        : `$${cartSummary.shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className={s.summaryDivider}>
                    <div className={s.summaryTotal}>
                      <span>Total</span>
                      <span>${cartSummary.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className={s.actions}>
                  <button
                    type="button"
                    onClick={clearCart}
                    className={`${btnOutline} ${s.fullWidthButton} ${s.ghostDanger}`}
                  >
                    Clear Cart
                  </button>
                  <Link
                    to="/checkout"
                    onClick={handleClose}
                    className={`${btnPrimary} ${s.fullWidthButton}`}
                  >
                    Checkout
                  </Link>
                  <Link
                    to="/products"
                    onClick={handleClose}
                    className={`${btnOutline} ${s.fullWidthButton}`}
                  >
                    Continue Shopping
                  </Link>
                </div>
                <p className={s.footerNote}>Shipping and taxes calculated at checkout.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
