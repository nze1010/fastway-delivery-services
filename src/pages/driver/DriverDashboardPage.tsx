import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Input } from '../../components/ui/Input';
import { firebaseShipmentService } from '../../services/firebase/shipmentService';
import type { Shipment, ShipmentStatus } from '../../types';
import { Truck, MapPin, CheckCircle, Package, LogOut, Clock, ShieldCheck, X } from 'lucide-react';

export interface DriverDashboardPageProps {
  onNavigateHome: () => void;
}

export const DriverDashboardPage: React.FC<DriverDashboardPageProps> = ({ onNavigateHome }) => {
  const { user, profile, logout } = useAuth();
  const [assignments, setAssignments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Update Modal State
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    status: 'in_transit' as ShipmentStatus,
    location: '',
    description: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const loadAssignments = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await firebaseShipmentService.getDriverAssignments(user.uid);
      setAssignments(data);
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [user]);

  const handleOpenUpdateModal = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setUpdateForm({
      status: shipment.status,
      location: shipment.currentLocation || '',
      description: '',
    });
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setSelectedShipment(null);
    setIsUpdateModalOpen(false);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment || !user) return;
    
    setIsUpdating(true);
    try {
      await firebaseShipmentService.addTrackingEvent(selectedShipment.id, {
        status: updateForm.status,
        title: `Status Updated: ${updateForm.status.replace('_', ' ').toUpperCase()}`,
        description: updateForm.description || `Driver updated status to ${updateForm.status}.`,
        location: updateForm.location || 'In Transit',
        createdBy: user.uid,
      });
      await loadAssignments();
      handleCloseUpdateModal();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const activeAssignments = assignments.filter(s => s.status !== 'delivered' && s.status !== 'cancelled');
  const completedAssignments = assignments.filter(s => s.status === 'delivered');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F3F4F6' }}>
      {/* Top Header */}
      <header style={{ backgroundColor: 'var(--color-navy)', color: 'white', padding: 'var(--space-3) var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <BrandLogo variant="light" />
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: 'var(--space-4)', marginLeft: 'var(--space-2)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--color-orange)' }}>
              <Truck size={18} /> Driver Workspace
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{profile?.displayName || 'Driver'}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{profile?.assignedHub || 'Field Operations'}</div>
          </div>
          <Button variant="outline" size="sm" onClick={() => { logout(); onNavigateHome(); }} style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
            <LogOut size={16} /> Sign Out
          </Button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            My Active Route <span style={{ backgroundColor: 'var(--color-blue)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '1rem' }}>{activeAssignments.length}</span>
          </h1>
          <Button onClick={loadAssignments} variant="outline" size="sm"><Clock size={16} /> Refresh</Button>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>Loading assignments...</div>
        ) : activeAssignments.length === 0 ? (
          <div style={{ backgroundColor: 'white', padding: 'var(--space-8)', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
            <ShieldCheck size={48} color="var(--color-success)" style={{ margin: '0 auto var(--space-4)' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-2)' }}>You're all caught up!</h3>
            <p style={{ color: 'var(--color-gray-dark)' }}>No active deliveries assigned to you at the moment.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
            {activeAssignments.map(shipment => (
              <div key={shipment.id} style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-navy)' }}>{shipment.trackingNumber}</span>
                  <Badge status={shipment.status}>{shipment.status.replace('_', ' ').toUpperCase()}</Badge>
                </div>
                
                <div style={{ marginBottom: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <MapPin size={16} color="var(--color-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-dark)', textTransform: 'uppercase', fontWeight: 600 }}>Destination</div>
                      <div style={{ fontSize: '0.9rem' }}>{shipment.receiver.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-dark)' }}>{shipment.receiver.address.street}, {shipment.receiver.address.city}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-dark)' }}>{shipment.receiver.phone}</div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: 'var(--space-3)', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Package size={14} /> <strong>Package:</strong> {shipment.packageDetails.weightKg}kg ({shipment.packageDetails.category})
                  </div>
                  <div><strong>Notes:</strong> {shipment.notes || 'None'}</div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <Button fullWidth onClick={() => handleOpenUpdateModal(shipment)} variant="primary">
                    Update Status
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed Deliveries */}
        {completedAssignments.length > 0 && (
          <div style={{ marginTop: 'var(--space-8)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)', color: 'var(--color-gray-dark)' }}>Completed Deliveries</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {completedAssignments.map(shipment => (
                <div key={shipment.id} style={{ backgroundColor: 'white', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <CheckCircle size={20} color="var(--color-success)" />
                    <span style={{ fontWeight: 600 }}>{shipment.trackingNumber}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-dark)' }}>To: {shipment.receiver.name}</span>
                  </div>
                  <Badge status="delivered">Delivered</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Update Modal */}
      {isUpdateModalOpen && selectedShipment && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 'var(--space-4)' }}>
          <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '500px', overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Update Delivery Status</h3>
              <button onClick={handleCloseUpdateModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleUpdateStatus} style={{ padding: 'var(--space-4)' }}>
              <div style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3)', backgroundColor: '#EFF6FF', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>
                <strong>Tracking:</strong> {selectedShipment.trackingNumber}
              </div>

              <div style={{ marginBottom: 'var(--space-4)' }}>
                <Select
                  label="New Status"
                  value={updateForm.status}
                  onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value as ShipmentStatus })}
                  style={{ width: '100%' }}
                  options={[
                    { value: 'picked_up', label: 'Picked Up from Hub' },
                    { value: 'in_transit', label: 'In Transit (On Route)' },
                    { value: 'out_for_delivery', label: 'Out for Delivery (Approaching)' },
                    { value: 'delivered', label: 'Delivered Successfully' },
                    { value: 'exception', label: 'Delivery Exception / Issue' }
                  ]}
                />
              </div>

              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Current Location (Optional)</label>
                <Input
                  value={updateForm.location}
                  onChange={(e) => setUpdateForm({ ...updateForm, location: e.target.value })}
                  placeholder="e.g. Customer Address, Highway 10"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Notes / Narrative</label>
                <Textarea
                  value={updateForm.description}
                  onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                  placeholder={updateForm.status === 'delivered' ? "Left at front door. Signed by John." : "Add detail about this update"}
                  rows={3}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
                <Button type="button" variant="outline" onClick={handleCloseUpdateModal}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Confirm Update'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
