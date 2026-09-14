/**
 * Utility to extract Fastway tracking numbers from uploaded official receipts (PDF or PNG/JPG)
 */

export interface ReceiptParseResult {
  success: boolean;
  trackingNumber?: string;
  error?: string;
}

export async function extractTrackingNumberFromReceipt(file: File): Promise<ReceiptParseResult> {
  if (!file) {
    return {
      success: false,
      error: 'Please select a Fastway consignment receipt.',
    };
  }

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  // Validate supported file format (PDF, PNG, JPEG, WebP)
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
    // 1. Check for official tracking number format in filename (e.g. Fastway-Consignment-FW-557612.pdf)
    const fileNameMatch = file.name.match(/\b(FW-\d{6})\b/i);
    let candidateTrackingNumber = fileNameMatch ? fileNameMatch[1].toUpperCase() : null;

    // 2. Deep content inspection for PDF documents
    if (isPdf) {
      const buffer = await file.arrayBuffer();
      const text = new TextDecoder('latin1').decode(buffer);

      // Verify basic PDF structure
      if (!text.includes('%PDF')) {
        return {
          success: false,
          error: 'This document does not appear to be a valid Fastway consignment receipt.',
        };
      }

      // Look for FW-XXXXXX in PDF stream, metadata, or text layer
      // Matches /Subject (FW-XXXXXX), /Keywords (...,FW-XXXXXX), (FASTWAY ... FW-XXXXXX) Tj, etc.
      const pdfTextMatch = text.match(/\b(FW-\d{6})\b/i);
      if (pdfTextMatch) {
        candidateTrackingNumber = pdfTextMatch[1].toUpperCase();
      }
    } else if (isImage) {
      // For images, inspect metadata chunks or header text
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

    // If no tracking number could be extracted
    return {
      success: false,
      error: 'We could not identify a Fastway tracking number from this receipt.',
    };
  } catch (err) {
    console.error('Receipt parse error:', err);
    return {
      success: false,
      error: 'Unable to process the receipt. Please try again or enter the tracking number manually.',
    };
  }
}
