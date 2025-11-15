/**
 * Reusable modal dialog prompting the user to confirm destructive or critical
 * actions with configurable button labels and variants.
 */

import { sprinkles } from '@client/app/sprinkles.css';
import { useState } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void | Promise<void>;
}

/**
 * Confirmation dialog component for destructive or important actions
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Delete Product?"
 *   description="This action cannot be undone."
 *   confirmLabel="Delete"
 *   cancelLabel="Cancel"
 *   variant="danger"
 *   onConfirm={handleDelete}
 * />
 * ```
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  onConfirm,
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirm action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const footer = (
    <div className={sprinkles({ display: 'flex', justifyContent: 'flex-end', gap: 'sm' })}>
      <Button variant="secondary" onClick={onClose} disabled={isLoading}>
        {cancelLabel}
      </Button>
      <Button
        variant={variant === 'danger' ? 'danger' : 'primary'}
        onClick={handleConfirm}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : confirmLabel}
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} size="small">
      {description && <p className={sprinkles({ color: 'textMuted' })}>{description}</p>}
    </Modal>
  );
}
