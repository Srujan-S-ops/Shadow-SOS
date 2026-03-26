"use client";
import { useEffect } from 'react';
import { useAppStore } from '@/lib/Store';
import { useAudioSiren } from '@/hooks/useAudioSiren';
import { AlertCircle, BellOff, Navigation } from 'lucide-react';

export default function IncomingAlert() {
  const { incomingAlert, stopIncomingAlarm } = useAppStore();
  const { playSiren, stopSiren } = useAudioSiren();

  useEffect(() => {
    if (incomingAlert) {
      playSiren();
    } else {
      stopSiren();
    }
  }, [incomingAlert, playSiren, stopSiren]);

  if (!incomingAlert) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-red-950/80 backdrop-blur-xl animate-shake">
      
      {/* Intense pulsing background effect */}
      <div className="absolute inset-0 bg-rose-600 mix-blend-overlay animate-pulse opacity-50" />

      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center text-center">
        <AlertCircle className="w-32 h-32 text-rose-500 mb-6 animate-ping" />
        
        <h1 className="text-4xl text-white font-black tracking-tighter mb-2">
          {incomingAlert.senderName.toUpperCase()} <br /> IS IN DANGER!
        </h1>
        
        <p className="text-rose-200 text-lg mb-10 font-medium">
          They have triggered their SOS beacon. Immediate action may be required.
        </p>

        <div className="flex flex-col gap-4 w-full">
          {incomingAlert.location && (
            <div className="w-full flex md:flex-row flex-col gap-4">
              <div className="w-full flex-1 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl relative min-h-[200px] md:min-h-[250px]">
                <iframe
                  title="Live Tracking Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${incomingAlert.location.lng - 0.005},${incomingAlert.location.lat - 0.005},${incomingAlert.location.lng + 0.005},${incomingAlert.location.lat + 0.005}&layer=mapnik&marker=${incomingAlert.location.lat},${incomingAlert.location.lng}`}
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(100%)' }} // Night mode filter
                />
              </div>
              <a
                href={`https://maps.google.com/?q=${incomingAlert.location.lat},${incomingAlert.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-rose-600 w-full md:w-auto flex items-center justify-center gap-3 py-4 md:px-8 rounded-xl font-bold text-lg shadow-xl hover:bg-slate-100 transition-colors"
              >
                <Navigation className="w-6 h-6" />
                <span className="md:hidden">OPEN MAP APP</span>
                <span className="hidden md:inline">OPEN GPS APP</span>
              </a>
            </div>
          )}
          
          <button
            onClick={stopIncomingAlarm}
            className="bg-slate-900 border-2 border-rose-500 text-white w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors"
          >
            <BellOff className="w-6 h-6 text-rose-400" />
            STOP ALARM Sound
          </button>
        </div>
      </div>

    </div>
  );
}
