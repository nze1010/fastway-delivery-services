import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  className = '',
  style,
  ...props
}) => {
  const maxWidths = {
    sm: '768px',
    md: '1024px',
    lg: '1240px',
    full: '100%',
  };

  return (
    <div
      className={`site-container ${className}`}
      style={{
        maxWidth: maxWidths[size],
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
