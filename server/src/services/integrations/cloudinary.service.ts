/**
 * Cloudinary integration utilities that manage configuration, image uploads,
 * deletions, and helper parsing for deriving public IDs from delivery URLs.
 * Encapsulates all Cloudinary-specific logic so other services deal with a
 * simple Promise-based API.
 */

import {
  v2 as cloudinary,
  type UploadApiErrorResponse,
  type UploadApiOptions,
  type UploadApiResponse,
} from 'cloudinary';
import crypto from 'crypto';
import { loadEnv } from '@server/config/env';

let configured = false;

function ensureConfigured(): void {
  if (configured) return;
  const { CLOUDINARY_URL } = loadEnv();

  if (!CLOUDINARY_URL) {
    throw new Error('CLOUDINARY_URL environment variable is not set');
  }

  try {
    cloudinary.config({ cloudinary_url: CLOUDINARY_URL, secure: true });
    configured = true;
  } catch (error) {
    throw new Error(
      `Failed to configure Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

function currentFolder(): string | undefined {
  const { CLOUDINARY_UPLOAD_FOLDER } = loadEnv();
  return CLOUDINARY_UPLOAD_FOLDER || undefined;
}

function generatePublicId(filename: string): string {
  const base = filename.split('.').slice(0, -1).join('.') || 'asset';
  const safeBase = base.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50) || 'asset';
  const suffix = crypto.randomBytes(6).toString('hex');
  return `${safeBase}-${suffix}`;
}

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
};

export async function uploadImageBuffer(
  buffer: Buffer,
  filename: string
): Promise<CloudinaryUploadResult> {
  ensureConfigured();
  const folder = currentFolder();
  const publicId = generatePublicId(filename);
  const options: UploadApiOptions = {
    resource_type: 'image',
    folder,
    public_id: publicId,
    overwrite: false,
  };

  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        options,
        (error: UploadApiErrorResponse | undefined, uploadResult?: UploadApiResponse) => {
          if (error || !uploadResult) {
            reject(error ?? new Error('Cloudinary upload failed'));
            return;
          }
          resolve(uploadResult);
        }
      );
      stream.end(buffer);
    });

    return {
      url: result.secure_url || result.url,
      publicId: result.public_id,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Cloudinary upload failed: ${message}`);
  }
}

export async function deleteAssetsByUrls(urls: string[]): Promise<void> {
  ensureConfigured();
  const publicIds = urls
    .map(extractPublicIdFromUrl)
    .filter((value): value is string => typeof value === 'string' && value.length > 0);
  if (!publicIds.length) return;

  await cloudinary.api.delete_resources(publicIds, { resource_type: 'image' });
}

export function extractPublicIdFromUrl(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('cloudinary.com')) {
      return null;
    }
    const segments = parsed.pathname.split('/').filter(Boolean);
    const uploadIndex = segments.findIndex((segment) => segment === 'upload');
    if (uploadIndex === -1) return null;
    const afterUpload = segments.slice(uploadIndex + 1);
    const versionIndex = afterUpload.findIndex((segment) => /^v\d+$/.test(segment));
    const assetSegments = versionIndex >= 0 ? afterUpload.slice(versionIndex + 1) : afterUpload;
    if (!assetSegments.length) return null;
    const assetWithExt = assetSegments.join('/');
    const dotIndex = assetWithExt.lastIndexOf('.');
    const withoutExt = dotIndex >= 0 ? assetWithExt.slice(0, dotIndex) : assetWithExt;
    return decodeURIComponent(withoutExt);
  } catch (_) {
    return null;
  }
}
