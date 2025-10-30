/**
 * Reusable form field component with integrated error handling and labels.
 * Works seamlessly with react-hook-form.
 */

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { field as fieldClass, label as labelClass, input as inputClass } from '@client/app/ui.css';

export interface FormFieldProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
  error?: string;
  hint?: string;
}

/**
 * FormField component - Input with label and error display
 *
 * @example
 * ```tsx
 * const { register, formState: { errors } } = useForm();
 *
 * <FormField
 *   label="Email"
 *   type="email"
 *   error={errors.email?.message}
 *   {...register('email')}
 * />
 * ```
 */
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, id, ...props }, ref) => {
    const inputId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={fieldClass}>
        <label className={labelClass} htmlFor={inputId}>
          {label}
        </label>
        <input
          id={inputId}
          className={inputClass}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {hint && !error && (
          <small id={`${inputId}-hint`} style={{ color: '#64748b', fontSize: '0.875rem' }}>
            {hint}
          </small>
        )}
        {error && (
          <small
            id={`${inputId}-error`}
            style={{ color: 'crimson', display: 'block', marginTop: '0.25rem' }}
          >
            {error}
          </small>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export interface FormTextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  label: string;
  error?: string;
  hint?: string;
}

/**
 * FormTextarea component - Textarea with label and error display
 */
export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, hint, id, ...props }, ref) => {
    const textareaId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={fieldClass}>
        <label className={labelClass} htmlFor={textareaId}>
          {label}
        </label>
        <textarea
          id={textareaId}
          className={inputClass}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          {...props}
        />
        {hint && !error && (
          <small id={`${textareaId}-hint`} style={{ color: '#64748b', fontSize: '0.875rem' }}>
            {hint}
          </small>
        )}
        {error && (
          <small
            id={`${textareaId}-error`}
            style={{ color: 'crimson', display: 'block', marginTop: '0.25rem' }}
          >
            {error}
          </small>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

export interface FormSelectProps extends ComponentPropsWithoutRef<'select'> {
  label: string;
  error?: string;
  hint?: string;
  options: Array<{ value: string; label: string }>;
}

/**
 * FormSelect component - Select dropdown with label and error display
 */
export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, hint, options, id, ...props }, ref) => {
    const selectId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={fieldClass}>
        <label className={labelClass} htmlFor={selectId}>
          {label}
        </label>
        <select
          id={selectId}
          className={inputClass}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {hint && !error && (
          <small id={`${selectId}-hint`} style={{ color: '#64748b', fontSize: '0.875rem' }}>
            {hint}
          </small>
        )}
        {error && (
          <small
            id={`${selectId}-error`}
            style={{ color: 'crimson', display: 'block', marginTop: '0.25rem' }}
          >
            {error}
          </small>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';
