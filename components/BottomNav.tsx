"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, Map as MapIcon, Grid } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  // Hide nav on splash/login
  if (pathname === '/login' || pathname === '/signup') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-950/90 backdrop-blur-xl border-t border-neutral-800 pb-safe z-40">
      <div className="flex items-center justify-around px-2 py-3">
        
        <Link 
          href="/" 
          className={`flex flex-col items-center gap-1.5 w-20 transition-colors ${pathname === '/' ? 'text-rose-500' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <ShieldAlert className={`w-6 h-6 ${pathname === '/' ? 'animate-pulse' : ''}`} />
          <span className="text-[10px] uppercase font-bold tracking-widest">SOS</span>
        </Link>
        
        <Link 
          href="/safe-spaces" 
          className={`flex flex-col items-center gap-1.5 w-20 transition-colors ${pathname === '/safe-spaces' ? 'text-indigo-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <MapIcon className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold tracking-widest">Safe Map</span>
        </Link>
        
        <Link 
          href="/tools" 
          className={`flex flex-col items-center gap-1.5 w-20 transition-colors ${pathname === '/tools' ? 'text-cyan-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <Grid className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold tracking-widest">Tools</span>
        </Link>

      </div>
    </nav>
  );
}
