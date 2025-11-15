/**
 * Visual toast host that listens to the global toast bus, renders stacked
 * alerts with variant styling, and supports dismissal and request-id copy.
 */
import { useCallback, useEffect, useState } from 'react';
import { showToast, type ToastMessage, useToast } from '../../lib/toast';
import { Button } from './Button';
import {
  actionsRow,
  bodyStyle,
  closeButton,
  container,
  copyButton,
  requestIdStyle,
  titleStyle,
  toastBase,
  variantStyles,
} from './ToastContainer.css';

function enqueueToast(
  setter: React.Dispatch<React.SetStateAction<ToastMessage[]>>,
  toast: ToastMessage
) {
  setter((prev) => [...prev, toast]);
  if (toast.duration > 0) {
    window.setTimeout(() => {
      setter((prev) => prev.filter((item) => item.id !== toast.id));
    }, toast.duration);
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const handleToast = useCallback((toast: ToastMessage) => {
    enqueueToast(setToasts, toast);
  }, []);

  useToast(handleToast);

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const copyRequestId = async (requestId: string) => {
    try {
      await navigator.clipboard.writeText(requestId);
      showToast('Request ID copied to clipboard', { type: 'info', duration: 2000 });
    } catch (error) {
      console.error('Failed to copy request ID:', error);
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className={container} role="status" aria-live="polite" aria-relevant="additions">
      {toasts.map((toast) => (
        <div key={toast.id} className={`${toastBase} ${variantStyles[toast.variant]}`}>
          <button
            type="button"
            className={closeButton}
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
          {toast.title && <div className={titleStyle}>{toast.title}</div>}
          <div className={bodyStyle}>{toast.message}</div>
          {(toast.requestId || toast.variant === 'error') && (
            <div className={actionsRow}>
              {toast.requestId && (
                <div className={requestIdStyle}>
                  <span>Request ID:</span>
                  <code>{toast.requestId.slice(0, 10)}…</code>
                  <button
                    type="button"
                    className={copyButton}
                    onClick={() => copyRequestId(toast.requestId!)}
                    aria-label="Copy request ID"
                  >
                    Copy
                  </button>
                </div>
              )}
              <Button variant="secondary" onClick={() => dismissToast(toast.id)}>
                Dismiss
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
