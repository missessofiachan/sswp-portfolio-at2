/**
 * @file searchHighlight.tsx
 * @description Utility component for highlighting search terms in text
 * @version 1.0.0
 */

import type React from 'react';

/**
 * Highlights search terms in text
 * Recursively finds and highlights all occurrences of the search term
 *
 * @param text - The text to search within
 * @param searchTerm - The term to highlight
 * @returns React node with highlighted matches
 *
 * @example
 * ```tsx
 * <div>{highlightSearch("Hello world", "world")}</div>
 * // Renders: Hello <mark>world</mark>
 * ```
 */
export function highlightSearch(text: string, searchTerm: string): React.ReactNode {
  if (!searchTerm || !text) return text;

  const lowerText = text.toLowerCase();
  const lowerSearch = searchTerm.toLowerCase();
  const index = lowerText.indexOf(lowerSearch);

  if (index === -1) return text;

  const before = text.substring(0, index);
  const match = text.substring(index, index + searchTerm.length);
  const after = text.substring(index + searchTerm.length);

  return (
    <>
      {before}
      <mark
        style={{
          backgroundColor: 'var(--highlight-bg, #fef08a)',
          color: 'var(--highlight-text, #000)',
          padding: '0 2px',
          borderRadius: '2px',
        }}
      >
        {match}
      </mark>
      {highlightSearch(after, searchTerm)}
    </>
  );
}
