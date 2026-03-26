"use client";
import React from 'react';

export default function RakshaLogo({ className = "w-8 h-8", color = "currentColor" }: { className?: string, color?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Shield */}
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      {/* Woman's profile silhouette inside the shield */}
      <path d="M9 14.5c0-1.5 1-2.5 1.5-3 .5-.5.5-1.5.5-1.5s0-1 1-1 1 .5 1 .5S14 8 14 7c0-2-1.5-3-3-3s-3 1.5-3 3c0 2 2 3 2 5v2" strokeWidth="1.5" />
      <path d="M11 11.5c-1 1-2 2-2 3.5" />
    </svg>
  );
}
