"use client";
import { useCallback, useRef, useState, useEffect } from 'react';

export function useRingtone() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Play a single ring burst
  const playRingBurst = useCallback(() => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    // Create dual tones (standard phone ringing frequencies)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(440, ctx.currentTime); // 440 Hz
    osc2.frequency.setValueAtTime(480, ctx.currentTime); // 480 Hz

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    // Fade in/out to avoid clicking
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.5, ctx.currentTime + 1.8);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.0);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 2.0);
    osc2.stop(ctx.currentTime + 2.0);

    activeOscillatorsRef.current.push(osc1, osc2);
    gainNodeRef.current = gain;
  }, []);

  const playRingtone = useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Play immediately, then loop every 4 seconds (2s ring + 2s silence)
    playRingBurst();
    intervalRef.current = setInterval(() => {
      playRingBurst();
    }, 4000);
    
  }, [isPlaying, playRingBurst]);

  const stopRingtone = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Hard stop any ongoing sound smoothly
    if (gainNodeRef.current && audioCtxRef.current) {
       gainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.1);
    }

    activeOscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    activeOscillatorsRef.current = [];
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      stopRingtone();
      if (audioCtxRef.current?.state !== 'closed') {
        audioCtxRef.current?.close();
      }
    };
  }, [stopRingtone]);

  return { playRingtone, stopRingtone, isPlaying };
}
