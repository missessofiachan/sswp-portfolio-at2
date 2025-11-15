/**
 * Accessible error callout that surfaces structured messages, request IDs,
 * and optional dismissal/copy affordances for debugging.
 */
import { showToast } from '@client/lib/toast';
import { formatErrorMessageWithId } from '@client/utils/errorFormatter';
import { useState } from 'react';
import { Button } from './Button';
import {
  actionButton,
  closeButton,
  code,
  container,
  headerRow,
  heading,
  message as messageClass,
  metaRow,
} from './ErrorDisplay.css';

export interface ErrorDisplayProps {
  error: unknown;
  title?: string;
  onDismiss?: () => void;
  showCopyToast?: boolean;
}

export function ErrorDisplay({
  error,
  title = 'Something went wrong',
  onDismiss,
  showCopyToast = true,
}: ErrorDisplayProps) {
  const { message, requestId, errorCode } = formatErrorMessageWithId(error);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!requestId) return;
    try {
      await navigator.clipboard.writeText(requestId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (showCopyToast) {
        showToast('Request ID copied', { type: 'info', duration: 2000, requestId });
      }
    } catch (err) {
      console.error('Failed to copy request ID', err);
      showToast('Failed to copy request ID', { type: 'error', duration: 2000 });
    }
  };

  return (
    <div className={container} role="alert">
      <div className={headerRow}>
        <div>
          <p className={heading}>{title}</p>
          <p className={messageClass}>{message}</p>
        </div>
        {onDismiss && (
          <button
            type="button"
            className={closeButton}
            onClick={onDismiss}
            aria-label="Dismiss error"
          >
            ×
          </button>
        )}
      </div>
      <div className={metaRow}>
        {errorCode && (
          <span>
            Error Code: <code className={code}>{errorCode}</code>
          </span>
        )}
        {requestId && (
          <span>
            Request ID: <code className={code}>{requestId}</code>
          </span>
        )}
        {requestId && (
          <Button
            variant="secondary"
            type="button"
            onClick={handleCopy}
            disabled={copied}
            className={actionButton}
          >
            {copied ? 'Copied' : 'Copy ID'}
          </Button>
        )}
      </div>
    </div>
  );
}

export default ErrorDisplay;
