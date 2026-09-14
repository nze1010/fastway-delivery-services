import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseApp';
import type { AdminUser, AdminRole } from '../../types';

export interface AuthStateChangeCallback {
  (user: User | null, profile: AdminUser | null): void;
}

export class AuthService {
  /**
   * Listen to Firebase Auth state changes and load user profile
   */
  onAuthStateChange(callback: AuthStateChangeCallback): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        callback(null, null);
        return;
      }

      try {
        const profile = await this.getUserProfile(firebaseUser.uid);
        callback(firebaseUser, profile);
      } catch (err) {
        console.error('Failed to load user profile:', err);
        // Fallback profile if profile document is not yet created
        const fallbackProfile: AdminUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'Fastway Staff',
          role: 'admin',
          isActive: true,
        };
        callback(firebaseUser, fallbackProfile);
      }
    });
  }

  /**
   * Administrative sign in with email and password
   */
  async login(email: string, pass: string): Promise<{ user: User; profile: AdminUser | null }> {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const profile = await this.getUserProfile(credential.user.uid);
    return { user: credential.user, profile };
  }

  /**
   * Sign out current session
   */
  async logout(): Promise<void> {
    await firebaseSignOut(auth);
  }

  /**
   * Retrieve administrative profile from Firestore `users/{uid}`
   */
  async getUserProfile(uid: string): Promise<AdminUser | null> {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return null;
    }
    const data = snap.data();
    return {
      uid,
      email: data.email || '',
      displayName: data.displayName || '',
      role: (data.role as AdminRole) || 'staff',
      assignedHub: data.assignedHub || '',
      isActive: data.isActive !== false,
      createdAt: data.createdAt ? data.createdAt.toString() : undefined,
      lastLoginAt: data.lastLoginAt ? data.lastLoginAt.toString() : undefined,
    };
  }

  /**
   * Initialize or create an administrative user account
   */
  async registerAdminUser(
    email: string,
    pass: string,
    displayName: string,
    role: AdminRole = 'admin'
  ): Promise<AdminUser> {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    const userRef = doc(db, 'users', cred.user.uid);
    const profile: AdminUser = {
      uid: cred.user.uid,
      email: email.trim(),
      displayName,
      role,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    await setDoc(userRef, {
      ...profile,
      serverCreatedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return profile;
  }
  /**
   * Retrieve list of operational drivers from Firestore users collection
   */
  async getDriversList(): Promise<AdminUser[]> {
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'driver')
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        email: data.email || '',
        displayName: data.displayName || '',
        role: data.role as AdminRole,
        assignedHub: data.assignedHub || '',
        isActive: data.isActive !== false,
      };
    });
  }
}

export const authService = new AuthService();
