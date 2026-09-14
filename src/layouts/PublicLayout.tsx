import React, { useState } from 'react';
import type { PageRoute } from '../constants/navigation';
import {
  MAIN_NAV_ITEMS,
  FOOTER_NAV_SERVICES,
  FOOTER_NAV_COMPANY,
  FOOTER_NAV_SUPPORT,
} from '../constants/navigation';
import { BrandLogo } from '../components/brand/BrandLogo';
import { Button } from '../components/ui/Button';
import {
  Menu,
  X,
  Search,
  ArrowRight,
  ChevronUp,
  Shield,
  FileText,
} from 'lucide-react';

export interface PublicLayoutProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  currentRoute,
  onNavigate,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | 'safety' | null>(null);

  const handleNavClick = (route: PageRoute, targetId?: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Skip to Content Accessible Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Main Header / Clean Navigation (Begins immediately, top bar removed) */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-light)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          className="site-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '76px',
          }}
        >
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            role="link"
            tabIndex={0}
            aria-label="Fastway Delivery Services Home"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNavClick('home');
              }
            }}
          >
            <BrandLogo showTagline size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: 'var(--space-6)',
            }}
            className="desktop-nav"
          >
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--color-blue)' : 'var(--color-charcoal)',
                    padding: 'var(--space-2) 0',
                    position: 'relative',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  {item.label}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2.5px',
                        backgroundColor: 'var(--color-blue)',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs (Desktop) */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}
            className="desktop-actions"
          >
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Search size={15} />}
              onClick={() => handleNavClick('tracking')}
            >
              Track Shipment
            </Button>
            <Button
              variant="orange"
              size="sm"
              rightIcon={<ArrowRight size={15} />}
              onClick={() => handleNavClick('send-package')}
            >
              Send Package
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
            className="mobile-menu-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-navy)',
            }}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid var(--border-light)',
              padding: 'var(--space-4) var(--space-6) var(--space-6)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <nav
              aria-label="Mobile Navigation"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-6)',
              }}
            >
              {MAIN_NAV_ITEMS.map((item) => {
                const isActive = currentRoute === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    style={{
                      textAlign: 'left',
                      fontSize: '1.05rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--color-blue)' : 'var(--color-charcoal)',
                      padding: 'var(--space-2) 0',
                      borderBottom: '1px solid var(--border-light)',
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <Button
                variant="primary"
                fullWidth
                leftIcon={<Search size={16} />}
                onClick={() => handleNavClick('tracking')}
              >
                Track Shipment
              </Button>
              <Button
                variant="orange"
                fullWidth
                rightIcon={<ArrowRight size={16} />}
                onClick={() => handleNavClick('send-package')}
              >
                Send Package
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main id="main-content" style={{ flex: 1 }}>
        {children}
      </main>

      {/* Professional Multi-Modal Logistics Footer */}
      <footer
        style={{
          backgroundColor: '#051320',
          color: 'rgba(247, 248, 246, 0.85)',
          paddingTop: 'var(--space-16)',
          paddingBottom: 'var(--space-8)',
          position: 'relative',
        }}
      >
        {/* Subtle luminous accent hairline */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(23, 105, 224, 0.7) 25%, rgba(242, 107, 33, 0.7) 75%, transparent 100%)',
            opacity: 0.85,
          }}
          aria-hidden="true"
        />

        <div className="site-container">
          <div className="footer-main-grid" style={{ marginBottom: 'var(--space-12)' }}>
            {/* Column 1: FASTWAY BRAND & MISSION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <BrandLogo variant="light" size="md" />
              </div>
              <p
                style={{
                  fontSize: '0.85rem',
                  lineHeight: 1.6,
                  color: 'rgba(247, 248, 246, 0.72)',
                  maxWidth: '320px',
                }}
              >
                Fast, secure, and globally connected logistics. Moving your packages and commercial cargo with dependable precision across domestic and international routes.
              </p>
            </div>

            {/* Column 2: LOGISTICS SERVICES */}
            <div>
              <h4
                style={{
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  marginBottom: 'var(--space-4)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                Services
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {FOOTER_NAV_SERVICES.map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleNavClick(item.route)}
                      className="footer-nav-link"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: COMPANY */}
            <div>
              <h4
                style={{
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  marginBottom: 'var(--space-4)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                Company
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {FOOTER_NAV_COMPANY.map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleNavClick(item.route, item.targetId)}
                      className="footer-nav-link"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: SUPPORT & TOOLS */}
            <div>
              <h4
                style={{
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  marginBottom: 'var(--space-4)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                Support & Tools
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {FOOTER_NAV_SUPPORT.map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleNavClick(item.route)}
                      className="footer-nav-link"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright, Interactive Legal Dialogs & Back to Top */}
          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: 'var(--space-6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 'var(--space-4)',
              fontSize: '0.82rem',
              color: 'rgba(247, 248, 246, 0.6)',
            }}
          >
            <div>
              © {new Date().getFullYear()} Fastway Delivery Services. All rights reserved.
            </div>

            {/* Interactive Legal Policy Triggers */}
            <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveLegalModal('privacy')}
                style={{
                  color: 'rgba(247, 248, 246, 0.65)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#FFFFFF')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(247, 248, 246, 0.65)')}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveLegalModal('terms')}
                style={{
                  color: 'rgba(247, 248, 246, 0.65)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#FFFFFF')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(247, 248, 246, 0.65)')}
              >
                Terms of Service
              </button>
              <button
                onClick={() => setActiveLegalModal('safety')}
                style={{
                  color: 'rgba(247, 248, 246, 0.65)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#FFFFFF')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(247, 248, 246, 0.65)')}
              >
                Cargo Safety Standards
              </button>
            </div>

            {/* Back to Top Button */}
            <div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: 'rgba(247, 248, 246, 0.65)',
                  fontSize: '0.82rem',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(247, 248, 246, 0.65)';
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }}
                aria-label="Back to top"
              >
                <span>Back to top</span>
                <ChevronUp size={15} />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Accessible Interactive Legal Modals */}
      {activeLegalModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(7, 26, 43, 0.8)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
          }}
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveLegalModal(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: 'var(--space-8)',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative',
              color: 'var(--color-charcoal)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveLegalModal(null)}
              style={{
                position: 'absolute',
                top: 'var(--space-5)',
                right: 'var(--space-5)',
                color: 'var(--color-charcoal-muted)',
                padding: 'var(--space-1)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            {activeLegalModal === 'privacy' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
                  <Shield size={24} color="var(--color-blue)" />
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--color-navy)' }}>Privacy Policy</h3>
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-charcoal-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Fastway Delivery Services — Consignment & Customer Data Protection
                </span>

                <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', fontSize: '0.9rem', lineHeight: 1.65 }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-navy)', marginBottom: '4px' }}>
                      1. Information Collection & Carriage Data
                    </h4>
                    <p style={{ color: 'var(--color-charcoal-light)' }}>
                      Fastway collects necessary consignment data including sender/recipient contact details, delivery addresses, package specifications, and declaration details strictly required for the safe execution of shipping and customs clearance.
                    </p>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-navy)', marginBottom: '4px' }}>
                      2. Shipment Visibility & Tracking
                    </h4>
                    <p style={{ color: 'var(--color-charcoal-light)' }}>
                      Shipment tracking information is securely associated with your unique Fastway tracking reference number. Progress milestones are recorded via bonded checkpoint scans to provide transparent transit visibility.
                    </p>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-navy)', marginBottom: '4px' }}>
                      3. Data Confidentiality & Non-Disclosure
                    </h4>
                    <p style={{ color: 'var(--color-charcoal-light)' }}>
                      We do not sell, rent, or monetize client shipping records. Commercial shipment details are only shared with authorized logistics handlers, customs officials, and terminal port authorities directly engaged in fulfilling carriage.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="primary" size="sm" onClick={() => setActiveLegalModal(null)}>
                    Understood & Close
                  </Button>
                </div>
              </div>
            )}

            {activeLegalModal === 'terms' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
                  <FileText size={24} color="var(--color-blue)" />
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--color-navy)' }}>Terms of Service</h3>
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-charcoal-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Conditions of Carriage & Multi-Modal Transportation
                </span>

                <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', fontSize: '0.9rem', lineHeight: 1.65 }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-navy)', marginBottom: '4px' }}>
                      1. Scope of Transportation
                    </h4>
                    <p style={{ color: 'var(--color-charcoal-light)' }}>
                      Fastway Delivery Services provides parcel delivery, air cargo, road freight, and ocean freight logistics under standard commercial carriage regulations. Transportation itineraries may coordinate across air, highway, and maritime corridors.
                    </p>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-navy)', marginBottom: '4px' }}>
                      2. Consignor Declarations & Packaging
                    </h4>
                    <p style={{ color: 'var(--color-charcoal-light)' }}>
                      Shippers are responsible for accurately declaring shipment contents and ensuring adequate protective packaging suitable for multi-modal transit and automated sortation.
                    </p>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-navy)', marginBottom: '4px' }}>
                      3. Checkpoint Scans & Delivery Confirmation
                    </h4>
                    <p style={{ color: 'var(--color-charcoal-light)' }}>
                      Electronic scan timestamps and digital delivery confirmation signify official chain of custody and verifiable proof of delivery completion.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="primary" size="sm" onClick={() => setActiveLegalModal(null)}>
                    Understood & Close
                  </Button>
                </div>
              </div>
            )}

            {activeLegalModal === 'safety' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
                  <Shield size={24} color="var(--color-orange)" />
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--color-navy)' }}>Cargo Safety Standards</h3>
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-charcoal-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Multi-Modal Transit Protocols & Security Safeguards
                </span>

                <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', fontSize: '0.9rem', lineHeight: 1.65 }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-navy)', marginBottom: '4px' }}>
                      1. Bonded Cargo Handling Protocols
                    </h4>
                    <p style={{ color: 'var(--color-charcoal-light)' }}>
                      All freight, containers, and express packages are processed through bonded transit facilities with continuous chain-of-custody oversight and physical tamper verification.
                    </p>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-navy)', marginBottom: '4px' }}>
                      2. Prohibited Goods & Hazardous Screening
                    </h4>
                    <p style={{ color: 'var(--color-charcoal-light)' }}>
                      Undeclared hazardous substances, explosives, and prohibited contraband are strictly barred from Fastway transport corridors. Cargo undergoes rigorous safety screening prior to aircraft and vessel loading.
                    </p>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-navy)', marginBottom: '4px' }}>
                      3. Weather & Multi-Modal Shielding
                    </h4>
                    <p style={{ color: 'var(--color-charcoal-light)' }}>
                      Consignments are protected against climatic variation, moisture, and road vibrations using palletized shrink-wrapping, sealed intermodal containers, and secure cargo restraints.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="orange" size="sm" onClick={() => setActiveLegalModal(null)}>
                    Understood & Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
