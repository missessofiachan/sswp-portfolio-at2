/**
 * Accessible modal/dialog component with focus trapping and ARIA attributes
 */

import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../../lib/hooks/useFocusTrap';
import {
  closeButton,
  modalBody,
  modalContent,
  modalFooter,
  modalHeader,
  modalOverlay,
} from './Modal.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'small' | 'medium' | 'large';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

/**
 * Accessible Modal Component
 *
 * Features:
 * - Focus trapping
 * - Escape key to close
 * - ARIA attributes for screen readers
 * - Portal rendering (outside main DOM tree)
 * - Body scroll lock when open
 *
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Delete Confirmation"
 * >
 *   <p>Are you sure you want to delete this item?</p>
 * </Modal>
 * ```
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const trapRef = useFocusTrap<HTMLDivElement>(isOpen);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={modalOverlay} onClick={handleOverlayClick} role="presentation">
      <div
        ref={trapRef}
        className={`${modalContent} ${modalContent}--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={modalHeader}>
          <h2 id="modal-title">{title}</h2>
          <button type="button" className={closeButton} onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </div>
        <div className={modalBody}>{children}</div>
        {footer && <div className={modalFooter}>{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
