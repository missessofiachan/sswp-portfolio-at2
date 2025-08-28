import { useEffect, useState } from 'react';
import { listProducts } from '@client/api/clients/products.api';

export default function Products() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    listProducts({ sort: { field: 'price', dir: 'asc' } }).then(setItems);
  }, []);
  return (
    <div>
      <h2>Products</h2>
      <ul>
        {items.map((p) => (
          <li key={p.id}>
            {p.name} — ${p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
