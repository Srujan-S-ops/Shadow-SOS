"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/Store';
import { useSensors } from '@/hooks/useSensors';
import EmergencyOverlay from '@/components/EmergencyOverlay';
import IncomingAlert from '@/components/IncomingAlert';
import { Info, LogOut, ShieldAlert, Calculator } from 'lucide-react';
import CalculatorMode from '@/components/CalculatorMode';
import ShakeAlertOverlay from '@/components/ShakeAlertOverlay';
import RakshaLogo from '@/components/RakshaLogo';
import UserProfileButton from '@/components/UserProfileButton';
import { translations, languages, AppLanguage } from '@/lib/i18n';

export default function Home() {
  const { triggerSOS, stopSOS, activeAlert, userName, logout, language, setLanguage } = useAppStore();
  const [showCalculator, setShowCalculator] = useState(false);
  
  const langKey = (translations[language as AppLanguage] ? language : 'en') as AppLanguage;
  const t = translations[langKey];
  
  // Initialize device sensor listeners (shake, voice, volume keys)
  useSensors();

  if (showCalculator) {
    return <CalculatorMode onExit={() => setShowCalculator(false)} />;
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 pb-24 relative overflow-hidden flex flex-col">
      {/* Overlays */}
      <EmergencyOverlay />
      <IncomingAlert />
      <ShakeAlertOverlay />

      {/* Secret Calculator Trigger */}
      <button 
        onClick={() => setShowCalculator(true)}
        className="absolute top-8 left-4 p-2 bg-neutral-900/50 border border-neutral-800/50 rounded-full hover:bg-neutral-800 transition text-neutral-500 z-50 opacity-30 hover:opacity-100"
        title="Calculator"
      >
        <Calculator className="w-5 h-5" />
      </button>

      <header className="mb-8 flex items-center justify-between mt-2 pl-12 relative z-10">
        <div className="flex items-center gap-3">
          <RakshaLogo className="w-8 h-8 text-rose-500" />
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              {t.appTitle}
            </h1>
            <p className="text-gray-400 text-xs font-medium mt-1 tracking-wide uppercase">
              {t.staySafe}, {userName || 'User'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 rounded-md p-1.5 outline-none max-w-[80px]"
          >
            {languages.map(l => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
          <UserProfileButton />
          <button 
            onClick={logout}
            className="p-3 bg-neutral-900 border border-neutral-800 rounded-full hover:bg-neutral-800 transition text-red-500"
            title={t.logout}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main SOS Trigger Hub */}
      <div className="flex-1 flex flex-col items-center justify-center relative my-10 min-h-[300px]">
        
        {activeAlert ? (
          <div className="z-10 w-full max-w-xs flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
             <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
               <ShieldAlert className="w-12 h-12 text-red-500" />
             </div>
             <h2 className="text-2xl font-black text-rose-500 mb-2 uppercase tracking-tighter">
               {activeAlert.level === 'red' ? t.sos : (activeAlert.level === 'orange' ? t.potentialThreat : t.cautionAlert)} {t.alertActive}
             </h2>
             <p className="text-sm text-neutral-400 mb-10 max-w-[250px] leading-relaxed">
               {t.trustedNetworkReceiving}
             </p>
             <button
               onClick={stopSOS}
               className="w-full bg-neutral-900 border-2 border-rose-500/50 hover:bg-rose-500/20 text-white font-black py-5 rounded-3xl transition-all active:scale-95 shadow-[0_0_40px_rgba(225,29,72,0.4)] tracking-widest uppercase"
             >
               {t.stopAllAlerts}
             </button>
          </div>
        ) : (
          <>
            {/* Pulsing rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 bg-red-500/10 rounded-full animate-ping [animation-duration:3s]" />
              <div className="absolute w-80 h-80 bg-red-500/5 rounded-full animate-ping [animation-duration:4s]" />
            </div>

            {/* The 3 Threat Levels */}
            <div className="flex flex-col items-center gap-4 z-10 w-full max-w-xs">
              <button
                onClick={() => triggerSOS('yellow')}
                className="w-full relative group overflow-hidden rounded-full bg-yellow-500/10 border-2 border-yellow-500/50 hover:bg-yellow-500/20 text-yellow-500 font-bold py-3 transition-all duration-300 transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center"
              >
                <span className="text-lg">{t.cautionAlert}</span>
                <span className="text-xs font-normal opacity-70 mt-0.5">{t.logUneasyFeeling}</span>
              </button>

              <button
                onClick={() => triggerSOS('orange')}
                className="w-full relative group overflow-hidden rounded-full bg-orange-500/10 border-2 border-orange-500/50 hover:bg-orange-500/20 text-orange-500 font-bold py-3 transition-all duration-300 transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center"
              >
                <span className="text-lg">{t.potentialThreat}</span>
                <span className="text-xs font-normal opacity-70 mt-0.5">{t.silentGPS}</span>
              </button>

              <button
                onClick={() => triggerSOS('red')}
                className="w-full relative group overflow-hidden rounded-full bg-gradient-to-br from-red-600 to-red-800 shadow-[0_0_40px_rgba(220,38,38,0.5)] text-white font-black py-8 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_60px_rgba(220,38,38,0.7)] active:scale-95 flex flex-col items-center justify-center border-4 border-neutral-900/50 mt-2"
              >
                <span className="text-4xl tracking-widest">{t.sos}</span>
                <span className="text-xs font-medium opacity-90 mt-1 uppercase">{t.immediateDanger}</span>
              </button>
            </div>

            {/* Emergency Contacts */}
            <div className="w-full max-w-xs mt-6 grid grid-cols-2 gap-3 z-10 pb-6">
              <a href="tel:100" className="bg-neutral-900 border border-neutral-800 p-3 rounded-2xl flex flex-col items-center justify-center hover:bg-neutral-800 transition shadow-lg active:scale-95">
                <span className="text-blue-500 font-black text-xl mb-0.5">100</span>
                <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-widest text-center">{t.police}</span>
              </a>
              <a href="tel:1091" className="bg-neutral-900 border border-neutral-800 p-3 rounded-2xl flex flex-col items-center justify-center hover:bg-neutral-800 transition shadow-lg active:scale-95">
                <span className="text-rose-500 font-black text-xl mb-0.5">1091</span>
                <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-widest text-center">{t.womenHelpline}</span>
              </a>
              <a href="tel:1098" className="bg-neutral-900 border border-neutral-800 p-3 rounded-2xl flex flex-col items-center justify-center hover:bg-neutral-800 transition shadow-lg active:scale-95">
                <span className="text-indigo-400 font-black text-xl mb-0.5">1098</span>
                <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-widest text-center">{t.childHelpline}</span>
              </a>
              <a href="tel:108" className="bg-neutral-900 border border-neutral-800 p-3 rounded-2xl flex flex-col items-center justify-center hover:bg-neutral-800 transition shadow-lg active:scale-95">
                <span className="text-amber-500 font-black text-xl mb-0.5">108</span>
                <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-widest text-center">{t.ambulance}</span>
              </a>
              <a href="sms:?body=SOS!%20I%20am%20in%20danger%20and%20need%20immediate%20help." className="col-span-2 bg-neutral-900 border border-neutral-800 p-3 rounded-2xl flex flex-col items-center justify-center hover:bg-neutral-800 transition shadow-lg active:scale-95">
                <span className="text-emerald-500 font-black text-xl mb-0.5">SMS</span>
                <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-widest text-center">Fallback</span>
              </a>
            </div>
          </>
        )}
      </div>

      {/* Test Hint */}
      <div className="absolute top-4 right-16 group z-50">
        <Info className="w-5 h-5 text-neutral-700 hover:text-neutral-400 cursor-pointer" />
        <div className="absolute right-0 top-8 bg-neutral-800 text-xs p-3 rounded-xl w-48 opacity-0 group-hover:opacity-100 transition shadow-xl border border-neutral-700 pointer-events-none text-neutral-300">
          <strong>{t.demoInfo}:</strong> {t.demoText}
        </div>
      </div>
      
    </main>
  );
}
