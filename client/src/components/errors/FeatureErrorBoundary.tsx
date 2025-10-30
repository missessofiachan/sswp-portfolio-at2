/**
 * Granular error boundaries for specific features.
 * More targeted than the global AppErrorBoundary.
 */

import React, { Component, type ReactNode } from 'react';
import { card, btnPrimary } from '@client/app/ui.css';

export interface FeatureErrorBoundaryProps {
  children: ReactNode;
  featureName?: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * FeatureErrorBoundary - Catches errors in a specific feature/section
 *
 * @example
 * ```tsx
 * <FeatureErrorBoundary featureName="Product List">
 *   <ProductsList />
 * </FeatureErrorBoundary>
 * ```
 */
export class FeatureErrorBoundary extends Component<FeatureErrorBoundaryProps, State> {
  constructor(props: FeatureErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in ${this.props.featureName || 'Feature'}:`, error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={card} style={{ margin: '2rem 0', textAlign: 'center' }}>
          <h3 style={{ color: '#dc2626', marginTop: 0 }}>
            {this.props.featureName ? `${this.props.featureName} Error` : 'Something went wrong'}
          </h3>
          <p style={{ color: '#64748b' }}>
            We encountered an error while loading this section. Please try refreshing the page.
          </p>
          {this.state.error && process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '1rem', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', color: '#64748b' }}>Error details</summary>
              <pre
                style={{
                  fontSize: '0.875rem',
                  overflow: 'auto',
                  padding: '1rem',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                }}
              >
                {this.state.error.toString()}
                {this.state.error.stack}
              </pre>
            </details>
          )}
          <button
            className={btnPrimary}
            onClick={() => {
              this.setState({ hasError: false, error: undefined });
              window.location.reload();
            }}
            style={{ marginTop: '1rem' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * ErrorFallback - Reusable error UI component
 */
export function ErrorFallback({ error, resetError }: { error?: Error; resetError?: () => void }) {
  return (
    <div className={card} style={{ margin: '2rem 0', textAlign: 'center' }}>
      <h3 style={{ color: '#dc2626', marginTop: 0 }}>Oops! Something went wrong</h3>
      <p style={{ color: '#64748b' }}>
        An unexpected error occurred. Please try again or contact support if the problem persists.
      </p>
      {error && process.env.NODE_ENV === 'development' && (
        <details style={{ marginTop: '1rem', textAlign: 'left' }}>
          <summary style={{ cursor: 'pointer', color: '#64748b' }}>Technical details</summary>
          <pre
            style={{
              fontSize: '0.875rem',
              overflow: 'auto',
              padding: '1rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
            }}
          >
            {error.toString()}
            {'\n\n'}
            {error.stack}
          </pre>
        </details>
      )}
      {resetError && (
        <button className={btnPrimary} onClick={resetError} style={{ marginTop: '1rem' }}>
          Try Again
        </button>
      )}
    </div>
  );
}
