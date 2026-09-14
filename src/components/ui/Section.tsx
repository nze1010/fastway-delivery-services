import React from 'react';

export type SectionBackground = 'warm' | 'white' | 'navy' | 'charcoal';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  background?: SectionBackground;
  paddingY?: 'none' | 'sm' | 'md' | 'lg';
}

export const Section: React.FC<SectionProps> = ({
  children,
  background = 'warm',
  paddingY = 'md',
  className = '',
  style,
  ...props
}) => {
  const paddingMap = {
    none: '0',
    sm: 'var(--space-8) 0',
    md: 'var(--space-16) 0',
    lg: 'var(--space-24) 0',
  };

  const bgClasses: Record<SectionBackground, string> = {
    warm: 'section-warm',
    white: 'section-white',
    navy: 'section-navy',
    charcoal: 'section-charcoal',
  };

  return (
    <section
      className={`section ${bgClasses[background]} ${className}`}
      style={{
        padding: paddingMap[paddingY],
        ...style,
      }}
      {...props}
    >
      {children}
    </section>
  );
};
