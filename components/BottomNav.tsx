"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, Map as MapIcon, Grid, PlaySquare, ShoppingBag, Navigation, Sparkles } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  // Hide nav on splash/login
  if (pathname === '/login' || pathname === '/signup') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-950/90 backdrop-blur-xl border-t border-neutral-800 pb-safe z-40">
      <div className="flex items-center justify-between px-2 py-3">
        
        <Link 
          href="/" 
          className={`flex flex-col flex-1 items-center gap-1.5 transition-colors ${pathname === '/' ? 'text-rose-500' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <ShieldAlert className={`w-5 h-5 ${pathname === '/' ? 'animate-pulse' : ''}`} />
          <span className="text-[9px] uppercase font-bold tracking-widest">SOS</span>
        </Link>
        
        <Link 
          href="/safe-spaces" 
          className={`flex flex-col flex-1 items-center gap-1.5 transition-colors ${pathname === '/safe-spaces' ? 'text-indigo-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <MapIcon className="w-5 h-5" />
          <span className="text-[9px] uppercase font-bold tracking-widest">Safe Map</span>
        </Link>

        <Link 
          href="/videos" 
          className={`flex flex-col flex-1 items-center gap-1.5 transition-colors ${pathname === '/videos' ? 'text-amber-500' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <PlaySquare className="w-5 h-5" />
          <span className="text-[9px] uppercase font-bold tracking-widest">Videos</span>
        </Link>

        <Link 
          href="/ai-chat" 
          className={`flex flex-col flex-1 items-center gap-1.5 transition-colors ${pathname === '/ai-chat' ? 'text-rose-500' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <Sparkles className={`w-5 h-5 ${pathname === '/ai-chat' ? 'animate-pulse' : ''}`} />
          <span className="text-[9px] uppercase font-bold tracking-widest leading-[10px] text-center">Raksha<br/>AI</span>
        </Link>
        
        <Link 
          href="/tools" 
          className={`flex flex-col flex-1 items-center gap-1.5 transition-colors ${pathname === '/tools' ? 'text-cyan-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[9px] uppercase font-bold tracking-widest">Tools</span>
        </Link>

        {/* 6th Button: GMaps Safe Route */}
        <a 
          href="https://www.google.com/maps/dir/?api=1&destination=Police+Station"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col flex-1 items-center gap-1.5 transition-colors text-blue-400 hover:text-blue-300"
          title="Nearest Safe Route"
        >
          <Navigation className="w-5 h-5" />
          <span className="text-[9px] uppercase font-bold tracking-widest">Route</span>
        </a>

      </div>
    </nav>
  );
}
