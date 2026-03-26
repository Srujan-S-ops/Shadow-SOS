"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/Store';
import { useSensors } from '@/hooks/useSensors';
import EmergencyOverlay from '@/components/EmergencyOverlay';
import IncomingAlert from '@/components/IncomingAlert';
import { Users, Map, PhoneCall, Footprints, Info } from 'lucide-react';

export default function Home() {
  const { triggerSOS } = useAppStore();
  
  // Initialize device sensor listeners (shake, voice)
  useSensors();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 pb-24 relative overflow-hidden flex flex-col">
      {/* Overlays */}
      <EmergencyOverlay />
      <IncomingAlert />

      <header className="mb-10 text-center flex-shrink-0 mt-4">
        <h1 className="text-3xl font-black bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
          HerGuard AI
        </h1>
        <p className="text-slate-400 text-sm font-medium mt-1 tracking-wide uppercase">
          Your Safety, Automated
        </p>
      </header>

      {/* Main SOS Trigger Hub */}
      <div className="flex-1 flex flex-col items-center justify-center relative my-10 min-h-[300px]">
        {/* Pulsing rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 bg-rose-500/10 rounded-full animate-ping [animation-duration:3s]" />
          <div className="absolute w-80 h-80 bg-rose-500/5 rounded-full animate-ping [animation-duration:4s]" />
        </div>

        <button
          onClick={triggerSOS}
          className="relative z-10 w-52 h-52 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full shadow-[0_0_40px_rgba(225,29,72,0.4)] flex items-center justify-center font-black text-5xl text-white tracking-widest active:scale-95 transform transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(225,29,72,0.6)] border-4 border-slate-900/50"
        >
          SOS
        </button>
        <p className="mt-8 text-slate-500 text-sm max-w-[200px] text-center">
          Tap instantly or shake your phone hard if in danger
        </p>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-4 mt-auto">
        <Link href="/walk" className="bg-slate-900/80 backdrop-blur border border-slate-800 p-4 rounded-2xl flex flex-col items-center text-center hover:bg-slate-800 transition active:scale-95">
          <div className="bg-emerald-500/20 p-3 rounded-full mb-3">
            <Footprints className="text-emerald-400 w-6 h-6" />
          </div>
          <span className="font-semibold text-slate-200">Walk With Me</span>
        </Link>
        <Link href="/fake-call" className="bg-slate-900/80 backdrop-blur border border-slate-800 p-4 rounded-2xl flex flex-col items-center text-center hover:bg-slate-800 transition active:scale-95">
          <div className="bg-cyan-500/20 p-3 rounded-full mb-3">
            <PhoneCall className="text-cyan-400 w-6 h-6" />
          </div>
          <span className="font-semibold text-slate-200">Fake Call</span>
        </Link>
        <Link href="/contacts" className="bg-slate-900/80 backdrop-blur border border-slate-800 p-4 rounded-2xl flex flex-col items-center text-center hover:bg-slate-800 transition active:scale-95">
          <div className="bg-indigo-500/20 p-3 rounded-full mb-3">
            <Users className="text-indigo-400 w-6 h-6" />
          </div>
          <span className="font-semibold text-slate-200">Trusted Contacts</span>
        </Link>
        <Link href="/map" className="bg-slate-900/80 backdrop-blur border border-slate-800 p-4 rounded-2xl flex flex-col items-center text-center hover:bg-slate-800 transition active:scale-95">
          <div className="bg-amber-500/20 p-3 rounded-full mb-3">
            <Map className="text-amber-400 w-6 h-6" />
          </div>
          <span className="font-semibold text-slate-200">Live Map</span>
        </Link>
      </div>

      {/* Test Hint */}
      <div className="absolute top-4 right-4 group">
        <Info className="w-5 h-5 text-slate-700 hover:text-slate-400 cursor-pointer" />
        <div className="absolute right-0 top-8 bg-slate-800 text-xs p-3 rounded-lg w-48 opacity-0 group-hover:opacity-100 transition shadow-xl border border-slate-700 pointer-events-none text-slate-300">
          <strong>Demo Info:</strong> Press <kbd className="bg-slate-700 px-1 rounded">I</kbd> on keyboard to simulate an incoming alert from someone else!
        </div>
      </div>
      
    </main>
  );
}
