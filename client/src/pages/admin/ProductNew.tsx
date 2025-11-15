import { card } from '@client/app/ui.css';
import ProductCreate from '@client/pages/ProductCreate';

export default function AdminProductNew() {
  return (
    <div className={card}>
      <h2 style={{ marginTop: 0 }}>Create Product</h2>
      <ProductCreate />
    </div>
  );
}
