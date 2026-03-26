"use client";
import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/Store';

export const useSensors = () => {
  const { triggerSOS, activeAlert } = useAppStore();
  const recognitionRef = useRef<any>(null);
  const lastX = useRef<number | null>(null);
  const lastY = useRef<number | null>(null);
  const lastZ = useRef<number | null>(null);
  const SHAKE_THRESHOLD = 15; // Requires a hard shake

  // 1. Shake Detection
  useEffect(() => {
    const handleMotion = (e: DeviceMotionEvent) => {
      if (activeAlert) return; // Prevent re-triggering while already active
      
      const { acceleration } = e;
      if (!acceleration) return;
      
      const { x, y, z } = acceleration;

      if (lastX.current !== null && lastY.current !== null && lastZ.current !== null && x !== null && y !== null && z !== null) {
        const deltaX = Math.abs(lastX.current - x);
        const deltaY = Math.abs(lastY.current - y);
        const deltaZ = Math.abs(lastZ.current - z);
        
        if (deltaX > SHAKE_THRESHOLD || deltaY > SHAKE_THRESHOLD || deltaZ > SHAKE_THRESHOLD) {
          console.log("SHAKE DETECTED");
          triggerSOS();
        }
      }
      
      lastX.current = x;
      lastY.current = y;
      lastZ.current = z;
    };

    // Note: iOS requires permission via DeviceMotionEvent.requestPermission()
    if (typeof window !== 'undefined') {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, [activeAlert, triggerSOS]);

  // 2. Voice Detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (e: any) => {
      if (activeAlert) return;

      for (let i = e.resultIndex; i < e.results.length; ++i) {
        const transcript = e.results[i][0].transcript.toLowerCase();
        if (transcript.includes('help') || transcript.includes('save me')) {
          console.log("VOICE EMERGENCY DETECTED:", transcript);
          triggerSOS();
          break;
        }
      }
    };

    recognition.start();

    // auto-restart if stopped
    recognition.onend = () => {
      if (!activeAlert) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [activeAlert, triggerSOS]);
};
