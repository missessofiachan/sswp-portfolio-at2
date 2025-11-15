/**
 * React Hook Form + Zod helper that standardizes validation, toast feedback,
 * and server error mapping for app forms.
 */

import { showToast } from '@client/lib/toast';
import { extractFieldErrors, formatErrorMessageWithId } from '@client/utils/errorFormatter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import {
  type DefaultValues,
  type FieldValues,
  type SubmitHandler,
  useForm as useReactHookForm,
} from 'react-hook-form';
import type { ZodSchema, ZodTypeDef } from 'zod';

interface UseAppFormOptions<TSchema extends ZodSchema<any, ZodTypeDef, any>> {
  schema: TSchema;
  defaultValues: DefaultValues<ZodSchemaOutput<TSchema>>;
  onSubmit: (values: ZodSchemaOutput<TSchema>) => Promise<void> | void;
  successMessage?: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  resetOnSuccess?: boolean;
}

export type ZodSchemaOutput<TSchema extends ZodSchema<any, ZodTypeDef, any>> = zodOutput<TSchema>;

// Helper type to infer output from Zod schema
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type zodOutput<TSchema extends ZodSchema<any, ZodTypeDef, any>> = TSchema['_output'];

/**
 * useAppForm - Wrapper around react-hook-form with Zod validation and toast feedback
 *
 * @example
 * ```tsx
 * const form = useAppForm({
 *   schema: Schema,
 *   defaultValues,
 *   successMessage: 'Product saved',
 *   onSubmit: async (values) => {
 *     await api.save(values);
 *   },
 * });
 *
 * return (
 *   <form onSubmit={form.handleSubmitForm}>
 *     <input {...form.register('name')} />
 *   </form>
 * );
 * ```
 */
export function useAppForm<TSchema extends ZodSchema<any, ZodTypeDef, any>>({
  schema,
  defaultValues,
  onSubmit,
  successMessage,
  onSuccess,
  onError,
  resetOnSuccess = false,
}: UseAppFormOptions<TSchema>) {
  const form = useReactHookForm<ZodSchemaOutput<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = form.handleSubmit(
    useCallback<SubmitHandler<ZodSchemaOutput<TSchema>>>(
      async (values) => {
        try {
          await onSubmit(values);
          if (successMessage) {
            showToast(successMessage, { type: 'success' });
          }
          onSuccess?.();
          if (resetOnSuccess) {
            form.reset(defaultValues);
          }
        } catch (error) {
          const fieldErrors = extractFieldErrors(error);
          Object.entries(fieldErrors).forEach(([field, message]) => {
            form.setError(field as keyof FieldValues, { type: 'server', message });
          });

          const { message, requestId } = formatErrorMessageWithId(error);
          showToast(message, { type: 'error', requestId });
          onError?.(error);
        }
      },
      [defaultValues, form, onError, onSubmit, onSuccess, resetOnSuccess, successMessage]
    )
  );

  return {
    ...form,
    handleSubmitForm: handleSubmit,
  };
}

export default useAppForm;
