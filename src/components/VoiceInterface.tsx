import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { SystemButton } from './SystemUI';

export const VoiceInterface = ({ onResult }: { onResult: (text: string) => void }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const rec = new SpeechRecognitionAPI();
      rec.continuous = false;
      rec.lang = 'en-US';
      rec.onresult = (event: any) => {
        onResult(event.results[0][0].transcript);
        setIsListening(false);
      };
      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          alert('Microphone permission denied. Please enable it in your browser settings.');
        }
        setIsListening(false);
      };
      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    } else {
      setSupported(false);
    }
  }, [onResult]);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
       console.warn("Speech recognition is not supported in this browser.");
       return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (e: any) {
        if (e.name === 'InvalidStateError') {
          console.warn("Recognition already started.");
          setIsListening(true);
        } else {
          console.error("Failed to start speech recognition:", e);
        }
      }
    }
  };

  if (!supported) return null;

  return (
    <SystemButton 
      onClick={toggleListening}
      className={isListening ? "bg-red-500/20 text-red-500 border-red-500/50" : ""}
    >
      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
      {isListening ? 'Listening...' : 'Voice AI'}
    </SystemButton>
  );
};
