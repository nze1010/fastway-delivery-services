import React from 'react';
import type { PageRoute } from '../constants/navigation';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { Heading } from '../components/ui/Heading';
import { Button } from '../components/ui/Button';
import { ShieldCheck, Truck, CheckCircle2, Plane } from 'lucide-react';

export interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div>
      {/* About Header */}
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
            <span>Company Overview</span>
          </div>
          <h1 style={{ color: '#FFFFFF', marginBottom: 'var(--space-2)' }}>
            About Fastway Delivery Services
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.1rem', maxWidth: '640px' }}>
            Fastway Delivery Services provides dependable delivery, transportation and logistics solutions designed to move packages, freight and cargo efficiently.
          </p>
        </Container>
      </section>

      {/* Corporate Mission & Capabilities */}
      <Section background="warm" paddingY="md">
        <Container>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-8)',
              alignItems: 'center',
            }}
          >
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--color-navy)', marginBottom: 'var(--space-4)' }}>
                Speed, Security & Coordinated Movement
              </h2>
              <p style={{ color: 'var(--color-charcoal-light)', lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
                At Fastway Delivery Services, we coordinate domestic and international delivery networks designed around speed, careful cargo custody, and transparent shipment visibility. We serve individuals, commercial merchants, and industrial shippers requiring dependable transportation across priority corridors.
              </p>
              <p style={{ color: 'var(--color-charcoal-light)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
                By integrating air cargo, scheduled ground line-haul, and maritime freight capabilities, our logistics coordination ensures that your goods move seamlessly with dedicated customer support at every checkpoint.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <Button
                  variant="primary"
                  onClick={() => onNavigate('services')}
                >
                  Explore Services
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onNavigate('contact')}
                >
                  Contact Us
                </Button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <Card variant="white" elevation="low">
                <ShieldCheck size={28} color="var(--color-blue)" style={{ marginBottom: 'var(--space-2)' }} />
                <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', marginBottom: 'var(--space-1)' }}>Secure Carriage</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
                  Rigorous handling standards to safeguard every parcel in our custody.
                </p>
              </Card>

              <Card variant="white" elevation="low">
                <Plane size={28} color="var(--color-orange)" style={{ marginBottom: 'var(--space-2)' }} />
                <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', marginBottom: 'var(--space-1)' }}>Air & Express</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
                  Expedited flight corridors for time-critical deliveries.
                </p>
              </Card>

              <Card variant="white" elevation="low">
                <Truck size={28} color="var(--color-navy)" style={{ marginBottom: 'var(--space-2)' }} />
                <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', marginBottom: 'var(--space-1)' }}>Ground Network</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
                  Scheduled road line-hauls for reliable domestic freight distribution.
                </p>
              </Card>

              <Card variant="white" elevation="low">
                <CheckCircle2 size={28} color="var(--color-blue)" style={{ marginBottom: 'var(--space-2)' }} />
                <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', marginBottom: 'var(--space-1)' }}>Clear Tracking</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
                  Milestone visibility so you always know where your cargo is.
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Core Principles */}
      <Section background="white" paddingY="md">
        <Container>
          <Heading
            level="h2"
            align="center"
            subtitle="The fundamental standards guiding our operations every single day."
          >
            Our Operational Commitments
          </Heading>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-6)',
              marginTop: 'var(--space-8)',
            }}
          >
            <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-warm-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
              <h3 style={{ color: 'var(--color-navy)', fontSize: '1.2rem', marginBottom: 'var(--space-2)' }}>
                Integrity & Accountability
              </h3>
              <p style={{ color: 'var(--color-charcoal-light)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                We maintain clear chains of custody. From pickup to final delivery receipt, our handlers treat every consignment with precision and respect.
              </p>
            </div>

            <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-warm-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
              <h3 style={{ color: 'var(--color-navy)', fontSize: '1.2rem', marginBottom: 'var(--space-2)' }}>
                Speed Without Compromise
              </h3>
              <p style={{ color: 'var(--color-charcoal-light)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Fast delivery requires disciplined routing, not haste. We optimize transport schedules and avoid bottlenecks to deliver on time.
              </p>
            </div>

            <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-warm-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
              <h3 style={{ color: 'var(--color-navy)', fontSize: '1.2rem', marginBottom: 'var(--space-2)' }}>
                Responsive Customer Support
              </h3>
              <p style={{ color: 'var(--color-charcoal-light)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Real support when you need it. Our team is accessible to assist with tracking updates, routing questions, and custom shipping requirements.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};
