import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  helperText,
  error,
  id,
  className = '',
  style,
  ...props
}) => {
  const generatedId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

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
      <textarea
        id={generatedId}
        className={`textarea-component ${className}`}
        style={{
          width: '100%',
          padding: '0.65rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          border: `1.5px solid ${error ? 'var(--color-danger)' : 'var(--border-light)'}`,
          backgroundColor: '#FFFFFF',
          color: 'var(--color-charcoal)',
          fontSize: '0.95rem',
          outline: 'none',
          minHeight: '90px',
          resize: 'vertical',
          ...style,
        }}
        {...props}
      />
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
