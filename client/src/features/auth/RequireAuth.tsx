import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './AuthProvider';

export function RequireAuth({ children, role }: { children: ReactNode; role?: 'user' | 'admin' }) {
  const { token, user } = useAuth();
  const loc = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: loc }} />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
}
