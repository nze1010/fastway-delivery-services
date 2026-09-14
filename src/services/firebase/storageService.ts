import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseApp';

export class FirebaseStorageService {
  /**
   * Check if Firebase Storage is active
   */
  isStorageAvailable(): boolean {
    return storage !== null;
  }

  /**
   * Upload consignment document or proof of delivery
   */
  async uploadShipmentDocument(shipmentId: string, file: File, documentType: string): Promise<string> {
    if (!storage) {
      throw new Error('Firebase Storage requires Blaze billing upgrade. Storage is currently unavailable.');
    }

    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `shipments/${shipmentId}/documents/${documentType}_${timestamp}_${cleanFileName}`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        shipmentId,
        documentType,
        uploadedAt: new Date().toISOString(),
      },
    });

    return await getDownloadURL(storageRef);
  }
}

export const storageService = new FirebaseStorageService();
