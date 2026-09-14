import React, { useState, useEffect } from 'react';
import type { PageRoute } from '../constants/navigation';
import { firebaseShipmentService } from '../services/firebase/shipmentService';
import type { Shipment } from '../types';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { extractTrackingNumberFromReceipt } from '../utils/receiptParser';
import {
  Search,
  CheckCircle2,
  MapPin,
  ArrowRight,
  UploadCloud,
  FileText,
  AlertCircle,
  Shield,
  Globe,
} from 'lucide-react';

export interface TrackingPageProps {
  initialTrackingNumber?: string;
  onNavigate: (route: PageRoute) => void;
}

export const TrackingPage: React.FC<TrackingPageProps> = ({
  initialTrackingNumber = '',
  onNavigate,
}) => {
  // Method selection: 'number' | 'receipt'
  const [activeMethod, setActiveMethod] = useState<'number' | 'receipt'>('number');
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('Connecting to Fastway tracking network...');
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Receipt upload state
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessingReceipt, setIsProcessingReceipt] = useState(false);
  const [receiptError, setReceiptError] = useState<string | null>(null);

  const performLookup = async (code: string, source: 'manual' | 'receipt' = 'manual') => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      if (source === 'manual') {
        setErrorMessage('Please enter a valid Fastway tracking reference.');
      }
      return;
    }

    setIsLoading(true);
    setLoadingMessage(source === 'receipt' ? 'Finding your shipment...' : 'Connecting to Fastway tracking network...');
    setErrorMessage(null);
    setReceiptError(null);
    setHasSearched(true);

    try {
      const result = await firebaseShipmentService.getShipmentByTrackingNumber(trimmed);
      setShipment(result);
      if (!result) {
        if (source === 'receipt') {
          setErrorMessage(`We found the consignment number (${trimmed}), but no shipment could be found for this reference.`);
        } else {
          setErrorMessage(
            `No shipment records found matching reference "${trimmed}". Please verify the tracking number from your receipt or confirmation message.`
          );
        }
      }
    } catch {
      setErrorMessage('Unable to retrieve tracking details at this moment. Please check your network and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialTrackingNumber) {
      setTrackingNumber(initialTrackingNumber);
      performLookup(initialTrackingNumber, 'manual');
    }
  }, [initialTrackingNumber]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(trackingNumber, 'manual');
  };

  const handleReceiptProcess = async (file: File) => {
    if (!file) {
      setReceiptError('Please select a Fastway consignment receipt.');
      return;
    }

    setIsProcessingReceipt(true);
    setReceiptError(null);
    setErrorMessage(null);
    setLoadingMessage('Reading receipt...');

    try {
      const parseResult = await extractTrackingNumberFromReceipt(file);

      if (!parseResult.success || !parseResult.trackingNumber) {
        setReceiptError(parseResult.error || 'We could not identify a Fastway tracking number from this receipt.');
        setIsProcessingReceipt(false);
        return;
      }

      const extractedCode = parseResult.trackingNumber.toUpperCase();
      setTrackingNumber(extractedCode);

      // Perform shipment lookup with extracted code
      await performLookup(extractedCode, 'receipt');
    } catch (err) {
      console.error('Receipt handling error:', err);
      setReceiptError('Unable to process the receipt. Please try again or enter the tracking number manually.');
    } finally {
      setIsProcessingReceipt(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleReceiptProcess(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleReceiptProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div>
      {/* Tracking Header & Search Section */}
      <section
        style={{
          backgroundColor: 'var(--color-navy)',
          color: '#FFFFFF',
          padding: 'var(--space-10) 0 var(--space-12)',
          borderBottom: '4px solid var(--color-blue)',
        }}
      >
        <Container>
          <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
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
              <span>Shipment Tracking</span>
            </div>

            <h1 style={{ color: '#FFFFFF', marginBottom: 'var(--space-2)' }}>
              Track Your Shipment
            </h1>

            <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.05rem', marginBottom: 'var(--space-6)', lineHeight: 1.5 }}>
              Enter your Fastway tracking number or upload your Fastway consignment receipt to track your shipment.
            </p>

            {/* Structured Dual-Method Tracking Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                textAlign: 'left',
              }}
            >
              {/* Method Selector Tabs */}
              <div
                style={{
                  display: 'flex',
                  borderBottom: '1px solid var(--border-light)',
                  backgroundColor: 'var(--color-warm-white)',
                }}
              >
                <button
                  type="button"
                  id="tab-method-number"
                  onClick={() => {
                    setActiveMethod('number');
                    setReceiptError(null);
                  }}
                  style={{
                    flex: 1,
                    padding: 'var(--space-3) var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: activeMethod === 'number' ? '#FFFFFF' : 'transparent',
                    color: activeMethod === 'number' ? 'var(--color-navy)' : 'var(--color-charcoal-muted)',
                    borderBottom: activeMethod === 'number' ? '2.5px solid var(--color-blue)' : '2.5px solid transparent',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <Search size={16} color={activeMethod === 'number' ? 'var(--color-blue)' : 'currentColor'} />
                  <span>Enter Tracking Number</span>
                </button>

                <button
                  type="button"
                  id="tab-method-receipt"
                  onClick={() => {
                    setActiveMethod('receipt');
                    setReceiptError(null);
                  }}
                  style={{
                    flex: 1,
                    padding: 'var(--space-3) var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: activeMethod === 'receipt' ? '#FFFFFF' : 'transparent',
                    color: activeMethod === 'receipt' ? 'var(--color-navy)' : 'var(--color-charcoal-muted)',
                    borderBottom: activeMethod === 'receipt' ? '2.5px solid var(--color-orange)' : '2.5px solid transparent',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <UploadCloud size={16} color={activeMethod === 'receipt' ? 'var(--color-orange)' : 'currentColor'} />
                  <span>Upload Receipt</span>
                </button>
              </div>

              {/* Method Card Content */}
              <div style={{ padding: 'var(--space-5)' }}>
                {activeMethod === 'number' ? (
                  /* METHOD 1: Tracking Number Input */
                  <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <Input
                          id="tracking-number-input"
                          placeholder="e.g. FW-557612"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          leftIcon={<Search size={18} />}
                          style={{
                            border: '1.5px solid var(--border-medium)',
                            backgroundColor: '#FFFFFF',
                          }}
                        />
                      </div>
                      <Button
                        id="track-shipment-btn"
                        variant="primary"
                        type="submit"
                        isLoading={isLoading}
                        size="md"
                        style={{ fontWeight: 700, minWidth: '160px' }}
                      >
                        Track Shipment
                      </Button>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-charcoal-muted)' }}>
                      Authoritative Fastway tracking format: <strong>FW-XXXXXX</strong> (e.g. FW-557612)
                    </span>
                  </form>
                ) : (
                  /* METHOD 2: Upload Fastway Receipt */
                  <div>
                    <input
                      id="receipt-file-input"
                      type="file"
                      accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      disabled={isProcessingReceipt || isLoading}
                    />

                    <div
                      id="receipt-dropzone"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => {
                        if (!isProcessingReceipt && !isLoading) {
                          document.getElementById('receipt-file-input')?.click();
                        }
                      }}
                      style={{
                        border: isDragOver
                          ? '2px dashed var(--color-orange)'
                          : '2px dashed var(--border-medium)',
                        backgroundColor: isDragOver
                          ? 'rgba(242, 107, 33, 0.05)'
                          : 'var(--color-warm-white)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-6) var(--space-4)',
                        textAlign: 'center',
                        cursor: isProcessingReceipt || isLoading ? 'not-allowed' : 'pointer',
                        transition: 'all var(--transition-fast)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                      }}
                    >
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(242, 107, 33, 0.12)',
                          color: 'var(--color-orange)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 'var(--space-1)',
                        }}
                      >
                        <UploadCloud size={24} />
                      </div>

                      <strong style={{ color: 'var(--color-navy)', fontSize: '1.05rem' }}>
                        Upload Fastway Receipt
                      </strong>

                      <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.85rem', margin: 0, maxWidth: '420px' }}>
                        Drag and drop your official Fastway consignment receipt here, or click to browse
                      </p>

                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          backgroundColor: 'rgba(5, 19, 32, 0.05)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          color: 'var(--color-charcoal-light)',
                          marginTop: 'var(--space-1)',
                        }}
                      >
                        <FileText size={12} />
                        <span>PDF & PNG receipts supported</span>
                      </div>
                    </div>

                    <p style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.8rem', marginTop: 'var(--space-3)', marginBottom: 0, textAlign: 'center' }}>
                      Upload your Fastway consignment receipt and we will identify the tracking reference for you.
                    </p>

                    {receiptError && (
                      <div
                        id="receipt-error-message"
                        style={{
                          marginTop: 'var(--space-3)',
                          padding: 'var(--space-3)',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: '#FEE2E2',
                          color: '#B91C1C',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <AlertCircle size={16} style={{ flexShrink: 0 }} />
                        <span>{receiptError}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Tracking Results & Information Section (Compact & Purposeful) */}
      <section
        style={{
          padding: 'var(--space-8) 0 var(--space-12)',
          backgroundColor: 'var(--color-warm-white)',
        }}
      >
        <Container size="md">
          {/* Loading State with reactive message */}
          {(isLoading || isProcessingReceipt) && (
            <div style={{ margin: 'var(--space-4) 0' }}>
              <LoadingState message={loadingMessage} />
            </div>
          )}

          {/* Error State */}
          {!isLoading && !isProcessingReceipt && errorMessage && (
            <ErrorState
              title="Shipment Not Found"
              message={errorMessage}
              onRetry={() => performLookup(trackingNumber, activeMethod === 'receipt' ? 'receipt' : 'manual')}
            />
          )}

          {/* Shipment Results Timeline View */}
          {!isLoading && !isProcessingReceipt && shipment && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {/* Summary Card */}
              <Card variant="white" elevation="medium">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 'var(--space-3)',
                    borderBottom: '1px solid var(--border-light)',
                    paddingBottom: 'var(--space-4)',
                    marginBottom: 'var(--space-5)',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Tracking Reference
                    </span>
                    <h2 style={{ fontSize: '1.6rem', color: 'var(--color-navy)', fontFamily: 'var(--font-display)' }}>
                      {shipment.trackingNumber}
                    </h2>
                  </div>
                  <Badge status={shipment.status} size="md" />
                </div>

                {/* Logistics Route Overview */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--space-4)',
                    backgroundColor: 'var(--color-warm-white)',
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-6)',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>Origin</span>
                    <p style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '0.95rem' }}>
                      {shipment.originHub}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>Destination</span>
                    <p style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '0.95rem' }}>
                      {shipment.destinationHub}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>Service Category</span>
                    <p style={{ fontWeight: 600, color: 'var(--color-blue)', fontSize: '0.95rem', textTransform: 'capitalize' }}>
                      {shipment.serviceType} Transit
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>Shipment Status</span>
                    <p style={{ fontWeight: 600, color: 'var(--color-orange)', fontSize: '0.95rem', textTransform: 'capitalize' }}>
                      {shipment.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                {/* Cargo Details */}
                <div style={{ marginBottom: 'var(--space-6)', fontSize: '0.9rem' }}>
                  <h4 style={{ color: 'var(--color-navy)', marginBottom: 'var(--space-1)' }}>Consignment Overview</h4>
                  <p style={{ color: 'var(--color-charcoal)' }}>
                    {shipment.packageDetails.description} ({shipment.packageDetails.weightKg} kg, {shipment.packageDetails.quantity} piece)
                  </p>
                </div>

                {/* Checkpoint Timeline */}
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)', marginBottom: 'var(--space-5)' }}>
                    Transit Milestones & Custody History
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {shipment.events.map((evt, idx) => (
                      <div
                        key={evt.id}
                        style={{
                          display: 'flex',
                          gap: 'var(--space-4)',
                          position: 'relative',
                        }}
                      >
                        {/* Milestone Node */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: idx === 0 ? 'var(--color-blue)' : 'var(--color-navy)',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 1,
                            }}
                          >
                            <CheckCircle2 size={16} />
                          </div>
                          {idx < shipment.events.length - 1 && (
                            <div
                              style={{
                                width: '2px',
                                flex: 1,
                                backgroundColor: 'var(--border-medium)',
                                margin: '4px 0',
                              }}
                            />
                          )}
                        </div>

                        {/* Milestone Details */}
                        <div
                          style={{
                            backgroundColor: 'var(--color-warm-white)',
                            padding: 'var(--space-3) var(--space-4)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-light)',
                            flex: 1,
                            marginBottom: 'var(--space-2)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              marginBottom: 'var(--space-1)',
                            }}
                          >
                            <h4 style={{ fontSize: '1rem', color: 'var(--color-navy)' }}>
                              {evt.title}
                            </h4>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>
                              {new Date(evt.timestamp).toLocaleString('en-US', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-light)', marginBottom: 'var(--space-2)' }}>
                            {evt.description}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>
                            <MapPin size={13} color="var(--color-orange)" />
                            <span>{evt.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <div style={{ textAlign: 'center' }}>
                <Button
                  variant="outline"
                  onClick={() => onNavigate('send-package')}
                  rightIcon={<ArrowRight size={14} />}
                >
                  Send Another Package
                </Button>
              </div>
            </div>
          )}

          {/* Initial State: Clean, compact features without ANY empty void */}
          {!isLoading && !isProcessingReceipt && !hasSearched && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 'var(--space-4)',
              }}
            >
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: 'var(--space-5)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-blue)', fontWeight: 700, fontSize: '0.95rem' }}>
                  <Globe size={18} />
                  <span>Real-Time Checkpoints</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-charcoal-muted)', lineHeight: 1.5 }}>
                  Receive continuous status updates as your consignment clears sorting hubs and international air corridors.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: 'var(--space-5)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-orange)', fontWeight: 700, fontSize: '0.95rem' }}>
                  <FileText size={18} />
                  <span>Digital Receipt Recognition</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-charcoal-muted)', lineHeight: 1.5 }}>
                  Upload your official Fastway digital receipt to automatically detect your consignment reference and track.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: 'var(--space-5)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-navy)', fontWeight: 700, fontSize: '0.95rem' }}>
                  <Shield size={18} />
                  <span>Verified Custody Chain</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-charcoal-muted)', lineHeight: 1.5 }}>
                  Every scan record is verified with certified timestamp, transport mode, and facility location logs.
                </p>
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
};
