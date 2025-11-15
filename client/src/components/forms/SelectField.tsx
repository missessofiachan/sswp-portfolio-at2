/**
 * React Hook Form wrapper for the design-system select component.
 */
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';
import { FormSelect, type FormSelectOption, type FormSelectProps } from './FormField';

export interface SelectFieldProps<TFieldValues extends FieldValues>
  extends Omit<FormSelectProps, 'error' | 'name' | 'options'> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  options: FormSelectOption[];
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  defaultValue?: string;
  shouldUnregister?: boolean;
}

export function SelectField<TFieldValues extends FieldValues>({
  name,
  control,
  options,
  rules,
  defaultValue,
  shouldUnregister,
  ...rest
}: SelectFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue as any}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState }) => (
        <FormSelect
          {...rest}
          options={options}
          {...field}
          value={field.value ?? ''}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
