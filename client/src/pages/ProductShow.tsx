// products/:id

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProduct } from '@client/api/clients/products.api';

export default function ProductShow() {
  const { id } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  useEffect(() => {
    if (id) getProduct(id).then(setProduct);
  }, [id]);
  if (!product) return <p>Loading…</p>;
  return (
    <article>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
    </article>
  );
}
