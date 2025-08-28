import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { register as apiRegister } from '@client/api/clients/auth.api';

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type FormValues = z.infer<typeof Schema>;

export default function Register() {
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(Schema) });

  async function onSubmit(values: FormValues) {
    setMessage(null);
    try {
      await apiRegister(values);
      setMessage('Account created. You can now log in.');
      reset();
    } catch (e: any) {
      setMessage(e?.response?.data?.error?.message || 'Registration failed');
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Create account</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Email
            <input
              type="email"
              {...register('email')}
              style={{ display: 'block', width: '100%' }}
            />
          </label>
          {errors.email && <small style={{ color: 'crimson' }}>{errors.email.message}</small>}
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Password
            <input
              type="password"
              {...register('password')}
              style={{ display: 'block', width: '100%' }}
            />
          </label>
          {errors.password && <small style={{ color: 'crimson' }}>{errors.password.message}</small>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Register'}
        </button>
      </form>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
}
