
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

    const now = ctx.currentTime;
    
    // Sub-bass impact
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(60, now);
    sub.frequency.exponentialRampToValueAtTime(40, now + 1.5);
    subGain.gain.setValueAtTime(0.3, now);
    subGain.gain.linearRampToValueAtTime(0, now + 1.5);
    sub.connect(subGain);
    subGain.connect(ctx.destination);
    
    // Rising "data" sweep
    const sweep = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    sweep.type = 'sawtooth';
    sweep.frequency.setValueAtTime(110, now);
    sweep.frequency.exponentialRampToValueAtTime(880, now + 1.2);
    sweepGain.gain.setValueAtTime(0, now);
    sweepGain.gain.linearRampToValueAtTime(0.1, now + 0.1);
    sweepGain.gain.linearRampToValueAtTime(0, now + 1.2);
    sweep.connect(sweepGain);
    sweepGain.connect(ctx.destination);

    // High frequency blip
    const blip = ctx.createOscillator();
    const blipGain = ctx.createGain();
    blip.type = 'square';
    blip.frequency.setValueAtTime(1200, now + 0.1);
    blipGain.gain.setValueAtTime(0, now + 0.1);
    blipGain.gain.linearRampToValueAtTime(0.05, now + 0.15);
    blipGain.gain.linearRampToValueAtTime(0, now + 0.3);
    blip.connect(blipGain);
    blipGain.connect(ctx.destination);

    sub.start(now);
    sweep.start(now);
    blip.start(now);
    
    sub.stop(now + 1.5);
    sweep.stop(now + 1.2);
    blip.stop(now + 0.3);
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
