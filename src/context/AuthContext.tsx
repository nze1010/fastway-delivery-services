import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import type { AdminUser, AdminRole } from '../types';
import { authService } from '../services/firebase/authService';

export interface AuthContextValue {
  user: User | null;
  profile: AdminUser | null;
  role: AdminRole | null;
  isAdmin: boolean;
  isStaff: boolean;
  isDriver: boolean;
  isDispatcher: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((firebaseUser, userProfile) => {
      setUser(firebaseUser);
      setProfile(userProfile);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const { user: loggedUser, profile: loggedProfile } = await authService.login(email, pass);
      
      const role = loggedProfile?.role || null;
      const isAdminRole = role === 'admin' || role === 'super_admin';
      const isStaffRole = isAdminRole || role === 'staff' || role === 'dispatcher' || role === 'logistics_manager' || role === 'driver';

      if (!loggedProfile || !isStaffRole) {
        await authService.logout();
        const err = new Error('Account lacks administrative privileges. Please verify your role in the database.');
        (err as any).code = 'auth/insufficient-permissions';
        throw err;
      }

      setUser(loggedUser);
      setProfile(loggedProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const role = profile?.role || null;
  const isAdmin = role === 'admin' || role === 'super_admin';
  const isStaff = isAdmin || role === 'staff' || role === 'dispatcher' || role === 'logistics_manager';
  const isDriver = role === 'driver';
  const isDispatcher = role === 'dispatcher' || isAdmin || role === 'logistics_manager';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin,
        isStaff,
        isDriver,
        isDispatcher,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
