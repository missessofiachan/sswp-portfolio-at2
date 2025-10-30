import { beforeEach, describe, expect, it, vi } from 'vitest';

const cloudinaryConfig = vi.hoisted(() => vi.fn());
const uploadStream = vi.hoisted(() => vi.fn());
const deleteResources = vi.hoisted(() => vi.fn());
const loadEnvMock = vi.hoisted(() =>
  vi.fn(() => ({
    CLOUDINARY_URL: 'cloudinary://key:key@test',
    CLOUDINARY_UPLOAD_FOLDER: 'test-folder',
  }))
);

vi.mock('../config/env', () => ({
  loadEnv: loadEnvMock,
}));

vi.mock('cloudinary', () => ({
  v2: {
    config: cloudinaryConfig,
    uploader: { upload_stream: uploadStream },
    api: { delete_resources: deleteResources },
  },
}));

describe('cloudinary.service', () => {
  let uploadImageBuffer: typeof import('../services/cloudinary.service').uploadImageBuffer;
  let deleteAssetsByUrls: typeof import('../services/cloudinary.service').deleteAssetsByUrls;
  let extractPublicIdFromUrl: typeof import(
    '../services/cloudinary.service'
  ).extractPublicIdFromUrl;
  let lastOptions: any;

  beforeEach(async () => {
    vi.resetModules();
    lastOptions = undefined;
    cloudinaryConfig.mockClear();
    uploadStream.mockReset();
    deleteResources.mockReset();
    loadEnvMock.mockClear();
    loadEnvMock.mockReturnValue({
      CLOUDINARY_URL: 'cloudinary://key:key@test',
      CLOUDINARY_UPLOAD_FOLDER: 'test-folder',
    });

    uploadStream.mockImplementation((options: any, cb: any) => {
      lastOptions = options;
      return {
        end: () =>
          cb(null, {
            secure_url: 'https://res.cloudinary.com/demo/image/upload/v1/test-folder/sample.png',
            public_id: options.public_id ?? 'generated-id',
          }),
      };
    });
    deleteResources.mockResolvedValue(undefined);

    ({ uploadImageBuffer, deleteAssetsByUrls, extractPublicIdFromUrl } = await import(
      '../services/cloudinary.service'
    ));
  });

  it('uploads image buffers via Cloudinary', async () => {
    const result = await uploadImageBuffer(Buffer.from('test'), 'sample.png');

    expect(cloudinaryConfig).toHaveBeenCalledWith({
      cloudinary_url: 'cloudinary://key:key@test',
      secure: true,
    });
    expect(uploadStream).toHaveBeenCalled();
    expect(lastOptions).toMatchObject({
      resource_type: 'image',
      folder: 'test-folder',
      overwrite: false,
    });
    expect(typeof lastOptions.public_id).toBe('string');
    expect(result).toEqual({
      url: 'https://res.cloudinary.com/demo/image/upload/v1/test-folder/sample.png',
      publicId: lastOptions.public_id,
    });
  });

  it('configures Cloudinary only once per module instance', async () => {
    await uploadImageBuffer(Buffer.from('foo'), 'a.png');
    await uploadImageBuffer(Buffer.from('bar'), 'b.png');

    expect(cloudinaryConfig).toHaveBeenCalledTimes(1);
  });

  it('deletes assets by extracted public ids', async () => {
    await deleteAssetsByUrls([
      'https://res.cloudinary.com/demo/image/upload/v1/folder/asset.png',
      'https://res.cloudinary.com/demo/image/upload/v123/folder/other%20file.jpg',
      'https://example.com/not-cloudinary.png',
      '',
    ]);

    expect(deleteResources).toHaveBeenCalledWith(['folder/asset', 'folder/other file'], {
      resource_type: 'image',
    });
  });

  it('extracts public ids from Cloudinary URLs', () => {
    expect(
      extractPublicIdFromUrl(
        'https://res.cloudinary.com/demo/image/upload/v1600000000/folder/sub/image.png'
      )
    ).toBe('folder/sub/image');
    expect(extractPublicIdFromUrl('https://res.cloudinary.com/demo/image/upload/folder.jpg')).toBe(
      'folder'
    );
    expect(extractPublicIdFromUrl('https://example.com/not-cloudinary.png')).toBeNull();
    expect(extractPublicIdFromUrl('')).toBeNull();
  });
});
