import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'orange' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: 600,
    borderRadius: '8px',
    transition: 'all 180ms cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    border: '1.5px solid transparent',
  };

  const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
    sm: { padding: '0.4rem 0.85rem', fontSize: '0.85rem' },
    md: { padding: '0.625rem 1.25rem', fontSize: '0.95rem' },
    lg: { padding: '0.875rem 1.75rem', fontSize: '1.05rem' },
  };

  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-blue)',
      color: '#FFFFFF',
      borderColor: 'var(--color-blue)',
      boxShadow: '0 2px 8px rgba(23, 105, 224, 0.25)',
    },
    secondary: {
      backgroundColor: 'var(--color-navy)',
      color: '#FFFFFF',
      borderColor: 'var(--color-navy)',
      boxShadow: '0 2px 8px rgba(7, 26, 43, 0.2)',
    },
    orange: {
      backgroundColor: 'var(--color-orange)',
      color: '#FFFFFF',
      borderColor: 'var(--color-orange)',
      boxShadow: '0 2px 8px rgba(242, 107, 33, 0.3)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-navy)',
      borderColor: 'var(--color-navy)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-charcoal)',
      borderColor: 'transparent',
    },
  };

  return (
    <button
      className={`btn-component ${className}`}
      disabled={disabled || isLoading}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {isLoading ? (
        <span
          style={{
            display: 'inline-block',
            width: '1em',
            height: '1em',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.75s linear infinite',
          }}
          aria-hidden="true"
        />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
