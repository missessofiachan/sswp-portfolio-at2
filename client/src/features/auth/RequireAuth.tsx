import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './AuthProvider';

/**
 * Protects routes by requiring authentication and (optionally) a specific user role.
 * Redirects to login if not authenticated, or to home if role does not match.
 *
 * @param children - The components to render if access is granted.
 * @param role - Optional role required to access the route ('user' or 'admin').
 */
/**
 * Protects a route by requiring an authenticated user and, optionally, a specific role.
 *
 * If no authentication token is available (from useAuth()), the component redirects to
 * "/login" and preserves the attempted location in navigation state ({ from: location }).
 * If a required role is provided and the current user's role does not match, it redirects
 * to "/unauthorized". When authentication and role checks pass, the component renders
 * the provided children.
 *
 * @param children - The React nodes to render when access is granted.
 * @param role - Optional required role for access. Allowed values: 'user' | 'admin'.
 * @returns The given children when access is permitted, otherwise a <Navigate /> redirect element.
 *
 * @example
 * <RequireAuth>
 *   <ProfilePage />
 * </RequireAuth>
 *
 * @example
 * <RequireAuth role="admin">
 *   <AdminDashboard />
 * </RequireAuth>
 *
 * @remarks
 * Relies on useAuth() to obtain { token, user } and useLocation() to capture the attempted route.
 */
export function RequireAuth({ children, role }: { children: ReactNode; role?: 'user' | 'admin' }) {
  const { token, user } = useAuth();
  const location = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  if (role && user?.role !== role) return <Navigate to="/unauthorized" replace />;
  return children;
}
