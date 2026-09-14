/**
 * FASTWAY DELIVERY SERVICES — BRAND DESIGN TOKENS
 * Strict visual system according to Master Blueprint
 */

export const BRAND_COLORS = {
  deepNavy: '#071A2B',
  primaryBlue: '#1769E0',
  logisticsOrange: '#F26B21',
  warmWhite: '#F7F8F6',
  charcoal: '#17212B',
} as const;

export const STATUS_CONFIG = {
  created: {
    label: 'Created',
    color: '#64748B',
    bgColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  registered: {
    label: 'Registered',
    color: '#0284C7',
    bgColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  processing: {
    label: 'Processing',
    color: '#D97706',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  dispatched: {
    label: 'Dispatched',
    color: '#1769E0',
    bgColor: '#EBF3FD',
    borderColor: '#BFDBFE',
  },
  picked_up: {
    label: 'Picked Up',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  in_transit: {
    label: 'In Transit',
    color: '#F26B21',
    bgColor: '#FEF3EC',
    borderColor: '#FED7AA',
  },
  at_facility: {
    label: 'At Facility',
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
  },
  delivered: {
    label: 'Delivered',
    color: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  delayed: {
    label: 'Delayed',
    color: '#EA580C',
    bgColor: '#FFF7ED',
    borderColor: '#FFEDD5',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  exception: {
    label: 'Exception / Issue',
    color: '#B91C1C',
    bgColor: '#FEF2F2',
    borderColor: '#F87171',
  },
} as const;
