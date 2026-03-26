"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRingtone } from '@/hooks/useRingtone';
import { Phone, PhoneOff, MicOff, Grid, Volume2, Plus, Video, User, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function FakeCallPage() {
  const [caller, setCaller] = useState('Mom');
  const [status, setStatus] = useState<'idle' | 'incoming' | 'active' | 'ended'>('idle');
  const [time, setTime] = useState(0);
  const { playRingtone, stopRingtone } = useRingtone();

  useEffect(() => {
    if (status === 'incoming') {
      playRingtone();
    } else {
      stopRingtone();
    }
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

  const triggerCall = () => {
    setStatus('incoming');
  };

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

  if (status === 'idle') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <Link href="/" className="absolute top-8 left-6 text-slate-400 font-bold">Close</Link>
        <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center mb-8 border border-cyan-500/30">
          <Phone className="w-10 h-10 text-cyan-400" />
        </div>
        <h1 className="text-3xl text-white font-bold mb-4 tracking-tight">Fake Call Escape</h1>
        <p className="text-slate-400 mb-12 max-w-xs leading-relaxed">
          Tap the button below. Your screen will instantly simulate an incoming iPhone call and blare the iPhone ringtone to help you excuse yourself.
        </p>
        <button 
          onClick={triggerCall}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-black py-5 px-12 rounded-full text-lg shadow-[0_0_30px_rgba(6,182,212,0.4)] active:scale-95 transition-all w-full max-w-xs"
        >
          TRIGGER FAKE CALL
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-between pb-16 pt-32 px-6 font-sans">
      
      {/* Caller Info */}
      <div className="text-center w-full">
        <h1 className="text-4xl text-white font-medium mb-3 tracking-wide">{caller}</h1>
        <p className="text-lg text-slate-400 font-light">
          {status === 'incoming' ? 'mobile' : formatTime(time)}
        </p>
      </div>

      {/* Active Call UI Grid */}
      {status === 'active' && (
        <div className="w-full max-w-[280px] mb-8 mt-auto">
          <div className="grid grid-cols-3 gap-y-10 gap-x-6">
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <button className="w-[72px] h-[72px] rounded-full bg-slate-800 flex items-center justify-center text-white active:bg-white active:text-black transition">
                <MicOff className="w-7 h-7" />
              </button>
              <span className="text-[13px] text-slate-300">mute</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <button className="w-[72px] h-[72px] rounded-full bg-slate-800 flex items-center justify-center text-white active:bg-white active:text-black transition">
                <Grid className="w-7 h-7" />
              </button>
              <span className="text-[13px] text-slate-300">keypad</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <button className="w-[72px] h-[72px] rounded-full bg-slate-800 flex items-center justify-center text-white active:bg-white active:text-black transition">
                <Volume2 className="w-7 h-7" />
              </button>
              <span className="text-[13px] text-slate-300">speaker</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <button className="w-[72px] h-[72px] rounded-full bg-slate-800 flex items-center justify-center text-white active:bg-white active:text-black transition">
                <Plus className="w-7 h-7" />
              </button>
              <span className="text-[13px] text-slate-300">add call</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <button className="w-[72px] h-[72px] rounded-full bg-slate-800 flex items-center justify-center text-slate-500 transition">
                <Video className="w-7 h-7" />
              </button>
              <span className="text-[13px] text-slate-500">FaceTime</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <button className="w-[72px] h-[72px] rounded-full bg-slate-800 flex items-center justify-center text-white active:bg-white active:text-black transition">
                <User className="w-7 h-7" />
              </button>
              <span className="text-[13px] text-slate-300">contacts</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Actions */}
      <div className={`w-full max-w-[280px] flex px-2 ${status === 'incoming' ? 'justify-between' : 'justify-center'} mt-auto pb-8`}>
        
        {status === 'incoming' ? (
          <>
            <div className="flex flex-col items-center gap-3">
              <button 
                onClick={handleDecline}
                className="w-[76px] h-[76px] rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center transform active:scale-95 transition"
              >
                <PhoneOff className="w-9 h-9 text-white" />
              </button>
              <span className="text-white text-sm">Decline</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <button 
                onClick={handleAccept}
                className="w-[76px] h-[76px] rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center transform active:scale-95 transition"
              >
                <Phone className="w-9 h-9 text-white animate-pulse" />
              </button>
              <span className="text-white text-sm">Accept</span>
            </div>
          </>
        ) : (
          <button 
            onClick={handleDecline}
            className="w-[76px] h-[76px] rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center transform active:scale-95 transition mt-4"
          >
            <PhoneOff className="w-9 h-9 text-white" />
          </button>
        )}
      </div>
      
    </div>
  );
}
