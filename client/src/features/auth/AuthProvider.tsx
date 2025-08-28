import React, { createContext, useContext, useState } from 'react';
import { login as apiLogin } from '@client/api/clients/auth.api';

type User = { id: string; role: 'user' | 'admin' } | null;

interface Ctx {
  user: User;
  token: string | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthCtx = createContext<Ctx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  async function login(data: { email: string; password: string }) {
    const res = await apiLogin(data);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('token', res.token);
  }
  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }

  return <AuthCtx.Provider value={{ user, token, login, logout }}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
