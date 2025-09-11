import React from 'react';

/**
 * Catches render/runtime errors in the React tree and displays a minimal diagnostic UI
 * instead of a blank white screen.
 */
export class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error?: Error }
> {
  state: { error?: Error } = { error: undefined };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[AppErrorBoundary] Caught error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
          <h1 style={{ marginTop: 0 }}>Something went wrong</h1>
          <p style={{ color: '#b91c1c' }}>{this.state.error.message}</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: 16 }}>
            {this.state.error.stack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export default AppErrorBoundary;
