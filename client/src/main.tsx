import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './app/routes';

// Create the router once and reuse it.
const router = createBrowserRouter(routes);

/**
 * Bootstrap and mount the React application.
 * Avoids using the non-null assertion operator and provides a helpful
 * console message when the root mount node is missing.
 */
function bootstrap(): void {
  const container = document.getElementById('root');

  if (!container) {
    // eslint-disable-next-line no-console
    console.error('Unable to find element with id "root". React application was not mounted.');
    return;
  }

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

bootstrap();
