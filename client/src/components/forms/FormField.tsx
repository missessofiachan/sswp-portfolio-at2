/**
 * Reusable form field component with integrated error handling and labels.
 * Works seamlessly with react-hook-form.
 */

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type ReactNode,
  useMemo,
  useState,
} from 'react';
import {
  control,
  controlWithAffix,
  controlWithSuffix,
  controlWrapper,
  error as errorClass,
  field,
  hint as hintClass,
  label as labelClass,
  message as messageClass,
  messageRow,
  prefix as prefixClass,
  required as requiredClass,
  suffix as suffixClass,
  toggleButton,
} from './FormField.css';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function toId(label: string, provided?: string) {
  if (provided) return provided;
  return `field-${label.toLowerCase().replace(/[^a-z0-9]+/gi, '-')}`;
}

export interface FormFieldProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
  error?: string;
  hint?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  requiredIndicator?: boolean;
  showPasswordToggle?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      error,
      hint,
      id,
      prefix,
      suffix,
      requiredIndicator,
      showPasswordToggle,
      type,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = useMemo(() => toId(label, id), [label, id]);

    const isPasswordField = showPasswordToggle && type === 'password';
    const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

    const hasPrefix = Boolean(prefix);
    const hasSuffix = Boolean(suffix) || isPasswordField;

    const describedBy = [
      error ? `${inputId}-error` : null,
      hint && !error ? `${inputId}-hint` : null,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={field}>
        <label className={labelClass} htmlFor={inputId}>
          <span>{label}</span>
          {(requiredIndicator || props.required) && <span className={requiredClass}>*</span>}
        </label>
        <div className={controlWrapper}>
          {hasPrefix && <span className={prefixClass}>{prefix}</span>}
          <input
            id={inputId}
            ref={ref}
            type={inputType}
            className={cx(control, hasPrefix && controlWithAffix, hasSuffix && controlWithSuffix)}
            data-error={error ? 'true' : 'false'}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy || undefined}
            {...props}
          />
          {(hasSuffix || isPasswordField) && (
            <span className={suffixClass}>
              {suffix}
              {isPasswordField && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={toggleButton}
                  aria-label={`${showPassword ? 'Hide' : 'Show'} password`}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              )}
            </span>
          )}
        </div>
        <div className={messageRow}>
          {error ? (
            <span id={`${inputId}-error`} className={cx(messageClass, errorClass)}>
              {error}
            </span>
          ) : hint ? (
            <span id={`${inputId}-hint`} className={cx(messageClass, hintClass)}>
              {hint}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export interface FormTextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  label: string;
  error?: string;
  hint?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  requiredIndicator?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, hint, id, requiredIndicator, ...props }, ref) => {
    const textareaId = useMemo(() => toId(label, id), [label, id]);
    const describedBy = [
      error ? `${textareaId}-error` : null,
      hint && !error ? `${textareaId}-hint` : null,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={field}>
        <label className={labelClass} htmlFor={textareaId}>
          <span>{label}</span>
          {(requiredIndicator || props.required) && <span className={requiredClass}>*</span>}
        </label>
        <textarea
          id={textareaId}
          ref={ref}
          className={control}
          data-error={error ? 'true' : 'false'}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy || undefined}
          {...props}
        />
        <div className={messageRow}>
          {error ? (
            <span id={`${textareaId}-error`} className={cx(messageClass, errorClass)}>
              {error}
            </span>
          ) : hint ? (
            <span id={`${textareaId}-hint`} className={cx(messageClass, hintClass)}>
              {hint}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

export interface FormSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps extends ComponentPropsWithoutRef<'select'> {
  label: string;
  error?: string;
  hint?: string;
  options: FormSelectOption[];
  placeholder?: string;
  requiredIndicator?: boolean;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, hint, options, placeholder, id, requiredIndicator, ...props }, ref) => {
    const selectId = useMemo(() => toId(label, id), [label, id]);
    const describedBy = [
      error ? `${selectId}-error` : null,
      hint && !error ? `${selectId}-hint` : null,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={field}>
        <label className={labelClass} htmlFor={selectId}>
          <span>{label}</span>
          {(requiredIndicator || props.required) && <span className={requiredClass}>*</span>}
        </label>
        <div className={controlWrapper}>
          <select
            id={selectId}
            ref={ref}
            className={control}
            data-error={error ? 'true' : 'false'}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy || undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className={messageRow}>
          {error ? (
            <span id={`${selectId}-error`} className={cx(messageClass, errorClass)}>
              {error}
            </span>
          ) : hint ? (
            <span id={`${selectId}-hint`} className={cx(messageClass, hintClass)}>
              {hint}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';
