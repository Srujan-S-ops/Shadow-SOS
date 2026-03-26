"use client";
import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/Store';
import { translations, AppLanguage } from '@/lib/i18n';
import { ShieldAlert } from 'lucide-react';

export default function ShakeAlertOverlay() {
  const { shakeAlertActive, setShakeAlertActive, triggerSOS, language } = useAppStore();
  const [timeLeft, setTimeLeft] = useState(10);
  
  // Safe cast for language translation (fallback to 'en')
  const langKey = (translations[language as AppLanguage] ? language : 'en') as AppLanguage;
  const t = translations[langKey];

  useEffect(() => {
    if (!shakeAlertActive) {
      setTimeLeft(10);
      return;
    }

    if (timeLeft <= 0) {
      // Time ran out -> user might be in danger
      setShakeAlertActive(false);
      triggerSOS('red');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [shakeAlertActive, timeLeft, setShakeAlertActive, triggerSOS]);

  if (!shakeAlertActive) return null;

  return (
    <div className="fixed inset-0 z-[900] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
      
      <div className="w-32 h-32 bg-orange-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <ShieldAlert className="w-16 h-16 text-orange-500" />
      </div>

      <h2 className="text-4xl font-black text-white mb-2 text-center leading-tight">
        {t.areYouOkay}
      </h2>
      
      <p className="text-neutral-400 text-center mb-10 max-w-[280px]">
        {t.autoSosIn} <span className="text-orange-500 font-bold text-xl">{timeLeft}</span> {t.seconds}
      </p>
      
      <button
        onClick={() => setShakeAlertActive(false)}
        className="w-full max-w-sm bg-neutral-800 border-2 border-green-500/50 hover:bg-green-500/20 text-green-400 font-black py-5 rounded-3xl transition-all active:scale-95 shadow-[0_0_40px_rgba(34,197,94,0.3)] tracking-widest uppercase"
      >
        {t.iAmOkay}
      </button>

    </div>
  );
}
