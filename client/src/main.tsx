import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@client/features/auth/AuthProvider';
import { routes } from './app/routes';

// Create the router once and reuse it.
const router = createBrowserRouter(routes);

/**
 * Bootstrap and mount the React application.
 * Avoids using the non-null assertion operator and provides a helpful
 * console message when the root mount node is missing.
 */
let root: ReturnType<typeof createRoot> | null = null;

/**
 * Bootstraps the React application by mounting it into the DOM element with id "root".
 *
 * - Locates the container via `document.getElementById('root')`. If the element cannot be found,
 *   an error is written to the console and the function returns early without mounting.
 * - Ensures a React root is created once (via `createRoot(container)`) and reused on subsequent calls.
 * - Renders the application tree wrapped in `React.StrictMode`, `AuthProvider`, and `RouterProvider`
 *   using the external `router` value.
 *
 * Remarks:
 * - This function has side effects (console output and DOM/React updates).
 * - It depends on external symbols: a module-level `root` variable and a `router` instance.
 * - Calling this multiple times will not recreate the React root but will re-render the app into it.
 *
 * @returns void
 *
 * @example
 * // Called once during application startup:
 * // bootstrap();
 */
function bootstrap(): void {
  const container = document.getElementById('root');

  if (!container) {
    console.error('Unable to find element with id "root". React application was not mounted.');
    return;
  }

  if (!root) {
    root = createRoot(container);
  }
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </React.StrictMode>
  );
}

bootstrap();
