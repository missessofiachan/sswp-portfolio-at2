import { Router, type Router as ExpressRouter } from 'express';
import { requireAuth } from '../middleware/auth';
import type { UploadedFile } from 'express-fileupload';
import path from 'path';
import { uploadImageBuffer } from '../../services/cloudinary.service';
import { loadEnv } from '../../config/env';
import {
  validateImageContent,
  sanitizeFilename,
  validateFileSize,
} from '../../utils/fileValidation';
import { expensiveOperationRateLimit } from '../middleware/rateLimit';

export const router: ExpressRouter = Router();

const IMAGE_TYPE_MAP = [
  { mime: 'image/png', ext: '.png' },
  { mime: 'image/jpeg', ext: '.jpeg' },
  { mime: 'image/jpeg', ext: '.jpg' },
  { mime: 'image/webp', ext: '.webp' },
  { mime: 'image/gif', ext: '.gif' },
  { mime: 'image/heic', ext: '.heic' },
  { mime: 'image/heif', ext: '.heif' },
  { mime: 'image/avif', ext: '.avif' },
] as const;

const ALLOWED_MIME_TYPES = new Set(IMAGE_TYPE_MAP.map((item) => item.mime));
const ALLOWED_EXTENSIONS = new Set(IMAGE_TYPE_MAP.map((item) => item.ext));

const { UPLOAD_MAX_MB } = loadEnv();
const UPLOAD_MAX_BYTES = UPLOAD_MAX_MB * 1024 * 1024;

/**
 * POST /api/v1/uploads
 *
 * Handles file upload for authenticated users. Accepts multipart/form-data with
 * files under the field name "files" or "file" (single or multiple files).
 *
 * **Security & Compliance Features:**
 * - Requires authentication via JWT token
 * - Validates file types (only allows common image formats)
 * - Enforces file size limits (configurable via UPLOAD_MAX_MB env var)
 * - Streams binaries directly to Cloudinary (no local persistence)
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
 *     "https://res.cloudinary.com/<cloud>/image/upload/v1234567890/product-abc.png"
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
router.post('/', expensiveOperationRateLimit, requireAuth, async (req, res) => {
  try {
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

    const urls: string[] = [];
    for (const f of files) {
      // 1. Validate file size
      if (typeof f.size === 'number' && !validateFileSize(f.size, UPLOAD_MAX_MB)) {
        return res
          .status(413)
          .json({ error: { message: `File too large (max ${UPLOAD_MAX_MB}MB)` } });
      }

      // 2. Validate MIME type and extension
      const extFromName = path.extname(f.name).toLowerCase();
      const mimeAllowed = ALLOWED_MIME_TYPES.has(
        f.mimetype as (typeof IMAGE_TYPE_MAP)[number]['mime']
      );
      const extAllowed = extFromName
        ? ALLOWED_EXTENSIONS.has(extFromName as (typeof IMAGE_TYPE_MAP)[number]['ext'])
        : false;

      if (!mimeAllowed || !extAllowed) {
        return res
          .status(400)
          .json({ error: { message: `Unsupported file type: ${f.mimetype || extFromName}` } });
      }

      // 3. Validate file content (magic numbers)
      const buffer = Buffer.isBuffer(f.data) ? f.data : Buffer.from(f.data as any);
      if (!validateImageContent(buffer)) {
        return res
          .status(400)
          .json({
            error: { message: 'Invalid file content. File may be corrupted or not a valid image.' },
          });
      }

      // 4. Sanitize filename before upload
      const safeFilename = sanitizeFilename(f.name);

      // 5. Upload to Cloudinary
      const { url } = await uploadImageBuffer(buffer, safeFilename);
      urls.push(url);
    }

    return res.status(201).json({ urls });
  } catch (err) {
    // Log error for debugging but don't expose internal details
    console.error('Upload error:', err);
    return res.status(500).json({ error: { message: (err as Error).message } });
  }
});
