import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebaseApp';
import type { Shipment, TrackingEvent, ShipmentStatus } from '../../types';

export interface CreateShipmentInput {
  serviceType: Shipment['serviceType'];
  sender: Shipment['sender'];
  receiver: Shipment['receiver'];
  packageDetails: Shipment['packageDetails'];
  originHub: string;
  destinationHub: string;
  estimatedDeliveryDate?: string;
  assignedTransportMode?: string;
  notes?: string;
  cost?: number;
  handlingFees?: number;
  totalAmount?: number;
  amountPaid?: number;
  balanceDue?: number;
  paymentStatus?: Shipment['paymentStatus'];
}

export interface AddTrackingEventInput {
  status: ShipmentStatus;
  title: string;
  description: string;
  location: string;
  timestamp?: string;
  createdBy?: string;
}

export class FirebaseShipmentService {
  private shipmentsCollection = collection(db, 'shipments');

  /**
   * Generates a clean, unique human-readable tracking number
   * Format: FW-XXXXXX (e.g., FW-849201)
   */
  generateTrackingNumber(): string {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `FW-${randomDigits}`;
  }

  /**
   * Search shipment by tracking reference number or document ID
   * Includes milestone events from subcollection
   */
  async getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment | null> {
    if (!trackingNumber || !trackingNumber.trim()) {
      return null;
    }

    const normalized = trackingNumber.trim().toUpperCase();

    // 1. Query by trackingNumber field
    const q = query(
      this.shipmentsCollection,
      where('trackingNumber', '==', normalized),
      limit(1)
    );
    const snap = await getDocs(q);

    let docSnap = snap.docs[0];

    // 2. If not found, check if input was the document ID
    if (!docSnap) {
      const directRef = doc(db, 'shipments', normalized);
      const directSnap = await getDoc(directRef);
      if (directSnap.exists()) {
        docSnap = directSnap;
      }
    }

    if (!docSnap) {
      return null;
    }

    const data = docSnap.data();
    const shipmentId = docSnap.id;

    // 3. Fetch subcollection tracking events
    const eventsRef = collection(db, 'shipments', shipmentId, 'trackingEvents');
    const eventsQuery = query(eventsRef, orderBy('timestamp', 'asc'));
    const eventsSnap = await getDocs(eventsQuery);

    const events: TrackingEvent[] = eventsSnap.docs.map((d) => {
      const evData = d.data();
      return {
        id: d.id,
        shipmentId,
        status: evData.status as ShipmentStatus,
        title: evData.title || '',
        description: evData.description || '',
        location: evData.location || '',
        timestamp: evData.timestamp || new Date().toISOString(),
        createdBy: evData.createdBy,
        updatedBy: evData.updatedBy,
      };
    });

    return {
      id: shipmentId,
      trackingNumber: data.trackingNumber || normalized,
      sender: data.sender || { name: '', phone: '', address: { street: '', city: '', state: '', country: '' } },
      receiver: data.receiver || { name: '', phone: '', address: { street: '', city: '', state: '', country: '' } },
      packageDetails: data.packageDetails || { description: '', category: 'general', weightKg: 1, quantity: 1 },
      serviceType: data.serviceType || 'express-parcel',
      status: data.status as ShipmentStatus,
      originHub: data.originHub || 'Central Transit Hub',
      destinationHub: data.destinationHub || 'Destination Service Station',
      currentLocation: data.currentLocation,
      assignedTransportMode: data.assignedTransportMode,
      estimatedDeliveryDate: data.estimatedDeliveryDate,
      notes: data.notes,
      cost: data.cost || 0,
      handlingFees: data.handlingFees || 0,
      totalAmount: data.totalAmount || 0,
      amountPaid: data.amountPaid || 0,
      balanceDue: data.balanceDue || 0,
      paymentStatus: data.paymentStatus || 'paid',
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      events,
    };
  }

