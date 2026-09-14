import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '540px',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(7, 26, 43, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
        zIndex: 9990,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth,
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-4) var(--space-6)',
            borderBottom: '1px solid var(--border-light)',
            backgroundColor: 'var(--color-warm-white)',
          }}
        >
          <h3 id="modal-title" style={{ fontSize: '1.2rem', color: 'var(--color-navy)' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-charcoal-muted)',
              padding: 'var(--space-1)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 'var(--space-6)', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
