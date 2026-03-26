import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC1gg7v1GxMPPc5ZECTf-Kp7okLwQ26uUg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "safety-for-women-762c5.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "safety-for-women-762c5",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "safety-for-women-762c5.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1062576007462",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1062576007462:web:4bae11b6b6f7c9a0b479e7",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://safety-for-women-762c5-default-rtdb.asia-southeast1.firebasedatabase.app",
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getDatabase(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);

// Force mock environment to false to rely on the hardcoded keys
export const isMockEnvironment = false;
