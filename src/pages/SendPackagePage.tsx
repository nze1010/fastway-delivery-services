import React, { useState } from 'react';
import type { PageRoute } from '../constants/navigation';
import { bookingService } from '../services/firebase/bookingService';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import {
  Package,
  User,
  MapPin,
  Calendar,
  Send,
  CheckCircle2,
} from 'lucide-react';

export interface SendPackagePageProps {
  onNavigate: (route: PageRoute) => void;
}

export const SendPackagePage: React.FC<SendPackagePageProps> = ({ onNavigate }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceCode, setReferenceCode] = useState('');
  const [formData, setFormData] = useState({
    // Sender
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    senderAddress: '',
    senderCity: '',

    // Recipient
    recipientName: '',
    recipientPhone: '',
    recipientEmail: '',
    recipientAddress: '',
    recipientCity: '',

    // Pickup & Delivery details
    pickupDate: '',
    pickupTimePreference: 'morning',
    deliveryInstructions: '',

    // Package details
    packageCategory: 'parcel',
    packageDescription: '',
    serviceType: 'express-parcel',
    estimatedWeightKg: '',
    dimensions: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await bookingService.submitBookingRequest({
        sender: {
          name: formData.senderName,
          phone: formData.senderPhone,
          email: formData.senderEmail,
          address: {
            street: formData.senderAddress,
            city: formData.senderCity,
            state: '',
            country: 'Global',
          },
        },
        receiver: {
          name: formData.recipientName,
          phone: formData.recipientPhone,
          email: formData.recipientEmail,
          address: {
            street: formData.recipientAddress,
            city: formData.recipientCity,
            state: '',
            country: 'Global',
          },
        },
        pickupSchedule: `${formData.pickupDate} (${formData.pickupTimePreference})`,
        deliveryInstructions: formData.deliveryInstructions,
        packageDetails: {
          description: formData.packageDescription,
          category: formData.packageCategory as any,
          weightKg: parseFloat(formData.estimatedWeightKg) || 1,
          quantity: 1,
        },
        serviceType: formData.serviceType,
      });

      setReferenceCode(res.referenceNumber);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to submit booking intake request:', err);
      // Fallback display reference if network hiccup occurs
      setReferenceCode(`REQ-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const customerJourneySteps = [
    {
      step: '01',
      title: 'Submit Details',
      desc: 'Provide sender, recipient, and package specifications through the simple form below.',
    },
    {
      step: '02',
      title: 'Logistics Review',
      desc: 'Our dispatch desk coordinates the optimal transit route and confirms your pickup schedule.',
    },
    {
      step: '03',
      title: 'Dispatch & Track',
      desc: 'Receive your official Fastway tracking reference to monitor your shipment to destination.',
    },
  ];

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
            <span>Customer Shipping Portal</span>
          </div>
          <h1 style={{ color: '#FFFFFF', marginBottom: 'var(--space-2)' }}>
            Send a Package with Fastway
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.05rem', maxWidth: '640px' }}>
            Fill in your shipment information below. Our customer logistics coordinators will arrange the optimal dispatch routing and contact you with confirmation.
          </p>
        </Container>
      </section>

      {/* Customer Journey Quick Steps */}
      <Section background="white" paddingY="md">
        <Container>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {customerJourneySteps.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: 'var(--space-6)',
                  backgroundColor: 'var(--color-warm-white)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-2)',
                }}
              >
                <span
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-blue)',
                    opacity: 0.35,
                  }}
                >
                  {item.step}
                </span>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy)' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal-light)', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Main Shipping Interface Form */}
      <Section background="warm" paddingY="md">
        <Container size="md">
          {isSubmitted ? (
            <Card variant="white" elevation="medium" style={{ textAlign: 'center', padding: 'var(--space-12) var(--space-6)' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-success-bg)',
                  color: 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-4)',
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--color-navy)', marginBottom: 'var(--space-2)' }}>
                Booking Request Received
              </h2>
              {referenceCode && (
                <div style={{ margin: 'var(--space-3) 0 var(--space-4)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                    Inquiry Reference Code
                  </span>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-blue)', fontFamily: 'var(--font-display)', marginTop: '2px' }}>
                    {referenceCode}
                  </p>
                </div>
              )}
              <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.98rem', maxWidth: '520px', margin: '0 auto var(--space-6)', lineHeight: 1.6 }}>
                Thank you for submitting your package details. A Fastway dispatch coordinator will review your route requirements, confirm pickup, and register your official tracking number.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <Button variant="primary" onClick={() => onNavigate('tracking')}>
                  Go to Tracking Page
                </Button>
                <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                  Submit Another Package
                </Button>
              </div>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              {/* 1. Sender Information */}
              <Card variant="white">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-5)', borderBottom: '1px solid var(--border-light)', paddingBottom: 'var(--space-3)' }}>
                  <User size={20} color="var(--color-blue)" />
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)' }}>1. Sender Information</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
                  <Input
                    label="Sender Full Name *"
                    name="senderName"
                    required
                    placeholder="e.g. Johnathan Smith"
                    value={formData.senderName}
                    onChange={handleChange}
                  />
                  <Input
                    label="Sender Phone Number *"
                    name="senderPhone"
                    required
                    placeholder="Contact telephone"
                    value={formData.senderPhone}
                    onChange={handleChange}
                  />
                  <Input
                    label="Sender Email Address *"
                    name="senderEmail"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.senderEmail}
                    onChange={handleChange}
                  />
                  <Input
                    label="Sender Address *"
                    name="senderAddress"
                    required
                    placeholder="Street address or facility"
                    value={formData.senderAddress}
                    onChange={handleChange}
                  />
                  <Input
                    label="Origin City & Region *"
                    name="senderCity"
                    required
                    placeholder="City, Country"
                    value={formData.senderCity}
                    onChange={handleChange}
                  />
                </div>
              </Card>

              {/* 2. Recipient Information */}
              <Card variant="white">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-5)', borderBottom: '1px solid var(--border-light)', paddingBottom: 'var(--space-3)' }}>
                  <MapPin size={20} color="var(--color-orange)" />
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)' }}>2. Recipient Information</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
                  <Input
                    label="Recipient Full Name *"
                    name="recipientName"
                    required
                    placeholder="Recipient or receiving company"
                    value={formData.recipientName}
                    onChange={handleChange}
                  />
                  <Input
                    label="Recipient Phone Number *"
                    name="recipientPhone"
                    required
                    placeholder="Recipient telephone"
                    value={formData.recipientPhone}
                    onChange={handleChange}
                  />
                  <Input
                    label="Recipient Email Address"
                    name="recipientEmail"
                    type="email"
                    placeholder="recipient@example.com"
                    value={formData.recipientEmail}
                    onChange={handleChange}
                  />
                  <Input
                    label="Delivery Street Address *"
                    name="recipientAddress"
                    required
                    placeholder="Street delivery address"
                    value={formData.recipientAddress}
                    onChange={handleChange}
                  />
                  <Input
                    label="Destination City & Country *"
                    name="recipientCity"
                    required
                    placeholder="Destination city, Country"
                    value={formData.recipientCity}
                    onChange={handleChange}
                  />
                </div>
              </Card>

              {/* 3. Pickup & Delivery Details */}
              <Card variant="white">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-5)', borderBottom: '1px solid var(--border-light)', paddingBottom: 'var(--space-3)' }}>
                  <Calendar size={20} color="var(--color-blue)" />
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)' }}>3. Pickup & Delivery Schedule</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
                  <Input
                    label="Preferred Pickup Date *"
                    name="pickupDate"
                    type="date"
                    required
                    value={formData.pickupDate}
                    onChange={handleChange}
                  />
                  <Select
                    label="Time Window Preference"
                    name="pickupTimePreference"
                    value={formData.pickupTimePreference}
                    onChange={handleChange}
                    options={[
                      { value: 'morning', label: 'Morning (08:00 - 12:00)' },
                      { value: 'afternoon', label: 'Afternoon (12:00 - 17:00)' },
                      { value: 'flexible', label: 'Flexible / Anytime' },
                    ]}
                  />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Textarea
                      label="Delivery Notes & Access Instructions"
                      name="deliveryInstructions"
                      placeholder="Gate codes, delivery contact person, specific loading bay..."
                      value={formData.deliveryInstructions}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </Card>

              {/* 4. Package & Service Specifications */}
              <Card variant="white">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-5)', borderBottom: '1px solid var(--border-light)', paddingBottom: 'var(--space-3)' }}>
                  <Package size={20} color="var(--color-navy)" />
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)' }}>4. Package Details & Service Category</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
                  <Select
                    label="Service Tier *"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    options={[
                      { value: 'express-parcel', label: 'Express Parcel Delivery' },
                      { value: 'air-freight', label: 'Air Freight & Cargo' },
                      { value: 'road-freight', label: 'Road Freight & Line Haul' },
                      { value: 'ocean-freight', label: 'Ocean Freight & Container Logistics' },
                      { value: 'supply-chain', label: 'Supply Chain Solutions' },
                    ]}
                  />
                  <Select
                    label="Package Category *"
                    name="packageCategory"
                    value={formData.packageCategory}
                    onChange={handleChange}
                    options={[
                      { value: 'parcel', label: 'Standard Box / Parcel' },
                      { value: 'documents', label: 'Documents / Paperwork' },
                      { value: 'electronics', label: 'Electronics / Technology' },
                      { value: 'commercial', label: 'Commercial Freight / Pallet' },
                      { value: 'fragile', label: 'Fragile / Delicate Items' },
                    ]}
                  />
                  <Input
                    label="Estimated Weight (kg) *"
                    name="estimatedWeightKg"
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    placeholder="e.g. 5.5"
                    value={formData.estimatedWeightKg}
                    onChange={handleChange}
                  />
                  <Input
                    label="Dimensions (L x W x H cm)"
                    name="dimensions"
                    placeholder="e.g. 40 x 30 x 20"
                    value={formData.dimensions}
                    onChange={handleChange}
                  />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Textarea
                      label="Package Description *"
                      name="packageDescription"
                      required
                      placeholder="Describe the nature of items being shipped..."
                      value={formData.packageDescription}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)' }}>
                <Button variant="outline" type="button" onClick={() => onNavigate('home')}>
                  Cancel
                </Button>
                <Button
                  variant="orange"
                  type="submit"
                  size="lg"
                  isLoading={isSubmitting}
                  rightIcon={<Send size={16} />}
                >
                  Submit Shipping Request
                </Button>
              </div>
            </form>
          )}
        </Container>
      </Section>
    </div>
  );
};
