"use client";
import React, { useState } from 'react';

interface CalculatorModeProps {
  onExit: () => void;
}

export default function CalculatorMode({ onExit }: CalculatorModeProps) {
  const [display, setDisplay] = useState('0');

  const handleInput = (char: string) => {
    setDisplay((prev) => {
      // If we've reached 10 digits and they press a number, keep accumulating to check
      if (prev === '0' && char !== '.') {
        return char;
      }
      return prev + char;
    });
  };

  const handleClear = () => {
    setDisplay('0');
  };

  const handleEquals = () => {
    // If the entered display is exactly 10 digits (a standard Indian phone number)
    // we trigger the exit back to SOS dashboard.
    const digitsOnly = display.replace(/\D/g, '');
    if (digitsOnly.length >= 10) {
      onExit();
      return;
    }
    
    // Evaluate simple math just for show
    try {
      const result = eval(display); // It's just a local basic calculator mock
      setDisplay(String(result));
    } catch {
      setDisplay('Error');
    }
  };

  const buttons = [
    ['C', '(', ')', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col items-center bg-neutral-900/90 border border-neutral-600/50 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
        
        {/* Calculator Display */}
        <div className="w-full h-40 flex flex-col justify-end text-right mb-6 bg-black/40 rounded-3xl p-4 border border-neutral-800">
          <div className="text-white text-5xl font-light tracking-wider break-all leading-tight overflow-hidden">
            {display}
          </div>
        </div>
        
        {/* Calculator Keypad */}
        <div className="w-full grid grid-cols-4 gap-3">
        {buttons.map((row, rIdx) => (
          <React.Fragment key={rIdx}>
            {row.map((btn, bIdx) => {
              const isZero = btn === '0';
              const isEquals = btn === '=';
              const isAction = ['/', '*', '-', '+', '='].includes(btn);
              const isClear = btn === 'C';
              
              return (
                <button
                  key={bIdx}
                  onClick={() => {
                    if (isEquals) handleEquals();
                    else if (isClear) handleClear();
                    else handleInput(btn);
                  }}
                  className={`
                    h-16 rounded-full text-2xl font-medium transition-colors active:opacity-70
                    ${isZero ? 'col-span-2' : 'col-span-1'}
                    ${isAction ? 'bg-orange-500 text-white' : 'bg-neutral-700 text-white'}
                    ${isClear ? 'bg-neutral-400 text-black' : ''}
                  `}
                >
                  {btn}
                </button>
              );
            })}
          </React.Fragment>
        ))}
        </div>
      </div>
    </div>
  );
}
