/**
 * Banner component prompting the user to create a missing Firestore index.
 */
import React from 'react';

type Props = {
  indexUrl: string;
  message?: string;
  onDismiss?: () => void;
};

/**
 * Slim banner to surface Firestore composite index creation link.
 * Shown when the backend provides an indexUrl for a failed-precondition.
 */
export default function IndexBanner({ indexUrl, message, onDismiss }: Props) {
  return (
    <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="font-semibold">Firestore index required</p>
          <p className="text-sm">
            {message || 'This view requires a Firestore composite index for the current filter.'}
          </p>
          <a
            href={indexUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
          >
            Create Firestore Index
            <span aria-hidden>↗</span>
          </a>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss"
            className="text-amber-800 hover:text-amber-900"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
