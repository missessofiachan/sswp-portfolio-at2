// products/:id

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteProduct, getProduct } from '@client/api/clients/products.api';
import { useAuth } from '@client/features/auth/AuthProvider';
import {
  card,
  actions,
  btnOutline,
  btnDanger,
  btnPrimary,
  photoFrame,
  photoThumb,
  sepiaPhoto,
} from '@client/app/ui.css';
import { resolveImageUrl, PLACEHOLDER_SRC } from '@client/lib/images';

type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  rating?: number;
  images?: string[];
};

// Simple confirmation modal component
function ConfirmModal({
  open,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: 'rgba(252, 243, 224, 0.96)',
          padding: 24,
          borderRadius: 8,
          border: '2px solid #c7a57a',
          minWidth: 300,
          boxShadow: '6px 6px 0 rgba(82, 52, 27, 0.3)',
        }}
      >
        <p>{message}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className={btnOutline} onClick={onCancel}>
            Cancel
          </button>
          <button className={btnDanger} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * ProductShow
 *
 * Displays a single product fetched by the `id` URL parameter. Handles loading,
 * error and not-found states, and conditionally renders edit/delete controls
 * for authorized users. Deleting a product shows a confirmation modal and,
 * upon success, navigates back to the product list.
 *   - Edit navigates to `/products/{id}/edit`.
 *   - Delete opens a confirmation modal; confirming calls `deleteProduct(id)`,
 *     disables the delete button while in progress, and navigates to
 *     `/products` on success.
 *
 * State:
 * - product: Product | null — the loaded product data.
 * - loading: boolean — whether the product is currently being fetched.
 * - error: string | null — an error message to display if a fetch or delete fails.
 * Dependencies / External APIs:
 * - getProduct(id): Promise<Product>
 * - deleteProduct(id): Promise<void>
 * - useParams(), useNavigate() from react-router
 * - useAuth() (expects `{ token, isAdmin }`)
 * - ConfirmModal component for delete confirmation
 *
 * @returns JSX.Element - the Product detail view with conditional actions and a confirmation modal.
 */
export default function ProductShow() {
  const { id } = useParams();
  const nav = useNavigate();
  const { token, isAdmin } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getProduct(id)
      .then(setProduct)
      .catch((e) => {
        console.error('Failed to load product', e);
        setError(e?.response?.data?.error?.message || 'Failed to load product');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      setDeleting(true);
      await deleteProduct(id);
      nav('/products');
    } catch (e) {
      console.error('Failed to delete product', e);
      setError('Failed to delete product');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: 'crimson' }}>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  const canEdit = Boolean(token) || isAdmin;

  return (
    <>
      <article className={card}>
        <h2 style={{ marginTop: 0 }}>{product.name}</h2>
        {Array.isArray(product.images) && product.images.length > 0 && (
          <div style={{ display: 'grid', gap: 8, marginBottom: 8 }}>
            {/* Primary image */}
            <img
              src={resolveImageUrl(product.images[0])}
              alt={product.name}
              className={`${photoFrame} ${sepiaPhoto}`}
              style={{ maxHeight: 360, objectFit: 'cover' }}
              onError={(e) => {
                const t = e.currentTarget as HTMLImageElement;
                if (t.src !== PLACEHOLDER_SRC) t.src = PLACEHOLDER_SRC;
              }}
            />
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.images.slice(1).map((url, i) => (
                  <img
                    key={i}
                    src={resolveImageUrl(url)}
                    alt={`${product.name} ${i + 2}`}
                    loading="lazy"
                    className={`${photoThumb} ${sepiaPhoto}`}
                    style={{
                      width: 96,
                      height: 96,
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      const t = e.currentTarget as HTMLImageElement;
                      if (t.src !== PLACEHOLDER_SRC) t.src = PLACEHOLDER_SRC;
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        <div style={{ display: 'grid', gap: 6, marginBottom: 12 }}>
          <p style={{ margin: 0, color: '#6d5b45' }}>
            Category: {product.category ? product.category : 'Uncategorised'}
          </p>
          {typeof product.rating === 'number' && !Number.isNaN(product.rating) && (
            <p style={{ margin: 0 }}>
              {(() => {
                const clamped = Math.max(0, Math.min(5, Number(product.rating)));
                const rounded = Math.round(clamped);
                return (
                  <>
                    Rating: {clamped.toFixed(1)} / 5{' '}
                    <span aria-hidden="true" style={{ color: '#d49a6a' }}>
                      {'★'.repeat(rounded)}
                      {'☆'.repeat(5 - rounded)}
                    </span>
                  </>
                );
              })()}
            </p>
          )}
          <p style={{ margin: 0, fontWeight: 600 }}>Price: ${Number(product.price).toFixed(2)}</p>
        </div>
        {product.description && <p>{product.description}</p>}
        {canEdit && (
          <div className={actions}>
            <Link className={btnPrimary} to={`/products/${product.id}/edit`}>
              Edit
            </Link>
            <button className={btnDanger} onClick={() => setShowConfirm(true)} disabled={deleting}>
              Delete
            </button>
            <Link className={btnOutline} to="/products">
              Back
            </Link>
          </div>
        )}
      </article>

      <ConfirmModal
        open={showConfirm}
        message="Delete this product?"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
