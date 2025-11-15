import IndexBanner from '@client/components/ui/IndexBanner';
import { NavLink, Outlet } from 'react-router-dom';
import { AdminBannerProvider, useAdminBanner } from './AdminBannerContext';
import * as s from './layout.css';

export default function AdminLayout() {
  const cls = ({ isActive }: { isActive: boolean }) => `${s.link} ${isActive ? s.active : ''}`;
  return (
    <AdminBannerProvider>
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
            <NavLink to="/admin/orders" className={cls}>
              Orders
            </NavLink>
            <NavLink to="/admin/audit-logs" className={cls}>
              Audit Logs
            </NavLink>
          </nav>
        </aside>
        <section className={s.main}>
          <BannerSlot />
          <Outlet />
        </section>
      </div>
    </AdminBannerProvider>
  );
}

function BannerSlot() {
  const { indexUrl, message, clearBanner } = useAdminBanner();
  if (!indexUrl) return null;
  return <IndexBanner indexUrl={indexUrl} message={message} onDismiss={clearBanner} />;
}
