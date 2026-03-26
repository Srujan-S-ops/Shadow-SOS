"use client";
import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/Store';
import { Users, PhoneCall, Footprints, MessageSquareWarning, MessageSquare, Sparkles } from 'lucide-react';

export default function ToolsDashboard() {
  const { inbox } = useAppStore();

  return (
    <div className="min-h-screen bg-black px-4 py-8 pb-32 flex flex-col pt-12">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white">Safety Tools</h1>
        <p className="text-gray-400 text-sm mt-2">Additional utilities to keep you protected.</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {/* Raksha AI Entry */}
        <Link href="/ai-chat" className="bg-neutral-900 border border-rose-500/30 p-5 rounded-2xl flex flex-col items-center text-center hover:bg-neutral-800 transition col-span-2 shadow-[0_0_20px_rgba(244,63,94,0.15)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="bg-rose-500/20 p-4 rounded-full mb-3 border border-rose-500/30 relative z-10">
            <Sparkles className="text-rose-400 w-8 h-8 animate-pulse" />
          </div>
          <span className="font-extrabold text-white tracking-widest text-lg relative z-10 uppercase">Raksha AI Guide</span>
          <p className="text-rose-300/80 font-medium text-xs mt-1 relative z-10">Multilingual Safety Assistant</p>
        </Link>
        
        <Link href="/walk" className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-col items-center text-center hover:bg-neutral-800 transition shadow-lg">
          <div className="bg-emerald-500/10 p-4 rounded-full mb-4 border border-emerald-500/20">
            <Footprints className="text-emerald-500 w-7 h-7" />
          </div>
          <span className="font-semibold text-white tracking-wide">Walk With Me</span>
        </Link>
        
        <Link href="/contacts" className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-col items-center text-center hover:bg-neutral-800 transition shadow-lg">
          <div className="bg-blue-500/10 p-4 rounded-full mb-4 border border-blue-500/20">
            <Users className="text-blue-500 w-7 h-7" />
          </div>
          <span className="font-semibold text-white tracking-wide">Trusted Network</span>
        </Link>
        
        <Link href="/sms" className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-col items-center text-center hover:bg-neutral-800 transition shadow-lg">
          <div className="bg-orange-500/10 p-4 rounded-full mb-4 border border-orange-500/20">
            <MessageSquareWarning className="text-orange-500 w-7 h-7" />
          </div>
          <span className="font-semibold text-white tracking-wide">SMS Fallback</span>
        </Link>
        
        <Link href="/fake-call" className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-col items-center text-center hover:bg-neutral-800 transition shadow-lg">
          <div className="bg-cyan-500/10 p-4 rounded-full mb-4 border border-cyan-500/20">
            <PhoneCall className="text-cyan-500 w-7 h-7" />
          </div>
          <span className="font-semibold text-white tracking-wide">Fake Call</span>
        </Link>
        
        <Link href="/smart-excuse" className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-col items-center text-center hover:bg-neutral-800 transition col-span-2 shadow-lg">
          <div className="bg-indigo-500/10 p-4 rounded-full mb-4 border border-indigo-500/20">
            <MessageSquare className="text-indigo-400 w-7 h-7" />
          </div>
          <span className="font-semibold text-white tracking-wide">AI Excuse Generator</span>
        </Link>
        
      </div>
    </div>
  );
}
