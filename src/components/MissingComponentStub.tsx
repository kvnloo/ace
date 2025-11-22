import React from 'react';

/**
 * MissingComponentStub
 *
 * Fallback component for missing or failed-to-load components
 * Prevents white screen errors and provides clear developer feedback
 *
 * Usage:
 *   const LazyComponent = React.lazy(() =>
 *     import('./Component').catch(() => ({ default: MissingComponentStub }))
 *   );
 */

interface MissingComponentStubProps {
  componentName?: string;
  error?: Error;
  showDetails?: boolean;
}

const MissingComponentStub: React.FC<MissingComponentStubProps> = ({
  componentName = 'Unknown Component',
  error,
  showDetails = process.env.NODE_ENV === 'development'
}) => {
  return (
    <div
      style={{
        padding: '2rem',
        margin: '1rem',
        border: '2px dashed #f59e0b',
        borderRadius: '0.5rem',
        backgroundColor: '#fffbeb',
        color: '#92400e',
        fontFamily: 'monospace'
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0', color: '#b45309' }}>
        Component Not Available: {componentName}
      </h3>

      <p style={{ margin: '0 0 0.5rem 0' }}>
        This component could not be loaded. This is a placeholder to prevent rendering errors.
      </p>

      {showDetails && error && (
        <details style={{ marginTop: '1rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            Error Details
          </summary>
          <pre
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem',
              backgroundColor: '#fef3c7',
              borderRadius: '0.25rem',
              overflow: 'auto',
              fontSize: '0.875rem'
            }}
          >
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}

      {showDetails && (
        <p style={{
          marginTop: '1rem',
          fontSize: '0.875rem',
          color: '#78350f'
        }}>
          Development Mode: Check console for more details
        </p>
      )}
    </div>
  );
};

export default MissingComponentStub;

/**
 * Helper function to create lazy components with automatic fallback
 */
export const createSafeLazyComponent = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  componentName: string
) => {
  return React.lazy(() =>
    importFn().catch((error) => {
      console.error(`Failed to load component: ${componentName}`, error);
      return {
        default: (props: any) => (
          <MissingComponentStub
            componentName={componentName}
            error={error}
            {...props}
          />
        )
      };
    })
  );
};
