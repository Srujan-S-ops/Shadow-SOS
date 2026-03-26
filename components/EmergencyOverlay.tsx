"use client";
import { useEffect } from 'react';
import { useAppStore } from '@/lib/Store';
import { useLocation } from '@/hooks/useLocation';
import { MapPin, ShieldAlert, XOctagon } from 'lucide-react';

export default function EmergencyOverlay() {
  const { activeAlert, stopSOS, updateLocation, contacts } = useAppStore();
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
            <div className="w-full rounded-xl overflow-hidden shadow-inner border border-slate-700 relative h-32 md:h-40">
              <iframe
                title="Your Live Location"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.005},${location.lat - 0.005},${location.lng + 0.005},${location.lat + 0.005}&layer=mapnik&marker=${location.lat},${location.lng}`}
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(100%)' }}
              />
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-6">Acquiring highly accurate GPS signal...</div>
          )}
          {error && <div className="text-xs text-rose-500 mt-2">{error}</div>}
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => {
              const msg = localStorage.getItem('customSmsMessage') || "HELP! I am in danger. Track my location here:";
              const locLink = location ? ` https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}` : '';
              const phones = contacts.map(c => c.phone).filter(Boolean).join(','); 
              window.location.href = `sms:${phones}?body=${encodeURIComponent(msg + locLink)}`;
            }}
            className="w-full relative group overflow-hidden rounded-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(234,88,12,0.5)]"
          >
            SEND SMS FALLBACK
          </button>
          
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
    </div>
  );
}
