import { collection, doc, setDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseApp';
import type { BookingRequest, ContactPerson, PackageSpecs } from '../../types';

export interface SubmitBookingInput {
  sender: ContactPerson;
  receiver: ContactPerson;
  pickupSchedule?: string;
  deliveryInstructions?: string;
  packageDetails: PackageSpecs;
  serviceType: string;
}

export class FirebaseBookingService {
  private requestsCollection = collection(db, 'bookingRequests');

  /**
   * Submit customer booking inquiry (Public intake queue)
   */
  async submitBookingRequest(input: SubmitBookingInput): Promise<{ id: string; referenceNumber: string }> {
    const docRef = doc(this.requestsCollection);
    const requestId = docRef.id;
    const refCode = `REQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowIso = new Date().toISOString();

    const bookingData = {
      referenceNumber: refCode,
      sender: input.sender,
      receiver: input.receiver,
      pickupSchedule: input.pickupSchedule || '',
      deliveryInstructions: input.deliveryInstructions || '',
      packageDetails: input.packageDetails,
      serviceType: input.serviceType,
      status: 'pending',
      createdAt: nowIso,
      serverCreatedAt: serverTimestamp(),
    };

    await setDoc(docRef, bookingData);

    return { id: requestId, referenceNumber: refCode };
  }

  /**
   * Administrative listing of booking requests
   */
  async getBookingRequests(limitCount = 50): Promise<BookingRequest[]> {
    const q = query(this.requestsCollection, orderBy('createdAt', 'desc'), limit(limitCount));
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        sender: data.sender,
        receiver: data.receiver,
        pickupSchedule: data.pickupSchedule,
        deliveryInstructions: data.deliveryInstructions,
        packageDetails: data.packageDetails,
        serviceType: data.serviceType,
        status: data.status || 'pending',
        createdAt: data.createdAt || new Date().toISOString(),
      };
    });
  }
}

export const bookingService = new FirebaseBookingService();
