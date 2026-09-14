import React, { useState } from 'react';
import type { PageRoute } from '../constants/navigation';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import {
  ArrowRight,
  Search,
  Zap,
  Plane,
  Truck,
  Ship,
  Box,
  ShieldCheck,
  Eye,
  CheckCircle2,
  PhoneCall,
  Globe,
} from 'lucide-react';

export interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
  onSearchTracking?: (trackingNumber: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSearchTracking }) => {
  const [trackingInput, setTrackingInput] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      if (onSearchTracking) {
        onSearchTracking(trackingInput.trim());
      }
      onNavigate('tracking');
    }
  };

  const customerJourneySteps = [
    {
      step: '01',
      title: 'Send',
      desc: 'Prepare and submit your package through the appropriate Fastway service.',
    },
    {
      step: '02',
      title: 'Move',
      desc: 'Fastway coordinates the appropriate air, ground, or maritime route.',
    },
    {
      step: '03',
      title: 'Track',
      desc: 'Follow your shipment progress using its unique tracking reference.',
    },
    {
      step: '04',
      title: 'Receive',
      desc: 'Your package reaches its intended destination safely and on schedule.',
    },
  ];

  const whyChooseBenefits = [
    {
      title: 'Reliable Delivery',
      desc: 'Professional transportation designed around dependable movement across domestic and international routes.',
      icon: <ShieldCheck size={22} color="var(--color-blue)" />,
    },
    {
      title: 'Secure Handling',
      desc: 'Careful handling of packages, freight and cargo throughout every stage of the delivery journey.',
      icon: <CheckCircle2 size={22} color="var(--color-orange)" />,
    },
    {
      title: 'Shipment Visibility',
      desc: 'Clear, continuous tracking access for customers with an existing shipment reference.',
      icon: <Eye size={22} color="var(--color-blue)" />,
    },
    {
      title: 'Flexible Logistics',
      desc: 'Adaptable transport solutions suitable for personal deliveries and ongoing business transportation needs.',
      icon: <Box size={22} color="var(--color-orange)" />,
    },
  ];

  const homeServices = [
    {
      id: 'express-parcel',
      title: 'Express Parcel Delivery',
      desc: 'Fast and dependable delivery for documents, parcels and time-sensitive packages across priority transit corridors.',
      tag: 'Priority Doorstep',
      actionLabel: 'Send Now',
      actionRoute: 'send-package' as PageRoute,
      icon: Zap,
      accentColor: 'var(--color-orange)',
      iconBg: 'rgba(242, 107, 33, 0.18)',
      iconColor: 'var(--color-orange)',
    },
    {
      id: 'air-freight',
      title: 'Air Freight & Cargo',
      desc: 'Efficient air transportation for cargo requiring speed, secure handling and reliable movement across international routes.',
      tag: 'Priority Air Transit',
      actionLabel: 'Details',
      actionRoute: 'services' as PageRoute,
      icon: Plane,
      accentColor: 'var(--color-blue)',
      iconBg: 'rgba(23, 105, 224, 0.22)',
      iconColor: '#93C5FD',
    },
    {
      id: 'road-freight',
      title: 'Road Freight & Line Haul',
      desc: 'Dependable road transportation for commercial cargo, freight and scheduled long-distance movement.',
      tag: 'Ground Haulage',
      actionLabel: 'Details',
      actionRoute: 'services' as PageRoute,
      icon: Truck,
      accentColor: '#38BDF8',
      iconBg: 'rgba(56, 189, 248, 0.18)',
      iconColor: '#7DD3FC',
    },
    {
      id: 'ocean-freight',
      title: 'Ocean Freight & Containers',
      desc: 'Practical sea freight and container transportation for larger shipments and international cargo movement.',
      tag: 'Maritime Transit',
      actionLabel: 'Details',
      actionRoute: 'services' as PageRoute,
      icon: Ship,
      accentColor: '#2DD4BF',
      iconBg: 'rgba(45, 212, 191, 0.18)',
      iconColor: '#5EEAD4',
    },
    {
      id: 'supply-chain',
      title: 'Supply Chain Solutions',
      desc: 'Flexible logistics support for businesses requiring coordinated transportation, movement and delivery.',
      tag: 'Enterprise Logistics',
      actionLabel: 'Details',
      actionRoute: 'services' as PageRoute,
      icon: Box,
      accentColor: '#818CF8',
      iconBg: 'rgba(129, 140, 248, 0.18)',
      iconColor: '#A5B4FC',
    },
  ];

  return (
    <div>
      {/* 1. HERO SECTION: Alive, Illuminated Logistics Environment */}
      <section
        style={{
          position: 'relative',
          backgroundColor: 'var(--color-navy)',
          color: '#FFFFFF',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          padding: 'var(--space-16) 0 var(--space-20)',
          borderBottom: '4px solid var(--color-blue)',
        }}
      >
        {/* Background Visual Layer: Cinematic Moving Logistics Fleet */}
        <img
          src="/images/hero-logistics.jpg"
          alt="Fastway Logistics Fleet"
          className="hero-animated-bg"
          style={{
            opacity: 0.72,
            filter: 'contrast(1.16) brightness(0.92) saturate(1.12)',
          }}
        />

        {/* Realistic Moving Sunlight & Headlight Sweep Across Fleet */}
        <div className="logistics-light-sweep" aria-hidden="true" />

        {/* Animated Moving Global Transit Routes & Telemetry Radar Beacons */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 1,
          }}
          aria-hidden="true"
        >
          {/* Animated Transit Route Lines SVG */}
          <svg
            style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.65 }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="routeGradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1769E0" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#1769E0" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="routeGradOrange" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F26B21" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F26B21" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Flight Transit Path Curve */}
            <path
              d="M 500 480 Q 780 180 1200 240"
              fill="none"
              stroke="url(#routeGradBlue)"
              strokeWidth="2.5"
              className="transit-route-line"
            />
            {/* Ground Express Route Curve */}
            <path
              d="M 650 520 Q 950 420 1280 460"
              fill="none"
              stroke="url(#routeGradOrange)"
              strokeWidth="2"
              className="transit-route-line-fast"
            />
            {/* Global Dispatch Cross-Corridor Arc */}
            <path
              d="M 400 320 Q 700 120 1150 160"
              fill="none"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.5"
              className="transit-route-line"
              style={{ animationDuration: '3.8s' }}
            />
          </svg>

          {/* Active Radar GPS Nodes on Fleet with Pulsing Rings */}
          <div style={{ position: 'absolute', top: '28%', right: '28%' }}>
            <div style={{ position: 'relative', width: '12px', height: '12px', backgroundColor: 'var(--color-blue)', borderRadius: '50%' }}>
              <div className="beacon-ping" />
            </div>
            <div
              style={{
                position: 'absolute',
                top: '-24px',
                left: '16px',
                backgroundColor: 'rgba(7, 26, 43, 0.85)',
                border: '1px solid rgba(23, 105, 224, 0.6)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.68rem',
                color: '#93C5FD',
                whiteSpace: 'nowrap',
                fontWeight: 600,
                letterSpacing: '0.04em',
                backdropFilter: 'blur(4px)',
              }}
            >
              FRA · AIR FREIGHT IN FLIGHT
            </div>
          </div>

          <div style={{ position: 'absolute', top: '56%', right: '14%' }}>
            <div style={{ position: 'relative', width: '12px', height: '12px', backgroundColor: 'var(--color-orange)', borderRadius: '50%' }}>
              <div className="beacon-ping-orange" />
            </div>
            <div
              style={{
                position: 'absolute',
                top: '-24px',
                left: '16px',
                backgroundColor: 'rgba(7, 26, 43, 0.85)',
                border: '1px solid rgba(242, 107, 33, 0.6)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.68rem',
                color: '#FED7AA',
                whiteSpace: 'nowrap',
                fontWeight: 600,
                letterSpacing: '0.04em',
                backdropFilter: 'blur(4px)',
              }}
            >
              LHR · EXPRESS DISPATCH ACTIVE
            </div>
          </div>
        </div>

        {/* Balanced Navy Gradient Overlays: Dark on the left for crisp text contrast, open & vibrant on the right */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(7, 26, 43, 0.94) 0%, rgba(7, 26, 43, 0.78) 46%, rgba(7, 26, 43, 0.28) 100%)',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '120px',
            background: 'linear-gradient(to top, rgba(7, 26, 43, 0.95), transparent)',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />

        {/* Ambient Subtle Illumination Elements */}
        <div
          style={{
            position: 'absolute',
            top: '8%',
            left: '25%',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(23, 105, 224, 0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />

        {/* Hero Content Container */}
        <Container>
          <div
            style={{
              maxWidth: '680px',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {/* Subtle Brand Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(23, 105, 224, 0.22)',
                border: '1px solid rgba(23, 105, 224, 0.45)',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#EBF3FD',
                marginBottom: 'var(--space-5)',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-orange)',
                }}
              />
              <span>Fastway Delivery Services</span>
            </div>

            {/* Headline */}
            <h1
              style={{
                color: '#FFFFFF',
                fontSize: 'clamp(2.5rem, 5vw + 1rem, 3.85rem)',
                lineHeight: 1.12,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                marginBottom: 'var(--space-4)',
              }}
            >
              Fast Delivery. <br />
              <span style={{ color: 'var(--color-blue)' }}>Trusted Service.</span>
            </h1>

            {/* Supporting Copy */}
            <p
              style={{
                fontSize: '1.18rem',
                lineHeight: 1.6,
                color: 'rgba(247, 248, 246, 0.9)',
                marginBottom: 'var(--space-8)',
                maxWidth: '560px',
              }}
            >
              Dependable delivery, logistics and transportation services designed for speed and security. Moving packages, freight and cargo with confidence across local and international routes.
            </p>

            {/* Two Primary Customer Actions: Track Shipment & Send Package */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Quick Tracking Search */}
              <form
                onSubmit={handleTrackSubmit}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: '0 12px 32px rgba(7, 26, 43, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  maxWidth: '520px',
                }}
              >
                <div style={{ paddingLeft: 'var(--space-3)', color: 'var(--color-charcoal-muted)' }}>
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Enter tracking reference number..."
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    color: 'var(--color-charcoal)',
                    fontSize: '0.95rem',
                    padding: 'var(--space-2) 0',
                  }}
                  aria-label="Enter Tracking Number"
                />
                <Button variant="primary" type="submit" size="md">
                  Track Shipment
                </Button>
              </form>

              {/* Secondary CTA */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-2)', flexWrap: 'wrap' }}>
                <Button
                  variant="orange"
                  size="md"
                  rightIcon={<ArrowRight size={16} />}
                  onClick={() => onNavigate('send-package')}
                >
                  Send Package
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  style={{ color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.45)' }}
                  onClick={() => onNavigate('services')}
                >
                  Explore Services
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SERVICES SECTION: Compact Premium Dark Navy Service Cards */}
      <Section background="warm" paddingY="md" id="services-overview">
        <Container>
          <div style={{ maxWidth: '640px', margin: '0 auto var(--space-8)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-blue)' }}>
              Transportation & Freight
            </span>
            <h2 style={{ fontSize: '1.9rem', color: 'var(--color-navy)', marginTop: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              Logistics Services Built for Speed & Security
            </h2>
            <p style={{ color: 'var(--color-charcoal-light)', fontSize: '0.96rem', lineHeight: 1.55 }}>
              Dependable transportation and supply chain solutions tailored for individuals and businesses moving cargo efficiently.
            </p>
          </div>

          {/* Unified Compact Premium Dark Navy Services Cards Layout */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-4)',
              alignItems: 'stretch',
            }}
          >
            {homeServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  style={{
                    backgroundColor: 'var(--color-navy)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-navy-border)',
                    boxShadow: '0 8px 22px -4px rgba(7, 26, 43, 0.32)',
                    padding: '1.2rem 1rem 0.95rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'rgba(23, 105, 224, 0.55)';
                    e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(7, 26, 43, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--color-navy-border)';
                    e.currentTarget.style.boxShadow = '0 8px 22px -4px rgba(7, 26, 43, 0.32)';
                  }}
                >
                  {/* Top Glowing Color Accent Bar */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: service.accentColor,
                    }}
                  />

                  <div>
                    {/* Compact Icon */}
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: service.iconBg,
                        color: service.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 'var(--space-3)',
                      }}
                    >
                      <IconComponent size={19} />
                    </div>

                    {/* Compact Title */}
                    <h3
                      style={{
                        fontSize: '1.04rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        marginBottom: 'var(--space-2)',
                        lineHeight: 1.3,
                      }}
                    >
                      {service.title}
                    </h3>

                    {/* Compact Description */}
                    <p
                      style={{
                        color: 'rgba(247, 248, 246, 0.72)',
                        lineHeight: 1.48,
                        fontSize: '0.81rem',
                        marginBottom: 'var(--space-4)',
                      }}
                    >
                      {service.desc}
                    </p>
                  </div>

                  {/* Compact Bottom Action Bar */}
                  <div
                    style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      paddingTop: 'var(--space-2)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.69rem',
                        color: 'rgba(255, 255, 255, 0.58)',
                        fontWeight: 600,
                        letterSpacing: '0.01em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {service.tag}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      style={{
                        color: '#93C5FD',
                        padding: '2px 4px',
                        fontSize: '0.76rem',
                        height: 'auto',
                        whiteSpace: 'nowrap',
                      }}
                      rightIcon={<ArrowRight size={11} />}
                      onClick={() => onNavigate(service.actionRoute)}
                    >
                      {service.actionLabel}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 3. WHY CHOOSE FASTWAY: Deep Navy Section With Side-By-Side Visual (Avoid All-White Problem) */}
      <section
        id="why-choose"
        style={{
          backgroundColor: 'var(--color-navy)',
          color: '#FFFFFF',
          padding: 'var(--space-20) 0',
          position: 'relative',
          overflow: 'hidden',
          borderTop: '1px solid var(--color-navy-border)',
          borderBottom: '1px solid var(--color-navy-border)',
        }}
      >
        <Container>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-12)',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Image Supporting Logistics Hub */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-navy)',
                  border: '1.5px solid var(--color-navy-border)',
                  position: 'relative',
                }}
              >
                <img
                  src="/images/logistics-hub.jpg"
                  alt="Fastway modern logistics distribution hub"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    filter: 'contrast(1.05)',
                  }}
                  loading="lazy"
                />
                {/* Subtle Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(7, 26, 43, 0.75) 0%, transparent 60%)',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'var(--space-5)',
                    left: 'var(--space-5)',
                    right: 'var(--space-5)',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-orange)', fontWeight: 700 }}>
                    Modern Infrastructure
                  </span>
                  <h4 style={{ color: '#FFFFFF', fontSize: '1.15rem', marginTop: '2px' }}>
                    Coordinated Cargo Routing & Automated Handling
                  </h4>
                </div>
              </div>
            </div>

            {/* Right Column: Practical Benefits */}
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-orange)' }}>
                Reliable Transportation
              </span>
              <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF', marginTop: 'var(--space-2)', marginBottom: 'var(--space-4)', letterSpacing: '-0.02em' }}>
                Why Choose Fastway Delivery Services
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.05rem', lineHeight: 1.65, marginBottom: 'var(--space-8)' }}>
                Built on accountability, careful handling, and predictable movement, we provide clear transportation services you can rely on every single day.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {whyChooseBenefits.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        padding: 'var(--space-2)',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-dark)',
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h3 style={{ color: '#FFFFFF', fontSize: '1.15rem', marginBottom: 'var(--space-1)' }}>
                        {item.title}
                      </h3>
                      <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. HOW FASTWAY WORKS: Simple Customer Journey (Warm White Background) */}
      <Section background="warm" paddingY="lg" id="how-it-works">
        <Container>
          <div style={{ maxWidth: '640px', margin: '0 auto var(--space-12)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-blue)' }}>
              Simple Process
            </span>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--color-navy)', marginTop: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              How Fastway Works
            </h2>
            <p style={{ color: 'var(--color-charcoal-light)', fontSize: '1.05rem' }}>
              Four simple steps from package preparation to final delivery.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {customerJourneySteps.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: 'var(--space-8) var(--space-6)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    fontSize: '2.2rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-blue)',
                    opacity: 0.3,
                  }}
                >
                  {item.step}
                </span>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy)' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-charcoal-light)', lineHeight: 1.65 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. GLOBAL LOGISTICS VISUAL SECTION: Air. Road. Sea. Connected. (Visual Breathing Room) */}
      <section
        id="global-network"
        style={{
          position: 'relative',
          minHeight: '440px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          overflow: 'hidden',
          backgroundColor: 'var(--color-navy)',
          color: '#FFFFFF',
          padding: 'var(--space-16) var(--space-4)',
        }}
      >
        {/* Full-bleed Panorama Asset with Continuous Panoramic Drift */}
        <img
          src="/images/global-logistics-panorama.jpg"
          alt="Global Multi-Modal Logistics Network"
          className="panorama-animated-bg"
          style={{
            opacity: 0.68,
            filter: 'contrast(1.18) brightness(0.92) saturate(1.15)',
          }}
        />

        {/* Realistic Light Sweep Across Ocean & Vessel */}
        <div className="logistics-light-sweep" style={{ animationDuration: '14s' }} aria-hidden="true" />

        {/* Global Radar Sweep Scanner */}
        <div
          className="radar-sweep-cone"
          style={{ top: 'calc(50% - 250px)', left: 'calc(50% - 250px)' }}
          aria-hidden="true"
        />

        {/* Navy Contrast Vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at center, rgba(7, 26, 43, 0.55) 0%, rgba(7, 26, 43, 0.88) 100%)',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(242, 107, 33, 0.2)',
              border: '1px solid rgba(242, 107, 33, 0.5)',
              padding: '0.3rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--color-orange)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 'var(--space-4)',
            }}
          >
            <Globe size={14} />
            <span>Multi-Modal Transportation</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.2rem, 4vw + 1rem, 3.2rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.18,
              letterSpacing: '-0.025em',
              marginBottom: 'var(--space-4)',
            }}
          >
            Air. Road. Sea. <br />
            <span style={{ color: 'var(--color-blue)' }}>Connected.</span>
          </h2>

          <p
            style={{
              fontSize: '1.15rem',
              lineHeight: 1.65,
              color: 'rgba(247, 248, 246, 0.9)',
              maxWidth: '580px',
              margin: '0 auto var(--space-8)',
            }}
          >
            Coordinated freight corridors ensuring continuous visibility, careful handling, and dependable dispatch across continents.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={16} />}
              onClick={() => onNavigate('services')}
            >
              Discover Logistics Solutions
            </Button>
            <Button
              variant="outline"
              size="lg"
              style={{ color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.4)' }}
              onClick={() => onNavigate('tracking')}
            >
              Track an Existing Shipment
            </Button>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION & SUPPORT CALLOUT (Prompt Section 18) */}
      <section
        id="dispatch-support"
        style={{
          background: 'linear-gradient(180deg, #091F33 0%, #061626 100%)',
          color: '#FFFFFF',
          padding: 'var(--space-16) 0',
          borderTop: '1px solid var(--color-navy-border)',
        }}
      >
        <Container>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-8)',
              alignItems: 'stretch',
            }}
          >
            {/* Primary Shipping Action Card */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-8)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--color-orange)',
                    marginBottom: 'var(--space-2)',
                    display: 'inline-block',
                  }}
                >
                  Direct Consignment Booking
                </span>
                <h2 style={{ color: '#FFFFFF', fontSize: '1.9rem', marginBottom: 'var(--space-3)', lineHeight: 1.25 }}>
                  Ready to Dispatch Your Package?
                </h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.98rem', lineHeight: 1.65, marginBottom: 'var(--space-6)' }}>
                  Fastway provides dependable, secure shipping solutions for individuals and enterprises. Submit your consignment details today.
                </p>
              </div>

              <div>
                <Button
                  variant="orange"
                  size="lg"
                  rightIcon={<ArrowRight size={16} />}
                  onClick={() => onNavigate('send-package')}
                >
                  Send Package
                </Button>
              </div>
            </div>

            {/* Support Callout Box */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-8)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'var(--space-3)' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(23, 105, 224, 0.2)',
                      color: 'var(--color-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <PhoneCall size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                      Customer Support
                    </span>
                    <h3 style={{ color: '#FFFFFF', fontSize: '1.3rem' }}>
                      Need Help With a Delivery?
                    </h3>
                  </div>
                </div>

                <p style={{ color: 'rgba(255, 255, 255, 0.78)', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: 'var(--space-6)' }}>
                  Have questions regarding delivery routing, cargo specifications, or general inquiries? Our customer support team is ready to assist.
                </p>
              </div>

              <div>
                <Button
                  variant="outline"
                  size="md"
                  style={{ color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.35)' }}
                  onClick={() => onNavigate('contact')}
                >
                  Contact Fastway Support
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
