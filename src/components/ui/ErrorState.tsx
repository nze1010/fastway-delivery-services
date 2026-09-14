import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'System Notice',
  message,
  onRetry,
}) => {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: 'var(--space-8) var(--space-6)',
        backgroundColor: 'var(--color-danger-bg)',
        border: '1.5px solid #FCA5A5',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '520px',
        margin: 'var(--space-6) auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: '#FEE2E2',
          color: 'var(--color-danger)',
          marginBottom: 'var(--space-3)',
        }}
      >
        <AlertTriangle size={28} />
      </div>
      <h4 style={{ color: 'var(--color-danger)', marginBottom: 'var(--space-2)' }}>
        {title}
      </h4>
      <p style={{ color: 'var(--color-charcoal-light)', fontSize: '0.95rem', marginBottom: onRetry ? 'var(--space-5)' : 0 }}>
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw size={14} />}
          style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
        >
          Retry
        </Button>
      )}
    </div>
  );
};
