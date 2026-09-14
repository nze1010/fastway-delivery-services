import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  id,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const generatedId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label
          htmlFor={generatedId}
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: error ? 'var(--color-danger)' : 'var(--color-navy)',
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          width: '100%',
          backgroundColor: disabled ? '#F1F5F9' : '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: `1.5px solid ${error ? 'var(--color-danger)' : 'var(--border-light)'}`,
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
        }}
      >
        {leftIcon && (
          <span style={{ paddingLeft: '0.85rem', display: 'flex', alignItems: 'center', color: 'var(--color-charcoal-muted)' }}>
            {leftIcon}
          </span>
        )}
        <input
          id={generatedId}
          disabled={disabled}
          className={`input-component ${className}`}
          style={{
            width: '100%',
            padding: '0.65rem 0.85rem',
            paddingLeft: leftIcon ? '0.5rem' : '0.85rem',
            paddingRight: rightIcon ? '0.5rem' : '0.85rem',
            border: 'none',
            background: 'transparent',
            outline: 'none',
            color: 'var(--color-charcoal)',
            fontSize: '0.95rem',
            ...style,
          }}
          {...props}
        />
        {rightIcon && (
          <span style={{ paddingRight: '0.85rem', display: 'flex', alignItems: 'center', color: 'var(--color-charcoal-muted)' }}>
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <span style={{ fontSize: '0.8rem', color: 'var(--color-danger)', fontWeight: 500 }}>
          {error}
        </span>
      )}
      {!error && helperText && (
        <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>
          {helperText}
        </span>
      )}
    </div>
  );
};
