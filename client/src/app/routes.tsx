import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import Navbar from '@client/components/layout/Navbar';

import Home from '@client/pages/Home';
import Products from '@client/pages/Products';
import ProductShow from '@client/pages/ProductShow';
import Login from '@client/pages/Login';
import Register from '@client/pages/Register';
import NotFound from '@client/pages/NotFound';
import LegacyClock from '@client/pages/LegacyClock';
import { RequireAuth } from '@client/features/auth/RequireAuth';

function Shell() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </>
  );
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Shell />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'legacy', element: <LegacyClock /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:id', element: <ProductShow /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      {
        path: 'admin',
        element: (
          <RequireAuth>
            <div>Admin dashboard (protected)</div>
          </RequireAuth>
        ),
      },
    ],
  },
];
