import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC1gg7v1GxmPPc5ZECTF-Kp7oKlwQ26uUg",
  authDomain: "safety-for-women-762c5.firebaseapp.com",
  projectId: "safety-for-women-762c5",
  storageBucket: "safety-for-women-762c5.firebasestorage.app",
  messagingSenderId: "1062576007462",
  appId: "1:1062576007462:web:4bae11b6b6f7c9a0b479e7",
  databaseURL: "https://safety-for-women-762c5-default-rtdb.asia-southeast1.firebasedatabase.app",
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getDatabase(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Force mock environment to false to rely on the hardcoded keys
export const isMockEnvironment = false;
