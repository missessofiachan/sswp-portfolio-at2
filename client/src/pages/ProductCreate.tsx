import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProduct, uploadImages } from '@client/api/clients/products.api';
import { card, field, input, label, actions, btnPrimary, btnOutline } from '@client/app/ui.css';

const Schema = z.object({
  name: z.string().min(2),
  price: z.coerce.number().nonnegative(),
  description: z.string().optional().default(''),
  category: z.string().min(2),
  rating: z.coerce.number().min(0).max(5).default(0),
  stock: z.coerce.number().int().nonnegative().default(0),
});

type FormValues = z.infer<typeof Schema>;

/**
 * ProductCreate
 *
 * Renders a form for creating a new product with image upload functionality.
 * Handles client-side validation, file uploads, and submission.
 *
 * The component:
 * - Uses react-hook-form with zodResolver(Schema) to manage form state and validation.
 * - Exposes fields: name, price, category, rating, stock, description.
 * - Allows users to upload images via file input (uploads to Cloudinary).
 * - Shows image previews with the ability to remove uploaded images before submission.
 * - Disables the submit button while the form is submitting (isSubmitting).
 * - Displays inline validation messages for each field.
 *
 * Submission behavior:
 * - onSubmit awaits createProduct(values) with uploaded image URLs
 * - If the server returns an object with an id, navigates to `/products/{id}`
 * - If the response is invalid or an exception occurs, alerts the user and logs the error
 *
 * Notes:
 * - Price input uses step="0.01".
 * - Rating input is constrained with min=0, max=5 and step=0.1.
 * - Images are uploaded immediately when selected and stored in component state.
 * - Validation logic and types are derived from Schema (zod).
 *
 * @returns {JSX.Element} The product creation form UI.
 *
 * @example
 * <ProductCreate />
 */

export default function ProductCreate() {
  const nav = useNavigate();
  const [uploadStatus, setUploadStatus] = useState<{ text: string; color: string } | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const statusTimeout = useRef<NodeJS.Timeout | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof Schema>, any, FormValues>({ resolver: zodResolver(Schema) });

  async function onSubmit(values: FormValues) {
    try {
      const created = await createProduct({
        name: values.name,
        price: values.price,
        description: values.description,
        category: values.category,
        rating: values.rating,
        stock: values.stock,
        images: uploadedImages,
      });
      if (created && created.id) {
        nav(`/products/${created.id}`);
      } else {
        alert('Product creation failed: Invalid response from server.');
      }
    } catch (error) {
      alert('Product creation failed. Please try again.');
      console.error(error);
    }
  }

  return (
    <div className={card}>
      <h2>New Product</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={field}>
          <label className={label}>Name</label>
          <input className={input} {...register('name')} />
          {errors.name && <small style={{ color: 'crimson' }}>{errors.name.message}</small>}
        </div>
        <div className={field}>
          <label className={label}>Upload Images</label>
          <input
            className={input}
            type="file"
            accept="image/*"
            multiple
            onChange={async (e) => {
              const fl = e.currentTarget.files;
              if (!fl || fl.length === 0) return;

              // Show loading state
              if (statusTimeout.current) clearTimeout(statusTimeout.current);
              setUploadStatus({ text: 'Uploading...', color: '#d49a6a' });

              try {
                const urls = await uploadImages(Array.from(fl));
                setUploadedImages((prev) => [...prev, ...urls]);
                // Clear selection
                e.currentTarget.value = '';

                setUploadStatus({ text: `✓ Uploaded ${urls.length} file(s)`, color: '#2d5a27' });
                statusTimeout.current = setTimeout(() => {
                  setUploadStatus(null);
                }, 3000);
              } catch (err: any) {
                console.error('Upload error:', err);

                // Detailed error handling
                let errorMessage = 'Upload failed';
                const status = err?.response?.status;
                const serverMessage = err?.response?.data?.error?.message;

                if (status === 401) {
                  errorMessage = 'Please log in and try again';
                } else if (status === 400) {
                  errorMessage = serverMessage || 'Invalid file type or format';
                } else if (status === 413) {
                  errorMessage = serverMessage || 'File too large';
                } else if (serverMessage) {
                  errorMessage = serverMessage;
                } else if (err.message) {
                  errorMessage = err.message;
                }

                setUploadStatus({ text: `✗ ${errorMessage}`, color: '#c53030' });
                statusTimeout.current = setTimeout(() => {
                  setUploadStatus(null);
                }, 5000);
              }
            }}
          />
          <small>
            Select image files to upload.{' '}
            {uploadedImages.length > 0 && `${uploadedImages.length} image(s) ready.`}
            {uploadStatus && (
              <span style={{ marginLeft: '8px', fontWeight: 'bold', color: uploadStatus.color }}>
                {uploadStatus.text}
              </span>
            )}
          </small>
          {uploadedImages.length > 0 && (
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {uploadedImages.map((url, idx) => (
                <div key={idx} style={{ position: 'relative', width: '100px', height: '100px' }}>
                  <img
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '4px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setUploadedImages((prev) => prev.filter((_, i) => i !== idx))}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      lineHeight: '1',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={field}>
          <label className={label}>Price</label>
          <input className={input} type="number" step="0.01" {...register('price')} />
          {errors.price && <small style={{ color: 'crimson' }}>{errors.price.message}</small>}
        </div>
        <div className={field}>
          <label className={label}>Category</label>
          <input className={input} {...register('category')} />
          {errors.category && <small style={{ color: 'crimson' }}>{errors.category.message}</small>}
        </div>
        <div className={field}>
          <label className={label}>Rating</label>
          <input
            className={input}
            type="number"
            min={0}
            max={5}
            step={0.1}
            {...register('rating')}
          />
          {errors.rating && <small style={{ color: 'crimson' }}>{errors.rating.message}</small>}
        </div>
        <div className={field}>
          <label className={label}>Stock</label>
          <input
            className={input}
            type="number"
            min={0}
            step={1}
            {...register('stock')}
            placeholder="Available inventory count"
          />
          {errors.stock && <small style={{ color: 'crimson' }}>{errors.stock.message}</small>}
        </div>
        <div className={field}>
          <label className={label}>Description</label>
          <textarea className={input} rows={3} {...register('description')} />
        </div>
        <div className={field}>
          <button className={btnOutline} type="button" onClick={() => reset()}>
            Reset
          </button>
        </div>
        <div className={actions}>
          <button className={btnPrimary} disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Saving…' : 'Create'}
          </button>
          <button className={btnOutline} type="reset">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
