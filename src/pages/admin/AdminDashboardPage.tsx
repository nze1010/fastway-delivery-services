import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Badge } from '../../components/ui/Badge';
import {
  firebaseShipmentService,
  type CreateShipmentInput,
} from '../../services/firebase/shipmentService';
import { bookingService } from '../../services/firebase/bookingService';
import { authService } from '../../services/firebase/authService';
import type { Shipment, ShipmentStatus, BookingRequest, AdminUser } from '../../types';
import {
  Package,
  Plus,
  LogOut,
  Search,
  ExternalLink,
  RefreshCw,
  MapPin,
  Clock,
  Trash2,
  X,
  Send,
  Truck,
  Inbox,
  Printer,
} from 'lucide-react';
import { ShipmentReceipt } from '../../components/admin/ShipmentReceipt';

export interface AdminDashboardPageProps {
  onNavigateHome: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigateHome }) => {
  const { profile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'shipments' | 'inquiries' | 'dispatch'>('shipments');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [inquiries, setInquiries] = useState<BookingRequest[]>([]);
  const [drivers, setDrivers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [receiptShipment, setReceiptShipment] = useState<Shipment | null>(null);
  
  const [assignForm, setAssignForm] = useState({ driverId: '' });

  // New Consignment Form State
  const [createForm, setCreateForm] = useState<CreateShipmentInput>({
    serviceType: 'express-parcel',
    sender: {
      name: '',
      phone: '',
      email: '',
      address: { street: '', city: '', state: '', country: 'Global' },
    },
    receiver: {
      name: '',
      phone: '',
      email: '',
      address: { street: '', city: '', state: '', country: 'Global' },
    },
    packageDetails: {
      description: '',
      category: 'parcel',
      weightKg: 2.5,
      quantity: 1,
    },
    originHub: 'Central International Gateway',
    destinationHub: 'Regional Sorting Facility',
    assignedTransportMode: 'Air Cargo Express',
    notes: '',
    cost: 0,
    handlingFees: 0,
    totalAmount: 0,
    amountPaid: 0,
    balanceDue: 0,
    paymentStatus: 'unpaid',
  });

  const updateFinancials = (updates: Partial<CreateShipmentInput>) => {
    setCreateForm((prev) => {
      const next = { ...prev, ...updates };
      const cost = next.cost || 0;
      const handling = next.handlingFees || 0;
      const total = cost + handling;
      let paid = next.amountPaid || 0;
      if (paid > total) paid = total; // Prevent overpayment
      if (paid < 0) paid = 0;
      
      const balance = total - paid;
      
      let status: Shipment['paymentStatus'] = 'unpaid';
      if (paid > 0 && paid < total) status = 'partially_paid';
      if (paid >= total && total > 0) status = 'paid';
      if (total === 0 && paid === 0) status = 'paid';

      return {
        ...next,
        cost,
        handlingFees: handling,
        totalAmount: total,
        amountPaid: paid,
        balanceDue: balance,
        paymentStatus: status,
      };
    });
  };

  // Milestone Event Form State
  const [milestoneForm, setMilestoneForm] = useState({
    status: 'in_transit' as ShipmentStatus,
    title: 'In Transit — En Route to Destination Hub',
    description: 'Consignment departed facility and is moving along primary transport corridor.',
    location: 'Central Freight Terminal',
  });

  const [isSaving, setIsSaving] = useState(false);

  // Load shipments and inquiries
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [shipmentsData, inquiriesData, driversData] = await Promise.all([
        firebaseShipmentService.getShipmentsList(100),
        bookingService.getBookingRequests(50),
        authService.getDriversList(),
      ]);
      setShipments(shipmentsData);
      setInquiries(inquiriesData);
      setDrivers(driversData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered shipments
  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.receiver.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Create Consignment
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const newShipment = await firebaseShipmentService.createShipment(createForm);
      setIsCreateModalOpen(false);
      setReceiptShipment(newShipment);
      await loadData();
    } catch (err) {
      console.error('Error creating consignment:', err);
      alert('Could not create consignment. Check permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Add Milestone Event
  const handleMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;
    setIsSaving(true);
    try {
      await firebaseShipmentService.addTrackingEvent(selectedShipment.id, {
        status: milestoneForm.status,
        title: milestoneForm.title,
        description: milestoneForm.description,
        location: milestoneForm.location,
        createdBy: profile?.email || 'Fastway Dispatcher',
      });
      setIsMilestoneModalOpen(false);
      await loadData();
    } catch (err) {
      console.error('Error adding milestone:', err);
      alert('Could not record milestone event.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Assign Driver
  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment || !assignForm.driverId) return;
    setIsSaving(true);
    try {
      const selectedDriver = drivers.find((d) => d.uid === assignForm.driverId);
      if (selectedDriver && profile) {
        await firebaseShipmentService.assignShipmentToDriver(
          selectedShipment.id,
          selectedDriver.uid,
          selectedDriver.displayName,
          profile.uid
        );
        setIsAssignModalOpen(false);
        await loadData();
      }
    } catch (err) {
      console.error('Error assigning driver:', err);
      alert('Could not assign driver.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete Consignment
  const handleDeleteShipment = async (shipmentId: string, trackingNum: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete consignment ${trackingNum}?`)) {
      return;
    }
    try {
      await firebaseShipmentService.deleteShipment(shipmentId);
      await loadData();
    } catch (err) {
      console.error('Error deleting shipment:', err);
      alert('Failed to delete consignment.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-warm-white)' }}>
      {/* Top Admin Header */}
      <header
        style={{
          backgroundColor: 'var(--color-navy)',
          color: '#FFFFFF',
          padding: 'var(--space-3) var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          borderBottom: '2px solid var(--color-blue)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <BrandLogo variant="light" size="sm" />
          <span
            style={{
              backgroundColor: 'rgba(23, 105, 224, 0.25)',
              border: '1px solid rgba(23, 105, 224, 0.5)',
              color: 'var(--color-blue)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            Dispatch Operations
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ fontSize: '0.85rem', textAlign: 'right' }}>
            <strong style={{ display: 'block', color: '#FFFFFF' }}>{profile?.displayName || 'Administrator'}</strong>
            <span style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.78rem' }}>
              {profile?.email} ({profile?.role || 'admin'})
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            style={{ color: '#FFFFFF' }}
            rightIcon={<ExternalLink size={14} />}
            onClick={onNavigateHome}
          >
            Public Site
          </Button>

          <Button
            variant="outline"
            size="sm"
            style={{ color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.35)' }}
            leftIcon={<LogOut size={14} />}
            onClick={logout}
          >
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="site-container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-16)' }}>
        {/* KPI Overview Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-8)',
          }}
        >
          <div style={{ backgroundColor: '#FFFFFF', padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Consignments
            </span>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginTop: '4px' }}>{shipments.length}</h3>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              In Transit
            </span>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--color-blue)', marginTop: '4px' }}>
              {shipments.filter((s) => s.status === 'in_transit' || s.status === 'out_for_delivery').length}
            </h3>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Delivered
            </span>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--color-success)', marginTop: '4px' }}>
              {shipments.filter((s) => s.status === 'delivered').length}
            </h3>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Customer Intake Requests
            </span>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--color-orange)', marginTop: '4px' }}>{inquiries.length}</h3>
          </div>
        </div>

        {/* Tab Navigation & Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button
              variant={activeTab === 'shipments' ? 'primary' : 'ghost'}
              size="sm"
              leftIcon={<Package size={16} />}
              onClick={() => setActiveTab('shipments')}
            >
              Consignment Registry ({shipments.length})
            </Button>
            <Button
              variant={activeTab === 'inquiries' ? 'primary' : 'ghost'}
              size="sm"
              leftIcon={<Inbox size={16} />}
              onClick={() => setActiveTab('inquiries')}
            >
              Intake Booking Requests ({inquiries.length})
            </Button>
            <Button
              variant={activeTab === 'dispatch' ? 'primary' : 'ghost'}
              size="sm"
              leftIcon={<Truck size={16} />}
              onClick={() => setActiveTab('dispatch')}
            >
              Dispatch & Drivers
            </Button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw size={14} />}
              onClick={loadData}
              isLoading={isLoading}
            >
              Refresh
            </Button>
            <Button
              variant="orange"
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              New Consignment
            </Button>
          </div>
        </div>

        {/* SHIPMENTS TAB */}
        {activeTab === 'shipments' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            {/* Search and Filters Bar */}
            <div
              style={{
                padding: 'var(--space-4) var(--space-6)',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: '220px' }}>
                <Input
                  placeholder="Filter by tracking # or client name..."
                  leftIcon={<Search size={16} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div style={{ width: '180px' }}>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Statuses' },
                    { value: 'registered', label: 'Registered' },
                    { value: 'processing', label: 'Processing' },
                    { value: 'in_transit', label: 'In Transit' },
                    { value: 'at_facility', label: 'At Facility' },
                    { value: 'out_for_delivery', label: 'Out for Delivery' },
                    { value: 'delivered', label: 'Delivered' },
                  ]}
                />
              </div>
            </div>

            {/* Shipments Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-warm-white)', borderBottom: '1px solid var(--border-light)' }}>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-navy)', fontWeight: 700 }}>Tracking Reference</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-navy)', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-navy)', fontWeight: 700 }}>Sender / Consignor</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-navy)', fontWeight: 700 }}>Receiver / Consignee</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-navy)', fontWeight: 700 }}>Route / Gateway</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-navy)', fontWeight: 700 }}>Created</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', color: 'var(--color-navy)', fontWeight: 700 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShipments.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-charcoal-muted)' }}>
                        No consignments found in Firestore database. Click "+ New Consignment" to register the first shipment.
                      </td>
                    </tr>
                  ) : (
                    filteredShipments.map((s) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 700, color: 'var(--color-navy)', fontFamily: 'var(--font-display)' }}>
                          {s.trackingNumber}
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-charcoal-muted)', fontWeight: 400 }}>
                            {s.serviceType}
                          </span>
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                          <Badge status={s.status} size="sm" />
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                          <strong style={{ display: 'block', color: 'var(--color-navy)' }}>{s.sender.name}</strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-charcoal-muted)' }}>{s.sender.address.city}, {s.sender.address.country}</span>
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                          <strong style={{ display: 'block', color: 'var(--color-navy)' }}>{s.receiver.name}</strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-charcoal-muted)' }}>{s.receiver.address.city}, {s.receiver.address.country}</span>
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: '0.82rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} color="var(--color-blue)" /> {s.originHub}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-charcoal-muted)' }}>
                            → {s.destinationHub}
                          </div>
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>
                          {new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            {!s.assignedDriverId && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedShipment(s);
                                  setIsAssignModalOpen(true);
                                }}
                              >
                                Assign
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<Clock size={13} />}
                              onClick={() => {
                                setSelectedShipment(s);
                                setIsMilestoneModalOpen(true);
                              }}
                            >
                              Update
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<Printer size={13} />}
                              onClick={() => setReceiptShipment(s)}
                            >
                              Receipt
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              style={{ color: 'var(--color-danger)' }}
                              onClick={() => handleDeleteShipment(s.id, s.trackingNumber)}
                            >
                              <Trash2 size={15} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INTAKE INQUIRIES TAB */}
        {activeTab === 'inquiries' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)' }}>Customer Package Intake Queue</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
                Requests submitted by clients through the public Send Package interface.
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-warm-white)', borderBottom: '1px solid var(--border-light)' }}>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-navy)' }}>Sender Contact</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-navy)' }}>Recipient Contact</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-navy)' }}>Package Specs</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-navy)' }}>Service Tier</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-navy)' }}>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-charcoal-muted)' }}>
                        No intake requests received yet.
                      </td>
                    </tr>
                  ) : (
                    inquiries.map((req) => (
                      <tr key={req.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                          <strong>{req.sender.name}</strong>
                          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>
                            {req.sender.phone} • {req.sender.address.city}
                          </span>
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                          <strong>{req.receiver.name}</strong>
                          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>
                            {req.receiver.phone} • {req.receiver.address.city}
                          </span>
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: '0.85rem' }}>
                          {req.packageDetails.description} ({req.packageDetails.weightKg} kg)
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: '0.85rem' }}>
                          <span style={{ textTransform: 'capitalize' }}>{req.serviceType}</span>
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>
                          {new Date(req.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DISPATCH & DRIVERS TAB */}
        {activeTab === 'dispatch' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)' }}>Dispatch Operations</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
                  Manage operational drivers and active route assignments.
                </p>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-warm-white)', borderBottom: '1px solid var(--border-light)' }}>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-navy)' }}>Driver Name</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-navy)' }}>Contact Email</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-navy)' }}>Assigned Hub</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-navy)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-charcoal-muted)' }}>
                        No drivers registered in the system. Create a driver account to start dispatching.
                      </td>
                    </tr>
                  ) : (
                    drivers.map((drv) => (
                      <tr key={drv.uid} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: 'var(--space-3) var(--space-4)' }}><strong>{drv.displayName}</strong></td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{drv.email}</td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{drv.assignedHub || 'Field Operations'}</td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                          <Badge status={drv.isActive ? 'delivered' : 'exception'} size="sm">
                            {drv.isActive ? 'Active' : 'Suspended'}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ASSIGN DRIVER MODAL */}
      {isAssignModalOpen && selectedShipment && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(7, 26, 43, 0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
          }}
          role="dialog"
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '450px',
              width: '100%',
              padding: 'var(--space-6)',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setIsAssignModalOpen(false)}
              style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)', cursor: 'pointer', background: 'none', border: 'none' }}
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: 'var(--space-2)' }}>Assign Driver to Consignment</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal-muted)', marginBottom: 'var(--space-6)' }}>Tracking: <strong>{selectedShipment.trackingNumber}</strong></p>

            <form onSubmit={handleAssignSubmit}>
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <Select
                  label="Select Available Driver"
                  value={assignForm.driverId}
                  onChange={(e) => setAssignForm({ driverId: e.target.value })}
                  options={[
                    { value: '', label: '-- Select Driver --' },
                    ...drivers.map(d => ({ value: d.uid, label: `${d.displayName} (${d.assignedHub})` }))
                  ]}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                <Button variant="outline" type="button" onClick={() => setIsAssignModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={isSaving || !assignForm.driverId}>
                  {isSaving ? 'Assigning...' : 'Confirm Dispatch'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CONSIGNMENT MODAL */}
      {isCreateModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(7, 26, 43, 0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '720px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 'var(--space-8)',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setIsCreateModalOpen(false)}
              style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)', cursor: 'pointer' }}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', marginBottom: 'var(--space-4)' }}>
              Register New Official Consignment
            </h3>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {/* Service Tier */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                <Select
                  label="Logistics Service Category *"
                  value={createForm.serviceType}
                  onChange={(e) => setCreateForm({ ...createForm, serviceType: e.target.value as Shipment['serviceType'] })}
                  options={[
                    { value: 'express-parcel', label: 'Express Parcel Delivery' },
                    { value: 'air-freight', label: 'Air Freight & Cargo' },
                    { value: 'road-freight', label: 'Road Freight & Line Haul' },
                    { value: 'ocean-freight', label: 'Ocean Freight & Containers' },
                    { value: 'supply-chain', label: 'Supply Chain Solutions' },
                  ]}
                />
                <Input
                  label="Assigned Transport Mode"
                  placeholder="e.g. Priority Air Cargo / Line-Haul"
                  value={createForm.assignedTransportMode}
                  onChange={(e) => setCreateForm({ ...createForm, assignedTransportMode: e.target.value })}
                />
              </div>

              {/* Sender & Receiver Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                {/* Consignor */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--color-navy)' }}>Consignor (Sender)</h4>
                  <Input
                    label="Sender Full Name *"
                    required
                    value={createForm.sender.name}
                    onChange={(e) => setCreateForm({ ...createForm, sender: { ...createForm.sender, name: e.target.value } })}
                  />
                  <Input
                    label="Sender Phone *"
                    required
                    value={createForm.sender.phone}
                    onChange={(e) => setCreateForm({ ...createForm, sender: { ...createForm.sender, phone: e.target.value } })}
                  />
                  <Input
                    label="Origin City & Country *"
                    required
                    value={createForm.sender.address.city}
                    onChange={(e) => setCreateForm({ ...createForm, sender: { ...createForm.sender, address: { ...createForm.sender.address, city: e.target.value } } })}
                  />
                  <Input
                    label="Origin Dispatch Hub *"
                    required
                    value={createForm.originHub}
                    onChange={(e) => setCreateForm({ ...createForm, originHub: e.target.value })}
                  />
                </div>

                {/* Consignee */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--color-navy)' }}>Consignee (Receiver)</h4>
                  <Input
                    label="Receiver Full Name *"
                    required
                    value={createForm.receiver.name}
                    onChange={(e) => setCreateForm({ ...createForm, receiver: { ...createForm.receiver, name: e.target.value } })}
                  />
                  <Input
                    label="Receiver Phone *"
                    required
                    value={createForm.receiver.phone}
                    onChange={(e) => setCreateForm({ ...createForm, receiver: { ...createForm.receiver, phone: e.target.value } })}
                  />
                  <Input
                    label="Destination City & Country *"
                    required
                    value={createForm.receiver.address.city}
                    onChange={(e) => setCreateForm({ ...createForm, receiver: { ...createForm.receiver, address: { ...createForm.receiver.address, city: e.target.value } } })}
                  />
                  <Input
                    label="Destination Service Station *"
                    required
                    value={createForm.destinationHub}
                    onChange={(e) => setCreateForm({ ...createForm, destinationHub: e.target.value })}
                  />
                </div>
              </div>

              {/* Package Specs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
                <Input
                  label="Weight (kg) *"
                  type="number"
                  step="0.1"
                  required
                  value={createForm.packageDetails.weightKg}
                  onChange={(e) => setCreateForm({ ...createForm, packageDetails: { ...createForm.packageDetails, weightKg: parseFloat(e.target.value) || 1 } })}
                />
                <Input
                  label="Package Description *"
                  required
                  placeholder="e.g. Commercial Electronics, Documents"
                  value={createForm.packageDetails.description}
                  onChange={(e) => setCreateForm({ ...createForm, packageDetails: { ...createForm.packageDetails, description: e.target.value } })}
                />
                <Input
                  label="Est. Delivery Date"
                  type="date"
                  value={createForm.estimatedDeliveryDate}
                  onChange={(e) => setCreateForm({ ...createForm, estimatedDeliveryDate: e.target.value })}
                />
              </div>

              {/* Payment Information */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', backgroundColor: 'var(--color-warm-white)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--color-navy)', margin: 0 }}>Payment Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-4)' }}>
                  <Input
                    label="Logistics Charge ($)"
                    type="number"
                    min="0"
                    required
                    value={createForm.cost}
                    onChange={(e) => updateFinancials({ cost: parseFloat(e.target.value) || 0 })}
                  />
                  <Input
                    label="Handling & Fees ($)"
                    type="number"
                    min="0"
                    required
                    value={createForm.handlingFees}
                    onChange={(e) => updateFinancials({ handlingFees: parseFloat(e.target.value) || 0 })}
                  />
                  <Input
                    label="Amount Paid ($)"
                    type="number"
                    min="0"
                    required
                    value={createForm.amountPaid}
                    onChange={(e) => updateFinancials({ amountPaid: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2)', fontSize: '0.9rem', color: 'var(--color-charcoal)' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>Total Amount:</span> ${createForm.totalAmount?.toLocaleString()}
                  </div>
                  <div>
                    <span style={{ fontWeight: 600 }}>Balance Due:</span> ${createForm.balanceDue?.toLocaleString()}
                  </div>
                  <div>
                    <span style={{ fontWeight: 600 }}>Status:</span> <span style={{ textTransform: 'uppercase', color: createForm.paymentStatus === 'paid' ? 'var(--color-success)' : createForm.paymentStatus === 'unpaid' ? 'var(--color-danger)' : 'var(--color-orange)' }}>{createForm.paymentStatus?.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              <Textarea
                label="Internal Dispatch Notes"
                placeholder="Bonded security instructions, loading bay codes, priority routing..."
                value={createForm.notes}
                onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="orange" type="submit" isLoading={isSaving} rightIcon={<Send size={15} />}>
                  Register & Assign Tracking Reference
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD MILESTONE EVENT MODAL */}
      {isMilestoneModalOpen && selectedShipment && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(7, 26, 43, 0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '560px',
              width: '100%',
              padding: 'var(--space-8)',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setIsMilestoneModalOpen(false)}
              style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)', cursor: 'pointer' }}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', color: 'var(--color-navy)', marginBottom: 'var(--space-1)' }}>
              Add Checkpoint Scan Milestone
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)', display: 'block', marginBottom: 'var(--space-5)' }}>
              Consignment Reference: <strong>{selectedShipment.trackingNumber}</strong>
            </span>

            <form onSubmit={handleMilestoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <Select
                label="Updated Shipment Status *"
                value={milestoneForm.status}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, status: e.target.value as ShipmentStatus })}
                options={[
                  { value: 'registered', label: 'Shipment Registered' },
                  { value: 'processing', label: 'Processing at Facility' },
                  { value: 'picked_up', label: 'Cargo Picked Up' },
                  { value: 'in_transit', label: 'In Transit / En Route' },
                  { value: 'at_facility', label: 'Arrived at Sorting Hub' },
                  { value: 'out_for_delivery', label: 'Out for Final Delivery' },
                  { value: 'delivered', label: 'Successfully Delivered' },
                  { value: 'delayed', label: 'Transit Delayed' },
                ]}
              />

              <Input
                label="Milestone Event Title *"
                required
                placeholder="e.g. Scanned at Sorting Gateway"
                value={milestoneForm.title}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
              />

              <Input
                label="Checkpoint Scan Location *"
                required
                placeholder="e.g. International Cargo Depot"
                value={milestoneForm.location}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, location: e.target.value })}
              />

              <Textarea
                label="Milestone Description *"
                required
                placeholder="Describe milestone progress details..."
                value={milestoneForm.description}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                <Button variant="outline" type="button" onClick={() => setIsMilestoneModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" isLoading={isSaving} rightIcon={<Truck size={15} />}>
                  Append Milestone Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {receiptShipment && (
        <ShipmentReceipt
          shipment={receiptShipment}
          onClose={() => setReceiptShipment(null)}
        />
      )}
    </div>
  );
};
