/**
 * Standardized form action buttons component
 */

import { type ReactNode } from 'react';
import { actions, btnPrimary, btnOutline } from '@client/app/ui.css';

export interface FormActionsProps {
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  onCancel?: () => void;
  showCancel?: boolean;
  children?: ReactNode;
}

/**
 * FormActions - Standardized submit and cancel buttons for forms
 *
 * @example
 * ```tsx
 * <form onSubmit={handleSubmit(onSubmit)}>
 *   {/* form fields *\/}
 *   <FormActions
 *     submitLabel="Save"
 *     isSubmitting={isSubmitting}
 *     onCancel={() => reset()}
 *   />
 * </form>
 * ```
 */
export function FormActions({
  submitLabel = 'Submit',
  cancelLabel = 'Reset',
  isSubmitting = false,
  onCancel,
  showCancel = true,
  children,
}: FormActionsProps) {
  return (
    <div className={actions}>
      <button className={btnPrimary} type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : submitLabel}
      </button>
      {showCancel && onCancel && (
        <button className={btnOutline} type="button" onClick={onCancel}>
          {cancelLabel}
        </button>
      )}
      {children}
    </div>
  );
}
