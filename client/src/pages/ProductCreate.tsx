import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProduct } from '@client/api/clients/products.api';
import { card, field, input, label, actions, btnPrimary, btnOutline } from '@client/app/ui.css';

const Schema = z.object({
  name: z.string().min(2),
  price: z.coerce.number().nonnegative(),
  description: z.string().optional().default(''),
  category: z.string().min(2),
  rating: z.coerce.number().min(0).max(5).default(0),
});

type FormValues = z.infer<typeof Schema>;

/**
 * ProductCreate
 *
 * Renders a form for creating a new product and handles client-side validation,
 * submission, navigation on success, and basic error reporting.
 *
 * The component:
 * - Uses react-hook-form with zodResolver(Schema) to manage form state and validation.
 * - Exposes fields: name, price, category, rating, description.
 * - Disables the submit button while the form is submitting (isSubmitting).
 * - Displays inline validation messages for each field.
 * - Provides two reset controls:
 *   - An inline Reset button (type="button") that calls the form reset() method.
 *   - A form-level Reset button (type="reset") to clear native form fields.
 *
 * Submission behavior:
 * - onSubmit awaits createProduct(values).
 * - If the server returns an object with an id, the component navigates to `/products/{id}` using useNavigate.
 * - If the response is invalid or an exception occurs, the component alerts the user and logs the error to the console.
 *
 * Notes:
 * - Price input uses step="0.01".
 * - Rating input is constrained with min=0, max=5 and step=0.1.
 * - Validation logic and types are derived from Schema (zod) and mapped to FormValues in useForm.
 *
 * @returns {JSX.Element} The product creation form UI.
 *
 * @example
 * <ProductCreate />
 */
export default function ProductCreate() {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof Schema>, any, FormValues>({ resolver: zodResolver(Schema) });

  async function onSubmit(values: FormValues) {
    try {
      const created = await createProduct(values);
      if (created && created.id) {
        nav(`/products/${created.id}`);
      } else {
        alert('Product creation failed: Invalid response from server.');
      }
    } catch (error) {
      alert('Product creation failed. Please try again.');
      console.error(error);
    }
  }

  return (
    <div className={card}>
      <h2>New Product</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={field}>
          <label className={label}>Name</label>
          <input className={input} {...register('name')} />
          {errors.name && <small style={{ color: 'crimson' }}>{errors.name.message}</small>}
        </div>
        <div className={field}>
          <label className={label}>Price</label>
          <input className={input} type="number" step="0.01" {...register('price')} />
          {errors.price && <small style={{ color: 'crimson' }}>{errors.price.message}</small>}
        </div>
        <div className={field}>
          <label className={label}>Category</label>
          <input className={input} {...register('category')} />
          {errors.category && <small style={{ color: 'crimson' }}>{errors.category.message}</small>}
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
          {errors.rating && <small style={{ color: 'crimson' }}>{errors.rating.message}</small>}
          <button className={btnOutline} type="button" onClick={() => reset()}>
            Reset
          </button>
          <textarea className={input} rows={3} {...register('description')} />
        </div>
        <div className={actions}>
          <button className={btnPrimary} disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Saving…' : 'Create'}
          </button>
          <button className={btnOutline} type="reset">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
