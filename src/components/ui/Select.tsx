import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  helperText,
  error,
  id,
  className = '',
  style,
  ...props
}) => {
  const generatedId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

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
      <select
        id={generatedId}
        className={`select-component ${className}`}
        style={{
          width: '100%',
          padding: '0.65rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          border: `1.5px solid ${error ? 'var(--color-danger)' : 'var(--border-light)'}`,
          backgroundColor: '#FFFFFF',
          color: 'var(--color-charcoal)',
          fontSize: '0.95rem',
          outline: 'none',
          ...style,
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
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
