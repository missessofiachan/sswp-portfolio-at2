/**
 * Hook that normalizes React Query-style status flags into a state machine
 * with prebuilt UI for loading/error/empty cases.
 */

import { sprinkles } from '@client/app/sprinkles.css';
import { Button } from '@client/components/ui/Button';
import { ErrorAlert } from '@client/components/ui/ErrorAlert';
import Loading from '@client/components/ui/Loading';

interface UseQueryStateOptions<T> {
  isLoading: boolean;
  error: Error | null;
  data: T | undefined | null;
  isEmpty?: (data: T) => boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

type QueryState = 'loading' | 'error' | 'empty' | 'success';

/**
 * Handles standardized query states (loading, error, empty, success)
 * Returns state and pre-built UI content for each state
 *
 * @example
 * ```tsx
 * const { state, content, isSuccess } = useQueryState({
 *   isLoading,
 *   error,
 *   data: products,
 *   isEmpty: (data) => data.length === 0,
 *   emptyMessage: "No products found",
 *   onRetry: refetch,
 * });
 *
 * if (!isSuccess) return content;
 * return <ProductList products={products} />;
 * ```
 */
export function useQueryState<T>(options: UseQueryStateOptions<T>) {
  const {
    isLoading,
    error,
    data,
    isEmpty,
    emptyMessage,
    loadingMessage,
    onRetry,
    showRetry = true,
  } = options;

  const state: QueryState = isLoading
    ? 'loading'
    : error
      ? 'error'
      : (isEmpty && data && isEmpty(data)) || !data
        ? 'empty'
        : 'success';

  const content =
    state === 'loading' ? (
      <Loading message={loadingMessage || 'Loading...'} />
    ) : state === 'error' ? (
      <div className={sprinkles({ display: 'flex', flexDirection: 'column', gap: 'sm' })}>
        <ErrorAlert message={error.message || 'Failed to load data'} details={error} />
        {showRetry && onRetry && (
          <div className={sprinkles({ display: 'flex', justifyContent: 'flex-end' })}>
            <Button variant="primary" onClick={onRetry}>
              Retry
            </Button>
          </div>
        )}
      </div>
    ) : state === 'empty' ? (
      <div className={sprinkles({ color: 'textMuted', padding: 'lg', textAlign: 'center' })}>
        {emptyMessage || 'No data available'}
      </div>
    ) : null;

  return {
    state,
    content,
    isLoading: state === 'loading',
    isError: state === 'error',
    isEmpty: state === 'empty',
    isSuccess: state === 'success',
  };
}

export default useQueryState;
