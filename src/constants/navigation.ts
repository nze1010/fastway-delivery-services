export type PageRoute =
  | 'home'
  | 'services'
  | 'tracking'
  | 'send-package'
  | 'about'
  | 'contact'
  | 'admin'
  | 'admin/login'
  | 'driver';

export interface NavItem {
  id: PageRoute;
  label: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'tracking', label: 'Track Shipment' },
  { id: 'send-package', label: 'Send Package' },
  { id: 'about', label: 'About Us' },
  { id: 'contact', label: 'Contact' },
];

export interface FooterNavItem {
  label: string;
  route: PageRoute;
  targetId?: string;
}

export const FOOTER_NAV_SERVICES: FooterNavItem[] = [
  { label: 'Express Delivery', route: 'services' },
  { label: 'Freight & Cargo', route: 'services' },
  { label: 'Supply Chain', route: 'services' },
];

export const FOOTER_NAV_COMPANY: FooterNavItem[] = [
  { label: 'About Fastway', route: 'about' },
  { label: 'How It Works', route: 'home', targetId: 'how-it-works' },
  { label: 'Global Network', route: 'home', targetId: 'global-network' },
];

export const FOOTER_NAV_SUPPORT: FooterNavItem[] = [
  { label: 'Track Shipment', route: 'tracking' },
  { label: 'Send Package', route: 'send-package' },
  { label: 'Contact Support', route: 'contact' },
];

