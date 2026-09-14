import { useState, useEffect } from 'react';
import type { PageRoute } from './constants/navigation';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PublicLayout } from './layouts/PublicLayout';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { TrackingPage } from './pages/TrackingPage';
import { SendPackagePage } from './pages/SendPackagePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { DriverDashboardPage } from './pages/driver/DriverDashboardPage';

function AppContent() {
  const { user, isStaff, isDriver, isLoading } = useAuth();

  // Read initial route from URL hash
  const getInitialRoute = (): PageRoute => {
    const rawHash = window.location.hash.replace('#', '').toLowerCase();
    const validRoutes: PageRoute[] = [
      'home',
      'services',
      'tracking',
      'send-package',
      'about',
      'contact',
      'admin',
      'admin/login',
      'driver',
    ];
    return validRoutes.includes(rawHash as PageRoute) ? (rawHash as PageRoute) : 'home';
  };

  const [currentRoute, setCurrentRoute] = useState<PageRoute>(getInitialRoute);
  const [activeTrackingSearch, setActiveTrackingSearch] = useState<string>('');

  const handleNavigate = (route: PageRoute) => {
    setCurrentRoute(route);
    window.location.hash = route === 'home' ? '' : `#${route}`;
  };

  // Browser back/forward navigation support
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Quick tracking search handler
  const handleSearchTracking = (trackingNumber: string) => {
    setActiveTrackingSearch(trackingNumber);
    handleNavigate('tracking');
  };

  // Admin Route: Login
  if (currentRoute === 'admin/login') {
    return (
      <AdminLoginPage
        onNavigateHome={() => handleNavigate('home')}
        onLoginSuccess={() => handleNavigate('admin')}
      />
    );
  }

  // Admin Route: Protected Dashboard
  if (currentRoute === 'admin') {
    if (isLoading) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#071A2B',
            color: '#FFFFFF',
            fontSize: '1rem',
          }}
        >
          <span>Verifying security session...</span>
        </div>
      );
    }

    if (!user || !isStaff) {
      return (
        <AdminLoginPage
          onNavigateHome={() => handleNavigate('home')}
          onLoginSuccess={() => handleNavigate('admin')}
        />
      );
    }

    return <AdminDashboardPage onNavigateHome={() => handleNavigate('home')} />;
  }

  // Driver Route: Protected Workspace
  if (currentRoute === 'driver') {
    if (isLoading) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F3F4F6',
            color: '#071A2B',
            fontSize: '1rem',
          }}
        >
          <span>Loading Driver Workspace...</span>
        </div>
      );
    }

    if (!user || !isDriver) {
      return (
        <AdminLoginPage
          onNavigateHome={() => handleNavigate('home')}
          onLoginSuccess={() => handleNavigate(isDriver ? 'driver' : 'admin')}
        />
      );
    }

    return <DriverDashboardPage onNavigateHome={() => handleNavigate('home')} />;
  }

  // Public Layout & Pages
  const renderPublicPage = () => {
    switch (currentRoute) {
      case 'home':
        return (
          <HomePage
            onNavigate={handleNavigate}
            onSearchTracking={handleSearchTracking}
          />
        );
      case 'services':
        return <ServicesPage onNavigate={handleNavigate} />;
      case 'tracking':
        return (
          <TrackingPage
            initialTrackingNumber={activeTrackingSearch}
            onNavigate={handleNavigate}
          />
        );
      case 'send-package':
        return <SendPackagePage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;
      default:
        return (
          <HomePage
            onNavigate={handleNavigate}
            onSearchTracking={handleSearchTracking}
          />
        );
    }
  };

  return (
    <PublicLayout currentRoute={currentRoute} onNavigate={handleNavigate}>
      {renderPublicPage()}
    </PublicLayout>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