  /**
   * Administrative listing of all shipments ordered by creation date
   */
  async getShipmentsList(limitCount = 60): Promise<Shipment[]> {
    const q = query(
      this.shipmentsCollection,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snap = await getDocs(q);
    return snap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        trackingNumber: data.trackingNumber || docSnap.id,
        sender: data.sender,
        receiver: data.receiver,
        packageDetails: data.packageDetails,
        serviceType: data.serviceType,
        status: data.status as ShipmentStatus,
        originHub: data.originHub,
        destinationHub: data.destinationHub,
        currentLocation: data.currentLocation,
        assignedTransportMode: data.assignedTransportMode,
        estimatedDeliveryDate: data.estimatedDeliveryDate,
        notes: data.notes,
        cost: data.cost,
        handlingFees: data.handlingFees,
        totalAmount: data.totalAmount,
        amountPaid: data.amountPaid,
        balanceDue: data.balanceDue,
        paymentStatus: data.paymentStatus || 'paid',
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
        events: [],
      };
    });
  }

  /**
   * Administrative creation of an authorized consignment
   * Sets up root shipment and initial milestone trackingEvent
   */
  async createShipment(input: CreateShipmentInput): Promise<Shipment> {
    const trackingNumber = this.generateTrackingNumber();
    const docRef = doc(this.shipmentsCollection);
    const shipmentId = docRef.id;
    const nowIso = new Date().toISOString();

    const shipmentData = {
      trackingNumber,
      sender: input.sender,
      receiver: input.receiver,
      packageDetails: input.packageDetails,
      serviceType: input.serviceType,
      status: 'registered' as ShipmentStatus,
      originHub: input.originHub,
      destinationHub: input.destinationHub,
      currentLocation: input.originHub,
      assignedTransportMode: input.assignedTransportMode || 'Air Cargo / Road Transit',
      estimatedDeliveryDate: input.estimatedDeliveryDate || '',
      notes: input.notes || '',
      cost: input.cost || 0,
      handlingFees: input.handlingFees || 0,
      totalAmount: input.totalAmount || 0,
      amountPaid: input.amountPaid || 0,
      balanceDue: input.balanceDue || 0,
      paymentStatus: input.paymentStatus || 'paid',
      createdAt: nowIso,
      updatedAt: nowIso,
      serverCreatedAt: serverTimestamp(),
      serverUpdatedAt: serverTimestamp(),
    };

    await setDoc(docRef, shipmentData);

    // Initial milestone event
    const initialEvent: TrackingEvent = {
      id: 'evt_init',
      shipmentId,
      status: 'registered',
      title: 'Shipment Manifest Created',
      description: 'Consignment documentation verified and unique tracking reference assigned into Fastway network.',
      location: input.originHub,
      timestamp: nowIso,
    };

    const initialEventRef = doc(collection(db, 'shipments', shipmentId, 'trackingEvents'));
    await setDoc(initialEventRef, {
      ...initialEvent,
      id: initialEventRef.id,
      serverTimestamp: serverTimestamp(),
    });

    return {
      ...shipmentData,
      id: shipmentId,
      events: [{ ...initialEvent, id: initialEventRef.id }],
    };
  }

  /**
   * Append milestone tracking event and update current status
   */
  async addTrackingEvent(shipmentId: string, eventInput: AddTrackingEventInput): Promise<TrackingEvent> {
    const nowIso = eventInput.timestamp || new Date().toISOString();
    const eventsCollection = collection(db, 'shipments', shipmentId, 'trackingEvents');
    const newEventDoc = doc(eventsCollection);

    const eventData: TrackingEvent = {
      id: newEventDoc.id,
      shipmentId,
      status: eventInput.status,
      title: eventInput.title,
      description: eventInput.description,
      location: eventInput.location,
      timestamp: nowIso,
      createdBy: eventInput.createdBy,
    };

    // Save event in subcollection
    await setDoc(newEventDoc, {
      ...eventData,
      serverTimestamp: serverTimestamp(),
    });

    // Update parent shipment document
    const shipmentRef = doc(db, 'shipments', shipmentId);
    await updateDoc(shipmentRef, {
      status: eventInput.status,
      currentLocation: eventInput.location,
      updatedAt: nowIso,
      serverUpdatedAt: serverTimestamp(),
    });

    return eventData;
  }

  /**
   * Administrative deletion of a consignment
   */
  async deleteShipment(shipmentId: string): Promise<void> {
    const shipmentRef = doc(db, 'shipments', shipmentId);
    await deleteDoc(shipmentRef);
  }

  /**
   * Assign a driver to a shipment (Phase 4)
   */
  async assignShipmentToDriver(
    shipmentId: string,
    driverId: string,
    driverName: string,
    dispatcherId: string
  ): Promise<void> {
    const shipmentRef = doc(db, 'shipments', shipmentId);
    
    // Update shipment with assignment
    await updateDoc(shipmentRef, {
      assignedDriverId: driverId,
      assignedDriverName: driverName,
      status: 'dispatched',
      updatedAt: new Date().toISOString(),
      serverUpdatedAt: serverTimestamp(),
    });

    // Create an internal milestone tracking event
    await this.addTrackingEvent(shipmentId, {
      status: 'dispatched',
      title: 'Consignment Assigned to Driver',
      description: `Assigned to operations driver: ${driverName}`,
      location: 'Dispatch Control Center',
      createdBy: dispatcherId,
    });
  }

  /**
   * Retrieve shipments assigned to a specific driver
   */
  async getDriverAssignments(driverId: string): Promise<Shipment[]> {
    const q = query(
      this.shipmentsCollection,
      where('assignedDriverId', '==', driverId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        trackingNumber: data.trackingNumber || docSnap.id,
        sender: data.sender,
        receiver: data.receiver,
        packageDetails: data.packageDetails,
        serviceType: data.serviceType,
        status: data.status as ShipmentStatus,
        originHub: data.originHub,
        destinationHub: data.destinationHub,
        currentLocation: data.currentLocation,
        assignedTransportMode: data.assignedTransportMode,
        estimatedDeliveryDate: data.estimatedDeliveryDate,
        notes: data.notes,
        cost: data.cost,
        handlingFees: data.handlingFees,
        totalAmount: data.totalAmount,
        amountPaid: data.amountPaid,
        balanceDue: data.balanceDue,
        paymentStatus: data.paymentStatus || 'paid',
        assignedDriverId: data.assignedDriverId,
        assignedDriverName: data.assignedDriverName,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
        events: [],
      };
    });
  }
}

export const firebaseShipmentService = new FirebaseShipmentService();
