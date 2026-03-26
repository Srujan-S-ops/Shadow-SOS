import { useState, useRef, useCallback } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export function useAudioVault() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const captureEvidence = useCallback(async (alertId: string, durationMs: number = 5000): Promise<string | null> => {
    try {
      // aggressively request dual-modality: Audio + Front-facing Video
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: { facingMode: "user" } 
        });
      } catch (err) {
        console.warn("Front camera constraint failed (likely testing on Desktop). Falling back to default camera:", err);
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: true 
        });
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      return new Promise<string | null>((resolve) => {
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
          setIsRecording(false);
          // Stop all camera and mic tracks intimately
          stream.getTracks().forEach((track) => track.stop());
          
          try {
            // Upload to Firebase Storage
            const storageRef = ref(storage, `evidence/${alertId}.webm`);
            await uploadBytes(storageRef, videoBlob);
            const downloadUrl = await getDownloadURL(storageRef);
            console.log("Video Evidence Uploaded:", downloadUrl);
            resolve(downloadUrl);
          } catch (err) {
            console.error("MediaVault Storage Error:", err);
            resolve(null);
          }
        };

        mediaRecorder.start();
        setIsRecording(true);

        // Auto-stop after standard duration (5 seconds for faster upload in emergency)
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, durationMs);

      });

    } catch (err) {
      console.error("Camera/Mic permission denied or not supported.", err);
      return null; // Gracefully fail
    }
  }, []);

  return { captureEvidence, isRecording };
}
