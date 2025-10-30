/**
 * Unit tests for file validation utilities
 */

import { describe, it, expect } from '@jest/globals';
import {
  validateFileSize,
  validateImageContent,
  sanitizeFilename,
} from '../../src/utils/fileValidation';

describe('File Validation', () => {
  describe('validateFileSize', () => {
    it('should accept files within size limit', () => {
      const size = 2 * 1024 * 1024; // 2MB
      const maxMB = 5;
      expect(validateFileSize(size, maxMB)).toBe(true);
    });

    it('should reject files exceeding size limit', () => {
      const size = 10 * 1024 * 1024; // 10MB
      const maxMB = 5;
      expect(validateFileSize(size, maxMB)).toBe(false);
    });

    it('should accept files at exact size limit', () => {
      const maxMB = 5;
      const size = maxMB * 1024 * 1024;
      expect(validateFileSize(size, maxMB)).toBe(true);
    });

    it('should reject zero-byte files', () => {
      expect(validateFileSize(0, 5)).toBe(false);
    });

    it('should reject negative sizes', () => {
      expect(validateFileSize(-100, 5)).toBe(false);
    });
  });

  describe('validateImageContent', () => {
    it('should accept valid PNG files', () => {
      // PNG magic number: 89 50 4E 47 0D 0A 1A 0A
      const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      expect(validateImageContent(pngBuffer)).toBe(true);
    });

    it('should accept valid JPEG files (FF D8 FF)', () => {
      const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
      expect(validateImageContent(jpegBuffer)).toBe(true);
    });

    it('should accept valid GIF files (GIF89a)', () => {
      const gifBuffer = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
      expect(validateImageContent(gifBuffer)).toBe(true);
    });

    it('should accept valid WebP files', () => {
      // WebP: RIFF....WEBP
      const webpBuffer = Buffer.from([
        0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
      ]);
      expect(validateImageContent(webpBuffer)).toBe(true);
    });

    it('should reject invalid image files', () => {
      const invalidBuffer = Buffer.from([0x00, 0x01, 0x02, 0x03]);
      expect(validateImageContent(invalidBuffer)).toBe(false);
    });

    it('should reject text files masquerading as images', () => {
      const textBuffer = Buffer.from('This is a text file');
      expect(validateImageContent(textBuffer)).toBe(false);
    });

    it('should reject empty buffers', () => {
      const emptyBuffer = Buffer.from([]);
      expect(validateImageContent(emptyBuffer)).toBe(false);
    });
  });

  describe('sanitizeFilename', () => {
    it('should preserve valid filenames', () => {
      expect(sanitizeFilename('image.png')).toBe('image.png');
      expect(sanitizeFilename('my-photo_123.jpg')).toBe('my-photo_123.jpg');
    });

    it('should remove path traversal attempts', () => {
      expect(sanitizeFilename('../../../etc/passwd')).toBe('passwd');
      expect(sanitizeFilename('..\\..\\windows\\system32')).toBe('system32');
    });

    it('should remove null bytes', () => {
      expect(sanitizeFilename('image\x00.png.exe')).toBe('image.png.exe');
    });

    it('should replace invalid characters with underscores', () => {
      expect(sanitizeFilename('my<file>name.png')).toBe('my_file_name.png');
      expect(sanitizeFilename('file:name|test.jpg')).toBe('file_name_test.jpg');
    });

    it('should handle Unicode characters', () => {
      expect(sanitizeFilename('фото.jpg')).toBe('фото.jpg');
      expect(sanitizeFilename('图片.png')).toBe('图片.png');
    });

    it('should limit filename length', () => {
      const longName = 'a'.repeat(300) + '.png';
      const sanitized = sanitizeFilename(longName);
      expect(sanitized.length).toBeLessThanOrEqual(255);
      expect(sanitized.endsWith('.png')).toBe(true);
    });

    it('should handle files with no extension', () => {
      expect(sanitizeFilename('README')).toBe('README');
    });

    it('should handle multiple dots', () => {
      expect(sanitizeFilename('my.file.name.tar.gz')).toBe('my.file.name.tar.gz');
    });
  });
});
