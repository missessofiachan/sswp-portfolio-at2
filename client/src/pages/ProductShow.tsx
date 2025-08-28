// products/:id

import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { deleteProduct, getProduct } from '@client/api/clients/products.api';
import { useAuth } from '@client/features/auth/AuthProvider';
import { card, actions, btnOutline, btnDanger, btnPrimary } from '@client/app/ui.css';

export default function ProductShow() {
  const { id } = useParams();
  const nav = useNavigate();
  const { token } = useAuth();
  const [product, setProduct] = useState<any | null>(null);
  useEffect(() => {
    if (id) getProduct(id).then(setProduct);
  }, [id]);
  if (!product) return <p>Loading…</p>;
  return (
    <article className={card}>
      <h2 style={{ marginTop: 0 }}>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      {token && (
        <div className={actions}>
          <Link className={btnPrimary} to={`/products/${product.id}/edit`}>Edit</Link>
          <button
            className={btnDanger}
            onClick={async () => {
              if (!id) return;
              if (confirm('Delete this product?')) {
                await deleteProduct(id);
                nav('/products');
              }
            }}
          >
            Delete
          </button>
          <Link className={btnOutline} to="/products">Back</Link>
        </div>
      )}
    </article>
  );
}
