"use client";
import React from 'react';
import Link from 'next/link';
import { PlaySquare, ExternalLink } from 'lucide-react';

export default function DefenseVideosPage() {
  const videos = [
    {
      id: "KVpxP3ZZtAc",
      title: "5 Self-Defense Moves Every Woman Should Know",
      creator: "Krav Maga Expert"
    },
    {
      id: "M4_8PeMqBgk",
      title: "How To Escape a Bear Hug (Front & Back)",
      creator: "Nick Drossos"
    },
    {
      id: "-V4vEyhWDZ0",
      title: "Basic Escapes from Chokeholds",
      creator: "Gracie Jiu-Jitsu"
    },
    {
      id: "T7aNSRoDCmg",
      title: "What to do if someone grabs your wrist",
      creator: "Self Defense Tutorials"
    }
  ];

  return (
    <div className="min-h-screen bg-black px-4 py-8 pb-32 flex flex-col pt-12 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <PlaySquare className="text-rose-500 w-8 h-8" />
          Training
        </h1>
        <p className="text-neutral-400 text-sm mt-2">Essential self-defense tutorials directly from experts.</p>
      </header>

      <div className="flex flex-col gap-6">
        {videos.map((vid) => (
          <div key={vid.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg flex flex-col">
            <div className="w-full relative pt-[56.25%] bg-black">
              <iframe 
                src={`https://www.youtube.com/embed/${vid.id}`} 
                title={vid.title}
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
            <div className="p-4 flex justify-between items-start">
              <div>
                <h3 className="text-white font-bold text-base leading-tight mb-1">{vid.title}</h3>
                <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">{vid.creator}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <a href="https://www.youtube.com/results?search_query=women+self+defense" target="_blank" rel="noreferrer" className="mt-8 flex items-center justify-center gap-2 p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 font-bold hover:bg-neutral-800 transition">
        Browse More on YouTube <ExternalLink className="w-4 h-4 text-neutral-500" />
      </a>
    </div>
  );
}
