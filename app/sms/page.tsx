"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquareWarning, Save } from 'lucide-react';

export default function SMSConfigPage() {
  const [message, setMessage] = useState("HELP! I am in danger. Track my location here:");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedMsg = localStorage.getItem('customSmsMessage');
    if (savedMsg) setMessage(savedMsg);
  }, []);

  const handleSave = () => {
    localStorage.setItem('customSmsMessage', message);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/" className="p-2 bg-neutral-900 rounded-full hover:bg-neutral-800 transition">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">SMS Fallback Action</h1>
      </header>

      <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl mb-8 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquareWarning className="w-6 h-6 text-orange-500" />
          <h2 className="text-white font-medium">Custom Emergency Message</h2>
        </div>
        
        <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
          If you lose internet connection, HerGuard AI can open your phone's native SMS app as a fallback. 
          Configure the default message that will be sent to your trusted contacts. <br/><br/>
          <em>(We will automatically attach a Google Maps tracking link to the end of this message when triggered).</em>
        </p>
        
        <textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 w-full resize-none mb-4"
          placeholder="Enter your emergency message..."
        />
        
        <button 
          onClick={handleSave}
          className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl transition flex justify-center items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saved ? 'Saved!' : 'Save Message'}
        </button>
      </div>

    </div>
  );
}
