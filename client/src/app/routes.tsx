import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import Navbar from '@client/components/layout/Navbar';
import Footer from '@client/components/layout/Footer';
import { containerClass } from './theme.css';

// ProductCreate is now embedded in Admin; keep legacy route redirected
import ProductEdit from '@client/pages/ProductEdit';
import Unauthorized from '@client/pages/Unauthorized';
import ProductCreate from '@client/pages/ProductCreate';
import { Checkout } from '@client/pages/Checkout';
import { RequireAuth } from '@client/features/auth/RequireAuth';
import About from '@client/pages/About';
import AdminLayout from '@client/pages/admin/Layout';
import AdminOverview from '@client/pages/admin/Overview';
import AdminProductNew from '@client/pages/admin/ProductNew';
import AdminProducts from '@client/pages/admin/Products';
import AdminUsers from '@client/pages/admin/Users';
import AdminOrders from '@client/pages/admin/Orders';
import Contact from '@client/pages/Contact';
import Home from '@client/pages/Home';
import Login from '@client/pages/Login';
import NotFound from '@client/pages/NotFound';
import Products from '@client/pages/Products';
import ProductShow from '@client/pages/ProductShow';
import Register from '@client/pages/Register';
import { Orders } from '@client/pages/Orders';
import OrderDetail from '@client/pages/OrderDetail';

function Shell() {
  return (
    <>
      <Navbar />
      <main className={containerClass.className}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

/**
 * Routes configuration for the application using React Router v6 RouteObject structure.
 *
 * This exported constant is an array of RouteObject entries describing the app's routing tree.
 *
 * Top-level route:
 * - path: '/'
 * - element: Shell (application layout / root UI)
 * - errorElement: NotFound (displayed when a route-level error occurs)
 * - children: nested routes rendered inside the Shell layout
 *
 * Child routes (examples present in this configuration):
 * - index: true
 *   - element: Home (root/index route)
 *
 * - path: 'legacy'
 *   - element: LegacyClock
 *
 * - path: 'products'
 *   - element: Products (products index/list)
 *
 * - path: 'products/:id'
 *   - element: ProductShow (product detail)
 *
 * - path: 'products/new'
 *   - element: ProductCreate wrapped by RequireAuth
 *   - Requires authentication: components wrapped in RequireAuth should render only for authenticated users.
 *
 * - path: 'products/:id/edit'
 *   - element: ProductEdit wrapped by RequireAuth
 *   - Requires authentication: editing is restricted to authenticated users.
 *
 * - path: 'admin'
 *   - element: Admin wrapped by RequireAuth with role="admin"
 *   - Requires authentication and authorization: the RequireAuth wrapper is expected to accept
 *     an optional `role` prop (e.g. "admin") to restrict access to users who have the specified role.
 *
 * Common fields used on each route object:
 * - path?: string — URL segment for the route. Use dynamic params like ':id' when needed.
 * - index?: boolean — marks an index route (no path, renders at parent path).
 * - element: React.ReactNode — component to render when the route matches.
 * - children?: RouteObject[] — nested routes rendered within the parent route's element.
 * - errorElement?: React.ReactNode — component shown when an error occurs during route loading/rendering (NotFound is used here).
 *
 * Notes / Implementation reminders:
 * - Ensure the RequireAuth component implements authentication gating and supports an optional `role` prop
 *   for authorization checks. Document expected role strings (e.g., "admin") in RequireAuth's own implementation.
 * - NotFound is used consistently as the errorElement for user-facing route errors; adjust as needed for custom error UI.
 *
 * @public
 * @constant
 * @type {RouteObject[]}
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Shell />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home />, errorElement: <NotFound /> },
      { path: 'about', element: <About />, errorElement: <NotFound /> },
      { path: 'contact', element: <Contact />, errorElement: <NotFound /> },
      { path: 'register', element: <Register />, errorElement: <NotFound /> },
      { path: 'login', element: <Login />, errorElement: <NotFound /> },
      { path: 'unauthorized', element: <Unauthorized />, errorElement: <NotFound /> },
      { path: 'products', element: <Products />, errorElement: <NotFound /> },
      { path: 'products/:id', element: <ProductShow />, errorElement: <NotFound /> },
      { path: 'checkout', element: <Checkout />, errorElement: <NotFound /> },
      {
        path: 'orders',
        element: (
          <RequireAuth>
            <Orders />
          </RequireAuth>
        ),
        errorElement: <NotFound />,
      },
      {
        path: 'orders/:id',
        element: (
          <RequireAuth>
            <OrderDetail />
          </RequireAuth>
        ),
        errorElement: <NotFound />,
      },
      {
        path: 'products/new',
        element: (
          <RequireAuth>
            <ProductCreate />
          </RequireAuth>
        ),
        errorElement: <NotFound />,
      },
      {
        path: 'products/:id/edit',
        element: (
          <RequireAuth>
            <ProductEdit />
          </RequireAuth>
        ),
        errorElement: <NotFound />,
      },
      // The 'role' prop on RequireAuth restricts access to users with the specified role (e.g., "admin").
      // Ensure RequireAuth supports this prop and document expected roles in its implementation.
      {
        path: 'admin',
        element: (
          <RequireAuth role="admin">
            <AdminLayout />
          </RequireAuth>
        ),
        errorElement: <NotFound />,
        children: [
          { index: true, element: <AdminOverview />, errorElement: <NotFound /> },
          { path: 'users', element: <AdminUsers />, errorElement: <NotFound /> },
          { path: 'products', element: <AdminProducts />, errorElement: <NotFound /> },
          { path: 'products/new', element: <AdminProductNew />, errorElement: <NotFound /> },
          { path: 'orders', element: <AdminOrders />, errorElement: <NotFound /> },
        ],
      },
    ],
  },
];
