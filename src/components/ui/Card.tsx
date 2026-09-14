import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'white' | 'warm' | 'navy';
  elevation?: 'flat' | 'low' | 'medium';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'white',
  elevation = 'low',
  hoverEffect = false,
  className = '',
  style,
  ...props
}) => {
  const bgStyles: Record<string, React.CSSProperties> = {
    white: {
      backgroundColor: '#FFFFFF',
      border: '1px solid var(--border-light)',
      color: 'var(--color-charcoal)',
    },
    warm: {
      backgroundColor: 'var(--color-warm-white)',
      border: '1px solid var(--border-medium)',
      color: 'var(--color-charcoal)',
    },
    navy: {
      backgroundColor: 'var(--color-navy-surface)',
      border: '1px solid var(--color-navy-border)',
      color: 'var(--color-warm-white)',
    },
  };

  const shadowStyles: Record<string, string> = {
    flat: 'none',
    low: 'var(--shadow-sm)',
    medium: 'var(--shadow-md)',
  };

  return (
    <div
      className={`card-component ${className}`}
      style={{
        borderRadius: 'var(--radius-lg)',
        boxShadow: shadowStyles[elevation],
        padding: 'var(--space-6)',
        transition: hoverEffect ? 'transform var(--transition-normal), box-shadow var(--transition-normal)' : undefined,
        ...bgStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
