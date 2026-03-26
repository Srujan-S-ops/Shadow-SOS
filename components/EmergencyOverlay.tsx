"use client";
import { useEffect } from 'react';
import { useAppStore } from '@/lib/Store';
import { useLocation } from '@/hooks/useLocation';
import { MapPin, ShieldAlert, XOctagon } from 'lucide-react';

export default function EmergencyOverlay() {
  const { activeAlert, stopSOS, updateLocation } = useAppStore();
  const { location, startTracking, stopTracking, error } = useLocation();

  useEffect(() => {
    if (activeAlert) {
      startTracking();
    } else {
      stopTracking();
    }
    return () => stopTracking();
  }, [activeAlert, startTracking, stopTracking]);

  useEffect(() => {
    if (location) {
      updateLocation(location.lat, location.lng);
    }
  }, [location, updateLocation]);

  if (!activeAlert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rose-600/20 backdrop-blur-md animate-siren">
      <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 md:p-10 text-center shadow-[0_0_50px_rgba(225,29,72,0.5)] max-w-sm w-full mx-4 flex flex-col items-center">
        
        <div className="animate-pulse mb-6 rounded-full bg-rose-500/20 p-4">
          <ShieldAlert className="w-20 h-20 text-rose-500" />
        </div>

        <h1 className="text-3xl font-black text-rose-500 mb-2 tracking-tighter">
          EMERGENCY ACTIVATED
        </h1>
        <p className="text-slate-300 mb-6 text-sm">
          Your trusted contacts have been alerted and your live location is being shared.
        </p>

        <div className="w-full bg-slate-800 rounded-2xl p-4 mb-8 border border-slate-700">
          <div className="flex items-center justify-center gap-2 text-rose-400 mb-2">
            <MapPin className="w-5 h-5 animate-bounce" />
            <span className="font-semibold text-sm">LIVE TRACKING ACTIVE</span>
          </div>
          {location ? (
            <div className="text-xs text-slate-400 font-mono bg-slate-950 rounded p-2">
              Lat: {location.lat.toFixed(6)}<br />
              Lng: {location.lng.toFixed(6)}
            </div>
          ) : (
            <div className="text-xs text-slate-400">Acquiring GPS signal...</div>
          )}
          {error && <div className="text-xs text-rose-500 mt-2">{error}</div>}
        </div>

        <button
          onClick={stopSOS}
          className="w-full relative group overflow-hidden rounded-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
        >
          <div className="flex items-center justify-center gap-2">
            <XOctagon className="w-6 h-6" />
            STOP EMERGENCY
          </div>
        </button>

      </div>
    </div>
  );
}
