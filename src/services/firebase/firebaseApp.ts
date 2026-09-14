import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from '../../config/firebase';

// Initialize Firebase singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Core service singletons
export const auth = getAuth(app);
export const db = getFirestore(app);

// Storage service (initialized safely)
let storageInstance = null;
try {
  storageInstance = getStorage(app);
} catch {
  // Graceful fallback if storage bucket is in Blaze upgrade requirement
  storageInstance = null;
}
export const storage = storageInstance;
