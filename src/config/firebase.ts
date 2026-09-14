/**
 * Firebase Client Configuration for Fastway Delivery Services
 * Dedicated Project: Delivery (delivery-67506)
 */

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBeELhqKwft0x_t0mSYrHdh6kk0uvfpDaQ',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'delivery-67506.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'delivery-67506',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'delivery-67506.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '732153528573',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:732153528573:web:d2fc3340697f6ca3bb3e94',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-T5E7N2SH4T',
};
