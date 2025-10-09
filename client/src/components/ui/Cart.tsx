import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAtom, useAtomValue } from 'jotai';
import {
  cartItemsAtom,
  cartSummaryAtom,
  isCartOpenAtom,
  removeFromCartAtom,
  updateCartItemQuantityAtom,
} from '../../features/cart/cartAtoms';

export function Cart() {
  const [isOpen, setIsOpen] = useAtom(isCartOpenAtom);
  const cartItems = useAtomValue(cartItemsAtom);
  const cartSummary = useAtomValue(cartSummaryAtom);
  const [, removeFromCart] = useAtom(removeFromCartAtom);
  const [, updateQuantity] = useAtom(updateCartItemQuantityAtom);

  const handleClose = () => setIsOpen(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  // Handle escape key and body scroll lock
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={handleClose}
      />
      {/* Cart Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
            {/* Cart Items */}
            <div className="mt-8">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start adding some items to your cart.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/products"
                      onClick={handleClose}
                      className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flow-root">
                  <ul role="list" className="-my-6 divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <li key={item.id} className="flex py-6">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover object-center"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                              <svg
                                className="h-8 w-8 text-gray-400"
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
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>{item.name}</h3>
                              <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                disabled={item.quantity <= 1}
                              >
                                <span className="text-gray-600">−</span>
                              </button>
                              <span className="text-gray-900 min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                              >
                                <span className="text-gray-600">+</span>
                              </button>
                            </div>
                            <div className="flex">
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="font-medium text-red-600 hover:text-red-500"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="space-y-4">
                  {/* Price Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal ({cartSummary.itemCount} items)</span>
                      <span>${cartSummary.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Est. Tax</span>
                      <span>${cartSummary.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Est. Shipping</span>
                      <span>
                        {cartSummary.shippingCost === 0
                          ? 'Free'
                          : `$${cartSummary.shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <span>Total</span>
                        <span>${cartSummary.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="space-y-3">
                    <Link
                      to="/checkout"
                      onClick={handleClose}
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                      Checkout
                    </Link>
                    <Link
                      to="/products"
                      onClick={handleClose}
                      className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500 text-center">
                    Shipping and taxes calculated at checkout.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
