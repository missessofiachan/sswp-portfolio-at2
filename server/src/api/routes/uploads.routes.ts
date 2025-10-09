import { Router, type Router as ExpressRouter } from 'express';
import { requireAuth } from '../middleware/auth';
import type { UploadedFile } from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import { getUploadsDir } from '../../utils/uploads';

export const router: ExpressRouter = Router();

/**
 * POST /api/v1/uploads
 *
 * Handles file upload for authenticated users. Accepts multipart/form-data with
 * files under the field name "files" or "file" (single or multiple files).
 *
 * **Security Features:**
 * - Requires authentication via JWT token
 * - Validates file types (only allows common image formats)
 * - Enforces file size limits (configurable via UPLOAD_MAX_MB env var)
 * - Generates unique filenames to prevent conflicts
 *
 * **Supported File Types:**
 * - PNG, JPEG, JPG, WebP, GIF, HEIC, HEIF, AVIF
 *
 * **Request Format:**
 * ```
 * Content-Type: multipart/form-data
 * Authorization: Bearer <jwt-token>
 *
 * Form fields:
 * - files: File[] (multiple files)
 * - OR file: File (single file)
 * ```
 *
 * **Response Format:**
 * ```json
 * {
 *   "urls": [
 *     "/api/v1/files/1234567890-abc123.jpg",
 *     "/api/v1/files/1234567890-def456.png"
 *   ]
 * }
 * ```
 *
 * **Error Responses:**
 * - 400: No files uploaded, unsupported file type
 * - 401: Authentication required
 * - 413: File too large
 * - 500: Server error during file processing
 *
 * @route POST /api/v1/uploads
 * @access Private
 * @param {Request} req - Express request object with files in req.files
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with uploaded file URLs or error
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const filesRoot = getUploadsDir();
    await fs.promises.mkdir(filesRoot, { recursive: true });

    // Type-safe access to uploaded files
    const anyFiles = (req as any).files as
      | undefined
      | { file?: UploadedFile | UploadedFile[]; files?: UploadedFile | UploadedFile[] };
    const payload = anyFiles?.files ?? anyFiles?.file;

    let files: UploadedFile[] = [];
    if (!payload) {
      return res.status(400).json({ error: { message: 'No files uploaded' } });
    }
    files = Array.isArray(payload) ? payload : [payload];

    // Whitelist of allowed MIME types and file extensions
    const allowed = new Set([
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/gif',
      'image/heic',
      'image/heif',
      'image/avif',
    ]);
    const allowedExts = new Set([
      '.png',
      '.jpg',
      '.jpeg',
      '.webp',
      '.gif',
      '.heic',
      '.heif',
      '.avif',
    ]);
    const maxMb = Number(process.env.UPLOAD_MAX_MB || 5);
    const maxBytes = maxMb * 1024 * 1024;

    const urls: string[] = [];
    for (const f of files) {
      const extFromName = path.extname(f.name).toLowerCase();
      const mimeAllowed = allowed.has(f.mimetype);
      const extAllowed = extFromName ? allowedExts.has(extFromName) : false;

      // Reject files that don't match allowed types
      if (!mimeAllowed && !extAllowed) {
        return res
          .status(400)
          .json({ error: { message: `Unsupported file type: ${f.mimetype || extFromName}` } });
      }

      // Reject files that exceed size limit
      if (typeof f.size === 'number' && f.size > maxBytes) {
        return res.status(413).json({ error: { message: `File too large (max ${maxMb}MB)` } });
      }

      // Generate file extension based on MIME type or filename
      const ext =
        extFromName ||
        (f.mimetype === 'image/png'
          ? '.png'
          : f.mimetype === 'image/jpeg'
            ? '.jpg'
            : f.mimetype === 'image/jpg'
              ? '.jpg'
              : f.mimetype === 'image/webp'
                ? '.webp'
                : f.mimetype === 'image/gif'
                  ? '.gif'
                  : f.mimetype === 'image/heic'
                    ? '.heic'
                    : f.mimetype === 'image/heif'
                      ? '.heif'
                      : f.mimetype === 'image/avif'
                        ? '.avif'
                        : '.bin');

      // Generate unique filename with timestamp and random string
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      const dest = path.join(filesRoot, filename);

      // Move uploaded file to permanent location
      await new Promise<void>((resolve, reject) => {
        (f as UploadedFile).mv(dest, (err: any) => (err ? reject(err) : resolve()));
      });

      // Return URLs under API prefix so Vite dev proxy forwards to server
      urls.push(`/api/v1/files/${filename}`);
    }

    return res.status(201).json({ urls });
  } catch (err) {
    // Log error for debugging but don't expose internal details
    console.error('Upload error:', err);
    return res.status(500).json({ error: { message: (err as Error).message } });
  }
});
