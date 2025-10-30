/**
 * Shopping Cart Management
 *
 * Jotai atoms and utilities for managing shopping cart state.
 * Handles cart items, quantities, and integration with the order system.
 *
 * @fileoverview Shopping cart state management
 * @module features/cart/cartAtoms
 */

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { CartItem } from '../../types/orders';
import type { Product } from '../../types/product';
import { showToast } from '../../lib/toast';

/**
 * Cart items stored in localStorage
 */
export const cartItemsAtom = atomWithStorage<CartItem[]>('cart-items', []);

/**
 * Cart visibility state
 */
export const isCartOpenAtom = atom(false);

/**
 * Derived atom for cart total count
 */
export const cartTotalCountAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((total, item) => total + item.quantity, 0);
});

/**
 * Derived atom for cart total price
 */
export const cartTotalPriceAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
});

/**
 * Derived atom for cart subtotal, tax, and shipping
 */
export const cartSummaryAtom = atom((get) => {
  const items = get(cartItemsAtom);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const taxRate = 0.1; // 10% tax
  const taxAmount = subtotal * taxRate;
  const shippingCost = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + taxAmount + shippingCost;

  return {
    subtotal,
    taxAmount,
    shippingCost,
    total,
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
  };
});

/**
 * Action atom to add item to cart
 */
export const addToCartAtom = atom(null, (get, set, product: Product, quantity: number = 1) => {
  const stockLevel = typeof product.stock === 'number' ? Math.max(0, Math.floor(product.stock)) : 0;
  if (stockLevel <= 0) {
    showToast('This item is out of stock', { type: 'warning' });
    return;
  }

  const currentItems = get(cartItemsAtom);
  const existingItemIndex = currentItems.findIndex((item) => item.id === product.id);
  const existingQty = existingItemIndex >= 0 ? currentItems[existingItemIndex].quantity : 0;
  const desiredQty = existingQty + quantity;

  if (desiredQty > stockLevel) {
    const allowed = Math.max(0, stockLevel - existingQty);
    if (allowed <= 0) {
      showToast(`You already have the maximum available (${stockLevel}) in your cart`, {
        type: 'warning',
      });
      return;
    }
    showToast(`Only ${allowed} more available. Updated quantity to ${existingQty + allowed}.`, {
      type: 'info',
    });
    quantity = allowed;
  }

  if (existingItemIndex >= 0) {
    const updatedItems = [...currentItems];
    updatedItems[existingItemIndex] = {
      ...updatedItems[existingItemIndex],
      quantity: updatedItems[existingItemIndex].quantity + quantity,
    };
    set(cartItemsAtom, updatedItems);
  } else {
    const newItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images?.[0] || product.imageUrls?.[0],
    };
    set(cartItemsAtom, [...currentItems, newItem]);
  }
});

/**
 * Action atom to remove item from cart
 */
export const removeFromCartAtom = atom(null, (get, set, productId: string) => {
  const currentItems = get(cartItemsAtom);
  const updatedItems = currentItems.filter((item) => item.id !== productId);
  set(cartItemsAtom, updatedItems);
  showToast('Item removed from cart', { type: 'success' });
});

/**
 * Action atom to update item quantity in cart
 */
export const updateCartItemQuantityAtom = atom(
  null,
  (get, set, productId: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      const currentItems = get(cartItemsAtom);
      const updatedItems = currentItems.filter((item) => item.id !== productId);
      set(cartItemsAtom, updatedItems);
      return;
    }

    const currentItems = get(cartItemsAtom);
    const updatedItems = currentItems.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    set(cartItemsAtom, updatedItems);
  }
);

/**
 * Action atom to clear entire cart
 */
export const clearCartAtom = atom(null, (_get, set) => {
  set(cartItemsAtom, []);
  showToast('Cart cleared', { type: 'info' });
});

/**
 * Action atom to toggle cart visibility
 */
export const toggleCartAtom = atom(null, (get, set) => {
  const isOpen = get(isCartOpenAtom);
  set(isCartOpenAtom, !isOpen);
});

/**
 * Derived atom to check if a specific product is in cart
 */
export const isProductInCartAtom = atom((get) => (productId: string) => {
  const items = get(cartItemsAtom);
  return items.some((item) => item.id === productId);
});

/**
 * Derived atom to get quantity of a specific product in cart
 */
export const getProductQuantityInCartAtom = atom((get) => (productId: string) => {
  const items = get(cartItemsAtom);
  const item = items.find((item) => item.id === productId);
  return item?.quantity || 0;
});
