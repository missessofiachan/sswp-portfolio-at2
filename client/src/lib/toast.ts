/**
 * Lightweight toast pub/sub utility that allows any component to dispatch
 * messages and subscribe via `useToast`, decoupled from the visual container.
 */
import { useEffect } from 'react';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  type?: ToastVariant;
  duration?: number; // ms
  title?: string;
  requestId?: string;
}

export interface ToastMessage {
  id: number;
  message: string;
  variant: ToastVariant;
  duration: number;
  title?: string;
  requestId?: string;
}

type ToastListener = (toast: ToastMessage) => void;

let listeners: ToastListener[] = [];

export function showToast(message: string, opts: ToastOptions = {}) {
  const toast: ToastMessage = {
    id: Date.now() + Math.random(),
    message,
    variant: opts.type ?? 'info',
    duration: opts.duration ?? 4000,
    title: opts.title,
    requestId: opts.requestId,
  };

  listeners.forEach((cb) => cb(toast));
}

export function useToast(callback: ToastListener) {
  useEffect(() => {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter((cb) => cb !== callback);
    };
  }, [callback]);
}
