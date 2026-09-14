import React from 'react';
import type { PageRoute } from '../constants/navigation';
import { COMPANY_PROFILE } from '../constants/company';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Truck, Zap, Plane, Ship, Box, ArrowRight, Globe } from 'lucide-react';

export interface ServicesPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const serviceIcons: Record<string, React.ReactNode> = {
    Zap: <Zap size={28} />,
    Plane: <Plane size={28} />,
    Truck: <Truck size={28} />,
    Ship: <Ship size={28} />,
    Box: <Box size={28} />,
  };

  return (
    <div>
      {/* Page Header */}
      <section
        style={{
          backgroundColor: 'var(--color-navy)',
          color: '#FFFFFF',
          padding: 'var(--space-12) 0',
          borderBottom: '4px solid var(--color-blue)',
        }}
      >
        <Container>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(23, 105, 224, 0.2)',
              border: '1px solid rgba(23, 105, 224, 0.5)',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#EBF3FD',
              marginBottom: 'var(--space-3)',
            }}
          >
            <span>Logistics Solutions</span>
          </div>
          <h1 style={{ color: '#FFFFFF', marginBottom: 'var(--space-2)' }}>
            Delivery & Logistics Services
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.1rem', maxWidth: '640px' }}>
            Comprehensive delivery, priority air cargo, ground line-haul, and ocean freight solutions designed for modern enterprise supply chains and everyday shipping.
          </p>
        </Container>
      </section>

      {/* Services Grid */}
      <Section background="warm" paddingY="md">
        <Container>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {COMPANY_PROFILE.services.map((service) => (
              <Card
                key={service.id}
                variant="white"
                elevation="low"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 'var(--space-8)',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-blue-light)',
                      color: 'var(--color-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 'var(--space-4)',
                    }}
                  >
                    {serviceIcons[service.iconName] || <Truck size={28} />}
                  </div>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--color-navy)', marginBottom: 'var(--space-2)' }}>
                    {service.title}
                  </h2>
                  <p style={{ color: 'var(--color-orange)', fontWeight: 600, fontSize: '0.95rem', marginBottom: 'var(--space-3)' }}>
                    {service.tagline}
                  </p>
                  <p style={{ color: 'var(--color-charcoal-light)', lineHeight: 1.6, marginBottom: 'var(--space-5)' }}>
                    {service.description}
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight size={14} />}
                    onClick={() => onNavigate('send-package')}
                  >
                    Inquire About This Service
                  </Button>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--color-warm-white)',
                    padding: 'var(--space-6)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  <h4 style={{ color: 'var(--color-navy)', marginBottom: 'var(--space-4)' }}>
                    Service Capabilities
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 'var(--space-2)' }}>
                      <span style={{ color: 'var(--color-charcoal-muted)' }}>Transit Standard:</span>
                      <strong style={{ color: 'var(--color-navy)' }}>{service.speed}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 'var(--space-2)' }}>
                      <span style={{ color: 'var(--color-charcoal-muted)' }}>Recommended For:</span>
                      <strong style={{ color: 'var(--color-navy)', textAlign: 'right', maxWidth: '200px' }}>{service.suitableFor}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 'var(--space-2)' }}>
                      <span style={{ color: 'var(--color-charcoal-muted)' }}>Tracking Level:</span>
                      <strong style={{ color: 'var(--color-blue)' }}>Continuous Checkpoint Scans</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-charcoal-muted)' }}>Cargo Protection:</span>
                      <strong style={{ color: 'var(--color-navy)' }}>Secure Transit Standards</strong>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Global Freight Consultation Banner */}
      <Section background="navy" paddingY="md">
        <Container>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
            <Globe size={36} color="var(--color-orange)" style={{ margin: '0 auto var(--space-3)' }} />
            <h2 style={{ color: '#FFFFFF', marginBottom: 'var(--space-3)' }}>
              Commercial Freight & Supply Chain Solutions
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
              From consolidated commercial shipments to dedicated air and ocean freight containers, Fastway provides flexible logistics services tailored to enterprise requirements.
            </p>
            <Button
              variant="orange"
              size="lg"
              onClick={() => onNavigate('contact')}
            >
              Contact Our Logistics Team
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
};
