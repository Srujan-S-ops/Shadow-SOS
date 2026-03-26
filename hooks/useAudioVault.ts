import { useState, useRef, useCallback } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export function useAudioVault() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const captureEvidence = useCallback(async (alertId: string, durationMs: number = 10000): Promise<string | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      return new Promise<string | null>((resolve) => {
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          setIsRecording(false);
          // Stop mic tracks heavily to release privacy indicator!
          stream.getTracks().forEach((track) => track.stop());
          
          try {
            // Upload to Firebase Storage secretly
            const storageRef = ref(storage, `evidence/${alertId}.webm`);
            await uploadBytes(storageRef, audioBlob);
            const downloadUrl = await getDownloadURL(storageRef);
            resolve(downloadUrl);
          } catch (err) {
            console.error("AudioVault Storage Error (Hackathon Note: Storage might not be configured on Firebase):", err);
            resolve(null); // fail gracefully so demo continues
          }
        };

        mediaRecorder.start();
        setIsRecording(true);

        // Auto-stop after standard duration
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, durationMs);

      });

    } catch (err) {
      console.error("Microphone permission denied or not supported.", err);
      return null; // Gracefully fail
    }
  }, []);

  return { captureEvidence, isRecording };
}
