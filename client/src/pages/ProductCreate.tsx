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

export default function ProductCreate() {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(Schema) as any });

  async function onSubmit(values: FormValues) {
    const created = await createProduct(values);
    nav(`/products/${created.id}`);
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
          <input className={input} type="number" min={0} max={5} step={0.1} {...register('rating')} />
          {errors.rating && <small style={{ color: 'crimson' }}>{errors.rating.message}</small>}
        </div>
        <div className={field}>
          <label className={label}>Description</label>
          <textarea className={input} rows={3} {...register('description')} />
        </div>
        <div className={actions}>
          <button className={btnPrimary} disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Saving…' : 'Create'}
          </button>
          <button className={btnOutline} type="reset">Reset</button>
        </div>
      </form>
    </div>
  );
}
