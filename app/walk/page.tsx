"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Footprints, ShieldAlert } from 'lucide-react';
import { useAppStore } from '@/lib/Store';

export default function WalkWithMePage() {
  const { triggerSOS, activeAlert } = useAppStore();
  const [isActive, setIsActive] = useState(false);
  const [minutesLeft, setMinutesLeft] = useState(15);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !activeAlert) {
      interval = setInterval(() => {
        if (secondsLeft === 0) {
          if (minutesLeft === 0) {
            // Timer finished without user cancelling! SOS TRIGGER!
            triggerSOS();
            setIsActive(false);
          } else {
            setMinutesLeft(m => m - 1);
            setSecondsLeft(59);
          }
        } else {
          setSecondsLeft(s => s - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutesLeft, secondsLeft, activeAlert, triggerSOS]);

  const toggleTimer = () => {
    if (isActive) {
      // STOP before it triggers
      setIsActive(false);
      setMinutesLeft(15);
      setSecondsLeft(0);
    } else {
      setIsActive(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex flex-col text-center items-center">
      <header className="w-full flex items-center gap-4 mb-12">
        <Link href="/" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-bold text-white">Walk With Me</h1>
      </header>

      <div className="bg-emerald-500/20 p-6 rounded-full mb-8">
        <Footprints className="w-16 h-16 text-emerald-400" />
      </div>

      <p className="text-slate-300 text-lg mb-8 max-w-sm">
        Set your expected travel time. If you do not stop the timer before it ends, an <b className="text-rose-400">SOS</b> will be automatically triggered.
      </p>

      {/* Timer Display */}
      <div className={`text-6xl font-mono font-black mb-12 flex items-center gap-2 ${isActive ? (minutesLeft < 2 ? 'text-rose-500 animate-pulse' : 'text-emerald-400') : 'text-slate-500'}`}>
        <span>{minutesLeft.toString().padStart(2, '0')}</span>
        <span>:</span>
        <span>{secondsLeft.toString().padStart(2, '0')}</span>
      </div>

      {/* Controls */}
      {!isActive ? (
        <div className="w-full max-w-xs flex flex-col gap-4">
          <div className="flex justify-between items-center bg-slate-900 rounded-2xl p-4 border border-slate-800">
            <span className="text-slate-300 font-medium">Set Duration</span>
            <div className="flex items-center gap-4">
              <button onClick={() => setMinutesLeft(Math.max(1, minutesLeft - 5))} className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold hover:bg-slate-700">-</button>
              <span className="text-white font-bold">{minutesLeft}m</span>
              <button onClick={() => setMinutesLeft(minutesLeft + 5)} className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold hover:bg-slate-700">+</button>
            </div>
          </div>
          
          <button 
            onClick={toggleTimer}
            className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg transition"
          >
            START TIMER
          </button>
        </div>
      ) : (
        <button 
          onClick={toggleTimer}
          className="w-full max-w-xs py-5 rounded-full bg-slate-800 border-2 border-slate-700 hover:border-emerald-500 text-emerald-400 font-bold text-lg transition shadow-xl"
        >
          ARRIVED SAFELY (STOP)
        </button>
      )}

      {activeAlert && (
        <div className="mt-8 flex flex-col items-center">
          <ShieldAlert className="w-12 h-12 text-rose-500 mb-2 animate-bounce" />
          <p className="text-rose-400 font-bold">SOS TRIGGERED AUTOMATICALLY!</p>
        </div>
      )}

    </div>
  );
}
