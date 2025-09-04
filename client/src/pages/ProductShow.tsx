// products/:id

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteProduct, getProduct } from '@client/api/clients/products.api';
import { useAuth } from '@client/features/auth/AuthProvider';
import { card, actions, btnOutline, btnDanger, btnPrimary } from '@client/app/ui.css';

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
      <div style={{ background: 'white', padding: 24, borderRadius: 8, minWidth: 300 }}>
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
 *
 * Behavior:
 * - Reads `id` from route params and fetches the product via `getProduct(id)`
 *   on mount and whenever `id` changes.
 * - Renders a loading indicator while fetching, an inline error message on
 *   failure, and a "Product not found" message when no product is returned.
 * - Formats the product price to two decimal places for display.
 * - Uses `useAuth()` to determine whether the current user can edit/delete
 *   (either authenticated or admin).
 * - Shows edit and delete actions when permitted:
 *   - Edit navigates to `/products/{id}/edit`.
 *   - Delete opens a confirmation modal; confirming calls `deleteProduct(id)`,
 *     disables the delete button while in progress, and navigates to
 *     `/products` on success.
 *
 * State:
 * - product: Product | null — the loaded product data.
 * - loading: boolean — whether the product is currently being fetched.
 * - error: string | null — an error message to display if a fetch or delete fails.
 * - showConfirm: boolean — whether the delete confirmation modal is visible.
 * - deleting: boolean — whether a delete request is in progress.
 *
 * Side effects:
 * - Fetch product in a useEffect when `id` changes.
 * - Trigger delete flow when the user confirms deletion.
 *
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
              src={product.images[0]}
              alt={product.name}
              style={{ width: '100%', maxHeight: 360, objectFit: 'cover', borderRadius: 8 }}
            />
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.images.slice(1).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`${product.name} ${i + 2}`}
                    loading="lazy"
                    style={{
                      width: 96,
                      height: 96,
                      objectFit: 'cover',
                      borderRadius: 6,
                      border: '1px solid #eee',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        {product.description && <p>{product.description}</p>}
        <p>Price: ${Number(product.price).toFixed(2)}</p>
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
