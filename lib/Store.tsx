"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

// Contact type
export type Contact = {
  id: string;
  name: string;
  phone: string;
};

// Alert type
export type AlertEvent = {
  alertId: string;
  fromUser: string;
  senderName: string;
  location: { lat: number; lng: number } | null;
  timestamp: number;
  status: 'active' | 'stopped';
};

interface AppContextType {
  userId: string;
  userName: string;
  setUserName: (name: string) => void;
  contacts: Contact[];
  addContact: (contact: Contact) => void;
  removeContact: (id: string) => void;
  activeAlert: AlertEvent | null;
  triggerSOS: () => void;
  stopSOS: () => void;
  incomingAlert: AlertEvent | null;
  stopIncomingAlarm: () => void;
  updateLocation: (lat: number, lng: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId] = useState(() => 
    typeof window !== 'undefined' ? localStorage.getItem('userId') || `user_${Math.random().toString(36).substring(2, 9)}` : 'user_123'
  );
  const [userName, setUserNameState] = useState('Safety User');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeAlert, setActiveAlert] = useState<AlertEvent | null>(null);
  const [incomingAlert, setIncomingAlert] = useState<AlertEvent | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userId', userId);
      const savedContacts = localStorage.getItem('contacts');
      if (savedContacts) setContacts(JSON.parse(savedContacts));
    }
  }, [userId]);

  const setUserName = (name: string) => {
    setUserNameState(name);
  };

  const addContact = (contact: Contact) => {
    const updated = [...contacts, contact];
    setContacts(updated);
    if (typeof window !== 'undefined') localStorage.setItem('contacts', JSON.stringify(updated));
  };

  const removeContact = (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    if (typeof window !== 'undefined') localStorage.setItem('contacts', JSON.stringify(updated));
  };

  const triggerSOS = () => {
    const alert: AlertEvent = {
      alertId: `alert_${Date.now()}`,
      fromUser: userId,
      senderName: userName,
      location,
      timestamp: Date.now(),
      status: 'active'
    };
    setActiveAlert(alert);
    
    // In a real app, this sends to Firebase. 
    // Here we simulate the broadcast.
    console.log("SOS TRIGGERED! Broadcasting to contacts:", contacts);
  };

  const stopSOS = () => {
    if (activeAlert) {
      setActiveAlert(null);
      console.log("SOS STOPPED!");
    }
  };

  const stopIncomingAlarm = () => {
    setIncomingAlert(null);
  };

  const updateLocation = React.useCallback((lat: number, lng: number) => {
    setLocation({ lat, lng });
    setActiveAlert(prev => prev ? { ...prev, location: { lat, lng } } : null);
  }, []);

  // Mock incoming alert for testing the hackathon MVP
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Pressing 'I' triggers a mock incoming alert
      if (e.key === 'i' || e.key === 'I') {
        setIncomingAlert({
          alertId: `mock_${Date.now()}`,
          fromUser: 'mock_user',
          senderName: 'Jane Doe',
          location: { lat: 34.0522, lng: -118.2437 },
          timestamp: Date.now(),
          status: 'active'
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider value={{
      userId, userName, setUserName, contacts, addContact, removeContact,
      activeAlert, triggerSOS, stopSOS, incomingAlert, stopIncomingAlarm,
      updateLocation
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
