import React from 'react';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingColor = 'navy' | 'blue' | 'orange' | 'white' | 'charcoal';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  color?: HeadingColor;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  level = 'h2',
  color = 'navy',
  subtitle,
  align = 'left',
  children,
  className = '',
  style,
  ...props
}) => {
  const Component = level;

  const colorMap: Record<HeadingColor, string> = {
    navy: 'var(--color-navy)',
    blue: 'var(--color-blue)',
    orange: 'var(--color-orange)',
    white: 'var(--color-white)',
    charcoal: 'var(--color-charcoal)',
  };

  return (
    <div
      style={{
        textAlign: align,
        marginBottom: subtitle ? 'var(--space-6)' : 'var(--space-3)',
      }}
    >
      <Component
        className={className}
        style={{
          color: colorMap[color],
          letterSpacing: '-0.025em',
          ...style,
        }}
        {...props}
      >
        {children}
      </Component>
      {subtitle && (
        <p
          style={{
            marginTop: 'var(--space-2)',
            fontSize: '1.05rem',
            color: color === 'white' ? 'rgba(255,255,255,0.8)' : 'var(--color-charcoal-muted)',
            maxWidth: align === 'center' ? '650px' : '100%',
            marginLeft: align === 'center' ? 'auto' : undefined,
            marginRight: align === 'center' ? 'auto' : undefined,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
