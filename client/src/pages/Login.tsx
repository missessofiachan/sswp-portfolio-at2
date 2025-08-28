import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@client/features/auth/AuthProvider';

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

type FormData = z.infer<typeof schema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { login } = useAuth();
  return (
    <form onSubmit={handleSubmit(login)}>
      <input placeholder="Email" {...register('email')} />
      {errors.email && <small>{errors.email.message}</small>}
      <input placeholder="Password" type="password" {...register('password')} />
      {errors.password && <small>{errors.password.message}</small>}
      <button type="submit">Login</button>
    </form>
  );
}
