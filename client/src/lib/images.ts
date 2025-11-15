/**
 * Image URL resolution helpers for normalizing relative asset paths against
 * the configured API base and providing a placeholder fallback.
 */
// Image URL resolution helpers
// Ensures relative URLs (like "/api/v1/files/.." or "/uploads/..") are made absolute
// using VITE_API_URL when provided, otherwise falls back to current window origin.
// Also provides a shared placeholder path for broken/missing images.

export const PLACEHOLDER_SRC = '/images/placeholder.svg';

/**
 * Resolves a possibly relative or malformed image URL to a fully qualified URL.
 * - Absolute (http, https, data, blob) URLs are returned unchanged.
 * - Relative paths are resolved against VITE_API_URL (if absolute) or window.origin.
 * - Invalid or empty input returns PLACEHOLDER_SRC.
 */
export function resolveImageUrl(u?: string | null): string {
  if (!u) return PLACEHOLDER_SRC;
  const s = u.trim();
  if (!s) return PLACEHOLDER_SRC;

  // Absolute or inline URLs → return directly
  if (/^(?:https?:|data:|blob:)/i.test(s)) return s;

  // Determine base URL
  const envBase = import.meta.env?.VITE_API_URL as string | undefined;
  const base =
    envBase && /^https?:\/\//i.test(envBase)
      ? envBase.replace(/\/+$/, '') // remove trailing slash for clean joining
      : `${window.location.origin}${envBase ? envBase.replace(/\/+$/, '') : ''}`;

  try {
    const resolved = new URL(s, base).toString();
    return resolved;
  } catch (err) {
    console.warn('[resolveImageUrl] Failed to resolve:', s, err);
    return PLACEHOLDER_SRC;
  }
}
