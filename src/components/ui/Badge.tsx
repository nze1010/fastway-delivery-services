import React from 'react';
import type { ShipmentStatus } from '../../types';
import { STATUS_CONFIG } from '../../constants/theme';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  status?: ShipmentStatus;
  variant?: 'primary' | 'orange' | 'navy' | 'gray' | 'success';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  status,
  variant,
  size = 'md',
  className = '',
  style,
  ...props
}) => {
  let text = children;
  let color = 'var(--color-charcoal)';
  let bgColor = 'var(--color-surface-alt)';
  let borderColor = 'var(--border-light)';

  if (status && STATUS_CONFIG[status]) {
    const config = STATUS_CONFIG[status];
    text = children || config.label;
    color = config.color;
    bgColor = config.bgColor;
    borderColor = config.borderColor;
  } else if (variant === 'primary') {
    color = 'var(--color-blue)';
    bgColor = 'var(--color-blue-light)';
    borderColor = '#BFDBFE';
  } else if (variant === 'orange') {
    color = 'var(--color-orange)';
    bgColor = 'var(--color-orange-light)';
    borderColor = '#FED7AA';
  } else if (variant === 'navy') {
    color = 'var(--color-white)';
    bgColor = 'var(--color-navy)';
    borderColor = 'var(--color-navy)';
  } else if (variant === 'success') {
    color = 'var(--color-success)';
    bgColor = 'var(--color-success-bg)';
    borderColor = '#A7F3D0';
  }

  const padding = size === 'sm' ? '0.15rem 0.55rem' : '0.25rem 0.75rem';
  const fontSize = size === 'sm' ? '0.75rem' : '0.85rem';

  return (
    <span
      className={`badge-component ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        padding,
        fontSize,
        color,
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...props}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: color,
        }}
        aria-hidden="true"
      />
      {text}
    </span>
  );
};
