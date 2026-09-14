import React from 'react';

export interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading logistics data...',
  size = 'md',
}) => {
  const spinnerSizes = {
    sm: '20px',
    md: '36px',
    lg: '52px',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-12) var(--space-4)',
        gap: 'var(--space-4)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: spinnerSizes[size],
          height: spinnerSizes[size],
          border: '3px solid var(--color-blue-light)',
          borderTopColor: 'var(--color-blue)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
};
