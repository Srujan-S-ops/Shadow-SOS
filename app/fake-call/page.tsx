"use client";
import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff } from 'lucide-react';
import { useRingtone } from '@/hooks/useRingtone';

export default function FakeCallPage() {
  const [caller, setCaller] = useState('Mom');
  const [status, setStatus] = useState<'incoming' | 'active' | 'ended'>('incoming');
  const [time, setTime] = useState(0);
  const { playRingtone, stopRingtone } = useRingtone();

  useEffect(() => {
    if (status === 'incoming') {
      // Browser AudioContext policy requires a slight delay or user interaction. 
      // Since the user clicked a link to get here, it usually auto-plays.
      playRingtone();
    } else {
      stopRingtone();
    }
    return () => stopRingtone();
  }, [status, playRingtone, stopRingtone]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'active') {
      interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleAccept = () => setStatus('active');
  const handleDecline = () => {
    setStatus('ended');
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (status === 'ended') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-500 font-bold text-xl">Call Ended</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-between pb-20 pt-32 px-6">
      
      {/* Caller Info */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-full bg-slate-700 mx-auto mb-6 flex items-center justify-center text-5xl text-slate-400 font-light border-4 border-slate-800">
          {caller[0].toUpperCase()}
        </div>
        <h1 className="text-4xl text-white font-medium mb-2">{caller}</h1>
        <p className="text-xl text-slate-400">
          {status === 'incoming' ? 'Incoming... (Fake Call)' : formatTime(time)}
        </p>
      </div>

      {/* Actions */}
      <div className="w-full max-w-sm flex justify-between px-8">
        <button 
          onClick={handleDecline}
          className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center shadow-lg transform active:scale-95 transition"
        >
          <PhoneOff className="w-10 h-10 text-white" />
        </button>

        {status === 'incoming' && (
          <button 
            onClick={handleAccept}
            className="w-20 h-20 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)] transform active:scale-95 transition animate-pulse"
          >
            <Phone className="w-10 h-10 text-white" />
          </button>
        )}
      </div>
      
    </div>
  );
}
