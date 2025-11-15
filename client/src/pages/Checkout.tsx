/**
 * Checkout Page Component
 *
 * Complete checkout flow including shipping address, payment method selection,
 * order review, and order placement.
 *
 * @fileoverview Checkout page with order creation
 * @module pages/Checkout
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue } from 'jotai';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { ordersApi } from '../api/clients/orders.api';
import { useAuth } from '../features/auth/AuthProvider';
import { cartItemsAtom, cartSummaryAtom, clearCartAtom } from '../features/cart/cartAtoms';
import { showToast } from '../lib/toast';
import { type CreateOrderInput, PaymentMethod } from '../types/orders';

// Shipping address validation schema
const shippingAddressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Name too long'),
  street: z.string().min(1, 'Street address is required').max(200, 'Address too long'),
  city: z.string().min(1, 'City is required').max(100, 'City name too long'),
  state: z.string().min(1, 'State/Province is required').max(100, 'State name too long'),
  postalCode: z.string().min(1, 'Postal code is required').max(20, 'Postal code too long'),
  country: z.string().min(1, 'Country is required').max(100, 'Country name too long'),
  phone: z.string().max(20, 'Phone number too long').optional(),
});

// Checkout form schema
const checkoutSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.nativeEnum(PaymentMethod),
  notes: z.string().max(500, 'Notes too long').optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

/**
 * Checkout page component
 */
export function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const cartItems = useAtomValue(cartItemsAtom);
  const cartSummary = useAtomValue(cartSummaryAtom);
  const [, clearCart] = useAtom(clearCartAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: PaymentMethod.CREDIT_CARD,
    },
  });

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const orderData: CreateOrderInput = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        paymentMethod: data.paymentMethod,
        shippingAddress: data.shippingAddress,
        notes: data.notes || undefined, // Convert empty string to undefined
      };

      console.log('Placing order as:', user?.id, '(admin)');
      console.log('Order data:', JSON.stringify(orderData, null, 2));

      const order = await ordersApi.createOrder(orderData);
      clearCart();
      showToast('Order placed successfully!', { type: 'success' });
      navigate(`/orders/${order.id}`);
    } catch (error) {
      console.error('Order creation failed:', error);

      // Extract detailed error information
      let errorMessage = 'Failed to place order';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // If there's a response with validation errors, log them
      if ((error as any)?.response?.data?.errors) {
        console.error('Validation errors:', (error as any).response.data.errors);
        errorMessage = 'Validation failed: ' + JSON.stringify((error as any).response.data.errors);
      }

      setSubmitError(errorMessage);
      showToast(errorMessage, { type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
            {/* Show user info if logged in */}
            {user && (
              <div className="mb-4 text-sm text-gray-700">
                <span>
                  Placing order as: <span className="font-semibold">{user.id}</span> ({user.role})
                </span>
              </div>
            )}
            {/* Show error if order creation fails */}
            {submitError && (
              <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300">
                <strong>Order failed:</strong> {submitError}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Shipping Address */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      {...register('shippingAddress.fullName')}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.shippingAddress?.fullName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.shippingAddress.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="street"
                      {...register('shippingAddress.street')}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.shippingAddress?.street && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.shippingAddress.street.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      {...register('shippingAddress.city')}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.shippingAddress?.city && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.shippingAddress.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      id="state"
                      {...register('shippingAddress.state')}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.shippingAddress?.state && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.shippingAddress.state.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      {...register('shippingAddress.postalCode')}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.shippingAddress?.postalCode && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.shippingAddress.postalCode.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country *
                    </label>
                    <input
                      type="text"
                      id="country"
                      {...register('shippingAddress.country')}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.shippingAddress?.country && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.shippingAddress.country.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register('shippingAddress.phone')}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.shippingAddress?.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.shippingAddress.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {Object.values(PaymentMethod).map((method) => (
                    <label key={method} className="flex items-center">
                      <input
                        type="radio"
                        value={method}
                        {...register('paymentMethod')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {method.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
                )}
              </div>

              {/* Order Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Order Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  {...register('notes')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Special delivery instructions, gift message, etc."
                />
                {errors.notes && (
                  <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({cartSummary.itemCount} items)</span>
                <span className="text-gray-900">${cartSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">${cartSummary.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {cartSummary.shippingCost === 0
                    ? 'Free'
                    : `$${cartSummary.shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${cartSummary.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
