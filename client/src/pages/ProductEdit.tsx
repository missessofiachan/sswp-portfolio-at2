import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getProduct, updateProduct } from '@client/api/clients/products.api';
import { card, field, input, label, actions, btnPrimary, btnOutline } from '@client/app/ui.css';

const Schema = z.object({
  name: z.string().min(2),
  price: z.coerce.number().nonnegative(),
  description: z.string().optional(),
  category: z.string().min(2),
  rating: z.coerce.number().min(0).max(5).default(0),
});

type FormValues = z.infer<typeof Schema>;

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <small style={{ color: 'crimson' }}>{message}</small>;
}

/**
 * ProductEdit
 *
 * Renders a form for editing an existing product. The component:
 * - Reads the product `id` from the current route params (useParams).
 * - Fetches the product with `getProduct(id)` when the component mounts or when `id` changes,
 *   and populates the form fields using react-hook-form's `reset`.
 * - Uses `useForm` with a Zod schema resolver (`zodResolver(Schema)`) to provide client-side
 *   validation and typed form values (`FormValues`).
 * - Submits updates via `updateProduct(id, values)` and navigates to the product detail page
 *   on success (`useNavigate`).
 *
 * Form fields:
 * - name: string
 * - price: number (input type="number", step 0.01)
 * - category: string
 * - rating: number (input type="number", min 0, max 5, step 0.1)
 * - description: string (textarea)
 *
 * Behavior and UX:
 * - Validation errors from the Zod schema are exposed through `formState.errors` and shown
 *   via `ErrorMessage` components adjacent to each field.
 * - A "Save" button submits the form. If no `id` is present, the submit is a no-op.
 * - A "Reset" button calls react-hook-form's `reset()` to restore the current form state
 *   (initial values loaded from the fetched product or the schema defaults).
 * - Side effects are limited to fetching the product data and performing the update request;
 *   consumers should ensure `getProduct` and `updateProduct` handle errors and loading state
 *   appropriately (this component assumes they return Promises).
 *
 * Notes:
 * - The component is a default export and returns JSX for an edit card-styled form.
 * - It relies on external modules/types: `Schema` (Zod schema), `FormValues` (form value type),
 *   `getProduct`, `updateProduct`, `ErrorMessage`, and CSS class names used for styling.
 *
 * @remarks
 * This component is intended to be used on a route like `/products/:id/edit`. Ensure the
 * route provides an `id` param and that the backend or data layer supports `getProduct`
 * and `updateProduct` for the provided `id`.
 *
 * @returns JSX.Element - The product edit form UI.
 */
export default function ProductEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const { register, handleSubmit, reset, formState } = useForm<
    z.input<typeof Schema>,
    any,
    FormValues
  >({
    resolver: zodResolver(Schema),
  });

  useEffect(() => {
    if (!id) return;
    getProduct(id).then((p) =>
      reset({
        name: p.name ?? '',
        price: p.price ?? 0,
        description: p.description ?? '',
        category: p.category ?? '',
        rating: p.rating ?? 0,
      })
    );
  }, [id, reset]);

  async function onSubmit(values: FormValues) {
    if (!id) return;
    await updateProduct(id, values);
    nav(`/products/${id}`);
  }

  return (
    <div className={card}>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={field}>
          <label className={label}>Name</label>
          <input className={input} {...register('name')} />
          <ErrorMessage message={formState.errors.name?.message} />
        </div>
        <div className={field}>
          <label className={label}>Price</label>
          <input className={input} type="number" step="0.01" {...register('price')} />
          <ErrorMessage message={formState.errors.price?.message} />
        </div>
        <div className={field}>
          <label className={label}>Category</label>
          <input className={input} {...register('category')} />
          <ErrorMessage message={formState.errors.category?.message} />
        </div>
        <div className={field}>
          <label className={label}>Rating</label>
          <input
            className={input}
            type="number"
            min={0}
            max={5}
            step={0.1}
            {...register('rating')}
          />
          <ErrorMessage message={formState.errors.rating?.message} />
        </div>
        <div className={field}>
          <label className={label}>Description</label>
          <textarea className={input} rows={3} {...register('description')} />
        </div>
        <div className={actions}>
          <button className={btnPrimary} type="submit">
            Save
          </button>
          <button className={btnOutline} type="button" onClick={() => reset()}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
