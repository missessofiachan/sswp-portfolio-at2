/**
 * Hook that wires arrow-key navigation semantics for menu/list containers.
 */
import { useEffect, useRef } from 'react';

export interface KeyboardNavOptions {
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean; // Whether to loop from last to first
  onSelect?: (index: number) => void;
}

/**
 * Hook for implementing arrow key navigation in lists
 *
 * @example
 * ```tsx
 * function Menu() {
 *   const [activeIndex, setActiveIndex] = useState(0);
 *   const navRef = useKeyboardNav({
 *     orientation: 'vertical',
 *     loop: true,
 *     onSelect: (index) => handleSelect(index),
 *   });
 *
 *   return (
 *     <ul ref={navRef} role="menu">
 *       {items.map((item, i) => (
 *         <li key={i} role="menuitem" tabIndex={i === activeIndex ? 0 : -1}>
 *           {item}
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useKeyboardNav<T extends HTMLElement>(options: KeyboardNavOptions = {}) {
  const { orientation = 'vertical', loop = false, onSelect } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const items = Array.from(
        container.querySelectorAll<HTMLElement>('[role="menuitem"], [role="option"], [role="tab"]')
      );

      if (items.length === 0) return;

      const currentIndex = items.findIndex((item) => item === document.activeElement);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      const isVertical = orientation === 'vertical' || orientation === 'both';
      const isHorizontal = orientation === 'horizontal' || orientation === 'both';

      if ((e.key === 'ArrowDown' && isVertical) || (e.key === 'ArrowRight' && isHorizontal)) {
        e.preventDefault();
        nextIndex = currentIndex + 1;
        if (nextIndex >= items.length) {
          nextIndex = loop ? 0 : currentIndex;
        }
      } else if ((e.key === 'ArrowUp' && isVertical) || (e.key === 'ArrowLeft' && isHorizontal)) {
        e.preventDefault();
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) {
          nextIndex = loop ? items.length - 1 : currentIndex;
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = items.length - 1;
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect?.(currentIndex);
        return;
      }

      if (nextIndex !== currentIndex) {
        items[nextIndex]?.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [orientation, loop, onSelect]);

  return ref;
}
