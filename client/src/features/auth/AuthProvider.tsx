import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { login as apiLogin } from '@client/api/clients/auth.api';

type User = { id: string; role: 'user' | 'admin' } | null;

interface Ctx {
  user: User;
  token: string | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthCtx = createContext<Ctx | undefined>(undefined);

/**
 * AuthProvider component that supplies authentication state and actions to the app via AuthCtx.
 *
 * This provider:
 * - Restores a previously stored JWT token from localStorage on initial client render and attempts
 *   to decode its payload (client-side only, without verification) to restore a minimal `user`
 *   object used for UI state (expects a payload with `sub` and `role`).
 * - Exposes `login` and `logout` functions to perform authentication changes.
 * - Exposes `isAdmin` computed flag derived from the current user's role.
 *
 * Important security note:
 * - The JWT payload decoding performed here uses atob and does NOT verify the token signature.
 *   It is intended solely to restore UI state and should never be relied upon for authorization
 *   or access control on the server or for any security-sensitive logic.
 *
 * @param props.children - React children to render inside the provider.
 *
 * @remarks
 * - On mount, the provider reads `localStorage.getItem('token')`. If a token exists, it attempts
 *   to base64-decode the token's payload and parse it as JSON. If the payload contains a `role`
 *   equal to `'user'` or `'admin'`, the provider will set `user = { id: String(sub), role }`.
 *   Any decoding/parsing errors are caught and logged; no exception is thrown to the app.
 *
 * - The `login` function calls an external `apiLogin` helper and expects a response shape like:
 *   { data: { token: string, user: { id: string; role: 'user' | 'admin' } } }.
 *   If the response is invalid, `login` clears auth state, removes any stored token and throws
 *   an Error indicating an invalid login response.
 *
 * - The `logout` function clears `user` and `token` in state and removes the token from
 *   localStorage.
 *
 * @returns A React element: an AuthCtx.Provider that supplies the following value:
 * - user: { id: string; role: 'user' | 'admin' } | null
 * - token: string | null
 * - login: (data: { email: string; password: string }) => Promise<void>
 * - logout: () => void
 * - isAdmin: boolean
 *
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 *
 * @public
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);

  // Restore user and token from localStorage on first load (client-only)
  useEffect(() => {
    try {
      const t = localStorage.getItem('token');
      if (!t) return;
      setToken(t);
      // Decode JWT payload without verifying (client-side only to restore UI state)
      const [, payloadB64] = t.split('.');
      if (!payloadB64) return;
      const normalizedB64 = payloadB64 + '='.repeat((4 - (payloadB64.length % 4)) % 4);
      const json = JSON.parse(atob(normalizedB64));
      // Expect { sub, role }
      if (json && typeof json === 'object' && (json.role === 'user' || json.role === 'admin')) {
        setUser({ id: String((json as any).sub ?? ''), role: (json as any).role });
      }
    } catch (err) {
      // Failed to decode JWT payload, possibly invalid token
      console.error('Failed to restore user from token:', err);
    }
  }, []);

  async function login(data: { email: string; password: string }) {
    // api returns { data: { token, user } }
    const res = await apiLogin(data);
    const payload = (res as any)?.data;
    if (!payload || typeof payload.token !== 'string' || !payload.user) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      throw new Error('Invalid login response from server');
    }
    setUser(payload.user as { id: string; role: 'user' | 'admin' });
    setToken(payload.token);
    localStorage.setItem('token', payload.token);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }

  const isAdmin = useMemo(() => user?.role === 'admin', [user]);

  return (
    <AuthCtx.Provider value={{ user, token, login, logout, isAdmin }}>{children}</AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
