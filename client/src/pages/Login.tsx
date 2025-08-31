import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@client/features/auth/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import { card, field, input, label, actions, btnPrimary, btnOutline } from '@client/app/ui.css';

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

type FormData = z.infer<typeof schema>;

type LocationState = { from?: { pathname: string } };

/**
 * Login
 *
 * Renders a login form and handles user authentication.
 *
 * Behavior
 * - Initializes a controlled form using react-hook-form with a Zod schema resolver (zodResolver(schema)).
 * - Uses useAuth().login to perform authentication with the submitted FormData.
 * - On successful login navigates to the previous location (location.state.from.pathname) or to '/' by default, using useNavigate with replace: true.
 * - Maintains an errorMessage state to display server-side or network error messages returned from the login request. It extracts the message via e?.response?.data?.error?.message and falls back to 'Login failed'.
 * - Displays validation errors provided by react-hook-form (errors.*) inline beneath their corresponding inputs.
 * - Exposes a Reset button that calls react-hook-form's reset() to clear the form.
 *
 * Hooks and related types
 * - useForm<FormData>({...}) — form management; FormData represents the shape of the submitted credentials (e.g., { email, password }).
 * - zodResolver(schema) — integrates Zod validation schema for form validation.
 * - useAuth() — provides the login method to perform authentication.
 * - useNavigate() and useLocation() — handle post-login redirection and compute the 'from' fallback location; LocationState type describes the expected location.state shape.
 * - useState<string | null> — holds the current error message shown to the user.
 *
 * Accessibility & UX
 * - Inputs include htmlFor/id pairing for their labels.
 * - Submit and Reset buttons have appropriate button types.
 * - Server and validation errors are shown near the form controls and styled to indicate error state.
 *
 * @returns {JSX.Element} The rendered login form component.
 */

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { login } = useAuth();
  const from = (location.state as LocationState | null)?.from?.pathname || '/';

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(values: FormData) {
    try {
      setErrorMessage(null);
      await login(values);
      navigate(from, { replace: true });
    } catch (e: any) {
      setErrorMessage(e?.response?.data?.error?.message || 'Login failed');
    }
  }

  return (
    <div className={card}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {errorMessage && (
          <div style={{ color: 'crimson', marginBottom: 8 }}>{errorMessage}</div>
        )}

        <div className={field}>
          <label className={label} htmlFor="email">Email</label>
          <input id="email" className={input} type="email" {...register('email')} />
          {errors.email && <small style={{ color: 'crimson' }}>{errors.email.message}</small>}
        </div>

        <div className={field}>
          <label className={label} htmlFor="password">Password</label>
          <input id="password" className={input} type="password" {...register('password')} />
          {errors.password && <small style={{ color: 'crimson' }}>{errors.password.message}</small>}
        </div>

        <div className={actions}>
          <button className={btnPrimary} type="submit">Login</button>
          <button className={btnOutline} type="button" onClick={() => reset()}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
