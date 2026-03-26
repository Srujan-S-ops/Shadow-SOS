"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/Store';
import { useSensors } from '@/hooks/useSensors';
import EmergencyOverlay from '@/components/EmergencyOverlay';
import IncomingAlert from '@/components/IncomingAlert';
import { Users, Map, PhoneCall, Footprints, Info, LogOut, MessageSquareWarning } from 'lucide-react';

export default function Home() {
  const { triggerSOS, userName, logout } = useAppStore();
  
  // Initialize device sensor listeners (shake, voice)
  useSensors();

  return (
    <main className="min-h-screen bg-black px-4 py-8 pb-24 relative overflow-hidden flex flex-col">
      {/* Overlays */}
      <EmergencyOverlay />
      <IncomingAlert />

      <header className="mb-8 flex items-center justify-between mt-2">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            HerGuard AI
          </h1>
          <p className="text-gray-400 text-xs font-medium mt-1 tracking-wide uppercase">
            Stay Safe, {userName || 'User'}
          </p>
        </div>
        <button 
          onClick={logout}
          className="p-3 bg-neutral-900 border border-neutral-800 rounded-full hover:bg-neutral-800 transition text-red-500"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Main SOS Trigger Hub */}
      <div className="flex-1 flex flex-col items-center justify-center relative my-10 min-h-[300px]">
        {/* Pulsing rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 bg-red-500/10 rounded-full animate-ping [animation-duration:3s]" />
          <div className="absolute w-80 h-80 bg-red-500/5 rounded-full animate-ping [animation-duration:4s]" />
        </div>

        <button
          onClick={triggerSOS}
          className="relative z-10 w-52 h-52 bg-gradient-to-br from-red-600 to-red-800 rounded-full shadow-[0_0_40px_rgba(220,38,38,0.5)] flex items-center justify-center font-black text-5xl text-white tracking-widest active:scale-95 transform transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(220,38,38,0.7)] border-4 border-neutral-900/50"
        >
          SOS
        </button>
        <p className="mt-8 text-neutral-500 text-sm max-w-[200px] text-center font-medium">
          Tap instantly or shake your phone hard if in danger
        </p>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-4 mt-auto">
        <Link href="/walk" className="bg-neutral-900/80 backdrop-blur border border-neutral-800 p-4 rounded-2xl flex flex-col items-center text-center hover:bg-neutral-800 transition py-5">
          <div className="bg-emerald-500/10 p-3 rounded-full mb-3">
            <Footprints className="text-emerald-500 w-6 h-6" />
          </div>
          <span className="font-semibold text-white text-sm">Walk With Me</span>
        </Link>
        <Link href="/contacts" className="bg-neutral-900/80 backdrop-blur border border-neutral-800 p-4 rounded-2xl flex flex-col items-center text-center hover:bg-neutral-800 transition py-5">
          <div className="bg-blue-500/10 p-3 rounded-full mb-3">
            <Users className="text-blue-500 w-6 h-6" />
          </div>
          <span className="font-semibold text-white text-sm">Trusted Network</span>
        </Link>
        <Link href="/sms" className="bg-neutral-900/80 backdrop-blur border border-neutral-800 p-4 rounded-2xl flex flex-col items-center text-center hover:bg-neutral-800 transition py-5">
          <div className="bg-orange-500/10 p-3 rounded-full mb-3">
            <MessageSquareWarning className="text-orange-500 w-6 h-6" />
          </div>
          <span className="font-semibold text-white text-sm">SMS Fallback</span>
        </Link>
        <Link href="/fake-call" className="bg-neutral-900/80 backdrop-blur border border-neutral-800 p-4 rounded-2xl flex flex-col items-center text-center hover:bg-neutral-800 transition py-5">
          <div className="bg-cyan-500/10 p-3 rounded-full mb-3">
            <PhoneCall className="text-cyan-500 w-6 h-6" />
          </div>
          <span className="font-semibold text-white text-sm">Fake Call</span>
        </Link>
      </div>

      {/* Test Hint */}
      <div className="absolute top-4 right-16 group z-50">
        <Info className="w-5 h-5 text-neutral-700 hover:text-neutral-400 cursor-pointer" />
        <div className="absolute right-0 top-8 bg-neutral-800 text-xs p-3 rounded-xl w-48 opacity-0 group-hover:opacity-100 transition shadow-xl border border-neutral-700 pointer-events-none text-neutral-300">
          <strong>Demo Info:</strong> Press <kbd className="bg-neutral-700 px-1 rounded font-mono">I</kbd> on keyboard to simulate an incoming alert from someone else!
        </div>
      </div>
      
    </main>
  );
}
