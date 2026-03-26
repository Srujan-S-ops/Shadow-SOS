"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Car, HeartCrack, Footprints, RefreshCcw } from 'lucide-react';

type Situation = 'uber' | 'date' | 'walking' | 'party';

const excuses = {
  uber: [
    "Hey! Yes, I just shared my live location with you and my brother. He's waiting for me outside the drop-off point right now. See you in 10 minutes!",
    "Hi dad! Yes, I'm in the Uber now. You're tracking the ride, right? Perfect. I'll call you the second I pull up to the driveway.",
    "My mom is actually a police officer and she's extremely paranoid, she tracks all my rides. Sorry if my phone keeps pinging!"
  ],
  date: [
    "Oh my god, I am so sorry... my roommate just called in a total panic. Our apartment pipe burst and water is everywhere. I have to leave immediately!",
    "I'm so sorry to do this, but my best friend just got into a car accident. She's okay, but she's at the hospital and I need to go get her right now.",
    "Hey, my mom just called and there's a family emergency. I really have to take off, I'm so sorry!"
  ],
  walking: [
    "Hey! Yeah I'm walking up to your house right now. Come outside and meet me halfway? I see you!",
    "Hi! Yeah, my boyfriend is walking the dog down my street right now, we're about to meet up at the corner.",
    "Can you hear me? Yeah, I'm almost there, tell dad to leave the porch light on and open the front door for me."
  ],
  party: [
    "Hey, my ride is here outside right now. I have to go catch them before they leave without me!",
    "I have an incredibly early shift at work tomorrow that I cannot miss. I'm going to have to head out now.",
    "My allergies are flaring up really badly right now, I need to go home and get my medication."
  ]
};

export default function SmartExcusePage() {
  const [activeSituation, setActiveSituation] = useState<Situation | null>(null);
  const [currentExcuse, setCurrentExcuse] = useState<string>("");

  const generateExcuse = (situation: Situation) => {
    setActiveSituation(situation);
    const list = excuses[situation];
    // Pick a random excuse from the list
    const random = list[Math.floor(Math.random() * list.length)];
    setCurrentExcuse(random);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/" className="p-2 bg-neutral-900 rounded-full hover:bg-neutral-800 transition">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Smart Excuse AI
        </h1>
      </header>

      <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
        Select your current situation. The system will instantly generate a culturally bulletproof, realistic excuse for you to use to safely exit an uncomfortable environment.
      </p>

      {/* Situation Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button 
          onClick={() => generateExcuse('date')}
          className={`p-4 rounded-2xl flex flex-col items-center gap-3 transition ${activeSituation === 'date' ? 'bg-indigo-600 border border-indigo-400' : 'bg-neutral-900 border border-neutral-800 hover:bg-neutral-800'}`}
        >
          <HeartCrack className={`w-8 h-8 ${activeSituation === 'date' ? 'text-white' : 'text-pink-500'}`} />
          <span className="font-bold text-sm">Weird Date</span>
        </button>

        <button 
          onClick={() => generateExcuse('uber')}
          className={`p-4 rounded-2xl flex flex-col items-center gap-3 transition ${activeSituation === 'uber' ? 'bg-indigo-600 border border-indigo-400' : 'bg-neutral-900 border border-neutral-800 hover:bg-neutral-800'}`}
        >
          <Car className={`w-8 h-8 ${activeSituation === 'uber' ? 'text-white' : 'text-yellow-500'}`} />
          <span className="font-bold text-sm">Creepy Cab/Uber</span>
        </button>

        <button 
          onClick={() => generateExcuse('walking')}
          className={`p-4 rounded-2xl flex flex-col items-center gap-3 transition ${activeSituation === 'walking' ? 'bg-indigo-600 border border-indigo-400' : 'bg-neutral-900 border border-neutral-800 hover:bg-neutral-800'}`}
        >
          <Footprints className={`w-8 h-8 ${activeSituation === 'walking' ? 'text-white' : 'text-emerald-500'}`} />
          <span className="font-bold text-sm">Followed Walking</span>
        </button>

        <button 
          onClick={() => generateExcuse('party')}
          className={`p-4 rounded-2xl flex flex-col items-center gap-3 transition ${activeSituation === 'party' ? 'bg-indigo-600 border border-indigo-400' : 'bg-neutral-900 border border-neutral-800 hover:bg-neutral-800'}`}
        >
          <MessageSquare className={`w-8 h-8 ${activeSituation === 'party' ? 'text-white' : 'text-purple-500'}`} />
          <span className="font-bold text-sm">Unsafe Party</span>
        </button>
      </div>

      {/* Result Area */}
      {currentExcuse && (
        <div className="bg-slate-900 border-2 border-indigo-500 rounded-2xl p-6 relative animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="absolute -top-3 left-6 bg-indigo-500 text-xs font-bold px-3 py-1 rounded-full tracking-wider">
            YOUR SCRIPT
          </div>
          
          <p className="text-xl font-medium leading-relaxed mt-2 text-indigo-50">
            "{currentExcuse}"
          </p>

          <button 
            onClick={() => generateExcuse(activeSituation!)}
            className="mt-6 w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center gap-2 font-bold text-sm text-indigo-300"
          >
            <RefreshCcw className="w-4 h-4" />
            GENERATE ANOTHER EXCUSE
          </button>
        </div>
      )}

    </div>
  );
}
