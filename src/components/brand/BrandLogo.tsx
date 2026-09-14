import React from 'react';

export interface BrandLogoProps {
  variant?: 'dark' | 'light';
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  showTagline = true,
  size = 'md',
}) => {
  const isLight = variant === 'light';

  const titleSizes = {
    sm: '1.1rem',
    md: '1.35rem',
    lg: '1.65rem',
  };

  const iconSizes = {
    sm: 28,
    md: 34,
    lg: 40,
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
        textDecoration: 'none',
        userSelect: 'none',
      }}
    >
      {/* Clean Modern Fastway Accent Mark */}
      <div
        style={{
          width: iconSizes[size],
          height: iconSizes[size],
          backgroundColor: '#071A2B',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(7, 26, 43, 0.25)',
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        <svg
          width={iconSizes[size] * 0.65}
          height={iconSizes[size] * 0.65}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dynamic forward speed glyph */}
          <path
            d="M4 14L12 6L20 6L12 14H4Z"
            fill="#1769E0"
          />
          <path
            d="M8 18L16 10H20L12 18H8Z"
            fill="#F26B21"
          />
        </svg>
      </div>

      {/* Clean Text-based Brand Treatment */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: titleSizes[size],
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: isLight ? '#FFFFFF' : 'var(--color-navy)',
            lineHeight: 1.05,
            textTransform: 'uppercase',
          }}
        >
          Fast<span style={{ color: 'var(--color-blue)' }}>way</span>
        </span>
        {showTagline && (
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: isLight ? 'rgba(255, 255, 255, 0.75)' : 'var(--color-orange)',
              marginTop: '2px',
            }}
          >
            Delivery Services
          </span>
        )}
      </div>
    </div>
  );
};
