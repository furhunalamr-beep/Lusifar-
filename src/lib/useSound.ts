
import { useCallback, useRef } from 'react';

export const useSound = () => {
  const audioContext = useRef<AudioContext | null>(null);

  const playClick = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContext.current;
    if (ctx.state === 'suspended') ctx.resume();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1);
  }, []);

  const playIntroSound = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContext.current;
    if (ctx.state === 'suspended') ctx.resume();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(110, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(440, ctx.currentTime + 1.5);

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 1.5);
  }, []);

  const speakClick = useCallback((text: string = "Confirmed") => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Interrupt previous speech
      const msg = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      const maleVoice = voices.find(v => v.name.includes('Male') || v.name.includes('Google UK English Male'));
      if (maleVoice) {
        msg.voice = maleVoice;
      }
      
      msg.pitch = 0.8;
      msg.rate = 1.2; // A bit faster than main voice for responsiveness
      
      window.speechSynthesis.speak(msg);
    }
  }, []);

  return { playClick, playIntroSound, speakClick };
};
