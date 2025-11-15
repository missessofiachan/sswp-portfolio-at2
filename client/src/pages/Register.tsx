import { register as apiRegister } from '@client/api/clients/auth.api';
import { FormActions } from '@client/components/forms/FormActions';
import { TextField } from '@client/components/forms/TextField';
import { AuthCardLayout } from '@client/components/layout/AuthCardLayout';
import { useAppForm } from '@client/lib/hooks/useAppForm';
import { z } from 'zod';

const Schema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type FormValues = z.infer<typeof Schema>;

export default function Register() {
  const form = useAppForm({
    schema: Schema,
    defaultValues: { email: '', password: '' },
    successMessage: 'Account created. You can now log in.',
    onSubmit: async (values) => {
      await apiRegister(values);
    },
    resetOnSuccess: true,
  });

  return (
    <AuthCardLayout
      title="Create account"
      subtitle="Join us to manage your shop"
      icon={
        <span role="img" aria-label="Rocket">
          🚀
        </span>
      }
      footer={
        <span>
          Already have an account? <a href="/login">Log in</a>
        </span>
      }
    >
      <form onSubmit={form.handleSubmitForm}>
        <TextField
          label="Email"
          name="email"
          type="email"
          required
          control={form.control}
          prefix={<span>📧</span>}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          required
          control={form.control}
          showPasswordToggle
        />
        <FormActions
          submitLabel="Register"
          isSubmitting={form.formState.isSubmitting}
          onCancel={() => form.reset()}
        />
      </form>
    </AuthCardLayout>
  );
}
