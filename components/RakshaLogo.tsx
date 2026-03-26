"use client";
import React from 'react';

export default function RakshaLogo({ className = "w-12 h-12", color = "currentColor" }: { className?: string, color?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* Outer Shield with subtle fill */}
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="url(#shieldGrad)" strokeWidth="2" />
      
      {/* Woman's profile silhouette inside the shield */}
      <path d="M9 14.5c0-1.5 1-2.5 1.5-3 .5-.5.5-1.5.5-1.5s0-1 1-1 1 .5 1 .5S14 8 14 7c0-2-1.5-3-3-3s-3 1.5-3 3c0 2 2 3 2 5v2" stroke="#fff" strokeWidth="2" />
      <path d="M11 11.5c-1 1-2 2-2 3.5" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}
