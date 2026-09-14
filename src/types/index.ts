/**
 * Data Model Foundation (Application & Firestore Contracts)
 * Connected to Firebase project: Delivery (delivery-67506)
 */

export type ShipmentStatus =
  | 'created'
  | 'registered'
  | 'processing'
  | 'dispatched'
  | 'picked_up'
  | 'in_transit'
  | 'at_facility'
  | 'out_for_delivery'
  | 'delivered'
  | 'delayed'
  | 'cancelled'
  | 'exception';

export type ServiceType =
  | 'express-parcel'
  | 'air-freight'
  | 'road-freight'
  | 'ocean-freight'
  | 'supply-chain'
  | 'standard'
  | 'express';

export type PaymentStatus =
  | 'paid'
  | 'partially_paid'
  | 'unpaid';

export interface AddressInfo {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  landmark?: string;
}

export interface ContactPerson {
  name: string;
  phone: string;
  email?: string;
  address: AddressInfo;
}

export interface PackageSpecs {
  description: string;
  category: 'documents' | 'parcel' | 'fragile' | 'perishable' | 'heavy_cargo' | 'general' | 'commercial' | 'electronics';
  weightKg: number;
  dimensionsCm?: {
    length: number;
    width: number;
    height: number;
  };
  quantity: number;
  declaredValue?: number;
  specialInstructions?: string;
}

export interface TrackingEvent {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  title: string;
  description: string;
  location: string;
  timestamp: string; // ISO-8601 string or display string
  createdBy?: string;
  updatedBy?: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  sender: ContactPerson;
  receiver: ContactPerson;
  packageDetails: PackageSpecs;
  serviceType: ServiceType;
  status: ShipmentStatus;
  events: TrackingEvent[];
  originHub: string;
  destinationHub: string;
  currentLocation?: string;
  assignedTransportMode?: string;
  estimatedDeliveryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  cost?: number; // Logistics charge
  handlingFees?: number;
  totalAmount?: number;
  amountPaid?: number;
  balanceDue?: number;
  paymentStatus: PaymentStatus;
  assignedDriverId?: string;
  assignedDriverName?: string;
}

export interface BookingRequest {
  id: string;
  sender: ContactPerson;
  receiver: ContactPerson;
  pickupSchedule?: string;
  deliveryInstructions?: string;
  packageDetails: PackageSpecs;
  serviceType: string;
  status: 'pending' | 'reviewed' | 'converted' | 'cancelled';
  createdAt: string;
}

export type AdminRole =
  | 'super_admin'
  | 'admin'
  | 'logistics_manager'
  | 'dispatcher'
  | 'staff'
  | 'driver'
  | 'support_agent';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: AdminRole;
  assignedHub?: string;
  isActive: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  address: AddressInfo;
  associatedShipmentIds: string[];
  createdAt: string;
}

export interface ServiceOffering {
  id: string;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  speed: string;
  suitableFor: string;
}

export interface LogisticsHub {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  isMainHub: boolean;
}

export interface WebsiteContent {
  companyName: string;
  tagline: string;
  supportPhone: string;
  supportEmail: string;
  headquarters: string;
  hubs: LogisticsHub[];
  services: ServiceOffering[];
}
