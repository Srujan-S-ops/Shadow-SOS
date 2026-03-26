"use client";
import { useEffect, useRef, useState } from 'react';

export const useAudioSiren = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playSiren = () => {
    if (isPlaying) return;
    initAudio();
    setIsPlaying(true);
    
    // Standard European Police Siren pattern (High-Low)
    const ctx = audioCtxRef.current!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    gain.gain.value = 0.5; // Max 1.0 (very loud)
    osc.start();

    oscRef.current = osc;
    gainRef.current = gain;

    let isHigh = true;
    intervalRef.current = setInterval(() => {
      if (oscRef.current) {
        // High 900Hz, Low 700Hz
        oscRef.current.frequency.setTargetAtTime(isHigh ? 900 : 700, ctx.currentTime, 0.05);
        isHigh = !isHigh;
      }
    }, 500); // Toggle every 500ms
  };

  const stopSiren = () => {
    if (!isPlaying) return;
    setIsPlaying(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (oscRef.current) {
      oscRef.current.stop();
      oscRef.current = null;
    }
    if (gainRef.current) {
      gainRef.current.disconnect();
      gainRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return stopSiren;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { playSiren, stopSiren, isPlaying };
};
