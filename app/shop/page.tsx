"use client";
import React from 'react';
import { ShoppingBag, ShieldCheck, ExternalLink, Zap, Siren } from 'lucide-react';

export default function ShopPage() {
  const equipment = [
    {
      id: "pepper-spray",
      name: "SABRE Red Pepper Spray",
      desc: "Maximum strength police-grade pepper spray with quick release key ring.",
      icon: <ShieldCheck className="w-8 h-8 text-rose-500" />,
      link: "https://www.amazon.com/s?k=sabre+red+pepper+spray"
    },
    {
      id: "alarm",
      name: "She's Birdie Personal Alarm",
      desc: "130dB siren with strobe light to deter attackers and alert people heavily.",
      icon: <Siren className="w-8 h-8 text-indigo-400" />,
      link: "https://www.amazon.com/s?k=shes+birdie+personal+alarm"
    },
    {
      id: "stun-gun",
      name: "VIPERTEK VTS-989 Stun Gun",
      desc: "High voltage stun gun with LED flashlight. Extremely intimidating sound.",
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      link: "https://www.amazon.com/s?k=vipertek+stun+gun"
    }
  ];

  return (
    <div className="min-h-screen bg-black px-4 py-8 pb-32 flex flex-col pt-12 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <ShoppingBag className="text-emerald-500 w-8 h-8" />
          Equipment
        </h1>
        <p className="text-neutral-400 text-sm mt-2 font-medium leading-relaxed">
          Trusted self-defense tools. Click to view on Amazon. Stay equipped, stay safe.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5">
        {equipment.map((item) => (
          <a key={item.id} href={item.link} target="_blank" rel="noreferrer" className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 flex items-center gap-5 hover:bg-neutral-800 transition active:scale-[0.98]">
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-inner flex items-center justify-center">
              {item.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-1">{item.name}</h3>
              <p className="text-neutral-400 text-sm leading-snug">
                {item.desc}
              </p>
            </div>
            <ExternalLink className="w-5 h-5 text-neutral-600 shrink-0" />
          </a>
        ))}
      </div>
      
      <div className="mt-8 p-5 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
        <h4 className="text-yellow-500 font-bold text-sm tracking-widest uppercase mb-2">Legal Disclaimer</h4>
        <p className="text-neutral-400 text-xs leading-relaxed">
          Please check your local state and city laws regarding the legal carry and usage of pepper sprays and stun guns before purchasing.
        </p>
      </div>
    </div>
  );
}
