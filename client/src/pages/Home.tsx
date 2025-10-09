import type { JSX } from 'react';

/**
 * Home page component.
 *
 * Renders a welcoming heading for Sofia's Shop.
 *
 * @returns {JSX.Element} The rendered home page.
 */
export default function Home(): JSX.Element {
  return (
    <main>
      <h1>Welcome to Sofia&apos;s Shop</h1>
      <p>Discover something magical today ✨</p>
    </main>
  );
}
