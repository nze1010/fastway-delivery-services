import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Lock, Mail, ShieldAlert, ArrowLeft, ShieldCheck, UserCheck, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/firebase/authService';

export interface AdminLoginPageProps {
  onNavigateHome: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onNavigateHome,
  onLoginSuccess,
}) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        setErrorMsg('Invalid administrative credentials. Please verify your email and password.');
      } else if (error.code === 'auth/too-many-requests') {
        setErrorMsg('Access temporarily blocked due to repeated failed attempts. Please try again later.');
      } else {
        setErrorMsg(error.message || 'Authentication failed. Please check your network connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#071A2B',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
        position: 'relative',
      }}
    >
      {/* Return to Public Website */}
      <button
        onClick={onNavigateHome}
        style={{
          position: 'absolute',
          top: 'var(--space-6)',
          left: 'var(--space-6)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.9rem',
          cursor: 'pointer',
        }}
      >
        <ArrowLeft size={16} /> Return to Public Website
      </button>

      {/* Login Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '440px',
          padding: 'var(--space-10) var(--space-8)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'inline-block', marginBottom: 'var(--space-4)' }}>
            <BrandLogo size="md" />
          </div>
          <h2 style={{ fontSize: '1.45rem', color: 'var(--color-navy)', marginBottom: 'var(--space-1)' }}>
            Staff & Dispatch Portal
          </h2>
          <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.88rem' }}>
            Authorized Fastway Delivery Services Personnel
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              backgroundColor: 'var(--color-danger-bg)',
              border: '1px solid var(--color-danger)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
              marginBottom: 'var(--space-4)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              fontSize: '0.85rem',
              color: 'var(--color-danger)',
            }}
          >
            <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{errorMsg}</span>
          </div>
        )}


        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input
            label="Administrative Email"
            type="email"
            required
            placeholder="admin@fastwaydelivery.com"
            leftIcon={<Mail size={16} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Security Password"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="••••••••••••"
            leftIcon={<Lock size={16} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="primary"
            type="submit"
            fullWidth
            size="md"
            isLoading={isSubmitting || isLoading}
            style={{ marginTop: 'var(--space-2)' }}
          >
            Authenticate Session
          </Button>
        </form>

      </div>
    </div>
  );
};
