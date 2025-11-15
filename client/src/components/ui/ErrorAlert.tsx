/**
 * Simple error alert component for form-level validation and Firestore index
 * warnings.
 */
import type React from 'react';

interface ErrorAlertProps {
  message: string;
  details?: unknown;
  indexUrl?: string;
  onClose?: () => void;
}

function normalizeDetails(details: unknown): Array<string> | undefined {
  if (!details) return undefined;
  // Support Joi error format: [{ field, message }]
  if (Array.isArray(details)) {
    const items = details
      .map((d) => {
        if (d && typeof d === 'object') {
          const anyD: any = d;
          if (typeof anyD.message === 'string') {
            if (typeof anyD.field === 'string') return `${anyD.field}: ${anyD.message}`;
            return anyD.message;
          }
        }
        return typeof d === 'string' ? d : JSON.stringify(d);
      })
      .filter(Boolean);
    return items.length ? items : undefined;
  }
  // Objects: stringify succinctly
  if (typeof details === 'object') {
    try {
      return [JSON.stringify(details)];
    } catch {}
  }
  if (typeof details === 'string') return [details];
  return undefined;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, details, indexUrl, onClose }) => {
  const items = normalizeDetails(details);
  return (
    <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-800">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold">{message}</p>
          {items && (
            <ul className="mt-2 list-disc pl-5 text-sm">
              {items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
          {indexUrl && (
            <p className="mt-2 text-sm">
              This query requires a Firestore index. Create it here:{' '}
              <a className="underline" href={indexUrl} target="_blank" rel="noreferrer">
                Open index creation link
              </a>
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Dismiss error"
            className="text-red-700 hover:text-red-900"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
