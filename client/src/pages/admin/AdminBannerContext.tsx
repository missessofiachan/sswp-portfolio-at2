import React, { createContext, useContext, useMemo, useState } from 'react';

type BannerState = {
  indexUrl?: string;
  message?: string;
};

type BannerContextValue = BannerState & {
  setBanner: (payload: BannerState | undefined) => void;
  clearBanner: () => void;
};

const AdminBannerContext = createContext<BannerContextValue | undefined>(undefined);

export function AdminBannerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BannerState>({});

  const value = useMemo<BannerContextValue>(
    () => ({
      ...state,
      setBanner: (payload) => setState(payload ?? {}),
      clearBanner: () => setState({}),
    }),
    [state]
  );

  return <AdminBannerContext.Provider value={value}>{children}</AdminBannerContext.Provider>;
}

export function useAdminBanner() {
  const ctx = useContext(AdminBannerContext);
  if (!ctx) throw new Error('useAdminBanner must be used within AdminBannerProvider');
  return ctx;
}
