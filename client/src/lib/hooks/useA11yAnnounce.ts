/**
 * Accessibility helper hook for emitting screen-reader live announcements.
 */
import React, { useEffect, useRef } from 'react';

type PolitenessLevel = 'polite' | 'assertive';

const liveRegion: HTMLDivElement | null = null;

function getOrCreateLiveRegion(politeness: PolitenessLevel): HTMLDivElement {
  const id = `a11y-live-region-${politeness}`;
  let region = document.getElementById(id) as HTMLDivElement | null;

  if (!region) {
    region = document.createElement('div');
    region.id = id;
    region.setAttribute('aria-live', politeness);
    region.setAttribute('aria-atomic', 'true');
    region.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
    region.style.position = 'absolute';
    region.style.left = '-10000px';
    region.style.width = '1px';
    region.style.height = '1px';
    region.style.overflow = 'hidden';
    document.body.appendChild(region);
  }

  return region;
}

/**
 * Hook to announce messages to screen readers
 *
 * @example
 * ```tsx
 * const announce = useA11yAnnounce();
 *
 * function handleSubmit() {
 *   // ... submit logic
 *   announce('Form submitted successfully', 'polite');
 * }
 * ```
 */
export function useA11yAnnounce() {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (message: string, politeness: PolitenessLevel = 'polite') => {
    const region = getOrCreateLiveRegion(politeness);

    // Clear existing content
    region.textContent = '';

    // Small delay to ensure screen readers pick up the change
    timeoutRef.current = setTimeout(() => {
      region.textContent = message;

      // Clear after 5 seconds to avoid stale announcements
      timeoutRef.current = setTimeout(() => {
        region.textContent = '';
      }, 5000);
    }, 100);
  };
}

/**
 * Component for creating a visually hidden but screen reader accessible element
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: '-10000px',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
  };

  return React.createElement('span', { style }, children);
}
