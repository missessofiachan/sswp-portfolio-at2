/**
 * Advanced image uploader with drag-and-drop, preview, and progress tracking
 */

import { uploadImages } from '@client/api/clients/products.api';
import { btnOutline, btnPrimary, card } from '@client/app/ui.css';
import { type ChangeEvent, type DragEvent, useRef, useState } from 'react';

export interface ImageUploaderProps {
  onUploadComplete: (urls: string[]) => void;
  onError?: (error: string) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
}

interface UploadingFile {
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

/**
 * ImageUploader - Drag-and-drop image uploader with preview and progress
 *
 * @example
 * ```tsx
 * <ImageUploader
 *   maxFiles={5}
 *   maxSizeMB={5}
 *   onUploadComplete={(urls) => setValue('images', urls)}
 *   onError={(err) => setError(err)}
 * />
 * ```
 */
export function ImageUploader({
  onUploadComplete,
  onError,
  maxFiles = 5,
  maxSizeMB = 5,
  accept = 'image/*',
}: ImageUploaderProps) {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file type: ${file.type}. Only images are allowed.`;
    }

    // Check file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      return `File too large: ${sizeMB.toFixed(1)}MB. Maximum ${maxSizeMB}MB allowed.`;
    }

    return null;
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList) return;

    const selectedFiles = Array.from(fileList);

    // Check max files limit
    if (files.length + selectedFiles.length > maxFiles) {
      onError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate and prepare files
    const newFiles: UploadingFile[] = [];
    for (const file of selectedFiles) {
      const error = validateFile(file);

      if (error) {
        onError?.(error);
        continue;
      }

      // Create preview
      const preview = URL.createObjectURL(file);
      newFiles.push({
        file,
        preview,
        progress: 0,
        status: 'pending',
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);

    // Upload files
    await uploadFiles(newFiles);
  };

  const uploadFiles = async (filesToUpload: UploadingFile[]) => {
    const formData = new FormData();
    filesToUpload.forEach((f) => formData.append('files', f.file));

    // Update status to uploading
    setFiles((prev) =>
      prev.map((f) => (filesToUpload.includes(f) ? { ...f, status: 'uploading' as const } : f))
    );

    try {
      // Simulate progress (real progress would require xhr or fetch with streaming)
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.status === 'uploading' && f.progress < 90 ? { ...f, progress: f.progress + 10 } : f
          )
        );
      }, 200);

      const result = await uploadImages(formData);
      clearInterval(progressInterval);

      // Update to success
      setFiles((prev) =>
        prev.map((f, idx) =>
          filesToUpload.includes(f) ? { ...f, status: 'success' as const, progress: 100 } : f
        )
      );

      onUploadComplete(result.urls);
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          filesToUpload.includes(f)
            ? {
                ...f,
                status: 'error' as const,
                error: error instanceof Error ? error.message : 'Upload failed',
              }
            : f
        )
      );
      onError?.(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        className={card}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: isDragging ? '2px dashed #4CAF50' : '2px dashed #ddd',
          backgroundColor: isDragging ? '#f0f9ff' : '#fafafa',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
        <p style={{ margin: 0, color: '#64748b' }}>
          <strong>Drop images here</strong> or click to browse
        </p>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          Max {maxFiles} files, {maxSizeMB}MB each • PNG, JPEG, WebP, GIF
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {/* Preview grid */}
      {files.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          {files.map((f, idx) => (
            <div key={idx} className={card} style={{ position: 'relative', padding: '0.5rem' }}>
              <img
                src={f.preview}
                alt={f.file.name}
                style={{
                  width: '100%',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  marginBottom: '0.5rem',
                }}
              />
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                {f.file.name.length > 20 ? f.file.name.slice(0, 17) + '...' : f.file.name}
              </div>

              {/* Progress bar */}
              {f.status === 'uploading' && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <div
                    style={{
                      height: '4px',
                      backgroundColor: '#e0e0e0',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${f.progress}%`,
                        backgroundColor: '#4CAF50',
                        transition: 'width 0.3s',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    {f.progress}%
                  </div>
                </div>
              )}

              {/* Status */}
              {f.status === 'success' && (
                <div style={{ fontSize: '0.75rem', color: '#22c55e' }}>✓ Uploaded</div>
              )}
              {f.status === 'error' && (
                <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>✗ {f.error}</div>
              )}

              {/* Remove button */}
              <button
                className={btnOutline}
                onClick={() => removeFile(idx)}
                style={{
                  width: '100%',
                  padding: '0.25rem',
                  fontSize: '0.75rem',
                  marginTop: '0.25rem',
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
