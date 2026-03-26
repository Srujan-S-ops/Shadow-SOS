"use client";
import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/Store';
import { ArrowLeft, Inbox, MessageSquareWarning, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function MessagesPage() {
  const { inbox } = useAppStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <ShieldAlert className="w-6 h-6 text-rose-500" />;
      case 'fallback': return <MessageSquareWarning className="w-6 h-6 text-orange-500" />;
      default: return <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
    }
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col font-sans mb-20">
      
      <header className="flex items-center justify-between mb-8 mt-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 bg-neutral-900 rounded-full hover:bg-neutral-800 transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-black tracking-tight">Emergency Inbox</h1>
        </div>
        <div className="bg-indigo-600 px-3 py-1 rounded-full text-xs font-bold">
          {inbox.length} Messages
        </div>
      </header>

      {inbox.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 px-8">
          <Inbox className="w-20 h-20 mb-4 text-neutral-600" />
          <p className="text-lg font-medium">No messages yet.</p>
          <p className="text-sm mt-2">When trusted contacts trigger an SOS or SMS fallback, their alerts will appear securely directly inside this inbox.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {inbox.map(msg => (
            <div key={msg.id} className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex gap-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="pt-1">
                {getIcon(msg.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-lg text-white">{msg.senderName}</span>
                  <span className="text-xs text-neutral-500">{formatTime(msg.timestamp)}</span>
                </div>
                <p className="text-neutral-300 leading-relaxed text-sm">
                  {msg.text}
                </p>
                {msg.type === 'fallback' && (
                  <div className="mt-3 inline-block bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    SMS Fallback Broadcast
                  </div>
                )}
                {msg.type === 'alert' && (
                  <div className="mt-3 inline-block bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Threat Tier Triggered
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
