import type { Shipment } from '../types';

/**
 * Clean Data Access Abstraction Interface
 * In Phase 3, a dedicated Firebase-backed service will implement this interface.
 */
export interface IShipmentService {
  getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment | null>;
  getRecentShipments(): Promise<Shipment[]>;
}

/**
 * Isolated development mock data for interface testing and preview.
 * Neutral international transit routes.
 */
const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: 'shp_001',
    trackingNumber: 'FW-849201',
    sender: {
      name: 'Global Enterprise Supplies',
      phone: '+1 (800) 555-0192',
      address: {
        street: '100 Gateway Boulevard',
        city: 'International Trade Zone',
        state: 'Logistics Terminal',
        country: 'Global',
      },
    },
    receiver: {
      name: 'Metro Commercial Distribution',
      phone: '+1 (800) 555-0481',
      address: {
        street: '450 Commercial Way',
        city: 'Metropolitan Area',
        state: 'Delivery District',
        country: 'Global',
      },
    },
    packageDetails: {
      description: 'Commercial Electronics & Components',
      category: 'general',
      weightKg: 14.2,
      dimensionsCm: { length: 45, width: 35, height: 25 },
      quantity: 2,
    },
    serviceType: 'express',
    status: 'in_transit',
    originHub: 'International Air Gateway',
    destinationHub: 'Regional Distribution Center',
    createdAt: '2026-09-13T08:30:00Z',
    updatedAt: '2026-09-13T20:15:00Z',
    cost: 0,
    paymentStatus: 'paid',
    events: [
      {
        id: 'evt_001',
        shipmentId: 'shp_001',
        status: 'registered',
        title: 'Shipment Manifest Created',
        description: 'Consignment documentation verified and tracking reference assigned.',
        location: 'Central Freight Terminal',
        timestamp: '2026-09-13T08:30:00Z',
      },
      {
        id: 'evt_002',
        shipmentId: 'shp_001',
        status: 'processing',
        title: 'Sorted & Cleared for Dispatch',
        description: 'Barcode scan completed and containerized for outbound transit.',
        location: 'Air Cargo Sorting Gateway',
        timestamp: '2026-09-13T12:15:00Z',
      },
      {
        id: 'evt_003',
        shipmentId: 'shp_001',
        status: 'in_transit',
        title: 'In Transit — En Route to Destination Hub',
        description: 'Cargo dispatched on scheduled transport line.',
        location: 'Transit Corridor Network',
        timestamp: '2026-09-13T18:40:00Z',
      },
    ],
  },
  {
    id: 'shp_002',
    trackingNumber: 'FW-104928',
    sender: {
      name: 'Pacific Trading Corp',
      phone: '+1 (800) 555-0832',
      address: {
        street: '12 Harbor Drive',
        city: 'Ocean Terminal',
        state: 'Maritime Bay',
        country: 'Global',
      },
    },
    receiver: {
      name: 'Apex Retail Fulfillment',
      phone: '+1 (800) 555-0912',
      address: {
        street: '88 Market Avenue',
        city: 'Central City',
        state: 'Retail Hub',
        country: 'Global',
      },
    },
    packageDetails: {
      description: 'Medical Laboratory Diagnostic Supplies',
      category: 'parcel',
      weightKg: 3.5,
      quantity: 1,
    },
    serviceType: 'standard',
    status: 'delivered',
    originHub: 'Maritime Cargo Depot',
    destinationHub: 'Central City Service Station',
    createdAt: '2026-09-10T10:00:00Z',
    updatedAt: '2026-09-12T15:40:00Z',
    cost: 0,
    paymentStatus: 'paid',
    events: [
      {
        id: 'evt_201',
        shipmentId: 'shp_002',
        status: 'registered',
        title: 'Shipment Received at Station',
        description: 'Consignment booked and weighed.',
        location: 'Maritime Logistics Desk',
        timestamp: '2026-09-10T10:00:00Z',
      },
      {
        id: 'evt_202',
        shipmentId: 'shp_002',
        status: 'dispatched',
        title: 'Departed Regional Gateway',
        description: 'Loaded on scheduled line-haul vehicle.',
        location: 'Maritime Terminal Hub',
        timestamp: '2026-09-11T09:00:00Z',
      },
      {
        id: 'evt_203',
        shipmentId: 'shp_002',
        status: 'out_for_delivery',
        title: 'Out for Final Delivery',
        description: 'Courier assigned for doorstep handover.',
        location: 'Central City Delivery Depot',
        timestamp: '2026-09-12T10:15:00Z',
      },
      {
        id: 'evt_204',
        shipmentId: 'shp_002',
        status: 'delivered',
        title: 'Delivered & Signed',
        description: 'Successfully received and verified by consignee.',
        location: '88 Market Avenue',
        timestamp: '2026-09-12T15:40:00Z',
      },
    ],
  },
];

export class MockShipmentService implements IShipmentService {
  private shipments: Shipment[] = [...MOCK_SHIPMENTS];

  async getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment | null> {
    await new Promise((res) => setTimeout(res, 180));
    const normalized = trackingNumber.trim().toUpperCase();
    const found = this.shipments.find(
      (s) => s.trackingNumber.toUpperCase() === normalized || s.id.toUpperCase() === normalized
    );
    return found ? { ...found } : null;
  }

  async getRecentShipments(): Promise<Shipment[]> {
    await new Promise((res) => setTimeout(res, 120));
    return [...this.shipments];
  }
}

export const shipmentService: IShipmentService = new MockShipmentService();
