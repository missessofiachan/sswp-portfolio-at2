import { Router, type Router as ExpressRouter } from 'express';
import { requireAuth } from '../middleware/auth';
import type { UploadedFile } from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import { getUploadsDir } from '../../utils/uploads';

export const router: ExpressRouter = Router();

// POST /api/v1/uploads
// Accepts multipart/form-data with field name "files" (single or multiple) or "file"
// Saves images to ./uploads and returns public URLs under /uploads
router.post('/', requireAuth, async (req, res) => {
  try {
    const filesRoot = getUploadsDir();
    await fs.promises.mkdir(filesRoot, { recursive: true });

    const anyFiles = (req as any).files as
      | undefined
      | { file?: UploadedFile | UploadedFile[]; files?: UploadedFile | UploadedFile[] };
    const payload = anyFiles?.files ?? anyFiles?.file;

    let files: UploadedFile[] = [];
    if (!payload) {
      return res.status(400).json({ error: { message: 'No files uploaded' } });
    }
    files = Array.isArray(payload) ? payload : [payload];

    const allowed = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
    const maxMb = Number(process.env.UPLOAD_MAX_MB || 5);
    const maxBytes = maxMb * 1024 * 1024;

    const urls: string[] = [];
    for (const f of files) {
      if (!allowed.has(f.mimetype)) {
        return res.status(400).json({ error: { message: `Unsupported type: ${f.mimetype}` } });
      }
      if (typeof f.size === 'number' && f.size > maxBytes) {
        return res.status(413).json({ error: { message: `File too large (max ${maxMb}MB)` } });
      }
      const extFromName = path.extname(f.name).toLowerCase();
      const ext =
        extFromName ||
        (f.mimetype === 'image/png'
          ? '.png'
          : f.mimetype === 'image/jpeg'
            ? '.jpg'
            : f.mimetype === 'image/webp'
              ? '.webp'
              : f.mimetype === 'image/gif'
                ? '.gif'
                : '.bin');
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      const dest = path.join(filesRoot, filename);
      // express-fileupload provides mv()
      await new Promise<void>((resolve, reject) => {
        (f as UploadedFile).mv(dest, (err: any) => (err ? reject(err) : resolve()));
      });
      // Return URLs under API prefix so Vite dev proxy forwards to server
      urls.push(`/api/v1/files/${filename}`);
    }

    return res.status(201).json({ urls });
  } catch (err) {
    return res.status(500).json({ error: { message: (err as Error).message } });
  }
});
