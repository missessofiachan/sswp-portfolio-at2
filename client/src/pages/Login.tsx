import { FormActions } from '@client/components/forms/FormActions';
import { TextField } from '@client/components/forms/TextField';
import { AuthCardLayout } from '@client/components/layout/AuthCardLayout';
import { useAuth } from '@client/features/auth/AuthProvider';
import { useAppForm } from '@client/lib/hooks/useAppForm';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

type FormData = z.infer<typeof schema>;

type LocationState = { from?: { pathname: string } };

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const form = useAppForm({
    schema,
    defaultValues: { email: '', password: '' },
    successMessage: 'Logged in successfully',
    onSubmit: async (values) => {
      await login(values);
      const returnTo = sessionStorage.getItem('returnTo');
      sessionStorage.removeItem('returnTo');
      const from = returnTo || (location.state as LocationState | null)?.from?.pathname || '/';
      navigate(from, { replace: true });
    },
  });

  useEffect(() => {
    try {
      const sessionExpired = sessionStorage.getItem('sessionExpired');
      if (sessionExpired === 'true') {
        setInfoMessage('Your session has expired. Please log in again.');
        sessionStorage.removeItem('sessionExpired');
      }
    } catch (error) {
      console.error('Error checking session expiration:', error);
    }
  }, []);

  return (
    <AuthCardLayout
      title="Welcome back"
      subtitle="Log in to access your dashboard"
      icon={
        <span role="img" aria-label="Lock">
          🔐
        </span>
      }
      error={infoMessage ? <div style={{ color: '#0066cc' }}>{infoMessage}</div> : undefined}
      footer={
        <span>
          Need an account? <Link to="/register">Create one</Link>
        </span>
      }
    >
      <form onSubmit={form.handleSubmitForm}>
        <TextField
          label="Email"
          name="email"
          type="email"
          control={form.control}
          required
          prefix={<span>📧</span>}
          placeholder="you@example.com"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          control={form.control}
          required
          showPasswordToggle
        />
        <FormActions
          submitLabel="Login"
          isSubmitting={form.formState.isSubmitting}
          onCancel={() => form.reset()}
        />
      </form>
    </AuthCardLayout>
  );
}
