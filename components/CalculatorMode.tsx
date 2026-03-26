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
    <div className="fixed inset-0 z-[9999] bg-neutral-900 flex flex-col items-center justify-end pb-10">
      {/* Calculator Display */}
      <div className="w-full flex-1 max-w-sm flex flex-col justify-end p-6 text-right">
        <div className="text-white text-6xl font-light tracking-wider break-all leading-tight max-h-48 overflow-y-auto w-full">
          {display}
        </div>
      </div>
      
      {/* Calculator Keypad */}
      <div className="w-full max-w-sm grid grid-cols-4 gap-4 px-6">
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
  );
}
