"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Map as MapIcon } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';
import { useAppStore } from '@/lib/Store';

export default function MapPage() {
  const { location, startTracking, stopTracking } = useLocation();
  const { activeAlert } = useAppStore();

  useEffect(() => {
    // Start tracking when map mounts to show current location
    startTracking();
    return () => stopTracking();
  }, [startTracking, stopTracking]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="flex items-center gap-4 p-6 shrink-0 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-slate-950 to-transparent">
        <Link href="/" className="p-2 bg-slate-800/80 backdrop-blur rounded-full hover:bg-slate-700">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-bold text-white drop-shadow-md">Live Map</h1>
      </header>

      <div className="flex-1 relative bg-slate-900 overflow-hidden">
        {/* Mock Map View using CSS Grid since we don't have a Google Maps API key built in for the hackathon MVP */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #475569 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />

        <div className="absolute inset-0 flex items-center justify-center">
          {location ? (
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-48 h-48 bg-emerald-500/10 rounded-full animate-ping absolute -inset-20" />
                <div className="bg-emerald-500 p-4 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] relative z-10">
                  <MapIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="mt-8 bg-slate-900 border border-slate-700 px-6 py-4 rounded-xl shadow-xl text-center">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">Your Coordinates</p>
                <p className="text-slate-200 font-mono text-lg">{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
                {activeAlert && (
                  <p className="text-rose-500 font-bold text-sm mt-2 animate-pulse">BROADCASTING...</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-slate-500 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
              Locating you...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
