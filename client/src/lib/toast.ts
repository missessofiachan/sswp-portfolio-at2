import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  type?: ToastType;
  duration?: number; // ms
}

let listeners: ((msg: string, opts: ToastOptions) => void)[] = [];

export function showToast(message: string, opts: ToastOptions = {}) {
  listeners.forEach((cb) => cb(message, opts));
}

export function useToast(callback: (msg: string, opts: ToastOptions) => void) {
  useEffect(() => {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter((cb) => cb !== callback);
    };
  }, [callback]);
}
