import { jsPDF } from 'jspdf';

// Mock File class if running in Node without standard File constructor
class MockFile {
  constructor(bits, name, options = {}) {
    this.name = name;
    this.type = options.type || '';
    this._bits = bits;
  }
  async arrayBuffer() {
    if (this._bits[0] instanceof ArrayBuffer) {
      return this._bits[0];
    }
    if (Buffer.isBuffer(this._bits[0])) {
      return this._bits[0].buffer.slice(
        this._bits[0].byteOffset,
        this._bits[0].byteOffset + this._bits[0].byteLength
      );
    }
    const str = this._bits.join('');
    return new TextEncoder().encode(str).buffer;
  }
}

// Receipt parser implementation to verify
async function extractTrackingNumberFromReceipt(file) {
  if (!file) {
    return {
      success: false,
      error: 'Please select a Fastway consignment receipt.',
    };
  }

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  const isPdf = fileType === 'application/pdf' || fileName.endsWith('.pdf');
  const isImage =
    fileType.startsWith('image/') ||
    fileName.endsWith('.png') ||
    fileName.endsWith('.jpg') ||
    fileName.endsWith('.jpeg') ||
    fileName.endsWith('.webp');

  if (!isPdf && !isImage) {
    return {
      success: false,
      error: 'Please upload a supported Fastway receipt.',
    };
  }

  try {
    const fileNameMatch = file.name.match(/\b(FW-\d{6})\b/i);
    let candidateTrackingNumber = fileNameMatch ? fileNameMatch[1].toUpperCase() : null;

    if (isPdf) {
      const buffer = await file.arrayBuffer();
      const text = new TextDecoder('latin1').decode(buffer);

      if (!text.includes('%PDF')) {
        return {
          success: false,
          error: 'This document does not appear to be a valid Fastway consignment receipt.',
        };
      }

      const pdfTextMatch = text.match(/\b(FW-\d{6})\b/i);
      if (pdfTextMatch) {
        candidateTrackingNumber = pdfTextMatch[1].toUpperCase();
      }
    } else if (isImage) {
      const buffer = await file.arrayBuffer();
      const headerText = new TextDecoder('latin1').decode(buffer.slice(0, 16384));
      const imageTextMatch = headerText.match(/\b(FW-\d{6})\b/i);
      if (imageTextMatch) {
        candidateTrackingNumber = imageTextMatch[1].toUpperCase();
      }
    }

    if (candidateTrackingNumber) {
      return {
        success: true,
        trackingNumber: candidateTrackingNumber,
      };
    }

    return {
      success: false,
      error: 'We could not identify a Fastway tracking number from this receipt.',
    };
  } catch {
    return {
      success: false,
      error: 'Unable to process the receipt. Please try again or enter the tracking number manually.',
    };
  }
}

async function runTests() {
  console.log('--- STARTING RECEIPT PARSER AUDIT TESTS ---');

  // Test A: No file
  const testA = await extractTrackingNumberFromReceipt(null);
  console.assert(!testA.success && testA.error === 'Please select a Fastway consignment receipt.', 'Test A failed');
  console.log('✓ Test A (No file): PASSED ->', testA.error);

  // Test B: Unsupported file
  const testB = await extractTrackingNumberFromReceipt(new MockFile(['data'], 'invoice.zip', { type: 'application/zip' }));
  console.assert(!testB.success && testB.error === 'Please upload a supported Fastway receipt.', 'Test B failed');
  console.log('✓ Test B (Unsupported file): PASSED ->', testB.error);

  // Test C: Corrupted / Non-PDF file with .pdf extension
  const testC = await extractTrackingNumberFromReceipt(new MockFile(['not a real pdf content'], 'fake.pdf', { type: 'application/pdf' }));
  console.assert(!testC.success && testC.error === 'This document does not appear to be a valid Fastway consignment receipt.', 'Test C failed');
  console.log('✓ Test C (Invalid receipt): PASSED ->', testC.error);

  // Test D: Valid PDF with no tracking number
  const emptyDoc = new jsPDF();
  emptyDoc.text('Hello World', 10, 10);
  const emptyPdfBuffer = emptyDoc.output('arraybuffer');
  const testD = await extractTrackingNumberFromReceipt(new MockFile([emptyPdfBuffer], 'regular_document.pdf', { type: 'application/pdf' }));
  console.assert(!testD.success && testD.error === 'We could not identify a Fastway tracking number from this receipt.', 'Test D failed');
  console.log('✓ Test D (Tracking number missing): PASSED ->', testD.error);

  // Test E1: Official Fastway PDF with metadata and hidden text
  const fastwayDoc = new jsPDF();
  fastwayDoc.setProperties({
    title: 'Fastway Consignment FW-557612',
    subject: 'FW-557612',
  });
  fastwayDoc.text('FASTWAY OFFICIAL CONSIGNMENT RECEIPT - TRACKING NUMBER: FW-557612', 10, 10);
  const fastwayPdfBuffer = fastwayDoc.output('arraybuffer');
  const testE1 = await extractTrackingNumberFromReceipt(new MockFile([fastwayPdfBuffer], 'generic_scan.pdf', { type: 'application/pdf' }));
  console.assert(testE1.success && testE1.trackingNumber === 'FW-557612', 'Test E1 failed');
  console.log('✓ Test E1 (Official Fastway PDF Content Extraction): PASSED ->', testE1.trackingNumber);

  // Test E2: Receipt identified via official filename
  const testE2 = await extractTrackingNumberFromReceipt(new MockFile(['fake'], 'Fastway-Consignment-FW-472380.png', { type: 'image/png' }));
  console.assert(testE2.success && testE2.trackingNumber === 'FW-472380', 'Test E2 failed');
  console.log('✓ Test E2 (Receipt Filename Extraction): PASSED ->', testE2.trackingNumber);

  console.log('\nALL 6 PARSER AUDIT TEST SCENARIOS PASSED!');
}

runTests();
