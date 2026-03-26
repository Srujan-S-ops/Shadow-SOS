"use client";
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth, db, isMockEnvironment } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, onValue, set, update } from 'firebase/database';
import { useAudioVault } from '@/hooks/useAudioVault';

export type Contact = {
  id: string;
  name: string;
  phone?: string;
};

export type ThreatLevel = 'yellow' | 'orange' | 'red';

export type AlertEvent = {
  alertId: string;
  fromUser: string;
  senderName: string;
  location: { lat: number; lng: number } | null;
  timestamp: number;
  status: 'active' | 'stopped';
  level: ThreatLevel;
  evidenceUrl?: string;
};

interface AppContextType {
  userId: string;
  userName: string;
  contacts: Contact[];
  addContact: (contact: Contact) => void;
  removeContact: (id: string) => void;
  activeAlert: AlertEvent | null;
  triggerSOS: (level?: ThreatLevel) => void;
  stopSOS: () => void;
  incomingAlert: AlertEvent | null;
  stopIncomingAlarm: () => void;
  updateLocation: (lat: number, lng: number) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeAlert, setActiveAlert] = useState<AlertEvent | null>(null);
  const [incomingAlert, setIncomingAlert] = useState<AlertEvent | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const { captureEvidence } = useAudioVault();
  
  const router = useRouter();
  const pathname = usePathname();

  const contactsRef = useRef(contacts);
  contactsRef.current = contacts;
  const userIdRef = useRef(userId);
  userIdRef.current = userId;
  const userNameRef = useRef(userName);
  userNameRef.current = userName;

  useEffect(() => {
    if (isMockEnvironment) {
       const mockId = typeof window !== 'undefined' ? localStorage.getItem('userId') || `user_${Math.random().toString(36).substring(2, 9)}` : 'user_123';
       setUserId(mockId);
       setUserName('Mock User');
       if (typeof window !== 'undefined') {
         localStorage.setItem('userId', mockId);
         const savedContacts = localStorage.getItem('contacts');
         if (savedContacts) setContacts(JSON.parse(savedContacts));
       }
       return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setUserName(user.displayName || 'User');
        
        // Listen to Contacts from Firebase Realtime DB
        const contactsRefObj = ref(db, `users/${user.uid}/contacts`);
        onValue(contactsRefObj, (snapshot) => {
          if (snapshot.exists()) {
            setContacts(snapshot.val() || []);
          } else {
            setContacts([]);
          }
        });

      } else {
        setUserId('');
        // Redirect to login if unauthenticated
        if (pathname !== '/login' && pathname !== '/signup') {
          router.push('/login');
        }
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  // Listen to incoming alerts if we are logged in
  useEffect(() => {
    if (isMockEnvironment || !userId) return;

    const incomingAlertsRef = ref(db, `users/${userId}/incomingAlerts`);
    const unsubscribe = onValue(incomingAlertsRef, (snapshot) => {
      if (snapshot.exists()) {
        const alerts = snapshot.val();
        // Find the first active one
        const active = Object.values(alerts).find((a: any) => a.status === 'active') as AlertEvent | undefined;
        if (active) {
          setIncomingAlert(active);
        } else {
          setIncomingAlert(null); // All stopped
        }
      } else {
        setIncomingAlert(null);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const addContact = async (contact: Contact) => {
    const updated = [...contacts, contact];
    setContacts(updated);
    if (!isMockEnvironment && userId) {
      await set(ref(db, `users/${userId}/contacts`), updated);
    } else if (typeof window !== 'undefined') {
      localStorage.setItem('contacts', JSON.stringify(updated));
    }
  };

  const removeContact = async (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    if (!isMockEnvironment && userId) {
      await set(ref(db, `users/${userId}/contacts`), updated);
    } else if (typeof window !== 'undefined') {
      localStorage.setItem('contacts', JSON.stringify(updated));
    }
  };

  const triggerSOS = (level: ThreatLevel = 'red') => {
    if (!userIdRef.current) return;
    const alertId = `alert_${userIdRef.current}_${Date.now()}`;
    const alert: AlertEvent = {
      alertId,
      fromUser: userIdRef.current,
      senderName: userNameRef.current,
      location,
      timestamp: Date.now(),
      status: 'active',
      level
    };
    setActiveAlert(alert);
    
    if (!isMockEnvironment) {
       // Broadcast directly to trusted contacts incoming alerts queue
       contactsRef.current.forEach(contact => {
          set(ref(db, `users/${contact.id}/incomingAlerts/${alertId}`), alert);
       });

       // Secretly record audio if Red Alert
       if (level === 'red') {
         captureEvidence(alertId).then((url) => {
           if (url) {
             // Append evidence URL to the active database streams
             contactsRef.current.forEach(contact => {
               update(ref(db, `users/${contact.id}/incomingAlerts/${alertId}`), { evidenceUrl: url });
             });
             setActiveAlert(prev => prev ? { ...prev, evidenceUrl: url } : null);
           }
         });
       }

    } else {
      console.log("SOS TRIGGERED! Broadcasting to contacts:", contactsRef.current);
    }
  };

  const stopSOS = () => {
    if (activeAlert) {
      if (!isMockEnvironment && userIdRef.current) {
        contactsRef.current.forEach(contact => {
           set(ref(db, `users/${contact.id}/incomingAlerts/${activeAlert.alertId}/status`), 'stopped');
        });
      }
      setActiveAlert(null);
      console.log("SOS STOPPED!");
    }
  };

  const stopIncomingAlarm = () => {
    // If the receiver hit 'STOP' locally just mute it locally
    setIncomingAlert(null);
  };

  const updateLocation = React.useCallback((lat: number, lng: number) => {
    setLocation({ lat, lng });
    setActiveAlert(prev => {
      if (prev) {
        if (!isMockEnvironment && userIdRef.current) {
          contactsRef.current.forEach(c => {
             set(ref(db, `users/${c.id}/incomingAlerts/${prev.alertId}/location`), {lat, lng});
          });
        }
        return { ...prev, location: { lat, lng } };
      }
      return null;
    });
  }, []);

  const logout = () => {
    if (!isMockEnvironment) {
      signOut(auth);
    } else {
      router.push('/login');
    }
  };

  return (
    <AppContext.Provider value={{
      userId, userName, contacts, addContact, removeContact,
      activeAlert, triggerSOS, stopSOS, incomingAlert, stopIncomingAlarm,
      updateLocation, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used within AppProvider");
  return ctx;
};
