import React, { useRef, useState } from 'react';
import type { Shipment } from '../../types';
import { BrandLogo } from '../brand/BrandLogo';
import { Button } from '../ui/Button';
import { Download, X, QrCode, Plane, MapPin, Truck, CheckCircle2, Shield, Calendar, Map, Phone, Package, Info, Printer, ExternalLink, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './ShipmentReceipt.css';

interface ShipmentReceiptProps {
  shipment: Shipment;
  onClose: () => void;
}

export const ShipmentReceipt: React.FC<ShipmentReceiptProps> = ({ shipment, onClose }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  const generateReceiptPDF = async (): Promise<{ pdf: jsPDF; pdfBlob: Blob; fileName: string }> => {
    if (!receiptRef.current) throw new Error('Receipt element not found');

    // Temporarily add pdf-mode class for consistent high-res layout
    receiptRef.current.classList.add('pdf-mode');

    const canvas = await html2canvas(receiptRef.current, {
      scale: 2, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    receiptRef.current.classList.remove('pdf-mode');

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Set official metadata properties for reliable receipt parsing
    pdf.setProperties({
      title: `Fastway Consignment ${shipment.trackingNumber}`,
      subject: shipment.trackingNumber,
      author: 'Fastway Delivery Services',
      keywords: `fastway,consignment,tracking,${shipment.trackingNumber}`,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    // Add machine-readable text layer containing the official tracking number
    pdf.setFontSize(1);
    pdf.setTextColor(255, 255, 255);
    pdf.text(`FASTWAY OFFICIAL CONSIGNMENT RECEIPT - TRACKING NUMBER: ${shipment.trackingNumber}`, 10, 10);

    const pdfArrayBuffer = pdf.output('arraybuffer');
    const pdfBlob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
    const fileName = `Fastway-Consignment-${shipment.trackingNumber}.pdf`;

    return { pdf, pdfBlob, fileName };
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    setDownloadNotice(null);

    try {
      const { pdfBlob, fileName } = await generateReceiptPDF();

      // Priority 1: Native File System Access API
      // Supported in modern Chrome and Edge on Windows.
      // Opens the Windows native Save As dialog directly with suggestedName and PDF type,
      // guaranteeing it saves as a real .pdf file with proper Windows file association.
      if ('showSaveFilePicker' in window) {
        try {
          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: fileName,
            types: [
              {
                description: 'PDF Document (*.pdf)',
                accept: {
                  'application/pdf': ['.pdf'],
                },
              },
            ],
          });
          const writableStream = await fileHandle.createWritable();
          await writableStream.write(pdfBlob);
          await writableStream.close();

          setDownloadNotice({
            type: 'success',
            text: `Receipt successfully saved as ${fileName}. You can open it directly from your selected folder!`
          });
          setIsDownloading(false);
          return;
        } catch (pickerErr: any) {
          if (pickerErr.name === 'AbortError') {
            // User intentionally closed/cancelled the save dialog
            setIsDownloading(false);
            return;
          }
          console.warn('showSaveFilePicker error, falling back to standard download:', pickerErr);
        }
      }

      // Priority 2: Standard Anchor download with explicit Blob and extended URL lifetime
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = blobUrl;
      link.download = fileName;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      setDownloadNotice({
        type: 'success',
        text: `Receipt downloaded as ${fileName}. Look in your Downloads folder!`
      });

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 60000);

    } catch (err) {
      console.error('Failed to generate or download PDF:', err);
      setDownloadNotice({
        type: 'info',
        text: 'PDF download encountered an issue. You can click "View PDF" or "Print" to save it directly.'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleViewPDF = async () => {
    setIsViewing(true);
    setDownloadNotice(null);
    try {
      const { pdfBlob } = await generateReceiptPDF();
      const blobUrl = URL.createObjectURL(pdfBlob);
      const newWindow = window.open(blobUrl, '_blank');
      if (!newWindow) {
        setDownloadNotice({
          type: 'info',
          text: 'Pop-up blocked by browser. Please allow pop-ups or use the Download button.'
        });
      }
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 120000);
    } catch (err) {
      console.error('Failed to open PDF in new tab:', err);
      alert('Could not open PDF viewer.');
    } finally {
      setIsViewing(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadPNG = async () => {
    if (!receiptRef.current) return;
    setIsDownloadingImage(true);
    setDownloadNotice(null);

    try {
      receiptRef.current.classList.add('pdf-mode');
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      receiptRef.current.classList.remove('pdf-mode');

      const fileName = `Fastway-Consignment-${shipment.trackingNumber}.png`;

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsDownloadingImage(false);
          return;
        }

        if ('showSaveFilePicker' in window) {
          try {
            const handle = await (window as any).showSaveFilePicker({
              suggestedName: fileName,
              types: [
                {
                  description: 'PNG Image (*.png)',
                  accept: { 'image/png': ['.png'] },
                },
              ],
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
            setDownloadNotice({
              type: 'success',
              text: `Receipt image saved as ${fileName}!`
            });
            setIsDownloadingImage(false);
            return;
          } catch (e: any) {
            if (e.name === 'AbortError') {
              setIsDownloadingImage(false);
              return;
            }
          }
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        setDownloadNotice({
          type: 'success',
          text: `Receipt image downloaded as ${fileName}!`
        });

        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 60000);

        setIsDownloadingImage(false);
      }, 'image/png');

    } catch (err) {
      console.error('Failed to export PNG:', err);
      setIsDownloadingImage(false);
    }
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Safe defaults for newly added financial fields
  const cost = shipment.cost || 0;
  const handling = shipment.handlingFees || 0;
  const total = shipment.totalAmount !== undefined ? shipment.totalAmount : (cost + handling);
  const paid = shipment.amountPaid !== undefined ? shipment.amountPaid : (shipment.paymentStatus === 'paid' ? total : 0);
  const balance = shipment.balanceDue !== undefined ? shipment.balanceDue : (total - paid);
  const statusFormatted = shipment.paymentStatus.replace(/_/g, ' ');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        backgroundColor: 'rgba(5, 19, 32, 0.9)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
        overflowY: 'auto'
      }}
      role="dialog"
      aria-modal="true"
    >
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          maxHeight: '100%',
          width: '100%',
          maxWidth: '850px',
        }}
      >
        {/* Actions Bar */}
        <div className="receipt-actions-bar">
          <div className="receipt-badge-status">
            Consignment Ref: {shipment.trackingNumber}
          </div>

          <div className="receipt-actions-group">
            {/* 1. Download PDF (Primary) */}
            <Button 
              variant="orange" 
              size="sm"
              leftIcon={<Download size={16} />} 
              onClick={handleDownloadPDF}
              isLoading={isDownloading}
              style={{ fontWeight: 700 }}
              title="Download official PDF to your device"
            >
              {isDownloading ? 'Saving PDF...' : 'DOWNLOAD PDF'}
            </Button>

            {/* 2. Open / View in New Tab */}
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ExternalLink size={16} />}
              onClick={handleViewPDF}
              isLoading={isViewing}
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              title="View PDF receipt directly in a browser tab"
            >
              {isViewing ? 'Opening...' : 'VIEW PDF'}
            </Button>

            {/* 3. Print / Save as PDF */}
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Printer size={16} />}
              onClick={handlePrintReceipt}
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              title="Print receipt or save as PDF via browser print"
            >
              PRINT
            </Button>

            {/* 4. Download Image (PNG) */}
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ImageIcon size={16} />}
              onClick={handleDownloadPNG}
              isLoading={isDownloadingImage}
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              title="Download receipt as PNG image"
            >
              {isDownloadingImage ? 'Exporting...' : 'SAVE IMAGE'}
            </Button>

            {/* Close Modal Button */}
            <Button 
              variant="ghost" 
              size="sm"
              style={{ color: 'white', padding: '0.4rem', marginLeft: '0.25rem' }} 
              onClick={onClose} 
              aria-label="Close Receipt"
            >
              <X size={24} />
            </Button>
          </div>
        </div>

        {/* Feedback Notice Banner */}
        {downloadNotice && (
          <div className={`receipt-notice ${downloadNotice.type}`}>
            <CheckCircle2 size={16} />
            <span style={{ fontWeight: 500 }}>{downloadNotice.text}</span>
            <button onClick={() => setDownloadNotice(null)} className="notice-close" aria-label="Dismiss">✕</button>
          </div>
        )}

        {/* Printable/Downloadable Receipt Wrapper */}
        <div className="receipt-print-wrapper" style={{ overflowY: 'auto', flex: 1, borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <div className="receipt-container official-document" ref={receiptRef}>
            
            {/* Watermark Background */}
            <div className="receipt-watermark">
              <Shield size={400} />
            </div>

            {/* Official Header */}
            <div className="receipt-header-premium">
              <div className="header-brand-col">
                <BrandLogo variant="light" size="lg" />
                <p className="header-tagline">Reliable. Fast. Secure.</p>
              </div>
              <div className="header-doc-col">
                <div className="doc-type">OFFICIAL CONSIGNMENT RECEIPT</div>
                <div className="doc-id-box">
                  <span className="doc-id-label">CONSIGNMENT NO.</span>
                  <span className="doc-id-value">{shipment.trackingNumber}</span>
                </div>
              </div>
            </div>

            <div className="receipt-body-premium">
              {/* Top Meta Info */}
              <div className="meta-info-strip">
                <div className="meta-item">
                  <Calendar size={16} className="meta-icon" />
                  <div>
                    <div className="meta-label">Date</div>
                    <div className="meta-value">{formatDate(shipment.createdAt)}</div>
                  </div>
                </div>
                <div className="meta-item">
                  <Info size={16} className="meta-icon" />
                  <div>
                    <div className="meta-label">Time</div>
                    <div className="meta-value">{formatTime(shipment.createdAt)}</div>
                  </div>
                </div>
                <div className="meta-item">
                  <Package size={16} className="meta-icon" />
                  <div>
                    <div className="meta-label">Service Class</div>
                    <div className="meta-value" style={{ textTransform: 'uppercase' }}>{shipment.serviceType.replace('-', ' ')}</div>
                  </div>
                </div>
                <div className="meta-item">
                  <CheckCircle2 size={16} className="meta-icon" />
                  <div>
                    <div className="meta-label">Shipment Status</div>
                    <div className="meta-value status-badge">{shipment.status.replace(/_/g, ' ')}</div>
                  </div>
                </div>
              </div>

              {/* QR Code & Routing Summary */}
              <div className="routing-summary-box">
                <div className="routing-flow">
                  <div className="route-point origin">
                    <div className="point-icon"><MapPin size={18} /></div>
                    <div className="point-details">
                      <span className="point-label">ORIGIN</span>
                      <strong className="point-name">{shipment.originHub}</strong>
                      <span className="point-country">{shipment.sender.address.city}, {shipment.sender.address.country}</span>
                    </div>
                  </div>
                  <div className="route-connector">
                    <div className="connector-line"></div>
                    <div className="connector-icon">
                      {shipment.assignedTransportMode?.toLowerCase().includes('air') ? <Plane size={20} /> : <Truck size={20} />}
                    </div>
                    <div className="connector-line"></div>
                  </div>
                  <div className="route-point destination">
                    <div className="point-icon dest"><MapPin size={18} /></div>
                    <div className="point-details text-right">
                      <span className="point-label">DESTINATION</span>
                      <strong className="point-name">{shipment.destinationHub}</strong>
                      <span className="point-country">{shipment.receiver.address.city}, {shipment.receiver.address.country}</span>
                    </div>
                  </div>
                </div>
                <div className="qr-code-box">
                  <QrCode size={64} color="var(--color-navy)" />
                  <span className="qr-label">Scan to Track</span>
                </div>
              </div>

              {/* Parties (Sender / Receiver) */}
              <div className="parties-grid">
                <div className="party-card">
                  <div className="party-header">
                    <Shield size={16} /> CONSIGNOR (SENDER)
                  </div>
                  <div className="party-body">
                    <strong className="party-name">{shipment.sender.name}</strong>
                    <div className="party-contact"><Phone size={14} /> {shipment.sender.phone}</div>
                    {shipment.sender.email && <div className="party-contact">@ {shipment.sender.email}</div>}
                    <div className="party-address">
                      <Map size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>
                        {shipment.sender.address.street}<br/>
                        {shipment.sender.address.city}, {shipment.sender.address.state}<br/>
                        {shipment.sender.address.country}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="party-card">
                  <div className="party-header receiver">
                    <Package size={16} /> CONSIGNEE (RECEIVER)
                  </div>
                  <div className="party-body">
                    <strong className="party-name">{shipment.receiver.name}</strong>
                    <div className="party-contact"><Phone size={14} /> {shipment.receiver.phone}</div>
                    {shipment.receiver.email && <div className="party-contact">@ {shipment.receiver.email}</div>}
                    <div className="party-address">
                      <Map size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>
                        {shipment.receiver.address.street}<br/>
                        {shipment.receiver.address.city}, {shipment.receiver.address.state}<br/>
                        {shipment.receiver.address.country}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consignment Details */}
              <div className="section-title">
                <h4>CONSIGNMENT DETAILS</h4>
                <div className="title-line"></div>
              </div>
              
              <table className="details-table">
                <thead>
                  <tr>
                    <th>DESCRIPTION OF GOODS</th>
                    <th>CATEGORY</th>
                    <th className="text-center">QTY</th>
                    <th className="text-right">WEIGHT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>{shipment.packageDetails.description}</strong></td>
                    <td style={{ textTransform: 'capitalize' }}>{shipment.packageDetails.category.replace('_', ' ')}</td>
                    <td className="text-center">{shipment.packageDetails.quantity}</td>
                    <td className="text-right">{shipment.packageDetails.weightKg} kg</td>
                  </tr>
                </tbody>
              </table>

              <div className="extra-details-grid">
                {shipment.packageDetails.dimensionsCm && (
                  <div className="extra-item">
                    <span className="extra-label">Dimensions:</span>
                    <span className="extra-value">{shipment.packageDetails.dimensionsCm.length}x{shipment.packageDetails.dimensionsCm.width}x{shipment.packageDetails.dimensionsCm.height} cm</span>
                  </div>
                )}
                {shipment.assignedTransportMode && (
                  <div className="extra-item">
                    <span className="extra-label">Transport Mode:</span>
                    <span className="extra-value">{shipment.assignedTransportMode}</span>
                  </div>
                )}
                {shipment.estimatedDeliveryDate && (
                  <div className="extra-item">
                    <span className="extra-label">Est. Delivery:</span>
                    <span className="extra-value">{new Date(shipment.estimatedDeliveryDate).toLocaleDateString()}</span>
                  </div>
                )}
                {shipment.packageDetails.specialInstructions && (
                  <div className="extra-item full-width">
                    <span className="extra-label">Instructions:</span>
                    <span className="extra-value instructions">{shipment.packageDetails.specialInstructions}</span>
                  </div>
                )}
              </div>

              {/* Financial Section */}
              <div className="financial-section">
                <div className="financial-status-box">
                  <div className="status-label">PAYMENT STATUS</div>
                  <div className={`payment-stamp ${shipment.paymentStatus}`}>
                    {statusFormatted}
                  </div>
                </div>
                
                <div className="financial-summary-box">
                  <div className="summary-title">PAYMENT SUMMARY</div>
                  <div className="summary-row">
                    <span>Logistics Charge</span>
                    <span>{formatCurrency(cost)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Handling & Fees</span>
                    <span>{formatCurrency(handling)}</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total-row">
                    <span>Total Amount</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="summary-row highlight">
                    <span>Amount Paid</span>
                    <span>{formatCurrency(paid)}</span>
                  </div>
                  <div className="summary-row balance-row">
                    <span>Balance Due</span>
                    <span>{formatCurrency(balance)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Footer */}
            <div className="receipt-footer-premium">
              <div className="footer-official-statement">
                This is the official electronic consignment receipt of Fastway Delivery Services. Please retain this document for your records and use the consignment number <strong>{shipment.trackingNumber}</strong> for shipment tracking and customer support.
              </div>
              <div className="footer-contact-info">
                <span>Fastway Delivery Services Ltd.</span>
                <span>•</span>
                <span>support@fastway.com</span>
                <span>•</span>
                <span>+234 800 FASTWAY</span>
                <span>•</span>
                <span>www.fastway.com</span>
              </div>
              <div className="footer-legal">
                Document automatically generated on {new Date().toLocaleString()}. Subject to standard terms and conditions of carriage.
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
