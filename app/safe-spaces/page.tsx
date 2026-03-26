"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useLocation } from '@/hooks/useLocation';
import { MapPin, AlertCircle } from 'lucide-react';

// Vital for Next.js: disable SSR for Leaflet mapping component
const SafeMapViewer = dynamic(() => import('@/components/SafeMapViewer'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-3xl animate-pulse">
      <div className="text-indigo-400 font-bold uppercase tracking-widest text-sm">Initializing Map Engine...</div>
    </div>
  )
});

export default function SafeSpacesPage() {
  const { location, error, startTracking, stopTracking } = useLocation();

  useEffect(() => {
    startTracking();
    return () => stopTracking();
  }, [startTracking, stopTracking]);

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32 flex flex-col font-sans pt-12">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white">Safe Spaces Radar</h1>
          <p className="text-indigo-400 text-sm mt-1 font-bold">Live 2km Environment Scan</p>
        </div>
      </header>

      {/* Map Content Box */}
      <div className="flex-1 w-full bg-neutral-900 rounded-3xl border-2 border-neutral-800 shadow-2xl overflow-hidden relative min-h-[400px]">
        {location ? (
          <SafeMapViewer userLat={location.lat} userLng={location.lng} />
        ) : error ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
            <p className="font-bold text-lg mb-2">GPS Signal Lost</p>
            <p className="text-neutral-400 text-sm">{error}</p>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900/50 backdrop-blur">
            <MapPin className="w-10 h-10 text-neutral-500 mb-4 animate-bounce" />
            <p className="text-neutral-400 font-bold animate-pulse">Acquiring highly accurate GPS fix...</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest">Police</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest">Medical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest">Fire Station</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest">Pharmacy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest">Govt</span>
        </div>
      </div>
    </div>
  );
}
