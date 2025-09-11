import { NavLink, Outlet } from 'react-router-dom';
import * as s from './layout.css';

export default function AdminLayout() {
  const cls = ({ isActive }: { isActive: boolean }) => `${s.link} ${isActive ? s.active : ''}`;
  return (
    <div className={s.wrap}>
      <aside className={s.side}>
        <nav style={{ display: 'grid', gap: 6 }}>
          <NavLink to="/admin" end className={cls}>
            Overview
          </NavLink>
          <NavLink to="/admin/users" className={cls}>
            Users
          </NavLink>
          <NavLink to="/admin/products" className={cls}>
            Products
          </NavLink>
          <NavLink to="/admin/products/new" className={cls}>
            Create Product
          </NavLink>
        </nav>
      </aside>
      <section className={s.main}>
        <Outlet />
      </section>
    </div>
  );
}
