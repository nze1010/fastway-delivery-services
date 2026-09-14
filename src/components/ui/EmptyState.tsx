import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-12) var(--space-6)',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1.5px dashed var(--border-medium)',
        maxWidth: '560px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-blue-light)',
          color: 'var(--color-blue)',
          marginBottom: 'var(--space-4)',
        }}
      >
        {icon || <PackageOpen size={32} />}
      </div>
      <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: 'var(--space-2)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.95rem', maxWidth: '420px', marginBottom: actionLabel ? 'var(--space-6)' : 0 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
