/**
 * File validation utilities for secure file upload handling.
 *
 * This module provides functions to validate file content by checking
 * magic numbers (file signatures) in addition to MIME types and extensions.
 */

/**
 * Magic number signatures for common image formats.
 * Each signature is an array of bytes at the start of the file.
 */
const IMAGE_SIGNATURES = {
  png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  jpg: [0xff, 0xd8, 0xff],
  gif87a: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
  gif89a: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
  webp: [0x52, 0x49, 0x46, 0x46], // "RIFF" (check for WEBP at offset 8)
  bmp: [0x42, 0x4d],
  // HEIC/HEIF - more complex, starts with ftyp box
  heic: [0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63], // at offset 4
  avif: [0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66], // at offset 4
};

/**
 * Validates if a buffer matches a given signature at a specific offset.
 */
function matchesSignature(buffer: Buffer, signature: number[], offset = 0): boolean {
  if (buffer.length < offset + signature.length) {
    return false;
  }
  for (let i = 0; i < signature.length; i++) {
    if (buffer[offset + i] !== signature[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Validates file content by checking magic numbers.
 * Returns true if the buffer matches a known image signature.
 *
 * @param buffer - File content buffer
 * @returns true if valid image format, false otherwise
 */
export function validateImageContent(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 8) {
    return false;
  }

  // Check PNG
  if (matchesSignature(buffer, IMAGE_SIGNATURES.png)) {
    return true;
  }

  // Check JPEG
  if (matchesSignature(buffer, IMAGE_SIGNATURES.jpg)) {
    return true;
  }

  // Check GIF
  if (
    matchesSignature(buffer, IMAGE_SIGNATURES.gif87a) ||
    matchesSignature(buffer, IMAGE_SIGNATURES.gif89a)
  ) {
    return true;
  }

  // Check WebP (RIFF + "WEBP" at offset 8)
  if (
    matchesSignature(buffer, IMAGE_SIGNATURES.webp) &&
    buffer.length >= 12 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return true;
  }

  // Check BMP
  if (matchesSignature(buffer, IMAGE_SIGNATURES.bmp)) {
    return true;
  }

  // Check HEIC (ftyp box at offset 4)
  if (buffer.length >= 12 && matchesSignature(buffer, IMAGE_SIGNATURES.heic, 4)) {
    return true;
  }

  // Check AVIF (ftyp box at offset 4)
  if (buffer.length >= 12 && matchesSignature(buffer, IMAGE_SIGNATURES.avif, 4)) {
    return true;
  }

  return false;
}

/**
 * Sanitizes filename by removing potentially dangerous characters
 * and limiting length.
 *
 * @param filename - Original filename
 * @param maxLength - Maximum allowed length (default: 255)
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string, maxLength = 255): string {
  // Remove path traversal attempts
  let safe = filename.replace(/\.\./g, '');

  // Remove special characters except alphanumeric, dash, underscore, and dot
  safe = safe.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Limit length
  if (safe.length > maxLength) {
    const ext = safe.split('.').pop() || '';
    const nameWithoutExt = safe.substring(0, safe.length - ext.length - 1);
    safe = nameWithoutExt.substring(0, maxLength - ext.length - 1) + '.' + ext;
  }

  return safe;
}

/**
 * Validates file size against a maximum limit.
 *
 * @param sizeBytes - File size in bytes
 * @param maxMB - Maximum allowed size in megabytes
 * @returns true if within limit, false otherwise
 */
export function validateFileSize(sizeBytes: number, maxMB: number): boolean {
  const maxBytes = maxMB * 1024 * 1024;
  return sizeBytes <= maxBytes;
}
