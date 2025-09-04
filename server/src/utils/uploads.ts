import path from 'path';
import fs from 'fs/promises';

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

export function getUploadsDir() {
  return UPLOADS_DIR;
}

// Determine if a URL points to a locally uploaded file we serve
export function isLocalUploadUrl(url: string): boolean {
  return (
    typeof url === 'string' && (url.startsWith('/uploads/') || url.startsWith('/api/v1/files/'))
  );
}

// Extract local filename from a served URL (defensive against traversal)
export function filenameFromUrl(url: string): string | null {
  if (!isLocalUploadUrl(url)) return null;
  const parts = url.split('/');
  const last = parts[parts.length - 1];
  if (!last) return null;
  // allow only safe basename
  const base = path.basename(last);
  // Disallow sneaky paths
  if (base.includes('..') || base.includes('/') || base.includes('\\')) return null;
  return base;
}

export async function deleteLocalFiles(urls: string[]): Promise<void> {
  const filenames = urls.map(filenameFromUrl).filter((v): v is string => Boolean(v));
  for (const f of filenames) {
    const abs = path.join(UPLOADS_DIR, f);
    try {
      await fs.unlink(abs);
    } catch (err: any) {
      if (err?.code === 'ENOENT') continue; // already gone
      // Log and continue; do not throw to avoid breaking API flow
      // eslint-disable-next-line no-console
      console.warn('Failed to delete file', abs, err?.message || err);
    }
  }
}
