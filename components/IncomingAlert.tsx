"use client";
import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/Store';
import { useAudioSiren } from '@/hooks/useAudioSiren';
import { AlertCircle, BellOff, Navigation, XCircle, VolumeX } from 'lucide-react';

export default function IncomingAlert() {
  const { incomingAlert, stopIncomingAlarm } = useAppStore();
  const { playSiren, stopSiren } = useAudioSiren();
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Reset mute state when a new alert comes in
    if (!incomingAlert) setIsMuted(false);
  }, [incomingAlert]);

  useEffect(() => {
    if (incomingAlert && incomingAlert.level === 'red' && !isMuted) {
      playSiren(); // Only Nuclear Red plays the loud siren
    } else {
      stopSiren();
    }
  }, [incomingAlert, isMuted, playSiren, stopSiren]);

  if (!incomingAlert) return null;

  // Yellow and Orange are subtle notifications directly in the dashboard
  if (incomingAlert.level === 'yellow' || incomingAlert.level === 'orange') {
    const isOrange = incomingAlert.level === 'orange';
    return (
      <div className={`fixed top-20 right-4 z-[100] ${isOrange ? 'bg-orange-600/90' : 'bg-yellow-500/90'} text-white p-4 rounded-xl shadow-2xl flex flex-col gap-3 animate-in slide-in-from-right-8 max-w-sm w-full border border-white/20`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <AlertCircle className={`w-6 h-6 ${isOrange ? 'animate-pulse' : ''}`} />
            <div>
              <h3 className="font-bold text-sm">
                {incomingAlert.senderName} is {isOrange ? 'sharing live tracking' : 'feeling uneasy'}
              </h3>
              <p className="text-xs opacity-90 mt-0.5">
                {isOrange ? 'They marked a Potential Threat.' : 'They logged a Vibe Check.'}
              </p>
            </div>
          </div>
          <button onClick={stopIncomingAlarm} className="bg-black/20 p-1.5 rounded-full hover:bg-black/30 transition shadow-sm active:scale-95">
            <BellOff className="w-4 h-4" />
          </button>
        </div>

        {incomingAlert.location && isOrange && (
          <div className="w-full h-32 rounded-lg overflow-hidden border border-white/20 mt-2 shadow-inner pointer-events-none">
            <iframe
              title="Live Tracker"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${incomingAlert.location.lng - 0.005},${incomingAlert.location.lat - 0.005},${incomingAlert.location.lng + 0.005},${incomingAlert.location.lat + 0.005}&layer=mapnik&marker=${incomingAlert.location.lat},${incomingAlert.location.lng}`}
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(100%)' }}
            />
          </div>
        )}
      </div>
    );
  }

  // Red Alert Full Screen
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-red-950/80 backdrop-blur-xl animate-shake">
      
      {/* Intense pulsing background effect */}
      <div className="absolute inset-0 bg-rose-600 mix-blend-overlay animate-pulse opacity-50" />

      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center text-center">
        <AlertCircle className="w-32 h-32 text-rose-500 mb-6 animate-ping" />
        
        <h1 className="text-4xl text-white font-black tracking-tighter mb-2">
          {incomingAlert.senderName.toUpperCase()} <br /> IS IN DANGER!
        </h1>
        
        <p className="text-rose-200 text-lg mb-8 font-medium">
          They have triggered their SOS beacon. Immediate action may be required.
        </p>

        <div className="flex flex-col gap-4 w-full">
          {incomingAlert.evidenceUrl && (
            <div className="w-full bg-black/50 border-2 border-rose-500 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(225,29,72,0.6)] flex flex-col items-center">
              <div className="bg-rose-600 text-white text-[10px] uppercase font-black tracking-widest px-4 py-1.5 w-full flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Live Camera Feed Captured
              </div>
              <video
                src={incomingAlert.evidenceUrl}
                controls
                autoPlay
                className="w-full max-h-[300px] object-cover"
              />
            </div>
          )}

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
          
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setIsMuted(true)}
              disabled={isMuted}
              className={`border-2 text-white w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-colors ${
                isMuted 
                  ? 'bg-slate-800 border-slate-700 opacity-50 cursor-not-allowed' 
                  : 'bg-black border-yellow-500 hover:bg-slate-900 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
              }`}
            >
              <VolumeX className={`w-6 h-6 ${isMuted ? 'text-slate-500' : 'text-yellow-400'}`} />
              {isMuted ? 'SIREN MUTED' : 'MUTE SIREN ONLY'}
            </button>

            <button
              onClick={stopIncomingAlarm}
              className="bg-slate-900 border-2 border-slate-700 text-white w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg hover:bg-rose-950 hover:border-rose-500 transition-colors"
            >
              <BellOff className="w-6 h-6 text-slate-400" />
              DISMISS FULL ALERT
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
