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
  description: z.string().optional().default(''),
  category: z.string().min(2),
  rating: z.coerce.number().min(0).max(5).default(0),
});
type FormValues = z.infer<typeof Schema>;

export default function ProductEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(Schema) as any,
  });

  useEffect(() => {
    if (!id) return;
    getProduct(id).then((p) => reset(p));
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
          {formState.errors.name && (
            <small style={{ color: 'crimson' }}>{formState.errors.name.message}</small>
          )}
        </div>
        <div className={field}>
          <label className={label}>Price</label>
          <input className={input} type="number" step="0.01" {...register('price')} />
          {formState.errors.price && (
            <small style={{ color: 'crimson' }}>{formState.errors.price.message}</small>
          )}
        </div>
        <div className={field}>
          <label className={label}>Category</label>
          <input className={input} {...register('category')} />
          {formState.errors.category && (
            <small style={{ color: 'crimson' }}>{formState.errors.category.message}</small>
          )}
        </div>
        <div className={field}>
          <label className={label}>Rating</label>
          <input className={input} type="number" min={0} max={5} step={0.1} {...register('rating')} />
          {formState.errors.rating && (
            <small style={{ color: 'crimson' }}>{formState.errors.rating.message}</small>
          )}
        </div>
        <div className={field}>
          <label className={label}>Description</label>
          <textarea className={input} rows={3} {...register('description')} />
        </div>
        <div className={actions}>
          <button className={btnPrimary} type="submit">Save</button>
          <button className={btnOutline} type="reset">Reset</button>
        </div>
      </form>
    </div>
  );
}
