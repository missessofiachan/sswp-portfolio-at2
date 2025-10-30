import { useState } from 'react';
import { useToast } from '../../lib/toast';
import type { ToastType } from '../../lib/toast';

export function ToastContainer() {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    visible: boolean;
  } | null>(null);

  useToast((msg: string, opts: { type?: ToastType; duration?: number }) => {
    setToast({
      message: msg,
      type: opts.type || 'info',
      visible: true,
    });
    setTimeout(() => {
      setToast((t) => t && { ...t, visible: false });
    }, opts.duration ?? 3000);
  });

  if (!toast || !toast.visible) return null;

  let bg = 'bg-gray-800';
  if (toast.type === 'success') bg = 'bg-green-600';
  if (toast.type === 'error') bg = 'bg-red-600';
  if (toast.type === 'warning') bg = 'bg-yellow-500';

  // Use 'alert' role and 'assertive' for errors, 'status' and 'polite' for others
  const role = toast.type === 'error' ? 'alert' : 'status';
  const ariaLive = toast.type === 'error' ? 'assertive' : 'polite';

  return (
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white ${bg}`}
      role={role}
      aria-live={ariaLive}
      aria-atomic="true"
    >
      {toast.message}
    </div>
  );
}
