import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { register as apiRegister } from '@client/api/clients/auth.api';
import { card, field, input, label, actions, btnPrimary, btnOutline } from '@client/app/ui.css';

const Schema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type FormValues = z.infer<typeof Schema>;

/**
 * Register
 *
 * Functional React component that renders a user registration form and handles client-side
 * validation, submission to an API, and user feedback.
 *
 * - Uses react-hook-form with a Zod schema resolver (Schema) to manage form state and validation
 *   for the FormValues type.
 * - Maintains a local message state (string | null) for transient success or error feedback.
 * - Displays field-level validation errors returned by react-hook-form.
 * - Disables the submit button and shows a "Submitting…" label while the form is being submitted.
 * - Provides a Reset button that calls react-hook-form's reset() to clear input values and errors.
 *
 * Submission behavior (onSubmit):
 * - Asynchronously attempts to register the user by calling the external apiRegister(values).
 * - Clears any existing message at the start of submission.
 * - On success:
 *   - Sets a success message ("Account created. You can now log in.") and resets the form.
 * - On error:
 *   - Logs the error to the console and sets a user-facing error message derived from:
 *     e?.response?.data?.error?.message || e?.message || 'Registration failed'
 *
 * Accessibility:
 * - Labels are associated with inputs via htmlFor/id attributes.
 *
 * Side effects:
 * - Relies on an external apiRegister implementation and a Schema + FormValues type definition
 *   (expected to be defined/imported in the same module).
 *
 * @returns {JSX.Element} A form UI for creating a new account with client-side validation and feedback.
 */
export default function Register() {
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(Schema) });

  async function onSubmit(values: FormValues) {
    try {
      setMessage(null);
      await apiRegister(values);
      setMessage('Account created. You can now log in.');
      reset();
    } catch (e: any) {
      console.error('Registration error:', e);
      setMessage(e?.response?.data?.error?.message || e?.message || 'Registration failed');
    }
  }

  return (
    <div className={card}>
      <h2>Create account</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={field}>
          <label className={label} htmlFor="email">Email</label>
          <input id="email" type="email" className={input} {...register('email')} />
          {errors.email && <small style={{ color: 'crimson' }}>{errors.email.message}</small>}
        </div>

        <div className={field}>
          <label className={label} htmlFor="password">Password</label>
          <input id="password" type="password" className={input} {...register('password')} />
          {errors.password && (
            <small style={{ color: 'crimson' }}>{errors.password.message}</small>
          )}
        </div>

        <div className={actions}>
          <button className={btnPrimary} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Register'}
          </button>
          <button className={btnOutline} type="button" onClick={() => reset()}>
            Reset
          </button>
        </div>
      </form>

      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
}
