/**
 * @file ScrollToTop.tsx
 * @description Component that scrolls to top on route changes
 * @version 1.0.0
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 * Automatically scrolls to the top of the page when the route changes
 *
 * @example
 * ```tsx
 * <Router>
 *   <ScrollToTop />
 *   <Routes>...</Routes>
 * </Router>
 * ```
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}
