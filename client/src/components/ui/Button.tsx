import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { buttonVariants } from './button.css';

type ButtonVariant = keyof typeof buttonVariants;

type ButtonProps = {
  variant?: ButtonVariant;
  asChild?: boolean;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', asChild = false, className, type = 'button', ...props },
  ref
) {
  const Component = asChild ? Slot : 'button';
  const componentClass = cx(buttonVariants[variant], className);

  if (asChild) {
    return <Component ref={ref as never} className={componentClass} {...props} />;
  }

  return <Component ref={ref} type={type} className={componentClass} {...props} />;
});
