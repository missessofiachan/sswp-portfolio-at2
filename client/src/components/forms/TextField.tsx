/**
 * React Hook Form-controlled text input built on top of FormField.
 */
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';
import { FormField, type FormFieldProps } from './FormField';

export interface TextFieldProps<TFieldValues extends FieldValues>
  extends Omit<FormFieldProps, 'error' | 'name'> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  defaultValue?: string;
  shouldUnregister?: boolean;
}

export function TextField<TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  defaultValue,
  shouldUnregister,
  ...rest
}: TextFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue as any}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState }) => (
        <FormField
          {...rest}
          {...field}
          value={field.value ?? ''}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
