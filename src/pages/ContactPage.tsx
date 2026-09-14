import React, { useState } from 'react';
import type { PageRoute } from '../constants/navigation';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Phone, Mail, Globe, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export interface ContactPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      {/* Contact Header */}
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
            <span>Customer Assistance</span>
          </div>
          <h1 style={{ color: '#FFFFFF', marginBottom: 'var(--space-2)' }}>
            Contact Fastway Delivery Services
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.05rem', maxWidth: '640px' }}>
            Get in touch with our customer service and dispatch team for shipment tracking support, shipping quotations, and logistics consultations.
          </p>
        </Container>
      </section>

      <Section background="warm" paddingY="md">
        <Container>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-8)',
            }}
          >
            {/* Contact Channels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--color-navy)', marginBottom: 'var(--space-2)' }}>
                  How Can We Help You?
                </h2>
                <p style={{ color: 'var(--color-charcoal-light)', lineHeight: 1.6 }}>
                  Whether you are an individual sending an urgent package or a commercial shipper managing recurring freight, our team is available to assist you.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <Card variant="white" elevation="low" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-blue-light)',
                      color: 'var(--color-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Phone size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>Customer Support Desk</span>
                    <p style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '1rem' }}>
                      Fastway Dispatch & Support Services
                    </p>
                  </div>
                </Card>

                <Card variant="white" elevation="low" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-orange-light)',
                      color: 'var(--color-orange)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>Online Communications</span>
                    <p style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '0.95rem' }}>
                      Fastway Support Portal [Inquiry Form]
                    </p>
                  </div>
                </Card>

                <Card variant="white" elevation="low" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-blue-light)',
                      color: 'var(--color-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Globe size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>Global Logistics</span>
                    <p style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '0.95rem' }}>
                      Air, Ground & Maritime Freight Routing
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Direct Inquiry Form */}
            <Card variant="white" elevation="medium">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-2)' }}>
                <MessageSquare size={20} color="var(--color-blue)" />
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-navy)' }}>
                  Send a Message
                </h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal-muted)', marginBottom: 'var(--space-6)' }}>
                Please fill in the form below and our team will get back to you promptly.
              </p>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
                  <CheckCircle2 size={48} color="var(--color-success)" style={{ margin: '0 auto var(--space-3)' }} />
                  <h4 style={{ color: 'var(--color-navy)', marginBottom: 'var(--space-2)' }}>
                    Message Received
                  </h4>
                  <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.9rem', marginBottom: 'var(--space-4)' }}>
                    Thank you for reaching out to Fastway Delivery Services. A representative will contact you soon.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <Input
                    label="Your Name *"
                    required
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="Contact telephone number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                  <Select
                    label="Topic of Inquiry *"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    options={[
                      { value: 'general', label: 'General Shipping Inquiry' },
                      { value: 'tracking', label: 'Shipment Tracking Assistance' },
                      { value: 'commercial', label: 'Commercial & Business Logistics' },
                      { value: 'rates', label: 'Rate Quotation' },
                    ]}
                  />
                  <Textarea
                    label="Your Message *"
                    required
                    placeholder="How can we assist with your delivery or logistics requirements?..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                  <Button
                    variant="primary"
                    type="submit"
                    rightIcon={<Send size={15} />}
                    style={{ alignSelf: 'flex-start', marginTop: 'var(--space-2)' }}
                  >
                    Submit Message
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  );
};
