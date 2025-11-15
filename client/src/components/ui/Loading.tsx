/**
 * Loading spinner featuring the Trans Pride palette used for async states.
 */
import { sprinkles } from '@client/app/sprinkles.css';
import './TransPrideSpinner.css';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Loading spinner component with Trans Pride colors
 *
 * @param message - Optional loading message to display below spinner
 * @param size - Spinner size (sm: 2rem, md: 3rem, lg: 4rem)
 *
 * @example
 * ```tsx
 * <Loading message="Loading products..." />
 * ```
 */
export default function Loading({ message, size = 'md' }: LoadingProps) {
  const sizeMap = {
    sm: '2rem',
    md: '3rem',
    lg: '4rem',
  };

  return (
    <div
      className={sprinkles({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      })}
      style={{ minHeight: 160 }}
    >
      <div
        className="trans-pride-spinner"
        role="status"
        aria-hidden="true"
        style={{ width: sizeMap[size], height: sizeMap[size] }}
      >
        <span className="sr-only">Loading...</span>
      </div>
      {message && (
        <div
          className={sprinkles({
            marginTop: 'md',
            color: 'textMuted',
          })}
          aria-live="polite"
        >
          {message}
        </div>
      )}
    </div>
  );
}
